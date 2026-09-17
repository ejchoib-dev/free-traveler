#!/usr/bin/env python3
"""Traveler Screen 계약(Screen Route Contract) 검증 스크립트.

`scripts/audit_tasks.py`(Task List/상세 내용 검증)와 달리, 이 스크립트는 **화면(Screen)
계약 자체** — 고정 5개 화면, Page Owner 1:1, 기술 경로 오분류, 여행지 상세/안전정보의
별도 Page화 금지, SCR-003의 이중 요구사항, (release 모드) Preview Checkpoint 존재 —
만 검사한다.

입력:
  - design-reference/SCREEN_ROUTE_CONTRACT.json
  - TASKS/TASK_MANIFEST.csv
  - src/app 디렉터리(--mode=ci / --mode=release에서만 실제 구현 파일을 스캔)

실행 모드(`--mode=plan|ci|release`, 기본값 plan):
  - plan    : Page Owner와 경로 "계획"만 검사(contract·Task Manifest만 사용, src/app 스캔 없음)
  - ci      : plan 검사 + 실제 구현된 Page 파일과 공개 경로 검사(src/app 스캔)
  - release : ci 검사 + docs/preview-checks/SCR-001.md ~ SCR-005.md 존재 확인

외부 패키지 없이 표준 라이브러리만 사용한다.
성공: `SCREEN_CONTRACT_PASS`를 출력하고 exit 0.
실패: 오류마다 파일·화면 ID·수정 힌트를 출력하고 exit 1.
"""
from __future__ import annotations

import argparse
import csv
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
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
APP_DIR = ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = ROOT / "docs" / "preview-checks"

# 고정 화면 5개(요청 명세 그대로 — SCREEN_ROUTE_CONTRACT.json이 이 목록과 어긋나면 그 자체가 오류다)
FIXED_SCREENS = [
    ("SCR-001", "/"),
    ("SCR-002", "/about"),
    ("SCR-003", "/travel-tools"),
    ("SCR-004", "/mates"),
    ("SCR-005", "/account"),
]
FIXED_SCREEN_ROUTES = {route: screen_id for screen_id, route in FIXED_SCREENS}
FIXED_SCREEN_IDS = {screen_id for screen_id, _ in FIXED_SCREENS}

# 허용 기술 경로(사용자 화면으로 세지 않는다)
TECH_ROUTE_PREFIXES = ("/api/",)
TECH_ROUTE_EXACT = ("/auth/callback", "/api")

# 여행지 상세·안전정보는 SCR-001 Drawer로만 구현한다(별도 Page 금지) — 새 경로 이름에서 이 패턴이
# 보이면 check 4 전용 힌트를 붙인다.
DEST_SAFETY_KEYWORDS = re.compile(
    r"destination|safety|country|countries|여행지|안전", re.IGNORECASE
)

errors: list[dict] = []
passed: list[str] = []


def error(message: str, file: str, screen_id: str, hint: str) -> None:
    errors.append({"message": message, "file": file, "screen_id": screen_id, "hint": hint})


def ok(label: str) -> None:
    passed.append(label)


def read_contract() -> dict:
    if not CONTRACT_PATH.exists():
        error(
            "입력 파일이 없습니다",
            str(CONTRACT_PATH.relative_to(ROOT)),
            "N/A",
            "design-reference/SCREEN_ROUTE_CONTRACT.json을 먼저 생성하세요.",
        )
        return {}
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        error(
            f"JSON 파싱 실패: {e}",
            str(CONTRACT_PATH.relative_to(ROOT)),
            "N/A",
            "JSON 문법 오류를 수정하세요.",
        )
        return {}


