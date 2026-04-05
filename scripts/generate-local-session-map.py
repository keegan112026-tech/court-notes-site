from __future__ import annotations

import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SESSIONS_DIR = REPO_ROOT / "data" / "sessions"
OUTPUT_PATH = REPO_ROOT / "lib" / "generated" / "local-session-details.ts"


def to_identifier(stem: str) -> str:
    parts = re.split(r"[^A-Za-z0-9]+", stem)
    name = "".join(part[:1].upper() + part[1:] for part in parts if part)
    if not name or name[0].isdigit():
        name = f"Session{name}"
    return name


def render() -> str:
    imports: list[str] = []
    mappings: list[str] = []

    for path in sorted(SESSIONS_DIR.glob("*.json")):
        identifier = to_identifier(path.stem)
        imports.append(f"import {identifier} from '@/data/sessions/{path.name}';")
        mappings.append(f"    '{path.stem}': {identifier},")

    lines = [
        "/* eslint-disable */",
        "// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.",
        "// Run `npm run sessions:generate-map` after adding or removing files in data/sessions.",
        "",
        *imports,
        "",
        "export const localSessionDetailsMap = {",
        *mappings,
        "} as const;",
        "",
        "export type GeneratedLocalSessionId = keyof typeof localSessionDetailsMap;",
        "",
    ]

    return "\n".join(lines)


def main() -> int:
    expected = render()
    current = OUTPUT_PATH.read_text(encoding="utf-8") if OUTPUT_PATH.exists() else ""

    if len(sys.argv) > 1 and sys.argv[1] == "--check":
        if current != expected:
            print("[sessions-map] OUT OF DATE")
            print("Run: npm run sessions:generate-map")
            return 1
        print("[sessions-map] OK")
        return 0

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(expected, encoding="utf-8", newline="\n")
    print(f"[sessions-map] wrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
