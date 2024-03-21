import './style.css';
import React, { useState } from 'react';
import axios from 'axios';

const WeatherForm = () => {
  const [zip, setZip] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async (zipCode) => {
    const apiKey = '3913bbbcaaf2a22e7c15f9a6be06b973';
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data. Please check the console for more information.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(zip);
  };

  return (
    <div className="weather-form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter ZIP Code"
        />
        <button type="submit">Get Weather</button>
      </form>
      {weatherData && (
        <div>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp}°F</p>
          <p>Condition: {weatherData.weather[0].main}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherForm;
