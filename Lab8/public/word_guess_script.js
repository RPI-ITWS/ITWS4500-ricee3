const words = [
    { word: "banana", hint: "A long curved fruit with a yellow skin" },
    { word: "television", hint: "An electronic device used for watching programs and movies" },
    { word: "mountain", hint: "A large natural elevation of the earth's surface" },
    { word: "bicycle", hint: "A vehicle with two wheels powered by pedals" },
    { word: "library", hint: "A building or room containing collections of books" },
    { word: "fireplace", hint: "A structure with a chimney used for containing a fire indoors" },
    { word: "astronaut", hint: "A person trained to travel in a spacecraft" },
    { word: "camera", hint: "A device used to capture photographs or videos" },
    { word: "rainbow", hint: "A natural spectrum of colors that appears in the sky after rain" },
    { word: "penguin", hint: "A flightless bird native to the Antarctic" },
    { word: "volcano", hint: "A mountain with a crater that erupts lava, ash, and gases" },
    { word: "garden", hint: "An area of land used for growing flowers, vegetables, or plants" },
    { word: "tiger", hint: "A large carnivorous feline with distinctive stripes" },
    { word: "beach", hint: "A sandy or pebbly shore by the ocean" },
    { word: "sunglasses", hint: "Eyewear designed to protect the eyes from sunlight" },
    // Add more words and hints as needed
];


let currentWordIndex;
let attempts = 0;

function initializeWordGuessGame() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    attempts = 0;
    document.getElementById('hint').textContent = words[currentWordIndex].hint;
}

function checkWord() {
    const wordInput = document.getElementById('wordInput').value.toLowerCase();
    const wordMessage = document.getElementById('wordMessage');

    if (wordInput === words[currentWordIndex].word) {
        wordMessage.textContent = `Congratulations! You guessed the word "${words[currentWordIndex].word}" in ${attempts} attempts.`;
    } else {
        wordMessage.textContent = 'Incorrect guess. Try again.';
    }

    attempts++;
}

function startNewRound() {
    initializeWordGuessGame(); // Reset the game state and initialize a new word and hint
    document.getElementById('wordInput').value = ''; // Clear the input field
    document.getElementById('wordMessage').textContent = ''; // Clear the message
}
