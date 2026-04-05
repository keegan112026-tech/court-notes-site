@echo off
setlocal

set "PWSH_EXE=%ProgramFiles%\PowerShell\7\pwsh.exe"
if exist "%PWSH_EXE%" goto run

for %%I in (pwsh.exe) do set "PWSH_EXE=%%~$PATH:I"
if defined PWSH_EXE goto run

echo [error] pwsh.exe not found. Install PowerShell 7 first. 1>&2
exit /b 1

:run
"%PWSH_EXE%" %*
