@echo off
echo ========================================
echo   LANCEMENT AUTO-COMMIT (30 min)
echo ========================================
powershell -ExecutionPolicy Bypass -File "%~dp0auto-commit.ps1"
pause

