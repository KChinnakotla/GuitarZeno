#!/bin/bash

# Start the GuitarZeno backend server

echo "Starting GuitarZeno Backend Server..."
echo "Make sure you have:"
echo "1. Arduino connected and chord_detection_arduino.ino uploaded"
echo "2. Camera connected"
echo "3. Dependencies installed (pip install -r requirements.txt)"
echo ""

# Check if virtual environment exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start the server
python backend/main.py

