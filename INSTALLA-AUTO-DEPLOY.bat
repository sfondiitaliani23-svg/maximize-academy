@echo off
:: ================================================================
::  MAXIMIZE ACADEMY - Installazione Auto-Deploy
::
::  Doppio click. Va eseguito UNA SOLA VOLTA.
::  Da ora il watcher parte da solo ogni volta che entri in Windows.
::  Usa la cartella "Esecuzione automatica" di Windows: niente admin.
::
::  Per disinstallare:  INSTALLA-AUTO-DEPLOY.bat rimuovi
:: ================================================================
setlocal

SET TASK_NAME=MaximizeAcademy-AutoDeploy
SET BAT_PATH=%~dp0auto-deploy-launcher.bat
SET STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\MaximizeAcademy-AutoDeploy.cmd

echo.
echo  ==================================================
echo    MAXIMIZE ACADEMY - Installazione Auto-Deploy
echo  ==================================================
echo.

:: 1) Toglie il vecchio task del Task Scheduler (versione precedente)
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1
    schtasks /query /tn "%TASK_NAME%" >nul 2>&1
    if not errorlevel 1 (
        echo  ATTENZIONE: c'e' ancora il vecchio task "%TASK_NAME%".
        echo  Rilancia questo file con click destro - "Esegui come amministratore".
        goto fine
    )
    echo  Vecchio task del Task Scheduler rimosso.
)

:: 2) Toglie il vecchio avvio automatico, se c'e'
if exist "%STARTUP_FILE%" del "%STARTUP_FILE%"

if /i "%~1"=="rimuovi" (
    echo  Auto-deploy disinstallato. Non partira' piu' da solo.
    echo  Se una finestra "Auto Deploy" e' aperta, chiudila a mano.
    goto fine
)

:: 3) Crea l'avvio automatico al login
> "%STARTUP_FILE%" echo @echo off
>> "%STARTUP_FILE%" echo start "Maximize Academy - Auto Deploy" /min "%BAT_PATH%"

if not exist "%STARTUP_FILE%" (
    echo  ERRORE: non riesco a creare l'avvio automatico.
    goto fine
)

echo  OK - Avvio automatico installato.
echo  Il watcher partira' da solo a ogni accesso a Windows.
echo.
echo  Avvio immediato del watcher...
start "Maximize Academy - Auto Deploy" /min "%BAT_PATH%"
echo  OK - Watcher avviato in una finestra ridotta a icona.

:fine
echo.
pause
endlocal
