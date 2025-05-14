@echo off
echo 正在启动项目...

echo 启动后端项目...
start cmd /k "call start-backend.bat"

echo 等待后端启动...
timeout /t 10

echo 启动前端项目...
start cmd /k "call start-frontend.bat"

echo 项目启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8080 