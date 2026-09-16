#!/usr/bin/env python3
"""Traveler Task 생성 파이프라인 - 입력 검증 스크립트.

Task List/상세를 생성하기 *전에* 실행한다. 외부 패키지 없이 표준 라이브러리만
사용한다(이 저장소의 package.json에는 Python 의존성이 없음).

검사 대상:
  - design-reference/SCREEN_ROUTE_CONTRACT.json (HARNESS_SCHEMA, Screen 5개, 중복 없음, core4/aux1)
  - docs/UIUX_TRACEABILITY.md (114개 Requirement, Implementation Status)
  - docs/03_UI_COVERAGE_ANALYSIS.md (합계 검증용 교차 확인)
  - src/app 실제 파일 트리 존재 여부(정보성)

종료 코드: 오류가 하나라도 있으면 1, 없으면 0. 경고는 종료 코드에 영향을 주지 않는다.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
HARNESS_SCHEMA = "traveler-screen-route-v1"
EXPECTED_SCREEN_IDS = [f"SCR-00{i}" for i in range(1, 6)]

errors: list[str] = []
warnings: list[str] = []


def error(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def load_json(path: Path):
    if not path.exists():
        error(f"파일이 없습니다: {path.relative_to(ROOT)}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        error(f"JSON 파싱 실패: {path.relative_to(ROOT)} — {exc}")
        return None


def load_text(path: Path) -> str | None:
    if not path.exists():
        error(f"파일이 없습니다: {path.relative_to(ROOT)}")
        return None
    return path.read_text(encoding="utf-8")


def check_screen_route_contract() -> dict | None:
    path = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
    data = load_json(path)
    if data is None:
        return None

    if data.get("schema_version") != HARNESS_SCHEMA:
        error(
            f"schema_version이 HARNESS_SCHEMA({HARNESS_SCHEMA})와 다릅니다: "
            f"{data.get('schema_version')!r}"
        )

    if data.get("framework") != "nextjs-app-router":
        warn(f"framework 값이 예상과 다릅니다: {data.get('framework')!r}")

    screens = data.get("screens", [])
    if len(screens) != 5:
        error(f"screens 배열이 정확히 5개가 아닙니다 (실제 {len(screens)}개).")

    ids = [s.get("screen_id") for s in screens]
    if sorted(ids) != EXPECTED_SCREEN_IDS:
        error(f"Screen ID 집합이 SCR-001~005와 다릅니다: {sorted(ids)}")

    routes = [s.get("route") for s in screens]
    if len(routes) != len(set(routes)):
        error(f"Route 중복이 있습니다: {routes}")

    entries = [s.get("page_entry") for s in screens]
    if len(entries) != len(set(entries)):
        error(f"Page Entry 중복이 있습니다: {entries}")

    core = [s for s in screens if s.get("role") == "core"]
    aux = [s for s in screens if s.get("role") == "auxiliary"]
    if len(core) != 4 or len(aux) != 1:
        error(f"핵심(core) 4개·보조(auxiliary) 1개 구성이 아닙니다 (core={len(core)}, auxiliary={len(aux)}).")

    for s in screens:
        if not s.get("page_owner_task_required"):
            error(f"{s.get('screen_id')}의 page_owner_task_required가 true가 아닙니다.")
        if not s.get("preview_required"):
            error(f"{s.get('screen_id')}의 preview_required가 true가 아닙니다.")

    scr001 = next((s for s in screens if s.get("screen_id") == "SCR-001"), None)
    if scr001 is not None and not scr001.get("starter_template_forbidden"):
        error("SCR-001의 starter_template_forbidden이 true가 아닙니다.")

    tech_routes = data.get("technical_routes", [])
    tech_types = {t.get("type") for t in tech_routes}
    for required_type in ("auth_callback", "api_route", "not_found"):
        if required_type not in tech_types:
            warn(f"technical_routes에 '{required_type}' 유형이 없습니다.")

    print(f"[OK] SCREEN_ROUTE_CONTRACT.json: {len(screens)}개 Screen, "
          f"core={len(core)}, auxiliary={len(aux)}, technical_routes={len(tech_routes)}개")

    return {s["screen_id"]: s for s in screens if "screen_id" in s}


def parse_traceability(path: Path):
    text = load_text(path)
    if text is None:
        return None
    # 각 행: | REQ-FUNC-001 ... | IMPLEMENT | Screen | Route | Page Entry | Task | Test | Status |
    row_re = re.compile(
        r"\|\s*(REQ-(?:FUNC|NF)-\d{3})[^|]*\|\s*(IMPLEMENT|EXCLUDED)\s*\|"
    )
    rows = row_re.findall(text)
    if not rows:
        error(f"{path.relative_to(ROOT)}에서 Requirement 행을 찾지 못했습니다.")
        return None

    seen: dict[str, str] = {}
    duplicates = []
    for req_id, status in rows:
        if req_id in seen and seen[req_id] != status:
            duplicates.append(req_id)
        seen[req_id] = status

    if duplicates:
        error(f"UIUX_TRACEABILITY.md에 상태가 다른 중복 Requirement 행이 있습니다: {duplicates}")

    if len(seen) != 114:
        error(f"UIUX_TRACEABILITY.md의 Requirement 개수가 114개가 아닙니다 (실제 {len(seen)}개).")

    implement = {k for k, v in seen.items() if v == "IMPLEMENT"}
    excluded = {k for k, v in seen.items() if v == "EXCLUDED"}

    print(f"[OK] UIUX_TRACEABILITY.md: 총 {len(seen)}개, "
          f"IMPLEMENT={len(implement)}, EXCLUDED={len(excluded)}")

    return {"all": seen, "implement": implement, "excluded": excluded}


def cross_check_counts(trace) -> None:
    """03_UI_COVERAGE_ANALYSIS.md의 집계표와 대조해 매직 넘버 없이 검증한다."""
    path = ROOT / "docs" / "03_UI_COVERAGE_ANALYSIS.md"
    text = load_text(path)
    if text is None or trace is None:
        return

    m_impl = re.search(r"\|\s*IMPLEMENT\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\*?\*?(\d+)\*?\*?\s*\|", text)
    m_excl = re.search(r"\|\s*EXCLUDED\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\*?\*?(\d+)\*?\*?\s*\|", text)

    if not m_impl or not m_excl:
        warn("03_UI_COVERAGE_ANALYSIS.md §6.3 집계표를 찾지 못해 교차 검증을 건너뜁니다.")
        return

    expected_implement = int(m_impl.group(1))
    expected_excluded = int(m_excl.group(1))

    if len(trace["implement"]) != expected_implement:
        error(
            "UIUX_TRACEABILITY.md의 IMPLEMENT 개수가 03_UI_COVERAGE_ANALYSIS.md 집계와 다릅니다: "
            f"{len(trace['implement'])} != {expected_implement}"
        )
    if len(trace["excluded"]) != expected_excluded:
        error(
            "UIUX_TRACEABILITY.md의 EXCLUDED 개수가 03_UI_COVERAGE_ANALYSIS.md 집계와 다릅니다: "
            f"{len(trace['excluded'])} != {expected_excluded}"
        )
    else:
        print(f"[OK] 03_UI_COVERAGE_ANALYSIS.md 집계와 일치 (IMPLEMENT={expected_implement}, EXCLUDED={expected_excluded})")


def check_required_docs() -> None:
    required = [
        "docs/06_SRS_UIUX_REVISED.md",
        "docs/PROJECT_SCOPE.md",
        "docs/UIUX_TRACEABILITY.md",
        "design-reference/D-001/DESIGN.md",
        "design-reference/UI_CONTRACT.md",
        "design-reference/SCREEN_ROUTE_CONTRACT.json",
        "package.json",
    ]
    for rel in required:
        if not (ROOT / rel).exists():
            error(f"필수 입력 문서가 없습니다: {rel}")


def check_src_app_tree() -> None:
    src_app = ROOT / "src" / "app"
    if not src_app.exists():
        error("src/app 디렉터리가 없습니다.")
        return
    files = sorted(p.relative_to(ROOT).as_posix() for p in src_app.rglob("*") if p.is_file())
    print(f"[INFO] 현재 src/app 파일 트리 ({len(files)}개):")
    for f in files:
        print(f"       - {f}")
    if not any(f.endswith("page.tsx") for f in files):
        warn("src/app 아래에 page.tsx가 없습니다.")


def main() -> int:
    print("== Traveler 입력 검증 (validate_inputs.py) ==")
    check_required_docs()
    check_screen_route_contract()
    trace = parse_traceability(ROOT / "docs" / "UIUX_TRACEABILITY.md")
    cross_check_counts(trace)
    check_src_app_tree()

    print()
    print(f"경고 {len(warnings)}건:")
    for w in warnings:
        print(f"  [WARN] {w}")

    print()
    print(f"오류 {len(errors)}건:")
    for e in errors:
        print(f"  [ERROR] {e}")

    print()
    if errors:
        print("결과: FAIL — Task 생성을 진행하지 마세요.")
        return 1

    print("결과: PASS — Task 생성을 진행해도 됩니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
