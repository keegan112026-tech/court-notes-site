$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
Set-Location $repoRoot

. (Join-Path $scriptDir 'bootstrap-utf8.ps1') -Quiet

function Write-Section($title) {
    Write-Host ""
    Write-Host ("=" * 72) -ForegroundColor DarkGray
    Write-Host $title -ForegroundColor Cyan
    Write-Host ("=" * 72) -ForegroundColor DarkGray
}

function Test-UrlStatus($url) {
    try {
        $status = (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 20).StatusCode
        return [pscustomobject]@{ Url = $url; Status = $status; Ok = $true }
    }
    catch {
        $code = $null
        if ($_.Exception.Response) {
            try { $code = $_.Exception.Response.StatusCode.value__ } catch { $code = "ERR" }
        }

        return [pscustomobject]@{
            Url = $url
            Status = if ($code) { $code } else { "ERR" }
            Ok = $false
        }
    }
}

Write-Section "CURRENT TASK GATE PRE-FLIGHT"
Write-Host "Repo root: $repoRoot"
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Section "Required Baseline Files"
$requiredFiles = @(
    @{ Label = "ROOT_BASELINE_ENTRY (00_..._2026-04-04.md)"; Mode = "glob"; Pattern = "00_*2026-04-04.md" },
    @{ Label = "CURRENT_SOURCE_OF_TRUTH_2026-04-04.md"; Mode = "exact"; Path = "CURRENT_SOURCE_OF_TRUTH_2026-04-04.md" },
    @{ Label = "CURRENT_BASELINE_2026-04-04.md"; Mode = "exact"; Path = "CURRENT_BASELINE_2026-04-04.md" },
    @{ Label = "WORK_PROTOCOL.md"; Mode = "exact"; Path = "WORK_PROTOCOL.md" },
    @{ Label = "CURRENT_TASK_GATE.md"; Mode = "exact"; Path = "CURRENT_TASK_GATE.md" },
    @{ Label = "GIT_MAINLINE_POLICY.md"; Mode = "exact"; Path = "GIT_MAINLINE_POLICY.md" },
    @{ Label = "DEPLOYMENT_AND_RELEASE_POLICY.md"; Mode = "exact"; Path = "DEPLOYMENT_AND_RELEASE_POLICY.md" },
    @{ Label = "DEPLOYMENT_LEDGER.md"; Mode = "exact"; Path = "DEPLOYMENT_LEDGER.md" }
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    $exists = $false

    if ($file.Mode -eq "glob") {
        $exists = @(Get-ChildItem -LiteralPath $repoRoot -File -Filter $file.Pattern -ErrorAction SilentlyContinue).Count -gt 0
    } else {
        $fullPath = Join-Path $repoRoot $file.Path
        $exists = Test-Path $fullPath
    }

    if ($exists) {
        Write-Host "[OK]  $($file.Label)" -ForegroundColor Green
    } else {
        Write-Host "[MISS] $($file.Label)" -ForegroundColor Red
        $missingFiles += $file.Label
    }
}

Write-Section "Git Baseline"
$branch = (git branch --show-current).Trim()
$head = (git rev-parse HEAD).Trim()
$main = (git rev-parse main).Trim()
$originMain = (git rev-parse origin/main).Trim()

Write-Host "Current branch : $branch"
Write-Host "HEAD           : $head"
Write-Host "main           : $main"
Write-Host "origin/main    : $originMain"

if ($head -eq $main -and $head -eq $originMain) {
    Write-Host "Branch baseline: aligned with main and origin/main" -ForegroundColor Green
} else {
    Write-Host "Branch baseline: NOT aligned with main/origin/main" -ForegroundColor Yellow
}

Write-Section "Git Worktree Status"
$statusLines = @(git status --short)
$untracked = @($statusLines | Where-Object { $_ -match '^\?\?' })
$changed = @($statusLines | Where-Object { $_ -notmatch '^\?\?' })

