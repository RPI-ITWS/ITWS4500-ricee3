// Function to fetch quote data from the server by ID
async function fetchQuoteData(id) {
  try {
      const response = await fetch(`/quotes/${id}`);
      if (!response.ok) {
          throw new Error('Failed to fetch quote data');
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching quote data:', error);
      throw error;
  }
}

// Event listener for form submission
document.getElementById('quoteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('idInput').value;

  try {
      // Fetch quote data from the server
      const quoteData = await fetchQuoteData(id);
      // Update UI with quote data
      updateQuoteUI(quoteData);
  } catch (error) {
      console.error('Error fetching quote data:', error);
      alert('Failed to fetch quote data');
  }
});

// Function to fetch quote data from the server by ID
async function fetchQuoteData(id) {
  try {
      const response = await fetch(`/quotes/${id}`);
      if (!response.ok) {
          throw new Error('Failed to fetch quote data');
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching quote data:', error);
      throw error;
  }
}



// Function to update UI with quotes data and save it in the saved-quotes-container
function updateQuotesUI(quotesData) {
  // Clear the saved quotes container before appending new data
  const savedQuotesContainer = document.getElementById('saved-quotes-container');
  savedQuotesContainer.innerHTML = '';

  // Create a title for the saved data
  const title = document.createElement('h2');
  title.textContent = 'Saved Quotes';
  savedQuotesContainer.appendChild(title);

  // Loop through each quote in the quotesData array
  quotesData.forEach(quoteData => {
      // Create a new div to contain the saved quote information
      const savedQuoteDiv = document.createElement('div');
      savedQuoteDiv.classList.add('saved-quote');

      // Create elements to display the quote information
      const idParagraph = document.createElement('p');
      idParagraph.textContent = `ID: ${quoteData.id}`;
      const authorParagraph = document.createElement('p');
      authorParagraph.textContent = `Author: ${quoteData.author}`;
      const quoteParagraph = document.createElement('p');
      quoteParagraph.textContent = `Quote: ${quoteData.quote}`;

      // Append quote information elements to the savedQuoteDiv
      savedQuoteDiv.appendChild(idParagraph);
      savedQuoteDiv.appendChild(authorParagraph);
      savedQuoteDiv.appendChild(quoteParagraph);

      // Create edit button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
          // Open a pop-up for editing quote information
          openEditPopup(quoteData);
      });

      // Append edit button to the savedQuoteDiv
      savedQuoteDiv.appendChild(editButton);

      // Append the savedQuoteDiv to the saved-quotes-container
      savedQuotesContainer.appendChild(savedQuoteDiv);
  });
}

// Define a global array to store the history of all quote data submissions
let quoteSubmissionHistory = [];

// Function to update UI with quote data and save it in the saved-quote-container
async function updateQuoteUI(quoteData) {
  // Update UI with quote data
  document.getElementById('id').textContent = `${quoteData.id}`;
  document.getElementById('author').textContent = `${quoteData.author}`;
  document.getElementById('quote').textContent = `${quoteData.quote}`;

  // Store quote data in the history array
  quoteSubmissionHistory.push(quoteData);

  // Clear the saved quote container before appending new data
  const savedQuoteContainer = document.getElementById('saved-quote-container');

  // Create a new div to contain the saved quote information
  const savedQuoteDiv = document.createElement('div');
  savedQuoteDiv.classList.add('saved-quote');

  // Create a title for the saved data
  const title = document.createElement('h2');
  title.textContent = 'Saved Quote Data';
  savedQuoteDiv.appendChild(title);

  // Create elements to display the quote information
  const idParagraph = document.createElement('p');
  idParagraph.textContent = `ID: ${quoteData.id}`;
  const authorParagraph = document.createElement('p');
  authorParagraph.textContent = `Author: ${quoteData.author}`;
  const quoteParagraph = document.createElement('p');
  quoteParagraph.textContent = `Quote: ${quoteData.quote}`;

  // Append quote information elements to the savedQuoteDiv
  savedQuoteDiv.appendChild(idParagraph);
  savedQuoteDiv.appendChild(authorParagraph);
  savedQuoteDiv.appendChild(quoteParagraph);

  // Create edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
      // Open a pop-up for editing quote information
      openEditPopup(quoteData);
  });

  // Append the savedQuoteDiv to the saved-quote-container
  savedQuoteContainer.appendChild(savedQuoteDiv);

  // Append edit button to the savedQuoteDiv
  savedQuoteDiv.appendChild(editButton);
}

// Event listener for the "Save" button for quote info
document.getElementById('save-button').addEventListener('click', async () => {
  const id = document.getElementById('idInput').value;

  try {
      // Fetch quote data from the server
      const response = await fetch('/quotes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
      });
      if (!response.ok) {
          throw new Error('Failed to save quote data');
      }

      // Parse the response JSON
      const savedQuoteData = await response.json();

      // Display the latest quote information
      const currentQuoteData = await fetchQuoteData(id);

      // Update UI with saved quote data only if it is defined
      if (isValidQuoteData(savedQuoteData)) {
          updateQuoteUI(savedQuoteData);
          saveButtonClickCount++;
      }

      // Update UI with current quote data only if it is defined
      if (isValidQuoteData(currentQuoteData)) {
          updateQuoteUI(currentQuoteData);
      }

      // Optionally, provide a success message to the user
      alert('Quote information saved successfully');
  } catch (error) {
      console.error('Error saving quote data:', error);
      alert('Failed to save quote information. Please try again.');
  }
});

// Function to check if the quote data is valid
function isValidQuoteData(quoteData) {
  return quoteData &&
      quoteData.id !== undefined &&
      quoteData.author !== undefined &&
      quoteData.quote !== undefined;
}

// Other functions and event listeners remain the same as before...

// Function to open a popup notification for editing quote information
function openEditPopup(quoteData) {
  // Create a notification container
  const notificationContainer = document.createElement('div');
  notificationContainer.classList.add('edit-notification'); // Add the class for styling

  // Create input fields for editing quote information
  const idInput = createInput('ID:', 'idInput', quoteData.id);
  const authorInput = createInput('Author:', 'authorInput', quoteData.author);
  const quoteInput = createInput('Quote:', 'quoteInput', quoteData.quote);

  // Create a submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', () => {
      // Update quote information
      quoteData.id = document.getElementById('idInput').value;
      quoteData.author = document.getElementById('authorInput').value;
      quoteData.quote = document.getElementById('quoteInput').value;

      // Close the notification
      notificationContainer.remove();

      // Update UI with edited quote information
      updateQuoteUI(quoteData);
  });

  // Append input fields and submit button to the notification container
  notificationContainer.appendChild(idInput);
  notificationContainer.appendChild(authorInput);
  notificationContainer.appendChild(quoteInput);
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

