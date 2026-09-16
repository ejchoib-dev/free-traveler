#!/usr/bin/env python3
"""Traveler Task → Wave 배치 스크립트.

입력:
  - TASKS/TASK_MANIFEST.csv        (task_id/category/screen/depends_on 등 구조화 필드)
  - TASKS/TASK-*.md 상세 파일       (Expected Files 파싱 — 파일 충돌 분리용)
  - design-reference/SCREEN_ROUTE_CONTRACT.json (Screen 5개 정본 순서·preview_required)

출력:
  - TASKS/TASK_DAG.md              (사람이 읽는 의존관계 문서: Depends On/Depended By/Group/Layer)
  - TASKS/WAVE_PLAN.md             (Wave ID → Task 목록 → Preview Checkpoint)
  - TASKS/WAVE_STATE.json          (schema_version/generated_at/waves[] — 전부 status=pending으로 초기화)
  - TASKS/TASK_MANIFEST.csv        (wave_id 열을 추가/갱신해 같은 파일에 다시 씀)

이 스크립트는 애플리케이션 코드를 만들지 않으며, git 명령(Branch/PR/Merge)을 실행하지 않는다.
표준 라이브러리만 사용한다.

주의: `scripts/audit_tasks.py`를 다시 실행하면 TASK_MANIFEST.csv가 처음부터 재생성되며
wave_id 열은 audit_tasks.py가 알지 못하는 열이라 사라진다. Task 내용을 감사로 수정한 뒤에는
audit_tasks.py → build_waves.py 순서로 다시 실행해 wave_id를 복원해야 한다.
"""
from __future__ import annotations

import csv
import json
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
TASK_DAG_PATH = ROOT / "TASKS" / "TASK_DAG.md"
WAVE_PLAN_PATH = ROOT / "TASKS" / "WAVE_PLAN.md"
WAVE_STATE_PATH = ROOT / "TASKS" / "WAVE_STATE.json"

# 사용자가 지정한 입력 경로는 TASKS/details/TASK-*.md 이지만, 이 저장소의 실제 관례는
# TASKS/TASK-*.md 이다(TASKS/details 디렉터리는 존재하지 않음). 있으면 그쪽을 쓰고,
# 없으면 실제 관례(TASKS/ 바로 아래)로 자동 대체한다.
_DETAILS_CANDIDATE = ROOT / "TASKS" / "details"
DETAILS_DIR = _DETAILS_CANDIDATE if _DETAILS_CANDIDATE.exists() else (ROOT / "TASKS")

SCHEMA_VERSION = "traveler-wave-plan-v1"
MIN_WAVE_SIZE = 4
MAX_WAVE_SIZE = 7

GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

SCREEN_TO_GROUP = {
    "SCR-001": 4,
    "SCR-002": 5,
    "SCR-003": 6,
    "SCR-004": 7,
    "SCR-005": 8,
}

errors: list[str] = []


def fail(msg: str) -> None:
    errors.append(msg)


def split_ids(cell: str) -> list[str]:
    if not cell:
        return []
    return [x.strip() for x in cell.split(";") if x.strip()]


def read_manifest() -> dict[str, dict]:
    if not MANIFEST_PATH.exists():
        fail(f"입력 파일이 없습니다: {MANIFEST_PATH.relative_to(ROOT)}")
        return {}
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)
    tasks: dict[str, dict] = {}
    for r in rows:
        tid = r["task_id"].strip()
        tasks[tid] = {
            "task_id": tid,
            "category": r.get("category", "").strip(),
            "screen": r.get("screen", "").strip(),
            "depends_on": split_ids(r.get("depends_on", "")),
            "detail_file": r.get("detail_file", "").strip(),
        }
    return {"tasks": tasks, "fieldnames": fieldnames, "rows": rows}


def read_contract() -> list[str]:
    if not CONTRACT_PATH.exists():
        fail(f"입력 파일이 없습니다: {CONTRACT_PATH.relative_to(ROOT)}")
        return []
    try:
        data = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        fail("SCREEN_ROUTE_CONTRACT.json 파싱 실패")
        return []
    return [s["screen_id"] for s in data.get("screens", [])]


