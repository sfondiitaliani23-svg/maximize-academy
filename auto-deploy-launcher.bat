@echo off
:: ============================================================
::  Maximize Academy — Auto-Deploy Launcher
::  Questo file viene eseguito dal Task Scheduler di Windows
::  all'avvio del sistema. Non chiudere questa finestra.
:: ============================================================
title Maximize Academy - Auto Deploy

:: Vai nella cartella del progetto
cd /d "c:\Users\Eliseo Miraglia\Desktop\LAVORO\MAXIMIZE ACADEMY SITO\MAXIMIZE_ACADEMY_PROGETTO_COMPLETO"

:: Loop infinito: se il processo crasha, si riavvia automaticamente
:loop
echo [%date% %time%] Avvio auto-deploy watcher...
node auto-deploy.js
echo [%date% %time%] Il processo si e' fermato. Riavvio tra 5 secondi...
timeout /t 5 /nobreak >nul
goto loop
