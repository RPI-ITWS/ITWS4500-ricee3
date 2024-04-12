const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Rome"],
        answer: "Paris"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        answer: "Blue Whale"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Jupiter", "Mars", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O"
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
        answer: "Mount Everest"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Michelangelo"],
        answer: "Leonardo da Vinci"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Pb"],
        answer: "Au"
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Liver", "Heart", "Brain", "Skin"],
        answer: "Skin"
    },
    {
        question: "Which country is the largest by land area?",
        options: ["Russia", "Canada", "China", "United States"],
        answer: "Russia"
    },
    {
        question: "What is the main ingredient in guacamole?",
        options: ["Tomato", "Avocado", "Onion", "Lime"],
        answer: "Avocado"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "J.K. Rowling"],
        answer: "Harper Lee"
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "Maldives", "Nauru"],
        answer: "Vatican City"
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Diamond", "Graphite", "Topaz", "Quartz"],
        answer: "Diamond"
    },
    {
        question: "Who is credited with discovering penicillin?",
        options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Albert Einstein"],
        answer: "Alexander Fleming"
    },
    // Add more questions and answers as needed
];


let currentQuestionIndex = 0;

function displayQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const message = document.getElementById('message');

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    optionsElement.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsElement.appendChild(button);
    });

    message.textContent = '';
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const message = document.getElementById('message');

    if (selectedOption === currentQuestion.answer) {
        message.textContent = 'Correct!';
    } else {
        message.textContent = 'Incorrect. Try again.';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('You have completed the quiz!');
        currentQuestionIndex = 0; // Reset the index to play again
        displayQuestion();
    }
}

// Display the first question when the page loads
displayQuestion();
