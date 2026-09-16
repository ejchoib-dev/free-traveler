#!/usr/bin/env python3
"""Traveler Harness(운영 규칙 인프라) 검증 스크립트.

`scripts/validate_inputs.py`(Task 생성 전 입력 문서 검증), `scripts/audit_tasks.py`
(Task List/상세 내용 검증)와 달리, 이 스크립트는 **Harness 자체**
(`CLAUDE.md`, Skill, 7개 Command, Harness Marker)가 갖춰져 있는지만 검사한다.

외부 패키지 없이 표준 라이브러리만 사용한다.
성공: 표준출력에 정확히 `VALIDATE_HARNESS_PASS`를 출력하고 exit 0.
실패: 문제가 된 파일/누락 규칙을 출력하고 exit 1.
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
CLAUDE_MD = ROOT / "CLAUDE.md"
SKILL_MD = ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = ROOT / ".claude" / "commands"
DESIGN_PATH = ROOT / "design-reference" / "D-001" / "DESIGN.md"
SCREEN_CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

EXPECTED_COMMANDS = {
    "gen-tasklist",
    "gen-task-details",
    "audit-tasks",
    "prepare-task",
    "implement-task",
    "run-wave",
    "release-check",
}

ALLOWED_DB_TABLES = [
    "USER_PROFILE", "MATE_POST", "MATE_APPLICATION",
    "USER_BLOCK", "REPORT", "OUTBOUND_URL_SETTING",
]

errors: list[str] = []


def error(msg: str) -> None:
    errors.append(msg)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


def main() -> int:
    print("== Traveler Harness 검증 (validate_harness.py) ==")

    claude_text = read_text(CLAUDE_MD)
    skill_text = read_text(SKILL_MD)
    combined = claude_text + "\n" + skill_text

    # ---- 1. CLAUDE.md 존재 ----
    if not CLAUDE_MD.exists():
        error(f"CLAUDE.md가 없습니다: {CLAUDE_MD.relative_to(ROOT)}")
    else:
        print("[PASS] 1. CLAUDE.md 존재")

    # ---- 2. Claude Code Skill 파일 존재 ----
    if not SKILL_MD.exists():
        error(f"Skill 파일이 없습니다: {SKILL_MD.relative_to(ROOT)}")
    else:
        print("[PASS] 2. Claude Code Skill 파일 존재")

    # ---- 3. 7개 Command 존재 ----
    command_files = sorted(COMMANDS_DIR.glob("*.md")) if COMMANDS_DIR.exists() else []
    command_names = {p.stem for p in command_files}
    if len(command_names) != 7:
        error(f"Command 개수가 7개가 아닙니다(실제 {len(command_names)}개): {sorted(command_names)}")
    missing_commands = EXPECTED_COMMANDS - command_names
    extra_commands = command_names - EXPECTED_COMMANDS
    if missing_commands:
        error(f"필수 Command 파일 누락: {sorted(missing_commands)}")
    if extra_commands:
        error(f"예상 목록에 없는 Command 파일 존재(개수 7 초과 원인 확인 필요): {sorted(extra_commands)}")
    if not missing_commands and not extra_commands and len(command_names) == 7:
        print(f"[PASS] 3. 7개 Command 존재: {sorted(command_names)}")

    # ---- 4. traveler-screen-route-v1 Marker 존재 ----
    if "HARNESS_SCHEMA=traveler-screen-route-v1" not in claude_text:
        error("CLAUDE.md에 'HARNESS_SCHEMA=traveler-screen-route-v1' Marker가 없습니다.")
    else:
        print("[PASS] 4. traveler-screen-route-v1 Marker 존재")

    # ---- 5. D-001 DESIGN 경로 일치 ----
    m = re.search(r"DESIGN_PATH=([^\s`]+)", claude_text)
    if not m:
        error("CLAUDE.md에 'DESIGN_PATH=' Marker가 없습니다.")
    else:
        declared = m.group(1).strip()
        if declared != "design-reference/D-001/DESIGN.md":
            error(f"DESIGN_PATH 값이 예상과 다릅니다: '{declared}'")
        elif not DESIGN_PATH.exists():
            error(f"DESIGN_PATH가 가리키는 파일이 실제로 없습니다: {DESIGN_PATH.relative_to(ROOT)}")
        else:
            print("[PASS] 5. D-001 DESIGN 경로 일치")

    # ---- 6. Screen Contract 경로 일치 ----
    m = re.search(r"SCREEN_CONTRACT=([^\s`]+)", claude_text)
    contract_data = None
    if not m:
        error("CLAUDE.md에 'SCREEN_CONTRACT=' Marker가 없습니다.")
    else:
        declared = m.group(1).strip()
        if declared != "design-reference/SCREEN_ROUTE_CONTRACT.json":
            error(f"SCREEN_CONTRACT 값이 예상과 다릅니다: '{declared}'")
        elif not SCREEN_CONTRACT_PATH.exists():
            error(f"SCREEN_CONTRACT가 가리키는 파일이 실제로 없습니다: {SCREEN_CONTRACT_PATH.relative_to(ROOT)}")
        else:
            try:
                contract_data = json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                error("SCREEN_ROUTE_CONTRACT.json 파싱 실패.")
            if contract_data and contract_data.get("schema_version") != "traveler-screen-route-v1":
                error(
                    "SCREEN_ROUTE_CONTRACT.json의 schema_version이 HARNESS_SCHEMA와 다릅니다: "
                    f"{contract_data.get('schema_version')!r}"
                )
            else:
                print("[PASS] 6. Screen Contract 경로 일치(schema_version 포함)")

    # ---- 7. Page Owner 5개 규칙 존재 ----
    has_page_owner_rule = "Page Owner" in claude_text
    has_five_screen_rule = bool(re.search(r"Screen당.*(PAGE_OWNER|Page Owner).*(정확히 1개|1개)", skill_text))
    if not (has_page_owner_rule and has_five_screen_rule):
        error("Page Owner 5개(Screen당 정확히 1개) 규칙이 CLAUDE.md/SKILL.md에 명시되어 있지 않습니다.")
    else:
        print("[PASS] 7. Page Owner 5개 규칙 존재")

    # ---- 8. DB Table 6개 기본 범위 존재 ----
    missing_tables_in_docs = [t for t in ALLOWED_DB_TABLES if t not in skill_text and t not in claude_text]
    if missing_tables_in_docs:
        error(f"DB 6개 테이블 중 문서에 언급되지 않은 것: {missing_tables_in_docs}")
    else:
        print("[PASS] 8. DB Table 6개 기본 범위 존재")

    # ---- 9. 외부 입력 비저장 규칙 존재 ----
    if not re.search(r"항공.{0,5}숙소.*(서버|DB|URL|로그|분석).*(보내지 않는다|저장하지 않는다|전달·저장하지 않는다)", claude_text):
        error("CLAUDE.md에 항공·숙소 외부 입력 비저장 규칙이 명시되어 있지 않습니다.")
    else:
        print("[PASS] 9. 외부 입력 비저장 규칙 존재")

    # ---- 10. Playwright Chromium Smoke 규칙 존재 ----
    if "PLAYWRIGHT_SCOPE=chromium-smoke" not in claude_text:
        error("CLAUDE.md에 'PLAYWRIGHT_SCOPE=chromium-smoke' Marker가 없습니다.")
    elif "Chromium" not in claude_text and "Chromium" not in skill_text:
        error("Chromium Smoke 관련 규칙 서술이 CLAUDE.md/SKILL.md에 없습니다.")
    else:
        print("[PASS] 10. Playwright Chromium Smoke 규칙 존재")

    # ---- 11. AUTO_MERGE=false ----
    if "AUTO_MERGE=false" not in claude_text:
        error("CLAUDE.md에 'AUTO_MERGE=false' Marker가 없습니다.")
    else:
        print("[PASS] 11. AUTO_MERGE=false")

    # ---- 12. AWS_ENABLED=false ----
    if "AWS_ENABLED=false" not in claude_text:
        error("CLAUDE.md에 'AWS_ENABLED=false' Marker가 없습니다.")
    else:
        print("[PASS] 12. AWS_ENABLED=false")

    # ---- 13. EXCLUDED 보호 규칙 존재 ----
    if "EXCLUDED" not in claude_text:
        error("CLAUDE.md에 EXCLUDED 보호 규칙이 명시되어 있지 않습니다.")
    else:
        print("[PASS] 13. EXCLUDED 보호 규칙 존재")

    print()
    if errors:
        print(f"오류 {len(errors)}건:")
        for e in errors:
            print(f"  [ERROR] {e}")
        print()
        print("결과: FAIL")
        return 1

    print("VALIDATE_HARNESS_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
