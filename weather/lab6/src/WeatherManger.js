import React, { useState } from 'react';
import $ from 'jquery'; // Import jQuery

export default function WeatherManager( {url} ) {
  // State for the update weather form
  const [updateType, setUpdateType] = useState('');


  // Function to post weather data
  const postWeather = () => {
    $.ajax({
      type: 'POST',
      url: url,
      success: function(response){
        console.log('POST request successful:', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0) {
          alert('Your weather post has been successful\nThe database has been update\nThe page will now reload');
          window.location.reload();
        }
        console.log('Error ' + jqXHR.status + ': ' + textStatus + '\n' + errorThrown);
      }
    });
  };

  // Function to update weather data
  const updateWeather = () => {
    var typer = '';
    // Log the value of the selected radio button or perform other actions
    console.log("Selected option at the time of button click:", updateType);

    // You can use an if-else statement or switch-case to perform actions based on the selected value
    switch(updateType) {
        case 'Temperature':
            console.log("Temperature will be updated");
            typer = 't';
            break;
        case 'Feels Like':
            console.log("Feels Like will be updated");
            typer = 'f';
            break;
        case 'Wind Speed':
            console.log("Wind Speed will be updated");
            typer = 'w';
            break;
        default:
            console.log("No selection or unknown selection");
    }

    $.ajax({
      type: 'PUT',
      url: url,
      data: { type: typer },
      success: function (response) {
        console.log('POS request successful:', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0) {
          alert('Your weather updates have been successful\nThe database has been updated\nThe page will now reload');
          window.location.reload();
        }
        console.log('Error ' + jqXHR.status + ': ' + textStatus + '\n' + errorThrown);
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-semibold">Weather Data Management</div>
      
      {/* Form for posting weather data */}
      <div className="bg-gray-100 p-4 rounded">
        <button onClick={postWeather} className="px-4 py-2 bg-blue-500 text-white rounded">Post Weather</button>
      </div>

      {/* Radio buttons for selecting update type */}
      <div className="bg-gray-100 p-4 rounded">
        <div className="mb-4">Select Update Type:</div>
        <div className="flex items-center mb-4">
          <input type="radio" name="updateType" value="Temperature" onChange={(e) => setUpdateType(e.target.value)} className="mr-2" />
          <label>Temperature</label>
        </div>
        <div className="flex items-center mb-4">
          <input type="radio" name="updateType" value="Feels Like" onChange={(e) => setUpdateType(e.target.value)} className="mr-2" />
          <label>Feels Like</label>
        </div>
        <div className="flex items-center mb-4">
          <input type="radio" name="updateType" value="Wind Speed" onChange={(e) => setUpdateType(e.target.value)} className="mr-2" />
          <label>Wind Speed</label>
        </div>
        <button onClick={updateWeather} className="px-4 py-2 bg-blue-500 text-white rounded">Update Weather</button>
      </div>
    </div>
  );
}