#!/usr/bin/env python3
"""`npm run format:check`가 호출하는 Prettier 대상 결정/실행 스크립트.

`tests/`나 `.github/workflows/`처럼 아직 생기지 않은 디렉터리를 Prettier 글롭 인자에
그대로 넣으면 "No files matching the pattern were found" 오류로 전체 검사가 실패한다.
이 스크립트는 실제로 존재하는 대상만 골라 `prettier --check`를 실행한다 — 디렉터리가
나중에 생기면 다음 실행부터 자동으로 검사 대상에 포함된다. 검사 대상은 항상
src/tests/루트 설정 파일/GitHub Workflow로 한정하고, docs/TASKS/design-reference
같은 요구사항·Task·Wave 문서는 절대 포함하지 않는다.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent

# (존재해야 검사 대상에 포함되는 디렉터리, 그때 추가할 글롭 패턴)
CONDITIONAL_TARGETS = [
    (ROOT / "tests", "tests/**/*.{js,jsx,ts,tsx,json}"),
    (ROOT / ".github" / "workflows", ".github/workflows/**/*.{yml,yaml}"),
]

# 항상 존재하는(또는 존재하지 않아도 매치 0건이 곧 정상인) 대상
ALWAYS_TARGETS = [
    "src/**/*.{js,jsx,ts,tsx,css,json}",
    "*.{js,mjs,cjs,ts,json}",
    "!package-lock.json",
    "!next-env.d.ts",
]


def main() -> int:
    patterns = list(ALWAYS_TARGETS)
    for path, pattern in CONDITIONAL_TARGETS:
        if path.exists():
            patterns.append(pattern)
        else:
            print(f"[check_format] {path.relative_to(ROOT)} 없음 -> 이번 검사에서 제외")

    cmd = ["npx", "prettier", "--check", *patterns]
    print("[check_format] 실행:", " ".join(cmd))
    return subprocess.call(cmd, shell=(os.name == "nt"))


if __name__ == "__main__":
    sys.exit(main())
