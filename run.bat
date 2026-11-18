@echo off
echo ========================================================
echo   Starting GOBEYOND TRAVELS Platform (Backend + Frontend)
echo ========================================================
cd /d "%~dp0"

echo [1/2] Starting Node.js Express Backend & Real-time Socket Server...
start "GoBeyond Backend API (:5000)" cmd /c "cd /d "%~dp0backend" && node src/server.js"

echo Waiting 2 seconds for API server to initialize...
timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend Web Server (:3000)...
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python server could not start. Launching index.html directly in your default browser...
    start index.html
)
pause
