@echo off
REM Sobe o Peter Tracker e mostra o QR code para abrir no Expo Go.
REM   start.bat            -> mesma rede Wi-Fi (LAN)
REM   start.bat --tunnel   -> via tunel (celular em outra rede / Wi-Fi com bloqueio)
setlocal
chcp 65001 >nul
cd /d "%~dp0peter-tracker"

where node >nul 2>&1 || (echo Node.js nao encontrado. Instale o Node 20+. & exit /b 1)

if not exist node_modules (
  echo Instalando dependencias...
  call npm install || exit /b 1
)

set MODE=--lan
if /i "%~1"=="--tunnel" (
  set MODE=--tunnel
  call npx expo install @expo/ngrok >nul 2>&1
)

echo.
echo Escaneie o QR code com o app Expo Go (Android) ou com a Camera (iOS).
echo Login demo: usuario "mj" / senha "peter123"
echo.
call npx expo start --clear %MODE%
