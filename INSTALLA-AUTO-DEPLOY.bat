@echo off
:: ================================================================
::  MAXIMIZE ACADEMY - Installazione Auto-Deploy
::
::  Doppio click. Va eseguito UNA SOLA VOLTA.
::  Il watcher parte da solo a ogni accesso a Windows, senza finestra.
::
::  Per disinstallare:  INSTALLA-AUTO-DEPLOY.bat rimuovi
:: ================================================================
setlocal
cd /d "%~dp0"

echo.
echo  ==================================================
echo    MAXIMIZE ACADEMY - Installazione Auto-Deploy
echo  ==================================================
echo.

if /i "%~1"=="rimuovi" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installa-auto-deploy.ps1" -Rimuovi
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installa-auto-deploy.ps1"
    if errorlevel 1 goto fine
    echo.
    echo  Avvio immediato del watcher...
    wscript.exe //B "%~dp0auto-deploy-hidden.vbs"
    echo  OK - Watcher avviato in background.
)

:fine
echo.
pause
endlocal
