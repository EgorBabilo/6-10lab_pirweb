const m = 1500; 

const quizData = new Map([
    ['belgium', {
        image: '../resource/belgium.jpg',
        options: ['Германия', 'Бельгия', 'Франция', 'Нидерланды'],
        correct: 'Бельгия'
    }],
    ['monaco', {
        image: '../resource/monaco.jpg',
        options: ['Индонезия', 'Польша', 'Монако', 'Сингапур'], 
        correct: 'Монако'
    }],
    ['austria', {
        image: '../resource/austria.png',
        options: ['Латвия', 'Мальта', 'Швейцария', 'Австрия'], 
        correct: 'Австрия'
    }],
    ['czech', {
        image: '../resource/czech.png',
        options: ['Словакия', 'Чехия', 'Россия', 'Финляндия'], 
        correct: 'Чехия'
    }],
    ['finland', {
        image: '../resource/finland.png',
        options: ['Дания', 'Норвегия', 'Финляндия', 'Швеция'], 
        correct: 'Финляндия'
    }],
    ['hungary', {
        image: '../resource/hungary.png',
        options: ['Италия', 'Румыния', 'Болгария', 'Венгрия'], 
        correct: 'Венгрия'
    }],
    ['latvia', {
        image: '../resource/latvia.png',
        options: ['Австрия', 'Латвия', 'Эстония', 'Литва'], 
        correct: 'Латвия'
    }],
    ['sweden', {
        image: '../resource/sweden.png',
        options: ['Финляндия', 'Исландия', 'Швеция', 'Норвегия'],
        correct: 'Швеция'
    }],
    ['greece', {
        image: '../resource/greece.png',
        options: ['Швейцария', 'Хорватия', 'Кипр', 'Греция'], 
        correct: 'Греция'
    }],
    ['bulgaria', {
        image: '../resource/bulgaria.png',
        options: ['Венгрия', 'Сербия', 'Македония', 'Болгария'], 
        correct: 'Болгария'
    }]
]);

let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let timeLeft = 0;
let timerId = null;
let n = 10;
let questionsOrder = [];
let userAnswers = new Map();
let answerSubmitted = false;

const settingsContainer = document.getElementById('settingsContainer');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const reviewBtn = document.getElementById('reviewBtn');
const restartBtn = document.getElementById('restartBtn');

const timer = document.getElementById('timer');
const quizImage = document.getElementById('quizImage');
const optionsContainer = document.getElementById('optionsContainer');
const message = document.getElementById('message');
const stats = document.getElementById('stats');
const finalStats = document.getElementById('finalStats');
const timePerQuestionInput = document.getElementById('timePerQuestion');

function initQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    userAnswers.clear();
    answerSubmitted = false;
    
    n = parseInt(timePerQuestionInput.value) || 10;
    
    questionsOrder = Array.from(quizData.keys()); 
 
    quizContainer.style.display = 'block';
    settingsContainer.style.display = 'none';
    resultsContainer.style.display = 'none';

    nextBtn.style.display = 'block';
    timer.style.display = 'block';
    nextBtn.disabled = true;

    updateStats();
    showQuestion();
}

function showQuestion() {
    answerSubmitted = false;
    const questionKey = questionsOrder[currentQuestionIndex];
    const questionData = quizData.get(questionKey);
    
    quizImage.src = questionData.image;
    quizImage.alt = `Флаг ${currentQuestionIndex + 1}`;
    
    optionsContainer.innerHTML = '';
  
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quizOption';
        radio.value = option;
        radio.id = `option${index}`;
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    message.textContent = '';
    message.className = 'message';
    nextBtn.disabled = true;
    
    startTimer();
}

function startTimer() {
    timeLeft = n;
    updateTimerDisplay();
  
    if (timerId) {
        clearInterval(timerId);
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();    
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timer.textContent = `Осталось времени: ${timeLeft}`;
}

function timeUp() {
    if (answerSubmitted) return;
    
    disableOptions();
    
    const selectedOption = document.querySelector('input[name="quizOption"]:checked');
    const questionKey = questionsOrder[currentQuestionIndex];
    const questionData = quizData.get(questionKey);
    
    if (!selectedOption) {
        incorrectAnswers++;
        message.textContent = 'Время вышло! Вы не успели ответить.';
        message.className = 'message incorrect';
    
        userAnswers.set(questionKey, null);
    }
 
    updateStats();
    nextBtn.disabled = false;
}

function checkAnswer() {
    if (answerSubmitted) return;
    
    const selectedOption = document.querySelector('input[name="quizOption"]:checked');
    const questionKey = questionsOrder[currentQuestionIndex];
    const questionData = quizData.get(questionKey);
    
    if (selectedOption) {
        answerSubmitted = true;
    
        clearInterval(timerId);
        disableOptions();
     
        const isCorrect = selectedOption.value === questionData.correct;
        
        if (isCorrect) {
            correctAnswers++;
            message.textContent = 'Правильно!';
            message.className = 'message correct';
        } else {
            incorrectAnswers++;
            message.textContent = `Неправильно! Правильный ответ: ${questionData.correct}`;
            message.className = 'message incorrect';
        }
  
        userAnswers.set(questionKey, selectedOption.value);
      
        updateStats();
    
        nextBtn.disabled = false;
    }
}

function disableOptions() {
    const options = document.querySelectorAll('input[name="quizOption"]');
    options.forEach(option => {
        option.disabled = true;
    });
}

function updateStats() {
    stats.textContent = `Правильных ответов: ${correctAnswers}, Неправильных: ${incorrectAnswers}`;
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questionsOrder.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    settingsContainer.style.display = 'none';
    
    finalStats.textContent = `Викторина завершена! Правильных ответов: ${correctAnswers} из ${questionsOrder.length}`;
}

function reviewAnswers() {
    resultsContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    settingsContainer.style.display = 'none';
    
    currentQuestionIndex = 0;
    showQuestionForReview();
}

function showQuestionForReview() {
    const questionKey = questionsOrder[currentQuestionIndex];
    const questionData = quizData.get(questionKey);
  
    quizImage.src = questionData.image;
    quizImage.alt = `Просмотр ответа ${currentQuestionIndex + 1}`;
  
    optionsContainer.innerHTML = '';
    
    const correctAnswerDiv = document.createElement('div');
    correctAnswerDiv.className = 'correct-answer';
    correctAnswerDiv.textContent = `Правильный ответ: ${questionData.correct}`;
    optionsContainer.appendChild(correctAnswerDiv);
  
    const userAnswer = userAnswers.get(questionKey);
    if (userAnswer) {
        message.textContent = `Ваш ответ: ${userAnswer}`;
        message.className = userAnswer === questionData.correct ? 'message correct' : 'message incorrect';
    } else {
        message.textContent = 'Вы не дали ответа';
        message.className = 'message incorrect';
    }

    nextBtn.style.display = 'none';
    timer.style.display = 'none';

    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questionsOrder.length) {
            showQuestionForReview();
        } else {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            settingsContainer.style.display = 'none';

            nextBtn.style.display = 'block';
            timer.style.display = 'block';
        }
    }, m);
}

function restartQuiz() {
    resultsContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    settingsContainer.style.display = 'block';
    timePerQuestionInput.value = '10'; 
}

startBtn.addEventListener('click', initQuiz);
nextBtn.addEventListener('click', nextQuestion);
reviewBtn.addEventListener('click', reviewAnswers);
restartBtn.addEventListener('click', restartQuiz);
optionsContainer.addEventListener('change', checkAnswer);