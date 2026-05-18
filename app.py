from flask import Flask, render_template, jsonify
import psutil
import os
from datetime import datetime
import json

app = Flask(__name__)

# Configuration
app.config['JSON_SORT_KEYS'] = False

def get_system_info():
    """Get comprehensive system information"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_count = psutil.cpu_count(logical=False)
        cpu_count_logical = psutil.cpu_count(logical=True)
        cpu_freq = psutil.cpu_freq().current if psutil.cpu_freq() else 0
        
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('C:' if os.name == 'nt' else '/')
        
        # Network stats
        net_io = psutil.net_io_counters()
        
        # Boot time
        boot_time = datetime.fromtimestamp(psutil.boot_time()).strftime('%Y-%m-%d %H:%M:%S')
        
        # Top processes by memory
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'memory_percent']):
            try:
                processes.append({
                    'name': proc.info['name'],
                    'pid': proc.info['pid'],
                    'memory_percent': round(proc.info['memory_percent'], 2)
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        
        processes = sorted(processes, key=lambda x: x['memory_percent'], reverse=True)[:10]
        
        return {
            'cpu': {
                'percent': cpu_percent,
                'count': cpu_count,
                'count_logical': cpu_count_logical,
                'frequency': round(cpu_freq, 2)
            },
            'memory': {
                'total': memory.total,
                'available': memory.available,
                'used': memory.used,
                'percent': memory.percent
            },
            'disk': {
                'total': disk.total,
                'used': disk.used,
                'free': disk.free,
                'percent': disk.percent
            },
            'network': {
                'bytes_sent': net_io.bytes_sent,
                'bytes_recv': net_io.bytes_recv
            },
            'boot_time': boot_time,
            'processes': processes,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    except Exception as e:
        return {'error': str(e)}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/system-info')
def api_system_info():
    return jsonify(get_system_info())

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
