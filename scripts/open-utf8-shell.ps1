$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

. (Join-Path $PSScriptRoot 'bootstrap-utf8.ps1')

Write-Host ""
Write-Host "[utf8] Repo shell ready." -ForegroundColor Cyan
Write-Host "[utf8] Repo root: $repoRoot" -ForegroundColor Cyan
Write-Host "[utf8] Suggested next steps:" -ForegroundColor DarkCyan
Write-Host "  - npm run gate:check"
Write-Host "  - npm run dev:stable"