def assign_group(task: dict) -> int:
    tid = task["task_id"]
    cat = task["category"]
    screen = task["screen"]

    if tid == "SHARED-AUTH-SETUP":
        return 3
    if cat == "DATA":
        return 2
    if cat == "SHARED":
        return 2
    if cat == "DB":
        return 3
    if cat == "RLS_TEST":
        return 3
    if cat in ("UNIT_TEST", "E2E_TEST", "CI", "MANUAL_CHECK"):
        return 9
    if cat == "DEPLOY":
        return 10
    if cat == "RELEASE_CHECK":
        return 10
    if screen in SCREEN_TO_GROUP:
        return SCREEN_TO_GROUP[screen]
    fail(f"{tid}: Wave 그룹을 판정할 수 없습니다(category={cat!r}, screen={screen!r})")
    return 9


def detect_cycles(tasks: dict[str, dict]) -> list[list[str]]:
    """3-색 DFS로 순환 의존성을 찾는다. 반환값은 순환에 포함된 노드 목록들."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    cycles: list[list[str]] = []
    stack: list[str] = []

    def visit(tid: str) -> None:
        color[tid] = GRAY
        stack.append(tid)
        for dep in tasks[tid]["depends_on"]:
            if dep not in tasks:
                continue
            if color[dep] == GRAY:
                idx = stack.index(dep)
                cycles.append(stack[idx:] + [dep])
            elif color[dep] == WHITE:
                visit(dep)
        stack.pop()
        color[tid] = BLACK

    for tid in tasks:
        if color[tid] == WHITE:
            visit(tid)
    return cycles


def compute_group_and_layer(tasks: dict[str, dict]) -> tuple[dict[str, int], dict[str, int]]:
    group_of = {tid: assign_group(t) for tid, t in tasks.items()}

    # 그룹 순서 위반(선행 Task가 뒤 Wave 그룹에 배치) 검사
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep not in tasks:
                continue
            if group_of[dep] > group_of[tid]:
                fail(
                    f"그룹 순서 위반: {tid}(그룹 {group_of[tid]})가 "
                    f"{dep}(그룹 {group_of[dep]})에 의존합니다 — 선행 Task가 뒤 Wave 그룹에 있습니다."
                )

    layer_of: dict[str, int] = {}

    def layer(tid: str, seen: set[str]) -> int:
        if tid in layer_of:
            return layer_of[tid]
        if tid in seen:
            return 0  # 순환은 detect_cycles에서 별도로 보고하고 여기서는 무한재귀만 방지
        seen = seen | {tid}
        g = group_of[tid]
        intra_deps = [d for d in tasks[tid]["depends_on"] if d in tasks and group_of[d] == g]
        if not intra_deps:
            layer_of[tid] = 0
        else:
            layer_of[tid] = 1 + max(layer(d, seen) for d in intra_deps)
        return layer_of[tid]

    for tid in tasks:
        layer(tid, set())

    return group_of, layer_of


def parse_expected_files(detail_file: str) -> list[str]:
    name = Path(detail_file).name if detail_file else ""
    path = DETAILS_DIR / name if name else None
    if not path or not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## Expected Files\s*\n(.*?)\n##", text, re.DOTALL)
    if not m:
        return []
    section = m.group(1)
    return [p for p in re.findall(r"`([^`]+)`", section) if "/" in p]


def build_waves(
    tasks: dict[str, dict], group_of: dict[str, int], layer_of: dict[str, int]
) -> list[dict]:
    files_of = {tid: parse_expected_files(t["detail_file"]) for tid, t in tasks.items()}

    waves: list[dict] = []
    wave_seq = 0

    for g in sorted(GROUP_TITLES):
        members = [tid for tid in tasks if group_of[tid] == g]
        if not members:
            continue
        max_layer = max(layer_of[tid] for tid in members)
        for layer_no in range(max_layer + 1):
            layer_members = sorted(tid for tid in members if layer_of[tid] == layer_no)
            if not layer_members:
                continue
            # 같은 layer(=서로 의존관계 없는 antichain) 안에서만 청크로 쪼갠다.
            # 파일 충돌이 감지되면 MAX_WAVE_SIZE 이전이라도 청크를 끊는다(규칙 5).
            chunk: list[str] = []
            chunk_files: set[str] = set()
            for tid in layer_members:
                tfiles = set(files_of.get(tid, []))
                collide = bool(chunk) and (tfiles & chunk_files)
                if chunk and (len(chunk) >= MAX_WAVE_SIZE or collide):
                    wave_seq += 1
                    waves.append(_make_wave(wave_seq, g, layer_no, chunk))
                    chunk, chunk_files = [], set()
                chunk.append(tid)
                chunk_files |= tfiles
            if chunk:
                wave_seq += 1
                waves.append(_make_wave(wave_seq, g, layer_no, chunk))

    return waves


def _make_wave(seq: int, group: int, layer_no: int, task_ids: list[str]) -> dict:
    return {
        "wave_id": f"W{seq:02d}",
        "group": group,
        "group_title": GROUP_TITLES[group],
        "layer": layer_no,
        "task_ids": task_ids,
    }


def wave_checkpoint_required(wave: dict, group_last_layer: dict[int, int]) -> bool:
    g = wave["group"]
    if g == 10:
        return True  # Vercel Preview·Release 확인 그룹 전체가 사람 확인 대상
    if g in (4, 5, 6, 7, 8) and wave["layer"] == group_last_layer[g]:
        return True  # 해당 Screen의 마지막(=Page Owner를 포함하는) Wave
    return False


def write_task_dag(tasks, group_of, layer_of, cycles, screen_order) -> None:
    depended_by: dict[str, list[str]] = {tid: [] for tid in tasks}
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep in depended_by:
                depended_by[dep].append(tid)

    lines = [
        "# Task Dependency DAG — Free Traveler",
        "",
        "이 문서는 `scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`의 `depends_on` 열로부터",
        "생성한다. 사람이 수정하지 않는다 — 다시 생성하려면 `python scripts/build_waves.py`를 실행한다.",
        "",
        f"- 순환 의존성: {len(cycles)}건",
        f"- Screen 순서(계약 기준): {', '.join(screen_order) if screen_order else '(확인 불가)'}",
        "",
        "| Task ID | Group | Layer | Depends On | Depended By |",
        "|---|---|---|---|---|",
    ]
    for tid in sorted(tasks, key=lambda x: (group_of[x], layer_of[x], x)):
        deps = ", ".join(tasks[tid]["depends_on"]) or "없음"
        by = ", ".join(sorted(depended_by[tid])) or "없음"
        lines.append(
            f"| {tid} | {group_of[tid]}. {GROUP_TITLES[group_of[tid]]} | {layer_of[tid]} | {deps} | {by} |"
        )

    if cycles:
        lines += ["", "## 순환 의존성 상세", ""]
        for c in cycles:
            lines.append("- " + " → ".join(c))

    TASK_DAG_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_plan(waves: list[dict], group_last_layer: dict[int, int]) -> None:
    lines = [
        "# Wave Plan — Free Traveler",
        "",
        "이 문서는 `scripts/build_waves.py`가 생성한다. Wave ID는 W00~W10으로 미리 고정하지 않고,",
        "Task 의존관계·그룹별 4~7개 배치·파일 충돌 분리 규칙에 따라 동적으로 매겨진다.",
        "`/run-wave`·`/prepare-task`는 이 문서를 Wave 정의의 정본으로 읽는다.",
        "",
        "| Wave | Group | Task IDs (Task ID 순으로 한 개씩 실행) | Preview Checkpoint |",
        "|---|---|---|---|",
    ]
    for w in waves:
        checkpoint = "예" if wave_checkpoint_required(w, group_last_layer) else "아니오"
        ids = ", ".join(w["task_ids"])
        lines.append(f"| {w['wave_id']} | {w['group']}. {w['group_title']} | {ids} | {checkpoint} |")
    WAVE_PLAN_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_state(waves: list[dict], group_last_layer: dict[int, int]) -> None:
    now = datetime.now(timezone(timedelta(hours=9))).isoformat()
    state = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": now,
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": f"{w['group']}. {w['group_title']}",
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": wave_checkpoint_required(w, group_last_layer),
                "checkpoint_result": None,
            }
            for w in waves
        ],
    }
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_manifest_with_wave_id(manifest: dict, task_wave: dict[str, str]) -> None:
    fieldnames = list(manifest["fieldnames"])
    if "wave_id" not in fieldnames:
        fieldnames.append("wave_id")
    rows = manifest["rows"]
    for r in rows:
        r["wave_id"] = task_wave.get(r["task_id"].strip(), "")
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    print("== Traveler Wave 배치 (build_waves.py) ==")
    print(f"Task 상세 파일 디렉터리: {DETAILS_DIR.relative_to(ROOT)}"
          + ("" if DETAILS_DIR == _DETAILS_CANDIDATE else "(TASKS/details 없음 → TASKS/ 대체 사용)"))

    manifest = read_manifest()
    screen_order = read_contract()
    if errors:
        print()
        print(f"오류 {len(errors)}건(입력 확인 실패):")
        for e in errors:
            print(f"  [ERROR] {e}")
        return 1

    tasks = manifest["tasks"]

    # 참조 무결성: 존재하지 않는 Depends On
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep not in tasks:
                fail(f"{tid}: 존재하지 않는 Depends On '{dep}'")

    cycles = detect_cycles(tasks)
    for c in cycles:
        fail("순환 의존성: " + " → ".join(c))

    if errors:
        print()
        print(f"오류 {len(errors)}건 — Wave를 배치하지 않고 중단합니다:")
        for e in errors:
            print(f"  [ERROR] {e}")
        print()
        print(f"순환 의존성 수: {len(cycles)}")
        return 1

    group_of, layer_of = compute_group_and_layer(tasks)
    if errors:
        print()
        print(f"오류 {len(errors)}건 — Wave를 배치하지 않고 중단합니다:")
        for e in errors:
            print(f"  [ERROR] {e}")
        print()
        print(f"순환 의존성 수: {len(cycles)}")
        return 1

    waves = build_waves(tasks, group_of, layer_of)

    group_last_layer: dict[int, int] = {}
    for tid in tasks:
        g = group_of[tid]
        group_last_layer[g] = max(group_last_layer.get(g, 0), layer_of[tid])

    task_wave = {tid: w["wave_id"] for w in waves for tid in w["task_ids"]}

    write_task_dag(tasks, group_of, layer_of, cycles, screen_order)
    write_wave_plan(waves, group_last_layer)
    write_wave_state(waves, group_last_layer)
    write_manifest_with_wave_id(manifest, task_wave)

    print(f"[생성] {TASK_DAG_PATH.relative_to(ROOT)}")
    print(f"[생성] {WAVE_PLAN_PATH.relative_to(ROOT)}")
    print(f"[생성] {WAVE_STATE_PATH.relative_to(ROOT)}")
    print(f"[갱신] {MANIFEST_PATH.relative_to(ROOT)} (wave_id 열 추가)")
    print()

    print(f"순환 의존성 수: {len(cycles)}")
    print()
    print("Wave별 Task 수:")
    for w in waves:
        cp = "예" if wave_checkpoint_required(w, group_last_layer) else "아니오"
        print(f"  {w['wave_id']} [{w['group']}. {w['group_title']}] — {len(w['task_ids'])}개 (Preview Checkpoint: {cp})")

    print()
    print("Page Owner 위치:")
    for tid, t in sorted(tasks.items()):
        if t["category"] == "PAGE_OWNER":
            print(f"  {tid} → {task_wave.get(tid, '(미배치)')}")

    print()
    print("BUILD_WAVES_DONE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
