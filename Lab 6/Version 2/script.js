const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resultsList = document.getElementById('resultsList');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

const ballRadius = 10;
const holeRadius = 15;
let ballPosition = { x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius, y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius };
let holePosition = { x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius, y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius };
let ballSpeed = { x: 0, y: 0 };
let startTime = Date.now();
let attempts = 0;
let timeRecords = [];
let timeLeft = 60;
let score = 0;  // Initialize score

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawHole() {
  ctx.beginPath();
  ctx.arc(holePosition.x, holePosition.y, holeRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHole();
  drawBall();
  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;

  if(ballPosition.x > canvas.width - ballRadius || ballPosition.x < ballRadius) {
    ballSpeed.x = 0;
  }
  if(ballPosition.y > canvas.height - ballRadius || ballPosition.y < ballRadius) {
    ballSpeed.y = 0;
  }

  if (isBallInHole()) {
    attempts++;
    score++;  // Increment score
    scoreDisplay.textContent = score;  // Update score display
    resetGame();
  }

  const elapsedTime = (Date.now() - startTime) / 1000;
  const elapsedTimeFixed = elapsedTime.toFixed(2);
  timeLeft = Math.max(60 - elapsedTimeFixed, 0);
  const timeLeftFixed = timeLeft.toFixed(0);
  timerDisplay.textContent = timeLeftFixed;

  if (timeLeft <= 0) {
    timeRecords.push(attempts);
    updateResults();
    resetTimer();
  }

  requestAnimationFrame(draw);
}

function isBallInHole() {
  const distance = Math.hypot(ballPosition.x - holePosition.x, ballPosition.y - holePosition.y);
  return distance < holeRadius + ballRadius;
}

function resetGame() {
  ballPosition = { x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius, y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius };
  holePosition = { x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius, y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius };
  ballSpeed = { x: 0, y: 0 };
}

function resetTimer() {
  startTime = Date.now();
  attempts = 0;
  score = 0;  // Reset score
  scoreDisplay.textContent = score;  // Reset score display
  timeLeft = 60;
}

function updateResults() {
  resultsList.innerHTML = '';
  timeRecords.forEach((record, index) => {
    const li = document.createElement('li');
    li.textContent = `Attempt ${index + 1}: ${record} successful hits`;
    resultsList.appendChild(li);
  });
}

document.addEventListener('keydown', (event) => {
  const key = event.key;
  const speed = 2;
  if (key === 'ArrowUp') {
    ballSpeed.y = -speed;
  } else if (key === 'ArrowDown') {
    ballSpeed.y = speed;
  } else if (key === 'ArrowLeft') {
    ballSpeed.x = -speed;
  } else if (key === 'ArrowRight') {
    ballSpeed.x = speed;
  }
});

window.addEventListener('deviceorientation', (event) => {
  const alpha = event.alpha; // Z 
  const beta = event.beta; // X (front to back)
  const gamma = event.gamma; // Y (left to right)
  
  ballSpeed.x = gamma / 45;
  ballSpeed.y = beta / 45;
});

draw();
