param(
    [switch]$SkipBuild,
    [switch]$SkipDeploy,
    [switch]$SkipSmoke,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot ".release-artifacts\published-articles-manifest.json"

function Run-Step {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    Write-Host ""
    Write-Host "==> $Label" -ForegroundColor Cyan
    & $Action
}

if ($DryRun) {
    Run-Step "Local env health check" { npm run env:check }
    Run-Step "Publish export dry-run" { node (Join-Path $repoRoot "scripts/export-published-articles-from-notion.mjs") --prune --manifest $manifestPath --dry-run }
    Run-Step "Publish sync dry-run" { node (Join-Path $repoRoot "scripts/sync-published-articles-to-notion.mjs") --manifest $manifestPath --dry-run }
    exit 0
}

Run-Step "Local env health check" { npm run env:check }
Run-Step "Export publishable articles from Notion" { node (Join-Path $repoRoot "scripts/export-published-articles-from-notion.mjs") --prune --manifest $manifestPath }
Run-Step "Validate published article snapshots" { npm run articles:validate }

if (-not $SkipBuild) {
    Run-Step "Build" { npm run build }
}

if (-not $SkipDeploy) {
    Run-Step "Deploy to production" { vercel deploy --prod --yes }
}

if (-not $SkipSmoke) {
    Run-Step "Smoke production public routes" { npm run smoke:public:prod }
}

Run-Step "Mark ready-to-publish articles as published in Notion" { node (Join-Path $repoRoot "scripts/sync-published-articles-to-notion.mjs") --manifest $manifestPath }

Write-Host ""
Write-Host "Production release workflow finished." -ForegroundColor Green
