//index.js

// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

// Function to navigate to Lab 5 page
function goToOtherPage() {
  window.location.href = "index.html";
}

function goToOtherPage2() {
  window.location.href = "page2.html";
}


// Function to fetch weather data from the server
async function fetchWeatherData(date) {
  try {
      const response = await fetch(`/weather/${date}`);
      if (!response.ok) {
          throw new Error('Failed to fetch weather data');
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
  }
}



// Event listener for form submission
document.getElementById('weatherForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const date = document.getElementById('weatherDateInput').value;

  try {
      // Fetch weather data from the server
      const weatherData = await fetchWeatherData(date);
      // Update UI with weather data
      updateWeatherUI(weatherData);
  } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data');
  }
});
// Define a global array to store the history of all weather data submissions
let weatherSubmissionHistory = [];

// Function to update UI with weather data and save it in the saved-weather-container
async function updateWeatherUI(weatherData, repeat = 1) {
    // Update UI with weather data
    document.getElementById('id').textContent = `${weatherData.id}`;
    document.getElementById('date').textContent = `${weatherData.date}`;
    document.getElementById('tempMin').textContent = `${weatherData.temp_min}°F`;
    document.getElementById('tempMax').textContent = `${weatherData.temp_max}°F`;
    document.getElementById('humidity').textContent = `${weatherData.humidity}%`;

    // Store weather data in the history array
    weatherSubmissionHistory.push(weatherData);

    // Clear the saved weather container before appending new data
    const savedWeatherContainer = document.getElementById('saved-weather-container');

    // Create a new div to contain the saved weather information
    const savedWeatherDiv = document.createElement('div');
    savedWeatherDiv.classList.add('saved-weather');

     // Create a title for the saved data
     const title = document.createElement('h2');
     title.textContent = 'Saved Data';
     savedWeatherDiv.appendChild(title);

    // Create elements to display the weather information
    const idParagraph = document.createElement('p');
    idParagraph.textContent = `ID: ${weatherData.id}`;
    const dateParagraph = document.createElement('p');
    dateParagraph.textContent = `Date: ${weatherData.date}`;
    const tempMinParagraph = document.createElement('p');
    tempMinParagraph.textContent = `Minimum Temperature: ${weatherData.temp_min}°F`;
    const tempMaxParagraph = document.createElement('p');
    tempMaxParagraph.textContent = `Maximum Temperature: ${weatherData.temp_max}°F`;
    const humidityParagraph = document.createElement('p');
    humidityParagraph.textContent = `Humidity: ${weatherData.humidity}%`;

    // Append weather information elements to the savedWeatherDiv
    savedWeatherDiv.appendChild(idParagraph);
    savedWeatherDiv.appendChild(dateParagraph);
    savedWeatherDiv.appendChild(tempMinParagraph);
    savedWeatherDiv.appendChild(tempMaxParagraph);
    savedWeatherDiv.appendChild(humidityParagraph);

    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        // Open a pop-up for editing weather information
        openEditPopup(weatherData);
    });

    // Append the savedWeatherDiv to the saved-weather-container
    savedWeatherContainer.appendChild(savedWeatherDiv);

    // Append edit button to the savedWeatherDiv
    savedWeatherDiv.appendChild(editButton);
}

// Event listener for the "Save" button for weather info
document.getElementById('save-button').addEventListener('click', async () => {
    const date = document.getElementById('weatherDateInput').value;

    try {
        // Fetch weather data from the server
        const response = await fetch('/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date })
        });
        if (!response.ok) {
            throw new Error('Failed to save weather data');
        }

        // Parse the response JSON
        const savedWeatherData = await response.json();


        
        // Display the latest weather information
        const currentWeatherData = await fetchWeatherData(date);

        // Update UI with saved weather data only if it is defined
        if (isValidWeatherData(savedWeatherData)) {
            updateWeatherUI(savedWeatherData);
            saveButtonClickCount++;
        }

        // Update UI with current weather data only if it is defined
        if (isValidWeatherData(currentWeatherData)) {
            updateWeatherUI(currentWeatherData);
        }

        // Optionally, provide a success message to the user
        alert('Weather information saved successfully');
    } catch (error) {
        console.error('Error saving weather data:', error);
        alert('Failed to save weather information. Please try again.');
    }
});

// Function to check if the weather data is valid
function isValidWeatherData(weatherData) {
    return weatherData &&
        weatherData.id !== undefined &&
        weatherData.date !== undefined &&
        weatherData.temp_min !== undefined &&
        weatherData.temp_max !== undefined &&
        weatherData.humidity !== undefined;
}

