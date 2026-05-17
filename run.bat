@echo off
echo Starting Windows System Monitor...
echo.

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\\Scripts\\activate.bat

echo Installing dependencies...
pip install -r requirements.txt -q

echo.
echo Starting Flask application...
echo.
echo Open your browser and go to: http://127.0.0.1:5000
echo.
echo Press Ctrl+C to stop the server.
echo.

python app.py
