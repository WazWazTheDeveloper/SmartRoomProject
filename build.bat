@echo off
cd taskControllerService 
start /wait cmd /k "npx tsc & exit"
cd ../deviceControllerService
start /wait cmd /k "npx tsc & exit"
cd ../controllerApiService
start /wait cmd /k "npx tsc & exit"
cd ../authService
start /wait cmd /k "npx tsc & exit"
cd ../accountService
start /wait cmd /k "npx tsc & exit"
cd ../frontend
start /wait cmd /k "npx next build & exit"

cd ../

start /wait cmd /k  "xcopy .\taskControllerService\build\ .\deployment\taskControllerService\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\taskControllerService\.env .\deployment\taskControllerService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\taskControllerService\package.json .\deployment\taskControllerService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\taskControllerService\package-lock.json .\deployment\taskControllerService\ /H /C /I /Y & exit"
start /wait cmd /k "rmdir /S /Q .\taskControllerService\build & exit"

start /wait cmd /k  "xcopy .\deviceControllerService\build\ .\deployment\deviceControllerService\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\deviceControllerService\.env .\deployment\deviceControllerService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\deviceControllerService\package.json .\deployment\deviceControllerService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\deviceControllerService\package-lock.json .\deployment\deviceControllerService\ /H /C /I /Y & exit"
start /wait cmd /k "rmdir /S /Q .\deviceControllerService\build & exit"

start /wait cmd /k  "xcopy .\controllerApiService\build\ .\deployment\controllerApiService\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\controllerApiService\.env .\deployment\controllerApiService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\controllerApiService\package.json .\deployment\controllerApiService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\controllerApiService\package-lock.json .\deployment\controllerApiService\ /H /C /I /Y & exit"
start /wait cmd /k "rmdir /S /Q .\controllerApiService\build & exit"

start /wait cmd /k  "xcopy .\authService\build\ .\deployment\authService\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\authService\.env .\deployment\authService\  /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\authService\package.json .\deployment\authService\  /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\authService\package-lock.json .\deployment\authService\  /H /C /I /Y & exit"
start /wait cmd /k "rmdir /S /Q .\authService\build & exit"

start /wait cmd /k  "xcopy .\accountService\build\ .\deployment\accountService\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\accountService\.env .\deployment\accountService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\accountService\package.json .\deployment\accountService\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\accountService\package-lock.json .\deployment\accountService\ /H /C /I /Y & exit"
start /wait cmd /k "rmdir /S /Q .\accountService\build & exit"

start /wait cmd /k  "xcopy .\frontend\.next\ .\deployment\frontend\.next\ /E /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\frontend\package.json .\deployment\frontend\ /H /C /I /Y & exit"
start /wait cmd /k  "xcopy .\frontend\package-lock.json .\deployment\frontend\ /H /C /I /Y & exit"