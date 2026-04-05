param(
    [switch]$Quiet
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

try {
    chcp 65001 > $null
} catch {
    # Ignore if code page cannot be changed in the current host.
}

[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Set-Content:Encoding'] = 'utf8'
$PSDefaultParameterValues['Add-Content:Encoding'] = 'utf8'
$PSDefaultParameterValues['Export-Csv:Encoding'] = 'utf8'

$env:PYTHONUTF8 = '1'

if (-not $Quiet) {
    Write-Host "[utf8] Console input  : $([Console]::InputEncoding.WebName)" -ForegroundColor Green
    Write-Host "[utf8] Console output : $([Console]::OutputEncoding.WebName)" -ForegroundColor Green
    Write-Host "[utf8] File output    : $($OutputEncoding.WebName)" -ForegroundColor Green
    Write-Host "[utf8] Code page      : 65001 requested" -ForegroundColor Green
}
