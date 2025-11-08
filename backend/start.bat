@echo off
REM Start the GuitarZeno backend server for Windows

echo Starting GuitarZeno Backend Server...
echo Make sure you have:
echo 1. Arduino connected and chord_detection_arduino.ino uploaded
echo 2. Camera connected
echo 3. Dependencies installed (pip install -r requirements.txt)
echo.

REM Check if virtual environment exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Start the server
python backend/main.py

pause

