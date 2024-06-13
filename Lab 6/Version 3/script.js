const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resultsList = document.getElementById('resultsList');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

const ballRadius = 10;
const holeRadius = 15;
const numberOfHoles = 5;  // Number of holes
let ballPosition ={} ;
let holes = [];
let currentHoleIndex = 0;
let ballSpeed = { x: 0, y: 0 };
let startTime = Date.now();
let timeRecords = [];
let timeLeft = 60;

function generateRandomPosition(radius) {
  return {
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: Math.random() * (canvas.height - radius * 2) + radius,
  };
}

function isOverlapping(ball, holes) {
  return holes.some(hole => {
      const distance = Math.hypot(ball.x - hole.x, ball.y - hole.y);
      return distance < ballRadius + holeRadius + 10;
  });
}

function initializePositions() {
  do {
      ballPosition = generateRandomPosition(ballRadius);
  } while (isOverlapping(ballPosition, holes));

  holes = [];
  for (let i = 0; i < numberOfHoles; i++) {  // Just one hole for version 0
      let holePosition;
      do {
          holePosition = generateRandomPosition(holeRadius);
      } while (isOverlapping(holePosition, holes) || isOverlapping(holePosition, [ballPosition]));
      holes.push({ ...holePosition, visited: false });
  }
}

function generateHoles() {
  holes = [];
  for (let i = 0; i < numberOfHoles; i++) {
    holes.push({ ...generateRandomPosition(holeRadius), visited: false });
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawHoles() {
  holes.forEach((hole, index) => {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
    ctx.fillStyle = hole.visited ? "#00FF00" : (index === currentHoleIndex ? "#FF0000" : "#FFD2D2");
    ctx.fill();
    ctx.closePath();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHoles();
  drawBall();
  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;

  if(ballPosition.x > canvas.width - ballRadius || ballPosition.x < ballRadius) {
    ballSpeed.x = 0;
  }
  if(ballPosition.y > canvas.height - ballRadius || ballPosition.y < ballRadius) {
    ballSpeed.y = 0;
  }

  if (isBallInCurrentHole()) {
    holes[currentHoleIndex].visited = true;
    currentHoleIndex++;
    updateScore();
    if (currentHoleIndex >= numberOfHoles) {
      const elapsedTime = (Date.now() - startTime) / 1000;
      timeRecords.push(elapsedTime.toFixed(2));
      updateResults();
      resetGame();
    }
  }

  const elapsedTime = (Date.now() - startTime) / 1000;
  const elapsedTimeFixed = elapsedTime.toFixed(2)
  timeLeft = Math.max(60 - elapsedTimeFixed, 0);
  const timeLeftFixed = timeLeft.toFixed(0)
  timerDisplay.textContent = timeLeftFixed;

  requestAnimationFrame(draw);
}

function isBallInCurrentHole() {
  const currentHole = holes[currentHoleIndex];
  const distance = Math.hypot(ballPosition.x - currentHole.x, ballPosition.y - currentHole.y);
  return distance < holeRadius + ballRadius;
}

function resetGame() {
  ballPosition = { x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius, y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius };
  initializePositions();
  currentHoleIndex = 0;
  ballSpeed = { x: 0, y: 0 };
  startTime = Date.now();
  timeLeft = 60;
  updateScore();
}

function updateScore() {
  scoreDisplay.textContent = `${currentHoleIndex}/${numberOfHoles}`;
}

function updateResults() {
  resultsList.innerHTML = '';
  timeRecords.forEach((record, index) => {
    const li = document.createElement('li');
    li.textContent = `Attempt ${index + 1}: ${record} seconds`;
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

initializePositions();
draw();
