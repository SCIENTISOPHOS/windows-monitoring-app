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
venv\\Scripts\\activate

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

## API Endpoints

### GET `/`
Returns the main dashboard HTML page.

### GET `/api/system-info`
Returns JSON with current system information:

```json
{
  "cpu": {
    "percent": 45.2,
    "count": 4,
    "count_logical": 8,
    "frequency": 2400.0
  },
  "memory": {
    "total": 17179869184,
    "available": 8589934592,
    "used": 8589934592,
    "percent": 50.0
  },
  "disk": {
    "total": 1099511627776,
    "used": 549755813888,
    "free": 549755813888,
    "percent": 50.0
  },
  "network": {
    "bytes_sent": 1000000000,
    "bytes_recv": 2000000000
  },
  "boot_time": "2024-01-15 10:30:00",
  "processes": [
    {
      "name": "chrome.exe",
      "pid": 1234,
      "memory_percent": 15.5
    }
  ],
  "timestamp": "2024-01-15 14:30:45"
}
```

## Configuration

### Modify Update Interval

Edit `static/js/dashboard.js`:

```javascript
setInterval(updateData, 2000); // Change 2000 to desired milliseconds
```

### Change Flask Port

Edit `app.py`:

```python
app.run(debug=True, host='127.0.0.1', port=5000)  # Change port number
```

### Enable Remote Access

Edit `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Accessible from other machines
```

## Troubleshooting

### Port Already in Use

Change the port number in `app.py`:
```python
app.run(debug=True, host='127.0.0.1', port=5001)  # Use different port
```

### psutil Permission Error

On Windows, run the command prompt as Administrator:
```bash
python app.py
```

### Virtual Environment Issues

Reactivate the virtual environment:
```bash
venv\\Scripts\\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

## Performance Tips

- Increase the update interval in `dashboard.js` for lower CPU usage
- Close unused browser tabs to reduce memory usage
- Keep the chart history low (MAX_HISTORY in `dashboard.js`)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Historical data logging to database
- [ ] Export reports to PDF
- [ ] Email alerts for high resource usage
- [ ] Dark mode theme
- [ ] Multi-core CPU usage breakdown
- [ ] GPU monitoring
- [ ] System event logs

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Author

Created by: SCIENTISOPHOS

## Support

For issues and questions, please open a GitHub issue in the repository.
