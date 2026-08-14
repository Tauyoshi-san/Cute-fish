@echo off
setlocal
title AQUA ALTER Launcher
cd /d "%~dp0"
set "npm_config_cache=%~dp0.npm-cache"

echo.
echo  ========================================
echo            AQUA ALTER LAUNCHER
echo  ========================================
echo.

where node >nul 2>nul
if errorlevel 1 goto no_node
where npm >nul 2>nul
if errorlevel 1 goto no_node

if /i "%~1"=="--check" goto check_ok

if not exist "node_modules\vite\bin\vite.js" goto install
if not exist "node_modules\phaser\package.json" goto install
goto start_game

:install
echo  Preparing the game for its first launch...
echo  Please keep this window open.
echo.
call npm install --no-audit --no-fund --fetch-timeout=60000 --fetch-retries=2
if not errorlevel 1 goto start_game
echo.
echo  Retrying with Windows certificate compatibility mode...
set "npm_config_strict_ssl=false"
call npm install --no-audit --no-fund --fetch-timeout=60000 --fetch-retries=2
if errorlevel 1 goto install_failed

:start_game
echo  Starting game...
echo  Your browser will open automatically.
echo  Keep this window open while playing.
echo.
call npm run dev
if errorlevel 1 goto start_failed
goto done

:no_node
echo  Node.js is required to run this game.
echo  The official download page will now open.
echo  Install the LTS version, then run this launcher again.
start "" "https://nodejs.org/ja"
goto failed

:install_failed
echo.
echo  SETUP FAILED
echo  Please check your internet connection and try again.
goto failed

:start_failed
echo.
echo  START FAILED
echo  Please take a screenshot of this window.
goto failed

:check_ok
echo  LAUNCHER CHECK OK
exit /b 0

:failed
echo.
pause
exit /b 1

:done
endlocal
