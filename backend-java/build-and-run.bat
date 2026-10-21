@echo off
setlocal enabledelayedexpansion
title Maximize Academy - Java Backend Server

echo ============================================================
echo   MAXIMIZE ACADEMY - COMPILAZIONE ED ESECUZIONE JAVA
echo ============================================================

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File compile.ps1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRORE] Compilazione fallita!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [AVVIO] Esecuzione Server Java su porta 8080...
java -cp bin com.maximize.academy.MaximizeAcademyServer

pause
