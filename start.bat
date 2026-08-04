@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NORTHSTAR_PORT=4007"
set "NORTHSTAR_ROOT=%CD%"
set "NORTHSTAR_PID_FILE=%CD%\.northstar-server.pid"
set "NORTHSTAR_LOG_FILE=%CD%\.northstar-dev.log"
set "NORTHSTAR_ERROR_LOG=%CD%\.northstar-dev-error.log"
set "NORTHSTAR_CLI=%CD%\node_modules\vinext\dist\cli.js"
set "NORTHSTAR_OPEN_BROWSER=1"

if /i "%~1"=="--no-browser" set "NORTHSTAR_OPEN_BROWSER=0"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [Northstar] Node.js was not found.
  echo [Northstar] Install Node.js, then run start.bat again.
  exit /b 1
)

if not exist "%NORTHSTAR_CLI%" (
  echo [Northstar] Project dependencies are missing.
  echo [Northstar] Run npm install, then run start.bat again.
  exit /b 1
)

if exist "%NORTHSTAR_PID_FILE%" (
  set /p NORTHSTAR_TRACKED_PID=<"%NORTHSTAR_PID_FILE%"
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "if (Get-Process -Id $env:NORTHSTAR_TRACKED_PID -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
  if not errorlevel 1 (
    echo [Northstar] The project server is already running. Checking the page...
    goto wait_for_page
  )
  del /q "%NORTHSTAR_PID_FILE%" >nul 2>&1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort 4007 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
  echo [Northstar] Port %NORTHSTAR_PORT% is already being used by another process.
  echo [Northstar] Stop that process before starting this project.
  exit /b 1
)

echo [Northstar] Starting the project on port %NORTHSTAR_PORT%...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$quotedCli = '\"' + $env:NORTHSTAR_CLI + '\"'; $process = Start-Process -FilePath 'node.exe' -ArgumentList @($quotedCli, 'dev', '--port', '4007') -WorkingDirectory $env:NORTHSTAR_ROOT -WindowStyle Hidden -RedirectStandardOutput $env:NORTHSTAR_LOG_FILE -RedirectStandardError $env:NORTHSTAR_ERROR_LOG -PassThru; Set-Content -LiteralPath $env:NORTHSTAR_PID_FILE -Value $process.Id -NoNewline"
if errorlevel 1 (
  echo [Northstar] The server could not be started.
  exit /b 1
)

:wait_for_page
echo [Northstar] Waiting for the website to become ready...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddSeconds(60); do { $trackedId = Get-Content -LiteralPath $env:NORTHSTAR_PID_FILE -ErrorAction SilentlyContinue; if (-not $trackedId -or -not (Get-Process -Id $trackedId -ErrorAction SilentlyContinue)) { exit 1 }; try { $response = Invoke-WebRequest -Uri 'http://localhost:4007/' -UseBasicParsing -TimeoutSec 3; if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { exit 0 } } catch {}; Start-Sleep -Milliseconds 500 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$trackedId = Get-Content -LiteralPath $env:NORTHSTAR_PID_FILE -ErrorAction SilentlyContinue; if ($trackedId) { Stop-Process -Id $trackedId -Force -ErrorAction SilentlyContinue }; Remove-Item -LiteralPath $env:NORTHSTAR_PID_FILE -Force -ErrorAction SilentlyContinue"
  echo [Northstar] The website did not become ready. Review:
  echo   %NORTHSTAR_LOG_FILE%
  echo   %NORTHSTAR_ERROR_LOG%
  exit /b 1
)

echo [Northstar] Website ready at http://localhost:%NORTHSTAR_PORT%/
echo [Northstar] Run stop.bat to stop the server.

if "%NORTHSTAR_OPEN_BROWSER%"=="1" (
  start "" "http://localhost:%NORTHSTAR_PORT%/"
)

exit /b 0
