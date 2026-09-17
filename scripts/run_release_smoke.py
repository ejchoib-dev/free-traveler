#!/usr/bin/env python3
"""`npm run release:check`가 호출하는 Playwright Smoke 실행 스크립트.

CI 환경에 실제 Supabase Secret(`SUPABASE_SERVICE_ROLE_KEY`)이 없으면 로그인이 필요한
흐름(E2E-MATE-AUTH 등)은 건너뛰고 공개 Smoke(`npm run test:e2e:public`)만 실행한다.
Secret이 있으면 전체 Smoke(`npm run test:e2e`)를 실행한다.

package.json의 npm script에는 이런 조건 분기를 직접 넣지 않는다(Bash 전용 문법 금지) —
이 스크립트가 그 분기를 대신한다. 표준 라이브러리만 사용한다.
"""
from __future__ import annotations

import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def main() -> int:
    has_secret = bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))
    if has_secret:
        print("[run_release_smoke] SUPABASE_SERVICE_ROLE_KEY 감지됨 -> npm run test:e2e (전체 Smoke)")
        npm_script = "test:e2e"
    else:
        print("[run_release_smoke] SUPABASE_SERVICE_ROLE_KEY 없음 -> npm run test:e2e:public (공개 Smoke만)")
        npm_script = "test:e2e:public"
    return subprocess.call(["npm", "run", npm_script], shell=(os.name == "nt"))


if __name__ == "__main__":
    sys.exit(main())
