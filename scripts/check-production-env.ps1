param(
    [switch]$SkipRemoteNotionCheck
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$tempFile = Join-Path $env:TEMP ("court-notes-prod-env-" + [guid]::NewGuid().ToString() + ".env")

try {
    Write-Host "Pulling Vercel production env to temp file..." -ForegroundColor Cyan
    vercel env pull $tempFile --environment=production --yes | Out-Host

    $args = @(
        (Join-Path $repoRoot "scripts/check-env-health.mjs"),
        "--env-file", $tempFile,
        "--label", "vercel-production",
        "--scope", "all"
    )

    if (-not $SkipRemoteNotionCheck) {
        $args += "--verify-notion"
    }

    & node @args
    exit $LASTEXITCODE
}
finally {
    if (Test-Path -LiteralPath $tempFile) {
        Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
    }
}