def read_manifest() -> list[dict]:
    if not MANIFEST_PATH.exists():
        error(
            "입력 파일이 없습니다",
            str(MANIFEST_PATH.relative_to(ROOT)),
            "N/A",
            "python scripts/audit_tasks.py를 먼저 실행해 TASK_MANIFEST.csv를 생성하세요.",
        )
        return []
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def check1_fixed_screens(contract: dict, require_files: bool) -> None:
    """1. 고정 화면 5개가 정확히 존재한다(+ ci/release에서는 실제 Page 파일도 존재)."""
    contract_path_str = str(CONTRACT_PATH.relative_to(ROOT))
    screens = {s.get("screen_id"): s for s in contract.get("screens", [])}

    all_declared_ok = True
    for screen_id, route in FIXED_SCREENS:
        s = screens.get(screen_id)
        if s is None:
            error(
                f"고정 화면 {screen_id}이(가) 계약에 없습니다",
                contract_path_str,
                screen_id,
                f'"screens" 배열에 screen_id="{screen_id}", route="{route}" 항목을 추가하세요.',
            )
            all_declared_ok = False
            continue
        if s.get("route") != route:
            error(
                f"{screen_id}의 route가 고정 화면 정의와 다릅니다(계약: {s.get('route')!r}, 기대: {route!r})",
                contract_path_str,
                screen_id,
                f'route 값을 "{route}"로 맞추세요(고정 화면 목록은 임의로 바꾸지 않습니다).',
            )
            all_declared_ok = False

    extra = set(screens) - FIXED_SCREEN_IDS
    for screen_id in sorted(extra):
        error(
            f"고정 화면 목록에 없는 Screen '{screen_id}'이(가) 계약에 있습니다",
            contract_path_str,
            screen_id,
            "5개 고정 화면 외 Screen을 추가하려면 먼저 사람 승인과 문서 개정이 필요합니다.",
        )
        all_declared_ok = False

    if all_declared_ok:
        ok("1. 고정 화면 5개가 계약과 정확히 일치")

    if not require_files:
        return

    # ci/release: 실제 Page 파일 존재 확인
    files_ok = True
    for screen_id, route in FIXED_SCREENS:
        s = screens.get(screen_id)
        page_entry = s.get("page_entry") if s else None
        if not page_entry:
            continue  # 위에서 이미 오류 기록됨
        page_path = ROOT / page_entry
        if not page_path.exists():
            error(
                f"{screen_id}의 Page 파일이 구현되지 않았습니다",
                page_entry,
                screen_id,
                f"{page_entry}를 생성해 {route} 화면을 조립하세요(PAGE-{screen_id.replace('-', '')} Task 참고).",
            )
            files_ok = False
    if files_ok:
        ok("1b. 고정 화면 5개의 Page 파일이 모두 구현됨(--mode=ci/release)")


def check2_page_owner_unique(manifest: list[dict]) -> None:
    """2. 각 화면 Page Owner Task가 정확히 하나다."""
    manifest_path_str = str(MANIFEST_PATH.relative_to(ROOT))
    counts: dict[str, list[str]] = {sid: [] for sid, _ in FIXED_SCREENS}
    for r in manifest:
        if r.get("category") == "PAGE_OWNER" and r.get("screen") in counts:
            counts[r["screen"]].append(r["task_id"])

    all_ok = True
    for screen_id, task_ids in counts.items():
        if len(task_ids) == 0:
            error(
                f"{screen_id}의 Page Owner Task가 없습니다",
                manifest_path_str,
                screen_id,
                f"category=PAGE_OWNER, screen={screen_id}인 Task를 TASKS/00_TASK_LIST.md·TASK_MANIFEST.csv에 추가하세요.",
            )
            all_ok = False
        elif len(task_ids) > 1:
            error(
                f"{screen_id}의 Page Owner Task가 {len(task_ids)}개입니다({', '.join(task_ids)})",
                manifest_path_str,
                screen_id,
                "Screen당 Page Owner는 정확히 1개여야 합니다 — 하나만 남기고 나머지는 COMPONENT로 재분류하세요.",
            )
            all_ok = False
    if all_ok:
        ok("2. 화면 5개 모두 Page Owner Task 정확히 1개")


def scan_app_pages() -> list[tuple[str, Path]]:
    """src/app 아래 실제 page.tsx들을 (route, 경로) 목록으로 반환한다."""
    pages: list[tuple[str, Path]] = []
    if not APP_DIR.exists():
        return pages
    for page_file in APP_DIR.rglob("page.tsx"):
        rel_dir = page_file.relative_to(APP_DIR).parent
        segments = [
            seg for seg in rel_dir.parts if not (seg.startswith("(") and seg.endswith(")"))
        ]
        route = "/" + "/".join(segments) if segments else "/"
        pages.append((route, page_file))
    return pages


def is_allowed_tech_route(route: str) -> bool:
    if route in TECH_ROUTE_EXACT:
        return True
    return any(route.startswith(prefix) for prefix in TECH_ROUTE_PREFIXES)


