@echo off
setlocal

set "PY313=%LocalAppData%\Programs\Python\Python313\python.exe"
set "PY312=%LocalAppData%\Programs\Python\Python312\python.exe"
set "TARGET="

if exist "%PY313%" set "TARGET=%PY313%"
if not defined TARGET if exist "%PY312%" set "TARGET=%PY312%"

if not defined TARGET (
  echo [py-wrapper] No usable Python installation found. 1>&2
  exit /b 1
)

if "%~1"=="-3.13" shift
if "%~1"=="-3.12" shift
if "%~1"=="-3" shift

"%TARGET%" %*
exit /b %ERRORLEVEL%
