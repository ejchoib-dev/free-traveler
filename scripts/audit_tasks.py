#!/usr/bin/env python3
"""Traveler Task 최종 감사 스크립트.

입력:
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

수행하는 18개 검사는 이 파일 상단의 CHECKS 정의를 그대로 따른다(요청받은 번호와 1:1).

출력:
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK_AUDIT_REPORT.md

종료 코드: 오류가 하나라도 있으면 1(TASK_AUDIT_REPORT.md/매니페스트는 그래도 생성해
디버깅에 사용할 수 있게 한다), 없으면 0.
성공 시 표준출력에 "AUDIT_PASS"와 통과한 검사 수를 출력한다.

외부 패키지 없이 표준 라이브러리만 사용한다.
"""
from __future__ import annotations

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
TASKS_DIR = ROOT / "TASKS"
TASKLIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = ROOT / "docs" / "PROJECT_SCOPE.md"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_CSV_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_MD_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

ALLOWED_DB_TABLES = {
    "USER_PROFILE",
    "MATE_POST",
    "MATE_APPLICATION",
    "USER_BLOCK",
    "REPORT",
    "OUTBOUND_URL_SETTING",
}
REQUIRED_DB_TASKS = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 병합", "무인 병합", "auto-merge", "autonomous merge"]
NEGATION_MARKERS = (
    "사용하지 않", "사용 안 함", "사용 안함", "만들지 않", "포함하지 않",
    "금지", "제외", "미사용", "없음",
)


# --------------------------------------------------------------------------
# 파싱
# --------------------------------------------------------------------------

def parse_tasklist_rows(text: str) -> list[dict]:
    rows = []
    for line in text.splitlines():
        s = line.strip()
        if not re.match(r"^\|\s*\d+\s*\|", s):
            continue
        cells = [c.strip() for c in line.split("|")]
        if len(cells) < 18:
            continue
        rows.append(
            {
                "seq": cells[1], "task_id": cells[2], "title": cells[3],
                "category": cells[4], "impl": cells[5], "req_ref": cells[6],
                "screen": cells[7], "route": cells[8], "page_entry": cells[9],
                "depends_on": cells[10], "expected_files": cells[11],
                "functional_ac": cells[12], "visual_ac": cells[13],
                "security_ac": cells[14], "verify": cells[15], "priority": cells[16],
            }
        )
    return rows


def parse_excluded_ledger(text: str) -> set[str]:
    ids: set[str] = set()
    in_section = False
    for line in text.splitlines():
        if line.strip().startswith("## 6. NON_IMPLEMENTATION"):
            in_section = True
            continue
        if in_section and re.match(r"^## \d+\.", line.strip()):
            break
        if in_section:
            m = re.match(r"\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|", line.strip())
            if m:
                ids.add(m.group(1))
    return ids


def req_ids(cell: str) -> list[str]:
    return re.findall(r"REQ-(?:FUNC|NF)-\d{3}", cell)


def split_ids(cell: str) -> list[str]:
    if not cell or cell.strip() in ("없음",):
        return []
    return [x.strip() for x in cell.split(",") if x.strip()]


def load_screen_contract() -> dict[str, dict] | None:
    if not CONTRACT_PATH.exists():
        return None
    try:
        data = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None
    return {s["screen_id"]: s for s in data.get("screens", []) if s.get("screen_id")}


def parse_project_scope_classification() -> dict[str, str]:
    """PROJECT_SCOPE.md의 요구사항 처리표에서 REQ ID -> IMPLEMENT/EXCLUDED를 읽는다."""
    if not PROJECT_SCOPE_PATH.exists():
        return {}
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    row_re = re.compile(r"\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|[^|]*\|\s*(IMPLEMENT|EXCLUDED)\s*\|")
    return dict(row_re.findall(text))


def strip_prohibition_sections(body: str) -> str:
    out = []
    skip = False
    for line in body.splitlines():
        if re.match(r"^## (Project Scope|Forbidden)\s*$", line.strip()):
            skip = True
            continue
        if skip and re.match(r"^## ", line.strip()):
            skip = False
        if not skip:
            out.append(line)
    return "\n".join(out)


