:: ================================================================
::  MAXIMIZE ACADEMY — Installazione Auto-Deploy come Windows Service
::  
::  ▶  ESEGUI COME AMMINISTRATORE (click destro → "Esegui come amm.")
::  ▶  Va eseguito UNA SOLA VOLTA.
::  Dopo il riavvio, l'auto-deploy partirà automaticamente ad ogni
::  accensione del PC senza bisogno di fare nulla.
:: ================================================================
@echo off
NET SESSION >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ╔════════════════════════════════════════════╗
    echo  ║  ERRORE: Esegui come Amministratore!       ║
    echo  ║  Click destro sul file → "Esegui come amm."║
    echo  ╚════════════════════════════════════════════╝
    pause
    exit /b 1
)

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║   MAXIMIZE ACADEMY — Installazione Auto-Deploy   ║
echo  ╚══════════════════════════════════════════════════╝
echo.

SET TASK_NAME=MaximizeAcademy-AutoDeploy
SET BAT_PATH=c:\Users\Eliseo Miraglia\Desktop\LAVORO\MAXIMIZE ACADEMY SITO\MAXIMIZE_ACADEMY_PROGETTO_COMPLETO\auto-deploy-launcher.bat
SET USER_NAME=Eliseo Miraglia

:: Rimuovi task precedente se esiste
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

:: Crea il task schedulato: all'avvio, sempre attivo, si riavvia se crasha
schtasks /create ^
  /tn "%TASK_NAME%" ^
  /tr "cmd.exe /c \"%BAT_PATH%\"" ^
  /sc ONSTART ^
  /ru "%USER_NAME%" ^
  /rl HIGHEST ^
  /f

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo  ✅ Task registrato con successo!
    echo.
    echo  Il watcher si avvierà automaticamente ad ogni
    echo  avvio di Windows senza bisogno di fare nulla.
    echo.
    echo  Avvio immediato del watcher...
    start "" /min cmd.exe /c "%BAT_PATH%"
    echo  ✅ Watcher avviato in background!
) ELSE (
    echo.
    echo  ❌ Errore nella creazione del task. Riprova come Amministratore.
)

echo.
pause
