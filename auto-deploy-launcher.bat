@echo off
:: ============================================================
::  Maximize Academy - Auto-Deploy Launcher
::  Avviato da Windows al login (vedi INSTALLA-AUTO-DEPLOY.bat).
::  Non chiudere questa finestra.
:: ============================================================
title Maximize Academy - Auto Deploy

:: Va nella cartella dove si trova questo file (funziona ovunque sia il progetto)
cd /d "%~dp0"

:loop
echo [%date% %time%] Avvio auto-deploy watcher...
node auto-deploy.js
:: Codice 2 = c'e' gia' un watcher attivo: non riavviare
if %ERRORLEVEL% EQU 2 (
    echo [%date% %time%] Un altro watcher e' gia' attivo. Chiudo questa finestra.
    timeout /t 5 /nobreak >nul
    exit /b 0
)
echo [%date% %time%] Il processo si e' fermato. Riavvio tra 10 secondi...
timeout /t 10 /nobreak >nul
goto loop
