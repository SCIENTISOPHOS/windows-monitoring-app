# Windows System Monitoring Application

A real-time Windows system monitoring dashboard built with Flask, HTML, CSS, JavaScript, and Bootstrap.

## Features

✅ **Real-time System Monitoring**
- CPU Usage and Frequency
- Memory Usage (RAM)
- Disk Space
- Network Activity (Upload/Download)
- Running Processes

✅ **Interactive Dashboard**
- Live CPU usage chart with history
- Memory distribution pie chart
- Color-coded progress bars
- Top 10 processes by memory usage
- System boot time and information

✅ **Responsive Design**
- Mobile-friendly layout
- Works on all screen sizes
- Bootstrap 5 framework
- Modern gradient UI

✅ **Auto-refresh**
- Updates every 2 seconds
- Real-time data visualization

## Requirements

- Python 3.7+
- Flask 3.0.0
- psutil 5.9.6

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SCIENTISOPHOS/windows-monitoring-app.git
cd windows-monitoring-app
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Usage

### Start the Application

```bash
python app.py
```

Or on Windows, double-click:
```bash
run.bat
```

### Access the Dashboard

Open your browser and go to:
```
http://127.0.0.1:5000
```

## Project Structure

```
windows-monitoring-app/
├── app.py                 # Flask application & API endpoints
├── requirements.txt       # Python dependencies
├── run.bat               # Batch file to run on Windows
├── README.md             # This file
├── .gitignore           # Git ignore file
└── static/
    ├── css/
    │   └── style.css     # Custom CSS styling
    └── js/
        └── dashboard.js  # Dashboard JavaScript
└── templates/
    └── index.html        # Main HTML page
```
