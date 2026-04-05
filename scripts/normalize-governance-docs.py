from __future__ import annotations

import sys
from pathlib import Path


EXACT_FILES = [
    "CURRENT_SOURCE_OF_TRUTH_2026-04-04.md",
    "CURRENT_BASELINE_2026-04-04.md",
    "WORK_PROTOCOL.md",
    "CURRENT_TASK_GATE.md",
    "GIT_MAINLINE_POLICY.md",
    "DEPLOYMENT_AND_RELEASE_POLICY.md",
    "DEPLOYMENT_LEDGER.md",
    "WORK_SESSION_GATE_2026-04-04.md",
    "REPO_CLEANUP_BASELINE_2026-04-04.md",
    "REPO_CLEANUP_FINAL_VERIFICATION_2026-04-04.md",
    "DIRTY_WORKTREE_CLASSIFICATION_2026-04-04.md",
    "ROUTE_ISOLATION_STRATEGY_2026-04-04.md",
    "CLAUDE_HANDOFF_START_HERE_2026-04-04.md",
    "README.md",
]

GLOB_PATTERNS = [
    "00_*2026-04-04.md",
    "docs/claude_handoff_2026-04-04/*.md",
]

BOM = b"\xef\xbb\xbf"


def iter_governance_docs(repo_root: Path) -> list[Path]:
    found: dict[str, Path] = {}

    for rel in EXACT_FILES:
        path = repo_root / rel
        if path.exists():
            found[path.as_posix()] = path

    for pattern in GLOB_PATTERNS:
        for path in repo_root.glob(pattern):
            if path.is_file():
                found[path.as_posix()] = path

    return [found[key] for key in sorted(found)]


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if not text.endswith("\n"):
        text += "\n"
    return text


def normalize(repo_root: Path) -> int:
    files = iter_governance_docs(repo_root)
    if not files:
        print("[governance-docs] FAIL: no governance docs matched")
        return 1

    print(f"[governance-docs] NORMALIZE {len(files)} files")
    for path in files:
        text = path.read_text(encoding="utf-8-sig")
        normalized = normalize_text(text)
        path.write_text(normalized, encoding="utf-8", newline="\n")
        print(path.relative_to(repo_root).as_posix())

    print("[governance-docs] OK")
    return 0


def verify(repo_root: Path) -> int:
    files = iter_governance_docs(repo_root)
    if not files:
        print("[governance-docs] FAIL: no governance docs matched")
        return 1

    problems: list[tuple[str, str]] = []
    for path in files:
        raw = path.read_bytes()
        rel = path.relative_to(repo_root).as_posix()

        if raw.startswith(BOM):
            problems.append((rel, "has UTF-8 BOM"))

        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            problems.append((rel, "not valid UTF-8"))
            continue

        if "\r" in text:
            problems.append((rel, "contains CR or CRLF line endings"))

        if not text.endswith("\n"):
            problems.append((rel, "missing final newline"))

    if problems:
        print("[governance-docs] FAIL")
        for rel, reason in problems:
            print(f"{rel}: {reason}")
        return 1

    print(f"[governance-docs] OK ({len(files)} files)")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) != 2 or argv[1] not in {"normalize", "verify", "list"}:
        print("usage: python scripts/normalize-governance-docs.py [normalize|verify|list]")
        return 2

    repo_root = Path(__file__).resolve().parents[1]
    cmd = argv[1]

    if cmd == "list":
        for path in iter_governance_docs(repo_root):
            print(path.relative_to(repo_root).as_posix())
        return 0
    if cmd == "normalize":
        return normalize(repo_root)
    return verify(repo_root)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
