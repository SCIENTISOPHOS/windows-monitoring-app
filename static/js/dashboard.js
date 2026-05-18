// Charts
let cpuChart, memoryChart;
const cpuHistory = [];
const MAX_HISTORY = 30;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    updateData()
    setInterval(updateData, 2000); // Update every 2 seconds
    updateTime();
    setInterval(updateTime, 1000); // Update time every second
});

// Initialize Charts
function initCharts() {
    const ctxCpu = document.getElementById('cpuChart').getContext('2d');
    cpuChart = new Chart(ctxCpu, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Usage (%)',
                data: [],
                borderColor: '#ef5350',
                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#ef5350',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#333', font: { size: 12, weight: 'bold' } }
                },
                filler: { propagate: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#666' },
                    grid: { color: '#e0e0e0' }
                },
                x: {
                    ticks: { color: '#666' },
                    grid: { color: '#e0e0e0' }
                }
            }
        }
    });

    const ctxMemory = document.getElementById('memoryChart').getContext('2d');
    memoryChart = new Chart(ctxMemory, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Available'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#ffa726', '#66bb6a'],
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#333', font: { size: 12, weight: 'bold' }, padding: 20 }
                }
            }
        }
    });
}

// Update Data
function updateData() {
    fetch('/api/system-info')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            // CPU
            document.getElementById('cpu-percent').textContent = data.cpu.percent.toFixed(1) + '%';
            document.getElementById('cpu-progress').style.width = data.cpu.percent + '%';
            document.getElementById('cpu-freq').textContent = `Frequency: ${data.cpu.frequency} MHz`;
            document.getElementById('cpu-cores').textContent = data.cpu.count;
            document.getElementById('logical-cores').textContent = data.cpu.count_logical;
            document.getElementById('cpu-frequency').textContent = data.cpu.frequency + ' MHz';

            // Memory
            const memoryPercent = data.memory.percent;
            document.getElementById('memory-percent').textContent = memoryPercent.toFixed(1) + '%';
            document.getElementById('memory-progress').style.width = memoryPercent + '%';
            const memoryUsedGB = (data.memory.used / (1024 ** 3)).toFixed(2);
            const memoryTotalGB = (data.memory.total / (1024 ** 3)).toFixed(2);
            document.getElementById('memory-used').textContent = `${memoryUsedGB} GB / ${memoryTotalGB} GB`;
            document.getElementById('total-ram').textContent = memoryTotalGB + ' GB';

            // Disk
            const diskPercent = data.disk.percent;
            document.getElementById('disk-percent').textContent = diskPercent.toFixed(1) + '%';
            document.getElementById('disk-progress').style.width = diskPercent + '%';
            const diskUsedGB = (data.disk.used / (1024 ** 3)).toFixed(2);
            const diskTotalGB = (data.disk.total / (1024 ** 3)).toFixed(2);
            document.getElementById('disk-used').textContent = `${diskUsedGB} GB / ${diskTotalGB} GB`;
            document.getElementById('total-disk').textContent = diskTotalGB + ' GB';

            // Network
            const bytesSent = (data.network.bytes_sent / (1024 ** 2)).toFixed(2);
            const bytesRecv = (data.network.bytes_recv / (1024 ** 2)).toFixed(2);
            document.getElementById('network-status').innerHTML = `<small>Upload: ${bytesSent} MB</small>`;
            document.getElementById('network-download').innerHTML = `<small>Download: ${bytesRecv} MB</small>`;

            // Boot Time
            document.getElementById('boot-time').textContent = `Boot: ${data.boot_time}`;
            document.getElementById('boot-time-full').textContent = data.boot_time;

            // Top Processes
            updateProcessesList(data.processes);

            // Update CPU Chart
            updateCpuChart(data.cpu.percent);

            // Update Memory Chart
            memoryChart.data.datasets[0].data = [
                data.memory.used / (1024 ** 3),
                data.memory.available / (1024 ** 3)
            ];
            memoryChart.update();
        })
        .catch(error => console.error('Fetch error:', error));
}

// Update CPU Chart
function updateCpuChart(cpuPercent) {
    const time = new Date().toLocaleTimeString();
    
    cpuHistory.push(cpuPercent);
    if (cpuHistory.length > MAX_HISTORY) {
        cpuHistory.shift();
    }

    cpuChart.data.labels = cpuHistory.map((_, i) => {
        if (i % Math.ceil(MAX_HISTORY / 6) === 0) {
            return new Date(Date.now() - (MAX_HISTORY - i) * 2000).toLocaleTimeString().slice(0, 5);
        }
        return '';
    });
    cpuChart.data.datasets[0].data = cpuHistory;
    cpuChart.update();
}

// Update Processes List
function updateProcessesList(processes) {
    const tbody = document.getElementById('processes-list');
    if (!processes || processes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No processes</td></tr>';
        return;
    }

    tbody.innerHTML = processes.map(proc => `
        <tr>
            <td title="${proc.name}">${proc.name.length > 20 ? proc.name.substring(0, 17) + '...' : proc.name}</td>
            <td>
                <span class="badge" style="background-color: ${proc.memory_percent > 50 ? '#ef5350' : proc.memory_percent > 20 ? '#ffa726' : '#66bb6a'}">
                    ${proc.memory_percent}%
                </span>
            </td>
        </tr>
    `).join('');
}

// Update Time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}
