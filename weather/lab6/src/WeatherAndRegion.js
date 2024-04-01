import React, { useState, useEffect } from 'react';
import $ from 'jquery'; // Import jQuery

function WeatherAndRegion({ url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      // Using jQuery's AJAX method to fetch data
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json", // Expecting JSON data
        success: function (data) {
          setData(data);
        },
        error: function (error) {
          console.log('There was a problem: ' + error.responseText + ' ' + error.statusCode);
        }
      });
    }
  }, [url]);

  if (!data) return <div>Loading...</div>;

  const weather = data.weather;
  const region = data.region;
  const location = data.location[0];

  // Calculate time
  let hour = (weather.dt + weather.timezone) % 86400;
  hour = Math.floor(hour / 3600);
  let minutes = weather.dt % 3600;
  minutes = Math.floor(minutes / 60);
  let hrsOut = hour < 10 ? `0${hour}` : hour;
  let minOut = minutes < 10 ? `0${minutes}` : minutes;

  // Calculate temperature
  let temp = weather.main.temp - 273.15;
  temp = temp * 9 / 5 + 32;
  temp = Math.round(temp * 10) / 10;
  // Calculate 'feels like' temperature
  let feelsLike = weather.main.feels_like - 273.15;
  feelsLike = feelsLike * 9 / 5 + 32;
  feelsLike = Math.round(feelsLike * 10) / 10;

  // Icon URL
  const iconUrl = `${process.env.PUBLIC_URL}/weatherIcons/${weather.weather[0].icon}.png`;

  return (
    <div>
      <div className="rounded bg-green-500 p-4 flex flex-row w-full justify-between">
        <div className="flex-1 text-center">
          <img src={iconUrl} alt="Weather Icon" className="w-1/2 mx-auto" />
          <p>{weather.weather[0].description}</p>
        </div>
        <div className="flex-1 text-center">
          <p>{weather.name}</p>
          <p>{hrsOut}:{minOut}</p>
          <p>Wind Speed: {weather.wind.speed}mph</p>
          <p>Wind Direction: {weather.wind.deg}°</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Temperature: {temp}<sup>&deg;F</sup></p>
          <p>Feels like: {feelsLike}<sup>&deg;F</sup></p>
        </div>
      </div>
      <div className="rounded bg-blue-500 p-4 flex flex-row w-full justify-between">
        <div className="flex-1 text-center">
          <img src={location.flags.png} alt={location.flags.alt} className="w-1/2 mx-auto" />
          <p>{region.country}'s flag</p>
        </div>
        <div className="flex-1 text-center">
          <p>You are in the {region.region} region of {region.country} so you might as well know some facts!</p>
          <p>The capital is {location.capital}.</p>
          <p>This country drives on the {location.car.side} side of the road.</p>
          <p>And the nation's currency is the {Object.keys(location.currencies)[0]}.</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherAndRegion;