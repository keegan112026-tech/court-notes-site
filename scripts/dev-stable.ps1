$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

. (Join-Path $PSScriptRoot 'bootstrap-utf8.ps1') -Quiet

Write-Host '[dev:stable] Clearing local Next cache...'

$pathsToClear = @(
    (Join-Path $repoRoot 'next-dev-cache'),
    (Join-Path $repoRoot 'tsconfig.tsbuildinfo')
)

foreach ($path in $pathsToClear) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host '[dev:stable] Starting Next dev server...'
& npm.cmd run dev
