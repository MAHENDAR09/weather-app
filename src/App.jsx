import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const checkWeather = async () => {
    if (!city) {
      // if no city is entred
      alert("Please enter a city name!");
      return;
    }

    try {
      // Get latitude and longitude
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();  // converting to JSON format

      if (!geoData.results || geoData.results.length === 0) {   // if city not exist
        setError("❌ City not found");
        alert("Enter a valid city");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0]; 

      // Get weather using latitude and longitude
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        ...weatherData.current_weather,
        city: name,
        country: country,
      });
      setError("");
      setCity("");
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("⚠️ Failed to fetch weather");
    }
  };

  const weatherapp = () => {
    if (!weather)
        return 'app';
    return "";
  }
  // Backgound selection based on weather
  const getBackgroundClass = () => {
    if (!weather) return "weather-app default-bg";
    if (weather.temperature >= 30) return "weather-app hot-bg";
    if (weather.temperature >= 15) return "weather-app medium-bg";
    return "weather-app cool-bg";
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="weather-box">
        <h1 className={weatherapp()}>🌤 Weather App</h1>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />

        <button onClick={checkWeather}>Check Weather</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>
              {weather.city}, {weather.country}
            </h2>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Wind: {weather.windspeed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