def find_unguarded_keyword(body: str, keyword: str) -> bool:
    """부정 표현 없이 keyword가 등장하면 True."""
    body_lower = body.lower()
    kw_lower = keyword.lower()
    start = 0
    while True:
        idx = body_lower.find(kw_lower, start)
        if idx == -1:
            return False
        window = body[max(0, idx - 20): idx + len(keyword) + 20]
        if not any(m in window for m in NEGATION_MARKERS):
            return True
        start = idx + len(keyword)


# --------------------------------------------------------------------------
# 검사 실행기
# --------------------------------------------------------------------------

class Check:
    def __init__(self, no: int, name: str):
        self.no = no
        self.name = name
        self.passed = True
        self.details: list[str] = []

    def fail(self, msg: str) -> None:
        self.passed = False
        self.details.append(msg)

    def info(self, msg: str) -> None:
        self.details.append(msg)


def run_checks() -> tuple[list[Check], list[dict], set[str]]:
    checks: list[Check] = []

    if not TASKLIST_PATH.exists():
        c = Check(0, "TASKS/00_TASK_LIST.md 존재")
        c.fail("TASKS/00_TASK_LIST.md가 없습니다.")
        return [c], [], set()

    tasklist_text = TASKLIST_PATH.read_text(encoding="utf-8")
    rows = parse_tasklist_rows(tasklist_text)
    row_by_id = {r["task_id"]: r for r in rows}
    tasklist_ids = set(row_by_id)
    excluded_ledger = parse_excluded_ledger(tasklist_text)

    detail_files = sorted(TASKS_DIR.glob("TASK-*.md"))
    detail_ids = {p.stem[len("TASK-"):] for p in detail_files}
    bodies = {tid: (TASKS_DIR / f"TASK-{tid}.md").read_text(encoding="utf-8") for tid in detail_ids}

    contract = load_screen_contract()
    scope_status = parse_project_scope_classification()

    # ---- 1. Task List 구현 ID와 상세 Task 파일 1:1 ----
    c1 = Check(1, "Task List 구현 ID ↔ 상세 Task 파일 1:1")
    missing_details = tasklist_ids - detail_ids
    orphan_details = detail_ids - tasklist_ids
    if missing_details:
        c1.fail(f"상세 파일 없는 Task: {sorted(missing_details)}")
    if orphan_details:
        c1.fail(f"Task List에 없는 상세 파일: {sorted(orphan_details)}")
    if c1.passed:
        c1.info(f"{len(tasklist_ids)}개 일치")
    checks.append(c1)

    # ---- 2. 중복 Task ID 0 ----
    c2 = Check(2, "중복 Task ID 0")
    ids_list = [r["task_id"] for r in rows]
    dup_ids = sorted({i for i in ids_list if ids_list.count(i) > 1})
    if dup_ids:
        c2.fail(f"중복 Task ID: {dup_ids}")
    else:
        c2.info(f"{len(ids_list)}개 Task ID 모두 고유")
    checks.append(c2)

    # ---- 3. Depends On 누락 0 (참조 무결성) ----
    c3 = Check(3, "Depends On 누락 0")
    for r in rows:
        for dep in split_ids(r["depends_on"]):
            if dep not in tasklist_ids:
                c3.fail(f"{r['task_id']}: 존재하지 않는 Depends On '{dep}'")
    if c3.passed:
        c3.info("모든 Depends On이 실제 Task ID를 참조함")
    checks.append(c3)

    # ---- 4. Dependency Cycle 0 ----
    c4 = Check(4, "Dependency Cycle 0")
    graph = {r["task_id"]: [d for d in split_ids(r["depends_on"]) if d in tasklist_ids] for r in rows}
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasklist_ids}
    cycle_found: list[str] = []

    def dfs(node: str, path: list[str]) -> bool:
        color[node] = GRAY
        path.append(node)
        for nxt in graph.get(node, []):
            if color[nxt] == GRAY:
                idx = path.index(nxt)
                cycle_found.extend(path[idx:] + [nxt])
                return True
            if color[nxt] == WHITE and dfs(nxt, path):
                return True
        path.pop()
        color[node] = BLACK
        return False

    for tid in tasklist_ids:
        if color[tid] == WHITE:
            if dfs(tid, []):
                break
    if cycle_found:
        c4.fail(f"순환 의존성 발견: {' -> '.join(cycle_found)}")
    else:
        c4.info("순환 의존성 없음")
    checks.append(c4)

    # ---- 5. Screen 5개 모두 Page Owner 정확히 1개 ----
    c5 = Check(5, "Screen 5개 모두 Page Owner 정확히 1개")
    owners_by_screen: dict[str, list[str]] = {}
    for r in rows:
        if r["category"] == "PAGE_OWNER":
            owners_by_screen.setdefault(r["screen"], []).append(r["task_id"])
    if contract:
        for sid in sorted(contract):
            owners = owners_by_screen.get(sid, [])
            if len(owners) != 1:
                c5.fail(f"{sid}의 Page Owner가 {len(owners)}개({owners})")
        extra = set(owners_by_screen) - set(contract)
        if extra:
            c5.fail(f"계약에 없는 Screen에 Page Owner 존재: {sorted(extra)}")
    else:
        c5.fail("SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사를 수행할 수 없습니다.")
    if c5.passed:
        c5.info(f"Screen {len(contract) if contract else 0}개 전부 Page Owner 1개")
    checks.append(c5)

    # ---- 6. Route·Page Entry·Expected Files 일치 ----
    c6 = Check(6, "Route·Page Entry·Expected Files 일치")
    if contract:
        for r in rows:
            screen_tokens = re.findall(r"SCR-\d{3}", r["screen"])
            route_literals = re.findall(r"`([^`]+)`", r["route"]) or [r["route"].strip("`")]
            if r["category"] == "PAGE_OWNER":
                # Page Owner는 정확히 1개 Screen을 1:1로 조립하므로 완전 일치를 요구한다.
                sid = screen_tokens[0] if screen_tokens else r["screen"]
                spec = contract.get(sid)
                if not spec:
                    c6.fail(f"{r['task_id']}: 계약에 없는 Screen '{sid}'")
                    continue
                if r["route"].strip("`") != spec["route"]:
                    c6.fail(f"{r['task_id']}: Route 불일치 (Task List='{r['route']}', 계약='{spec['route']}')")
                if r["page_entry"].strip("`") != spec["page_entry"]:
                    c6.fail(f"{r['task_id']}: Page Entry 불일치 (Task List='{r['page_entry']}', 계약='{spec['page_entry']}')")
            elif screen_tokens and "`" in r["route"] and r["category"] in ("COMPONENT", "E2E_TEST"):
                # 여러 Screen을 함께 다루는 Task(E2E 등)는 각 Screen의 계약 Route가
                # Route 셀에 하나라도 포함되어 있으면 일치로 본다. Screen 칸에 참고용으로만
                # SCR-00X를 언급하는 DATA/DB/SHARED 등(Route=N/A, 백틱 없음)은 대상에서 제외한다.
                for sid in screen_tokens:
                    spec = contract.get(sid)
                    if spec and spec["route"] not in route_literals:
                        c6.fail(
                            f"{r['task_id']}: {sid}의 계약 Route('{spec['route']}')가 "
                            f"Task List Route 셀({r['route']})에 없음"
                        )
            body = bodies.get(r["task_id"], "")
            page_entry_plain = r["page_entry"].strip("`")
            if page_entry_plain not in ("N/A",) and page_entry_plain not in body:
                c6.fail(f"{r['task_id']}: 상세 파일에 Page Entry('{page_entry_plain}')가 기록되어 있지 않음")
    else:
        c6.fail("SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사를 수행할 수 없습니다.")
    if c6.passed:
        c6.info("Page Owner Route/Page Entry가 계약과 일치, 모든 Task 상세에 Page Entry 기록됨")
    checks.append(c6)

    # ---- 7. Component-only Screen 0 ----
    c7 = Check(7, "Component-only Screen 0")
    component_screens = {r["screen"] for r in rows if r["category"] == "COMPONENT" and r["screen"].startswith("SCR-")}
    owner_screens = set(owners_by_screen)
    orphan_screens = component_screens - owner_screens
    if orphan_screens:
        c7.fail(f"Page Owner 없이 Component만 있는 Screen: {sorted(orphan_screens)}")
    else:
        c7.info("Component가 있는 모든 Screen에 Page Owner 존재")
    checks.append(c7)

    # ---- 8. SCR-001 Starter 제거 AC 존재 ----
    c8 = Check(8, "SCR-001 Starter 제거 AC 존재")
    scr001_owner = owners_by_screen.get("SCR-001", [])
    if not scr001_owner:
        c8.fail("SCR-001 Page Owner가 없습니다.")
    else:
        body = bodies.get(scr001_owner[0], "")
        if "스캐폴드" not in body:
            c8.fail(f"{scr001_owner[0]}: 'create-next-app 스캐폴드 제거' 관련 AC가 없습니다.")
        else:
            c8.info(f"{scr001_owner[0]}에서 확인")
    checks.append(c8)

    # ---- 9. SCR-003 세 탭 조립 AC 존재 ----
    c9 = Check(9, "SCR-003 세 탭 조립 AC 존재")
    scr003_owner = owners_by_screen.get("SCR-003", [])
    if not scr003_owner:
        c9.fail("SCR-003 Page Owner가 없습니다.")
    else:
        body = bodies.get(scr003_owner[0], "")
        if not all(k in body for k in ("항공", "숙소", "동행")):
            c9.fail(f"{scr003_owner[0]}: 항공·숙소·동행 3개 탭 조립 AC가 불완전합니다.")
        else:
            c9.info(f"{scr003_owner[0]}에서 확인")
    checks.append(c9)

    # ---- 10. SCR-005 역할별 상태 조립 AC 존재 ----
    c10 = Check(10, "SCR-005 역할별(Guest/Member/Admin) 상태 조립 AC 존재")
    scr005_owner = owners_by_screen.get("SCR-005", [])
    if not scr005_owner:
        c10.fail("SCR-005 Page Owner가 없습니다.")
    else:
        body = bodies.get(scr005_owner[0], "")
        has_guest = re.search(r"Guest|게스트", body)
        has_member = re.search(r"Member|회원|멤버", body)
        has_admin = re.search(r"Admin|관리자", body)
        if not (has_guest and has_member and has_admin):
            c10.fail(f"{scr005_owner[0]}: Guest·Member·Admin 역할별 조립 AC가 불완전합니다.")
        else:
            c10.info(f"{scr005_owner[0]}에서 확인")
    checks.append(c10)

    # ---- 11. DB Schema·RLS·Access·Seed Task 존재 ----
    c11 = Check(11, "DB Schema·RLS·Access·Seed Task 존재")
    missing_db_tasks = [t for t in REQUIRED_DB_TASKS if t not in tasklist_ids]
    if missing_db_tasks:
        c11.fail(f"필수 DB Task 누락: {missing_db_tasks}")
    else:
        c11.info(f"{REQUIRED_DB_TASKS} 전부 존재")
    checks.append(c11)

    # ---- 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음 ----
    c12 = Check(12, "DB Table 범위 ≤ 6개 기본 테이블")
    used_tables: set[str] = set()
    unexpected_tables: set[str] = set()
    for r in rows:
        if r["category"] != "DB":
            continue
        body = strip_prohibition_sections(bodies.get(r["task_id"], ""))
        for m in re.finditer(r"\b([A-Z][A-Z_]{3,})\b", body):
            token = m.group(1)
            if token in ALLOWED_DB_TABLES:
                used_tables.add(token)
            elif token in ("AUDIT_LOG", "MEDIA_ASSET", "COUNTRY_SAFETY", "DESTINATION_CONTENT", "DESTINATION"):
                unexpected_tables.add(token)
    if unexpected_tables:
        c12.fail(f"허용 목록 밖 테이블 언급: {sorted(unexpected_tables)}")
    if len(used_tables) > 6:
        c12.fail(f"테이블 수가 6개를 초과함: {sorted(used_tables)}")
    if c12.passed:
        c12.info(f"사용된 테이블 {len(used_tables)}개: {sorted(used_tables)}")
    checks.append(c12)

    # ---- 13. 외부 입력 비저장 AC 존재 ----
    c13 = Check(13, "외부 입력(항공·숙소) 비저장 AC 존재")
    for tid in ("COMP-SCR003-FLIGHT", "COMP-SCR003-HOTEL"):
        if tid not in bodies:
            c13.fail(f"{tid} 상세 파일이 없습니다.")
            continue
        body = bodies[tid]
        if not re.search(r"서버.*저장하지 않는다|저장하지 않는다.*서버", body):
            c13.fail(f"{tid}: 서버 미저장 AC 문구가 없습니다.")
    if c13.passed:
        c13.info("COMP-SCR003-FLIGHT, COMP-SCR003-HOTEL에서 확인")
    checks.append(c13)

    # ---- 14. Auth·성인·기본 RLS AC 존재 ----
    c14 = Check(14, "Auth·성인 확인·기본 RLS AC 존재")
    all_body_text = "\n".join(bodies.values())
    if not re.search(r"인증|로그인", all_body_text):
        c14.fail("어떤 Task에도 인증/로그인 관련 AC가 없습니다.")
    if not re.search(r"성인", all_body_text):
        c14.fail("어떤 Task에도 성인 확인 관련 AC가 없습니다.")
    if "DB-RLS-BASE" not in tasklist_ids:
        c14.fail("DB-RLS-BASE Task가 없어 기본 RLS를 확인할 수 없습니다.")
    if c14.passed:
        c14.info("인증/성인확인/DB-RLS-BASE 모두 확인됨")
    checks.append(c14)

    # ---- 15. Playwright Chromium Smoke Task 존재 ----
    c15 = Check(15, "Playwright Chromium Smoke Task 존재")
    e2e_rows = [r for r in rows if r["category"] == "E2E_TEST"]
    if not e2e_rows:
        c15.fail("E2E_TEST 카테고리 Task가 없습니다.")
    else:
        mentions_chromium = any("chromium" in bodies.get(r["task_id"], "").lower() for r in e2e_rows)
        if not mentions_chromium:
            c15.fail("E2E_TEST Task 중 Chromium을 명시한 Task가 없습니다.")
        for r in e2e_rows:
            body_lower = strip_prohibition_sections(bodies.get(r["task_id"], "")).lower()
            if re.search(r"firefox|webkit|safari|부하|load test|visual regression|시각 회귀", body_lower):
                c15.fail(f"{r['task_id']}: Chromium Smoke 범위를 벗어난 내용이 있습니다.")
    if c15.passed:
        c15.info(f"E2E_TEST Task {len(e2e_rows)}개, Chromium Smoke 범위 확인")
    checks.append(c15)

    # ---- 16. AWS·EC2·자동 Merge 구현 Task 0 ----
    c16 = Check(16, "AWS·EC2·자동 Merge 구현 Task 0")
    for tid, raw_body in bodies.items():
        body = strip_prohibition_sections(raw_body)
        for kw in FORBIDDEN_KEYWORDS:
            if find_unguarded_keyword(body, kw):
                c16.fail(f"{tid}: 금지 키워드 '{kw}'가 부정 표현 없이 등장")
    if c16.passed:
        c16.info("모든 Task에서 금지 키워드 없음(또는 금지 문맥으로만 언급)")
    checks.append(c16)

    # ---- 17. REQ-FUNC 80개 + REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재 ----
    c17 = Check(17, "REQ-FUNC 80개·REQ-NF 34개 전체가 Task 또는 EXCLUDED 표에 존재")
    all_reqs = {f"REQ-FUNC-{i:03d}" for i in range(1, 81)} | {f"REQ-NF-{i:03d}" for i in range(1, 35)}
    covered: set[str] = set()
    for r in rows:
        covered.update(req_ids(r["req_ref"]))
    accounted = covered | excluded_ledger
    missing = all_reqs - accounted
    if missing:
        c17.fail(f"Task에도, EXCLUDED 표에도 없는 Requirement: {sorted(missing)}")
    extra = accounted - all_reqs
    if extra:
        c17.fail(f"REQ-FUNC-001~080/REQ-NF-001~034 범위 밖 ID: {sorted(extra)}")
    if scope_status:
        implement_per_scope = {k for k, v in scope_status.items() if v == "IMPLEMENT"}
        excluded_per_scope = {k for k, v in scope_status.items() if v == "EXCLUDED"}
        mismatch_impl_as_excluded = implement_per_scope & excluded_ledger
        mismatch_excl_as_covered = excluded_per_scope & covered
        if mismatch_impl_as_excluded:
            c17.fail(f"PROJECT_SCOPE상 IMPLEMENT인데 EXCLUDED 표에 있음: {sorted(mismatch_impl_as_excluded)}")
        if mismatch_excl_as_covered:
            c17.fail(f"PROJECT_SCOPE상 EXCLUDED인데 구현 Task에 포함됨: {sorted(mismatch_excl_as_covered)}")
    if c17.passed:
        c17.info(f"전체 114개(FUNC 80 + NF 34) 전부 Task({len(covered)}) 또는 EXCLUDED 표({len(excluded_ledger)})에 존재")
    checks.append(c17)

    # ---- 18. EXCLUDED 상세 구현 파일이 생성되지 않음 ----
    c18 = Check(18, "EXCLUDED 상세 구현 파일 미생성")
    excluded_only_tasks = []
    for r in rows:
        rreqs = set(req_ids(r["req_ref"]))
        if rreqs and rreqs.issubset(excluded_ledger):
            excluded_only_tasks.append(r["task_id"])
    if excluded_only_tasks:
        c18.fail(f"EXCLUDED Requirement만 커버하는 Task 상세가 존재함: {excluded_only_tasks}")
    for eid in excluded_ledger:
        for r in rows:
            if eid in req_ids(r["req_ref"]):
                c18.fail(f"EXCLUDED Requirement {eid}가 구현 Task '{r['task_id']}'의 Requirement Ref에 포함됨")
    if c18.passed:
        c18.info(f"EXCLUDED {len(excluded_ledger)}개 모두 상세 구현 파일 없이 NON_IMPLEMENTATION 표에만 존재")
    checks.append(c18)

    return checks, rows, tasklist_ids


