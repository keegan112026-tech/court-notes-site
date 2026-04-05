from __future__ import annotations

import sys
from pathlib import Path


TEXT_EXTS = {
    ".md",
    ".txt",
    ".json",
    ".yml",
    ".yaml",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".html",
    ".css",
    ".ps1",
    ".cmd",
    ".bat",
}

SKIP_DIRS = {
    ".git",
    "node_modules",
    ".next",
    "next-dev-cache",
    ".claude",
    ".vercel",
    "old_prototype_archive",
    "version_snapshots",
    "outsourcing_packages",
    "版本備份_guide-prototype與計畫緣起_2026-04-03",
    "還原筆記單頁外包工作包_2026-04-04",
}

SKIP_PATH_PARTS = {
    "docs/archive",
    "docs/legacy_archived_docs_2026-04-04",
    "scripts/check-encoding.mjs",
}

MOJIBAKE_SNIPPETS = (
    "ï»¿",
    "Ã",
    "â€",
    "â€™",
    "â€œ",
    "â€\x9d",
    "å",
    "ç",
    "æ",
)


def should_skip(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return True
    normalized = path.as_posix()
    return any(part in normalized for part in SKIP_PATH_PARTS)


def main() -> int:
    problems: list[tuple[str, str]] = []

    for path in Path(".").rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        if should_skip(path):
            continue

        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            problems.append((path.as_posix(), "not valid utf-8"))
            continue

        if "\ufffd" in text:
            problems.append((path.as_posix(), "contains replacement character"))
            continue

        for snippet in MOJIBAKE_SNIPPETS:
            if snippet in text:
                problems.append((path.as_posix(), f"contains mojibake snippet: {snippet!r}"))
                break

    if problems:
        print("[encoding] FAIL")
        for file_path, reason in problems:
            print(f"{file_path}: {reason}")
        return 1

    print("[encoding] OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
