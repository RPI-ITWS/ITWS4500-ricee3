import React, { useState, useEffect } from 'react';
import $ from 'jquery'; // Import jQuery

function WeatherAndRegion({ url }) {
  const [data, setData] = useState(null);
  // States for form inputs
  const [accessibility, setAccessibility] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [participants, setParticipants] = useState('');
  let parameters = {
    accessibility,
    price,
    type,
    participants
  }

  // POST request to add a new article
  const activityInformation = () => {
    parameters = {
      accessibility: (10-accessibility)/10,
      price,
      type,
      participants
    }
    console.log("Parameters: ",parameters);
  };

  useEffect(() => {
    if (url) {
      // Using jQuery's AJAX method to fetch data
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json", // Expecting JSON data
        data: parameters,
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
  const activity = data.activity;

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

  const accessibilityRating = 10 - (activity.accessibility) * 10;

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
      <div className="rounded bg-purple-500 p-4 flex flex-row w-full justify-between">
        <div className="flex-1 text-center">
          <p>If you're bored why don't you try a {activity.type} activity by going to {activity.activity}!</p>
          <p>It will reqiure {activity.participants} {activity.participants > 1
            ? 'people'
            : 'person'},
            has an accessibilityRating(0-10) of {accessibilityRating}, and costs {activity.price}!</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="text-lg font-semibold">Add</div>

        {/* Input fields and buttons for posting, putting, and deleting articles */}
        <input
          type="number"
          value={accessibility}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 10) {
              setAccessibility(value); // Directly set the value without transformation
            } else if (e.target.value === '') {
              setAccessibility(''); // Allow clearing the input
            }
          }}
          className="p-2 border rounded"
          placeholder="Accessibility on rating 0-10"
          step='any'
        />
        <input
          type="number"
          value={price}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setPrice(value);
            }
          }}
          className="p-2 border rounded"
          placeholder="Your budget"
          step='any'
        /><input
          type="number"
          value={participants}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setParticipants(value);
            }
          }}
          className="p-2 border rounded"
          placeholder="Number of people you have"
          step='any'
        />
        <select
          value={type}
          onChange={(e) => {
            if (!e.target.value == "random") {
              setParticipants(e.target.value);
            }
          }}
          className="p-2 border rounded"
        >
          <option value="random">Random</option>
          <option value="education">Education</option>
          <option value="recreational">Recreational</option>
          <option value="social">Social</option>
          <option value="diy">DIY</option>
          <option value="charity">Charity</option>
          <option value="cooking">Cooking</option>
          <option value="relaxation">Relaxation</option>
          <option value="music">Music</option>
          <option value="busywork">Busywork</option>
        </select>

        {/* Include other input fields similarly */}

        {/* Buttons for actions */}
        <div className="w-screen max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">

          <button onClick={activityInformation} className="px-4 py-2 bg-blue-500 text-white rounded">New Activity</button>

        </div>
      </div>

    </div>
  );
}

export default WeatherAndRegion;