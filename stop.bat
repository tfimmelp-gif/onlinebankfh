@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NORTHSTAR_PORT=4007"
set "NORTHSTAR_PID_FILE=%CD%\.northstar-server.pid"

if not exist "%NORTHSTAR_PID_FILE%" goto untracked

set /p NORTHSTAR_TRACKED_PID=<"%NORTHSTAR_PID_FILE%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$pidFile = Get-Item -LiteralPath $env:NORTHSTAR_PID_FILE -ErrorAction SilentlyContinue; $process = Get-Process -Id $env:NORTHSTAR_TRACKED_PID -ErrorAction SilentlyContinue; if (-not $pidFile -or -not $process -or $process.ProcessName -ne 'node' -or [Math]::Abs(($process.StartTime - $pidFile.CreationTime).TotalSeconds) -gt 20) { exit 1 }; exit 0"
if errorlevel 1 (
  del /q "%NORTHSTAR_PID_FILE%" >nul 2>&1
  goto untracked
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Stop-Process -Id $env:NORTHSTAR_TRACKED_PID -Force -ErrorAction SilentlyContinue; Remove-Item -LiteralPath $env:NORTHSTAR_PID_FILE -Force -ErrorAction SilentlyContinue; Start-Sleep -Milliseconds 750; if (Get-NetTCPConnection -LocalPort 4007 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"
if errorlevel 1 (
  echo [Northstar] A project process is still listening on port %NORTHSTAR_PORT%.
  exit /b 1
)

echo [Northstar] Project server stopped.
exit /b 0

:untracked
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort 4007 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"
if errorlevel 1 (
  echo [Northstar] Port %NORTHSTAR_PORT% is active, but it was not started by start.bat.
  echo [Northstar] It was left running to avoid stopping an unrelated process.
  exit /b 1
)

echo [Northstar] No running project server was found on port %NORTHSTAR_PORT%.
exit /b 0