def check3_and_4_no_unexpected_pages(pages: list[tuple[str, Path]]) -> None:
    """3. 기술 경로를 사용자 화면으로 세지 않는다 / 4. 여행지 상세·안전정보 새 Page 금지."""
    unexpected_ok = True
    for route, page_path in pages:
        if route in FIXED_SCREEN_ROUTES:
            continue
        if is_allowed_tech_route(route):
            continue

        rel_path = str(page_path.relative_to(ROOT))
        if DEST_SAFETY_KEYWORDS.search(route) or DEST_SAFETY_KEYWORDS.search(rel_path):
            error(
                f"여행지 상세·안전정보로 보이는 새 Page가 생성되었습니다({route})",
                rel_path,
                "SCR-001",
                "여행지 상세·국가 안전정보는 SCR-001의 Drawer 컴포넌트로만 구현합니다(별도 Route/Page 금지, "
                "design-reference/UI_CONTRACT.md SCR-001, REQ-FUNC-004/047~054). 이 Page를 삭제하고 "
                "COMP-SCR001-DEST-DRAWER/SAFETY-DRAWER 안에 구현하세요.",
            )
        else:
            error(
                f"계약에 없는 예상치 못한 Page 경로입니다({route})",
                rel_path,
                "N/A(신규)",
                "5개 고정 화면(SCR-001~005) 또는 허용 기술 경로(/auth/callback, /api/**, not-found)가 "
                "아니면 새 Page를 만들지 않습니다. design-reference/SCREEN_ROUTE_CONTRACT.json에 없는 "
                "경로라면 이 Page를 제거하거나, 정말 필요하면 먼저 계약을 개정하세요.",
            )
        unexpected_ok = False

    if unexpected_ok:
        ok("3/4. 기술 경로 오분류 없음, 여행지 상세·안전정보 별도 Page 없음")


def check5_scr003_dual_requirement(manifest: list[dict]) -> None:
    """5. SCR-003 Task가 여행 입력과 동행 작성 양쪽 요구를 포함한다."""
    scr003_ids = [r["task_id"] for r in manifest if r.get("screen") == "SCR-003"]
    has_travel_input = any(
        "FLIGHT" in tid or "HOTEL" in tid for tid in scr003_ids
    )
    has_mate_write = any("MATE-WRITE" in tid for tid in scr003_ids)

    if has_travel_input and has_mate_write:
        ok("5. SCR-003이 여행 입력·동행 작성 Task를 모두 포함")
        return

    manifest_path_str = str(MANIFEST_PATH.relative_to(ROOT))
    if not has_travel_input:
        error(
            "SCR-003에 여행 입력(항공·숙소) Task가 없습니다",
            manifest_path_str,
            "SCR-003",
            "COMP-SCR003-FLIGHT/COMP-SCR003-HOTEL처럼 screen=SCR-003인 여행 입력 Task를 추가하세요.",
        )
    if not has_mate_write:
        error(
            "SCR-003에 동행 작성 Task가 없습니다",
            manifest_path_str,
            "SCR-003",
            "COMP-SCR003-MATE-WRITE처럼 screen=SCR-003인 동행 작성 Task를 추가하세요.",
        )


def check6_preview_checkpoints() -> None:
    """6. (release 전용) docs/preview-checks/SCR-001.md ~ SCR-005.md 확인."""
    all_ok = True
    for screen_id, _ in FIXED_SCREENS:
        p = PREVIEW_CHECKS_DIR / f"{screen_id}.md"
        if not p.exists():
            error(
                f"{screen_id}의 Preview Checkpoint 기록이 없습니다",
                str(p.relative_to(ROOT)),
                screen_id,
                f"사람이 Vercel Preview로 {screen_id}를 확인한 뒤 docs/preview-checks/{screen_id}.md에 "
                "결과를 기록하세요(CLAUDE.md 규칙 22).",
            )
            all_ok = False
    if all_ok:
        ok("6. Preview Checkpoint 기록 5개 모두 존재")


def main() -> int:
    parser = argparse.ArgumentParser(description="Traveler Screen 계약 검증")
    parser.add_argument(
        "--mode",
        choices=["plan", "ci", "release"],
        default="plan",
        help="plan(계획만) | ci(구현 Page 포함) | release(ci + Preview Checkpoint)",
    )
    args = parser.parse_args()
    mode = args.mode

    print(f"== Traveler Screen 계약 검증 (check_screen_contract.py --mode={mode}) ==")

    contract = read_contract()
    manifest = read_manifest()
    if errors:
        _report_and_exit()
        return 1

    check1_fixed_screens(contract, require_files=(mode in ("ci", "release")))
    check2_page_owner_unique(manifest)

    if mode in ("ci", "release"):
        pages = scan_app_pages()
        check3_and_4_no_unexpected_pages(pages)

    check5_scr003_dual_requirement(manifest)

    if mode == "release":
        check6_preview_checkpoints()

    return _report_and_exit()


def _report_and_exit() -> int:
    for label in passed:
        print(f"[PASS] {label}")

    if not errors:
        print()
        print("SCREEN_CONTRACT_PASS")
        return 0

    print()
    print(f"오류 {len(errors)}건:")
    for e in errors:
        print(f"  [ERROR] {e['message']}")
        print(f"    파일: {e['file']}")
        print(f"    화면: {e['screen_id']}")
        print(f"    힌트: {e['hint']}")
    print()
    print("결과: FAIL")
    return 1


if __name__ == "__main__":
    sys.exit(main())
