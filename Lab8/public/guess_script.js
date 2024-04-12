const targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess(event) {
    event.preventDefault(); // Prevent form submission and page refresh
    const guessInput = document.getElementById('guessInput');
    const message = document.getElementById('message');

    const guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        message.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    attempts++;

    if (guess === targetNumber) {
        message.textContent = `Congratulations! You guessed the number ${targetNumber} in ${attempts} attempts.`;
        guessInput.disabled = true;
    } else if (guess < targetNumber) {
        message.textContent = 'Too low! Try again.';
    } else {
        message.textContent = 'Too high! Try again.';
    }
}
