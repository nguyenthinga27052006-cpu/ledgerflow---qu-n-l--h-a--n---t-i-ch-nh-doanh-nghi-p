@echo off
chcp 65001 >nul
title LedgerFlow - Quản lý Hóa đơn & Tài chính Doanh nghiệp
setlocal enabledelayedexpansion

:: Chuyen den dung thu muc chua file bat
cd /d "%~dp0"

echo ======================================================================
echo          LEDGERFLOW - QUẢN LÝ HÓA ĐƠN & TÀI CHÍNH DOANH NGHIỆP
echo ======================================================================
echo.
echo [*] Thư mục làm việc: %~dp0
echo.

:: Kiem tra xem da co node_modules chua
if not exist "node_modules\" (
    echo [!] Chưa tìm thấy thư mục node_modules. Đang tiến hành cài đặt thư viện...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo [X] Cài đặt thất bại! Vui lòng kiểm tra lại kết nối mạng hoặc Node.js.
        pause
        exit /b 1
    )
)

echo [1/2] Đang tự động mở trình duyệt web tới: http://localhost:3000/
start http://localhost:3000/

echo [2/2] Đang khởi động máy chủ hệ thống (Vite Server)...
echo.
echo ======================================================================
echo  HỆ THỐNG ĐANG HOẠT ĐỘNG TẠI: http://localhost:3000/
echo  - Bạn có thể thao tác trên trình duyệt vừa mở.
echo  - Để dừng hệ thống, đóng cửa sổ này hoặc nhấn tổ hợp phím [Ctrl + C].
echo ======================================================================
echo.

:: Chay truc tiep file bin cua Vite qua Node.js de tranh loi dau '&' trong duong dan Windows
node .\node_modules\vite\bin\vite.js --port=3000 --host=0.0.0.0

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Máy chủ đã dừng hoặc gặp lỗi (Mã lỗi: %ERRORLEVEL%).
)

pause