// Event listener for the "Delete" button
document.getElementById('delete-button').addEventListener('click', () => {
    // Get the container element that holds the saved weather information
    const savedWeatherContainer = document.getElementById('saved-weather-container');

    // Remove all child elements from the container
    while (savedWeatherContainer.firstChild) {
        savedWeatherContainer.removeChild(savedWeatherContainer.firstChild);
    }

    // Remove the weather data input
    const weatherDataInput = document.getElementById('weatherDateInput');
    weatherDataInput.value = ''; // Clear the input field
});

// Event listener for the "History" button
document.getElementById('history-button').addEventListener('click', () => {
  const historyList = document.getElementById('history-list');
  const historyButton = document.getElementById('history-button');
  
  // Toggle visibility of history list
  if (historyList.style.display === 'none' || !historyList.style.display) {
      historyList.style.display = 'block';
      historyButton.textContent = 'Hide History';
  } else {
      historyList.style.display = 'none';
      historyButton.textContent = 'Show History';
  }

  // Clear previous history
  historyList.innerHTML = '';

  // Create title for the history container
  const historyTitle = document.createElement('h2');
  historyTitle.textContent = 'History';
  historyList.appendChild(historyTitle);

  // Iterate over weatherSubmissionHistory array and display historical weather information
  weatherSubmissionHistory.forEach(weatherData => {
      const historyEntry = document.createElement('div');
      historyEntry.classList.add('history-entry'); // Add a class for styling

      // Create individual paragraphs for each weather data
      const idParagraph = document.createElement('p');
      idParagraph.textContent = `ID: ${weatherData.id}`;
      const dateParagraph = document.createElement('p');
      dateParagraph.textContent = `Date: ${weatherData.date}`;
      const tempMinParagraph = document.createElement('p');
      tempMinParagraph.textContent = `Minimum Temperature: ${weatherData.temp_min}°F`;
      const tempMaxParagraph = document.createElement('p');
      tempMaxParagraph.textContent = `Maximum Temperature: ${weatherData.temp_max}°F`;
      const humidityParagraph = document.createElement('p');
      humidityParagraph.textContent = `Humidity: ${weatherData.humidity}%`;

      // Append individual paragraphs to history entry
      historyEntry.appendChild(idParagraph);
      historyEntry.appendChild(dateParagraph);
      historyEntry.appendChild(tempMinParagraph);
      historyEntry.appendChild(tempMaxParagraph);
      historyEntry.appendChild(humidityParagraph);

      // Append history entry to history list
      historyList.appendChild(historyEntry);

      // Add a line separating each history data
      const separator = document.createElement('hr');
      historyList.appendChild(separator);
  });
});



// Function to open a popup notification for editing weather information
function openEditPopup(weatherData) {
  // Create a notification container
  const notificationContainer = document.createElement('div');
  notificationContainer.classList.add('edit-notification'); // Add the class for styling

  // Create input fields for editing weather information
  const idInput = createInput('ID:', 'idInput', weatherData.id);
  const dateInput = createInput('Date:', 'dateInput', weatherData.date);
  const tempMinInput = createInput('Minimum Temperature:', 'tempMinInput', weatherData.temp_min);
  const tempMaxInput = createInput('Maximum Temperature:', 'tempMaxInput', weatherData.temp_max);
  const humidityInput = createInput('Humidity:', 'humidityInput', weatherData.humidity);

  // Create a submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', () => {
    // Update weather information
    weatherData.id = document.getElementById('idInput').value;
    weatherData.date = document.getElementById('dateInput').value;
    weatherData.temp_min = document.getElementById('tempMinInput').value;
    weatherData.temp_max = document.getElementById('tempMaxInput').value;
    weatherData.humidity = document.getElementById('humidityInput').value;

    // Close the notification
    notificationContainer.remove();

    // Update UI with edited weather information
    updateWeatherUI(weatherData);
  });

  // Append input fields and submit button to the notification container
  notificationContainer.appendChild(idInput);
  notificationContainer.appendChild(dateInput);
  notificationContainer.appendChild(tempMinInput);
  notificationContainer.appendChild(tempMaxInput);
  notificationContainer.appendChild(humidityInput);
  notificationContainer.appendChild(submitButton);

  // Append the notification container to the body
  document.body.appendChild(notificationContainer);
}



// Function to create an input field
function createInput(labelText, id, value) {
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', id);
  input.setAttribute('value', value);
  const container = document.createElement('div');
  container.appendChild(label);
  container.appendChild(input);
  return container;
}