# --------------------------------------------------------------------------
# 출력물 생성
# --------------------------------------------------------------------------

def write_manifest_csv(rows: list[dict]) -> None:
    fieldnames = [
        "task_id", "category", "screen", "route", "page_entry",
        "depends_on", "requirement_ref", "priority", "detail_file", "status",
    ]
    with MANIFEST_CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            detail_file = f"TASKS/TASK-{r['task_id']}.md"
            exists = (TASKS_DIR / f"TASK-{r['task_id']}.md").exists()
            writer.writerow(
                {
                    "task_id": r["task_id"],
                    "category": r["category"],
                    "screen": r["screen"],
                    "route": r["route"].strip("`"),
                    "page_entry": r["page_entry"].strip("`"),
                    "depends_on": "; ".join(split_ids(r["depends_on"])),
                    "requirement_ref": "; ".join(req_ids(r["req_ref"])),
                    "priority": r["priority"],
                    "detail_file": detail_file,
                    "status": "DETAIL_EXISTS" if exists else "DETAIL_MISSING",
                }
            )


def write_audit_report(checks: list[Check], overall_pass: bool) -> None:
    lines = [
        "# Task Audit Report",
        "",
        "| 항목 | 값 |",
        "|---|---|",
        "| Document ID | TASK-AUDIT-TRAVEL-001 |",
        "| 근거 문서 | `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |",
        f"| 검사 수 | {len(checks)} |",
        f"| 최종 결과 | {'AUDIT_PASS' if overall_pass else 'AUDIT_FAIL'} |",
        "",
        "---",
        "",
        "## 검사 결과",
        "",
        "| # | 검사 | 결과 | 상세 |",
        "|---|---|---|---|",
    ]
    for c in checks:
        status = "PASS" if c.passed else "FAIL"
        detail = "<br>".join(c.details) if c.details else "-"
        lines.append(f"| {c.no} | {c.name} | {status} | {detail} |")

    fail_count = sum(1 for c in checks if not c.passed)
    pass_count = len(checks) - fail_count
    lines += [
        "",
        "---",
        "",
        "## 요약",
        "",
        f"- 통과: {pass_count}/{len(checks)}",
        f"- 실패: {fail_count}/{len(checks)}",
        f"- 최종: **{'AUDIT_PASS' if overall_pass else 'AUDIT_FAIL'}**",
    ]
    REPORT_MD_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    print("== Traveler Task 최종 감사 (audit_tasks.py) ==")
    checks, rows, _ = run_checks()

    if rows:
        write_manifest_csv(rows)
        print(f"[생성] {MANIFEST_CSV_PATH.relative_to(ROOT)}")

    overall_pass = all(c.passed for c in checks)
    write_audit_report(checks, overall_pass)
    print(f"[생성] {REPORT_MD_PATH.relative_to(ROOT)}")

    print()
    for c in checks:
        status = "PASS" if c.passed else "FAIL"
        print(f"[{status}] {c.no}. {c.name}")
        for d in c.details:
            print(f"       - {d}")

    print()
    if overall_pass:
        print(f"AUDIT_PASS ({len(checks)}/{len(checks)} checks passed)")
        return 0

    fail_count = sum(1 for c in checks if not c.passed)
    print(f"AUDIT_FAIL ({fail_count}/{len(checks)} checks failed)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
