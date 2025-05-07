const images = [
  'https://cdn.pixabay.com/photo/2018/03/21/13/48/the-letters-of-the-alphabet-3246732_960_720.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/52/the-letters-of-the-alphabet-3246755_960_720.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/46/the-letters-of-the-alphabet-3246713_1280.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/47/the-letters-of-the-alphabet-3246721_960_720.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/47/the-letters-of-the-alphabet-3246716_1280.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/44/the-letters-of-the-alphabet-3246706_960_720.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/51/the-letters-of-the-alphabet-3246745_960_720.png',
  'https://cdn.pixabay.com/photo/2018/03/21/13/50/the-letters-of-the-alphabet-3246740_640.png'
];

let gameCards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let timer;
let timeLeft = 60;
let timerStarted = false; // Flag to track if the timer has started
let startTime; // Variable to track the start time

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  const timerBox = document.getElementById('timerBox');
  
  timerDisplay.textContent = timeLeft;
  startTime = Date.now(); // Track the start time when the timer starts

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerBox.classList.add('warning');
    } else {
      timerBox.classList.remove('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      lockBoard = true;
      document.getElementById('result').textContent = 'You lost, try again! 💥';
      timerBox.classList.remove('warning');
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer); // Stop any running timer
  timeLeft = 60;
  const timerDisplay = document.getElementById('timer');
  const timerBox = document.getElementById('timerBox');
  timerDisplay.textContent = timeLeft;
  timerBox.classList.remove('warning');
  timerStarted = false; // Reset timer started flag
}

function createBoard() {
  gameCards = [...images, ...images];
  gameCards.sort(() => 0.5 - Math.random());

  const gameContainer = document.getElementById('gameContainer');
  gameContainer.innerHTML = '';

  gameCards.forEach((imgUrl, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-image', imgUrl);
    card.setAttribute('data-index', index);

    const frontFace = document.createElement('div');
    frontFace.classList.add('front');

    const backFace = document.createElement('div');
    backFace.classList.add('back');
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = "Image";
    backFace.appendChild(img);

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);
    gameContainer.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;

    // Start the timer only when the first card is flipped
    if (!timerStarted) {
      startTimer(); // Start the timer on first card flip
      timerStarted = true; // Mark that the timer has started
    }
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.getAttribute('data-image') === secondCard.getAttribute('data-image');

  if (isMatch) {
    matchedPairs++;
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();

  if (matchedPairs === images.length) {
    // Stop the timer when all pairs are found
    clearInterval(timer);

    const timeTaken = Math.max(0, 60 - timeLeft); // Calculate the time taken
    document.getElementById('result').textContent = `Congratulations, you found all pairs! 🎉 You finished in ${timeTaken} seconds.`;
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
  matchedPairs = 0;
  lockBoard = false;          // ✅ Unlock the board
  firstCard = null;           // ✅ Clear selected cards
  secondCard = null;
  timerStarted = false;  
  document.getElementById('result').textContent = '';
  createBoard();
  resetTimer(); // Reset the timer but don't start it automatically
}

// Initialize the game on page load
createBoard();

document.getElementById('resetBtn').addEventListener('click', resetGame);