Write-Host "Changed tracked files : $($changed.Count)"
Write-Host "Untracked files       : $($untracked.Count)"

if ($statusLines.Count -eq 0) {
    Write-Host "Worktree is clean." -ForegroundColor Green
} else {
    Write-Host "Worktree is dirty. You must define touched-file scope before editing." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Top status lines:" -ForegroundColor DarkYellow
    $statusLines | Select-Object -First 25 | ForEach-Object { Write-Host $_ }
}

Write-Section "Production Checks"
$productionUrls = @(
    "https://court-notes-site.vercel.app/",
    "https://court-notes-site.vercel.app/about",
    "https://court-notes-site.vercel.app/sessions",
    "https://court-notes-site.vercel.app/forum"
)

$results = $productionUrls | ForEach-Object { Test-UrlStatus $_ }
foreach ($result in $results) {
    $color = if ($result.Ok) { "Green" } else { "Red" }
    $label = if ($result.Ok) { "OK" } else { "FAIL" }
    Write-Host ("[{0}] {1} -> {2}" -f $label, $result.Url, $result.Status) -ForegroundColor $color
}

Write-Section "Route Group Isolation"
$groups = @("app\(preview)", "app\(prototype)", "app\(demo)", "app\(archive)")
foreach ($group in $groups) {
    $fullPath = Join-Path $repoRoot $group
    if (Test-Path $fullPath) {
        Write-Host "[OK]  $group" -ForegroundColor Green
    } else {
        Write-Host "[MISS] $group" -ForegroundColor Yellow
    }
}

Write-Section "Encoding Check"
$encodingScript = Join-Path $repoRoot "scripts\check-encoding.mjs"
$governanceScript = Join-Path $repoRoot "scripts\normalize-governance-docs.mjs"
$sessionMapScript = Join-Path $repoRoot "scripts\generate-local-session-map.mjs"
if (-not (Test-Path $encodingScript) -or -not (Test-Path $governanceScript) -or -not (Test-Path $sessionMapScript)) {
    Write-Host "[MISS] node-based repo checks not found; encoding check skipped." -ForegroundColor Yellow
    $encodingExit = $null
    $governanceExit = $null
    $sessionMapExit = $null
} else {
    & node ".\\scripts\\check-encoding.mjs"
    $encodingExit = $LASTEXITCODE

    Write-Section "Governance Docs UTF-8 Check"
    & node ".\\scripts\\normalize-governance-docs.mjs" verify
    $governanceExit = $LASTEXITCODE

    Write-Section "Local Session Map Check"
    & node ".\\scripts\\generate-local-session-map.mjs" --check
    $sessionMapExit = $LASTEXITCODE
}

Write-Section "Gate Verdict"
$hasProdFailure = $results | Where-Object { -not $_.Ok }
if ($missingFiles.Count -gt 0) {
    Write-Host "Verdict: BLOCKED - baseline files missing." -ForegroundColor Red
    exit 2
}

if ($hasProdFailure.Count -gt 0) {
    Write-Host "Verdict: CAUTION - production verification has failures." -ForegroundColor Yellow
    exit 1
}

if ($encodingExit -eq 1) {
    Write-Host "Verdict: BLOCKED - encoding check failed." -ForegroundColor Red
    exit 3
}

if ($governanceExit -eq 1) {
    Write-Host "Verdict: BLOCKED - governance docs UTF-8 check failed." -ForegroundColor Red
    exit 4
}

if ($sessionMapExit -eq 1) {
    Write-Host "Verdict: BLOCKED - local session import map is out of date." -ForegroundColor Red
    exit 5
}

if ($statusLines.Count -gt 0) {
    Write-Host "Verdict: PROCEED WITH SCOPE LOCK - production is healthy, but worktree is dirty." -ForegroundColor Yellow
    exit 0
}

Write-Host "Verdict: READY - baseline confirmed and worktree clean." -ForegroundColor Green
exit 0
