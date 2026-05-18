// static/js/dashboard.js
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const alertPlaceholder = document.getElementById("alertPlaceholder");
const mainContent = document.getElementById("mainContent");

let tempChart = null;

function showAlert(message, type = "danger") {
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

async function fetchWeather(city) {
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      const payload = await res.json().catch(()=>({error: 'Unknown error'}));
      throw new Error(payload.error || payload.message || res.statusText);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

function clearUI() {
  document.getElementById("cityName").textContent = "";
  document.getElementById("currentDesc").textContent = "";
  document.getElementById("currentTemp").textContent = "";
  document.getElementById("feelsLike").textContent = "";
  document.getElementById("weatherIcon").innerHTML = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("wind").textContent = "";
  document.getElementById("minmax").textContent = "";
  document.getElementById("forecastList").innerHTML = "";
}

function renderCurrent(current) {
  document.getElementById("cityName").textContent = `${current.city}, ${current.country || ""}`;
  const weather = current.weather && current.weather[0];
  document.getElementById("currentDesc").textContent = weather ? capitalize(weather.description) : "";
  document.getElementById("currentTemp").textContent = current.temp !== undefined ? `${Math.round(current.temp)}°C` : "-";
  document.getElementById("feelsLike").textContent = current.feels_like !== undefined ? `Feels like ${Math.round(current.feels_like)}°C` : "";
  if (weather && weather.icon) {
    const url = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    document.getElementById("weatherIcon").innerHTML = `<img src="${url}" alt="${weather.description}">`;
  }
  document.getElementById("humidity").textContent = current.humidity ? `${current.humidity}%` : "-";
  document.getElementById("wind").textContent = current.wind_speed ? `${current.wind_speed} m/s` : "-";
  document.getElementById("minmax").textContent = (current.temp_min !== undefined && current.temp_max !== undefined)
    ? `${Math.round(current.temp_min)}° / ${Math.round(current.temp_max)}°` : "-";
}

function renderForecastList(timeseries) {
  const container = document.getElementById("forecastList");
  container.innerHTML = "";
  timeseries.slice(0, 12).forEach(item => {
    const date = new Date(item.dt * 1000);
    const hour = date.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
    const iconUrl = `https://openweathermap.org/img/wn/${item.icon}.png`;
    const el = document.createElement("div");
    el.className = "forecast-item me-2";
    el.innerHTML = `<div class="small text-muted">${hour}</div>
                    <div><img src="${iconUrl}" alt="${item.desc}"></div>
                    <div class="fw-bold">${Math.round(item.temp)}°C</div>
                    <div class="small text-muted">${capitalize(item.desc)}</div>`;
    container.appendChild(el);
  });
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function renderTempChart(timeseries) {
  const labels = timeseries.map(i => {
    const d = new Date(i.dt * 1000);
    return d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
  });
  const data = timeseries.map(i => i.temp);

  const ctx = document.getElementById("tempChart").getContext("2d");
  if (tempChart) {
    tempChart.data.labels = labels;
    tempChart.data.datasets[0].data = data;
    tempChart.update();
    return;
  }
  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temperature (°C)",
        data,
        borderColor: "#ff7b7b",
        backgroundColor: "rgba(255,123,123,0.12)",
        tension: 0.3,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

async function onSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showAlert("Please enter a city name.", "warning");
    return;
  }
  searchBtn.disabled = true;
  try {
    alertPlaceholder.innerHTML = "";
    clearUI();
    const data = await fetchWeather(city);
    if (data && data.current) {
      renderCurrent(data.current);
      renderForecastList(data.forecast.timeseries);
      renderTempChart(data.forecast.timeseries.slice(0, 16)); // next ~48h (3h intervals)
      mainContent.style.display = "block";
    } else {
      showAlert("No data returned from server.", "warning");
    }
  } catch (err) {
    console.error(err);
    showAlert(`Error: ${err.message || err}`, "danger");
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", onSearch);
cityInput.addEventListener("keydown", (e) => { if (e.key === "Enter") onSearch(); });
