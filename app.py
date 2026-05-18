from flask import Flask, render_template, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()  # charge .env

API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not API_KEY:
    raise RuntimeError("Set OPENWEATHER_API_KEY in .env")

app = Flask(__name__, static_folder="static", template_folder="templates")

OWM_BASE_CURRENT = "https://api.openweathermap.org/data/2.5/weather"
OWM_BASE_FORECAST = "https://api.openweathermap.org/data/2.5/forecast"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def api_weather():
    """
    Proxy endpoint: /api/weather?city=Paris
    Returns combined current weather + 5-day forecast (3h step) for the city.
    """
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "Missing 'city' parameter"}), 400

    params_current = {"q": city, "appid": API_KEY, "units": "metric", "lang": "en"}
    params_forecast = {"q": city, "appid": API_KEY, "units": "metric", "lang": "en", "cnt": 40}

    try:
        r1 = requests.get(OWM_BASE_CURRENT, params=params_current, timeout=10)
        r1.raise_for_status()
        current = r1.json()

        r2 = requests.get(OWM_BASE_FORECAST, params=params_forecast, timeout=10)
        r2.raise_for_status()
        forecast = r2.json()

        # Simplify forecast: pick time series for chart
        timeseries = []
        for item in forecast.get("list", []):
            timeseries.append({
                "dt": item["dt"],
                "dt_txt": item["dt_txt"],
                "temp": item["main"]["temp"],
                "icon": item["weather"][0]["icon"],
                "desc": item["weather"][0]["description"]
            })

        result = {
            "current": {
                "city": current.get("name"),
                "country": current.get("sys", {}).get("country"),
                "temp": current.get("main", {}).get("temp"),
                "feels_like": current.get("main", {}).get("feels_like"),
                "temp_min": current.get("main", {}).get("temp_min"),
                "temp_max": current.get("main", {}).get("temp_max"),
                "humidity": current.get("main", {}).get("humidity"),
                "wind_speed": current.get("wind", {}).get("speed"),
                "weather": current.get("weather", []),
            },
            "forecast": {
                "raw": forecast,
                "timeseries": timeseries
            }
        }
        return jsonify(result)
    except requests.HTTPError as e:
        code = getattr(e.response, "status_code", 500)
        try:
            return jsonify({"error": e.response.json()}), code
        except Exception:
            return jsonify({"error": str(e)}), code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
