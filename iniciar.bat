@echo off
cd /d "%~dp0"
python run.py
if errorlevel 1 (
  echo.
  echo Nao consegui rodar o Python. Verifique se ele esta instalado e no PATH.
  pause
)
