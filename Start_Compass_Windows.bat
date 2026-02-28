@echo off
cd /d "%~dp0"
echo ==================================================
echo       THE COMPASS IS STARTING (WINDOWS)
echo ==================================================

:: 1. Start the Brain (Backend Server) in a new minimized window
echo 1. Waking up the Brain (Server)...
start "Compass Backend" /MIN node server/index.js

:: Wait a moment
timeout /t 2 /nobreak >nul

:: 2. Open the Browser
echo 2. Opening the Browser...
start "" "http://localhost:5173"

:: 3. Start the Interface
echo 3. Launching Interface...
echo --------------------------------------------------
echo Press CTRL+C to close the Compass Frontend.
echo (Note: The Backend window will disappear automatically or stay minimized)
echo --------------------------------------------------
npm run dev
