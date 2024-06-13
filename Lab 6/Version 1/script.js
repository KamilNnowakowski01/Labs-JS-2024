const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resultsList = document.getElementById('resultsList');
const currentTimeDisplay = document.getElementById('currentTime');

const ballRadius = 10;
const holeRadius = 15;
let ballPosition = { x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius, y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius };
let holePosition = { x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius, y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius };
let ballSpeed = { x: 0, y: 0 };
let startTime = Date.now();
let timeRecords = [];

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
        const elapsedTime = (Date.now() - startTime) / 1000;
        timeRecords.push(elapsedTime.toFixed(2));
        updateResults();
        resetGame();
    } else {
        updateTimeDisplay();
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
    startTime = Date.now();
}

function updateResults() {
    resultsList.innerHTML = '';
    timeRecords.forEach((record, index) => {
        const li = document.createElement('li');
        li.textContent = `Attempt ${index + 1}: ${record} seconds`;
        resultsList.appendChild(li);
    });
}

function updateTimeDisplay() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    currentTimeDisplay.textContent = `${elapsedTime.toFixed(2)} seconds`;
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
