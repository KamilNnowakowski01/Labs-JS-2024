const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resultsList = document.getElementById("resultsList");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

const ballRadius = 10;
const portalRadius = 10;
const holeRadius = 15;
const numberOfHoles = 5;
let ballPosition = {};
let holes = [];
let scores = []
let currentHoleIndex = 0;
let ballSpeed = { x: 0, y: 0 };
let startTime = Date.now();
let timeRecords = [];

function generateRandomPosition(radius) {
  return {
    x: Math.random() * (canvas.width - radius * 2) + radius,
    y: Math.random() * (canvas.height - radius * 2) + radius,
  };
}

function isOverlapping(ball, holes) {
  return holes.some((hole) => {
    const distance = Math.hypot(ball.x - hole.x, ball.y - hole.y);
    return distance < ballRadius + holeRadius + 10;
  });
}

function initializePositions() {
  do {
    ballPosition = generateRandomPosition(ballRadius);
  } while (isOverlapping(ballPosition, holes));

  holes = [];
  scores = [];

  for (let i = 0; i < 5; i++) {
    let holePosition;
    do {
      holePosition = generateRandomPosition(portalRadius);
    } while (
      isOverlapping(holePosition, holes) ||
      isOverlapping(holePosition, [ballPosition])
    );

    scores.push({
      ...holePosition,
      visited: false,
      type:"score",
      speed: { x: 0, y: 0 },

    });
  }

  for (let i = 0; i < 2; i++) {
    let holePosition;
    do {
      holePosition = generateRandomPosition(holeRadius);
    } while (
      isOverlapping(holePosition, holes) ||
      isOverlapping(holePosition, scores) ||
      isOverlapping(holePosition, [ballPosition])
    );

    holes.push({
      ...holePosition,
      visited: false,
      type:"moving",
      speed:{ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }

    });
  }

  for (let i = 0; i < 2; i++) {
    let holePosition;
    do {
      holePosition = generateRandomPosition(portalRadius);
    } while (
      isOverlapping(holePosition, holes) ||
      isOverlapping(holePosition, scores) ||
      isOverlapping(holePosition, [ballPosition])
    );

    holes.push({
      ...holePosition,
      visited: false,
      type:"portal",
      speed: { x: 0, y: 0 },

    });
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function getColorHole(index, hole) {
  color = "#000000";
  
  if (hole.type === "portal") {
    color = "#C1E6FF"; //light blue
  }

  if (hole.type === "moving") {
    color = "#15294D"; //
  }

  if (hole.type === "score") {
    color = "#FFD2D2"; //pink
  }

  if (index === currentHoleIndex && hole.type === "score") {
    color = "#FF0000"; //red
  }

  if (hole.visited === true) {
    color = "#B5E0A2"; //green
  }

  return color;
}

function drawHoles() {

  const portalHoles = holes.filter((hole) => hole.type === "portal");
  const movingHoles = holes.filter((hole) => hole.type === "moving");

  portalHoles.forEach((hole, index) => {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, portalRadius, 0, Math.PI * 2);
    ctx.fillStyle = getColorHole(index, hole);
    ctx.fill();
    ctx.closePath();
  });
  scores.forEach((hole, index) => {
    if(index === currentHoleIndex ){
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = getColorHole(index, hole);
      ctx.fill();
      ctx.closePath();
    }
  });
  movingHoles.forEach((hole, index) => {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
    ctx.fillStyle = getColorHole(index, hole);
    ctx.fill();
    ctx.closePath();
  });
}

function getRandomPortalHole(holes) {
  const portalHoles = holes.filter((hole) => hole.type === "portal");

  if (portalHoles.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * portalHoles.length);
  return portalHoles[randomIndex];
}

function getDifferentPortalHole(currentHole, holes) {
  const portalHoles = holes.filter((hole) => hole.type === "portal" && hole !== currentHole);
  
  if (portalHoles.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * portalHoles.length);
  return portalHoles[randomIndex];
}

function removeHole(targetHole, holes) {
  const index = holes.findIndex(hole => hole.x === targetHole.x && hole.y === targetHole.y && hole.type === targetHole.type);
  if (index !== -1) {
    holes.splice(index, 1);
  }
}

function getHoleWithBall() {
  const objectHoles = [ ...holes, ...scores]
  // Przeszukujemy wszystkie dziury, aby znaleźć tę, w której znajduje się piłka
  for (const hole of objectHoles) {
    const distance = Math.hypot(
      ballPosition.x - hole.x,
      ballPosition.y - hole.y
    );
    if (distance < holeRadius + ballRadius) {
      return hole; // Zwracamy dziurę, w której znajduje się piłka
    }
  }
  return null;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHoles();
  drawBall();
  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;

  if (
    ballPosition.x > canvas.width - ballRadius ||
    ballPosition.x < ballRadius
  ) {
    ballSpeed.x = 0;
  }
  if (
    ballPosition.y > canvas.height - ballRadius ||
    ballPosition.y < ballRadius
  ) {
    ballSpeed.y = 0;
  }

  holes.forEach((hole) => {
    if (hole.type === "moving") {
      hole.x += hole.speed.x;
      hole.y += hole.speed.y;

      //Sprawdź granice i w razie potrzeby zmień kierunek
      if (hole.x < holeRadius || hole.x > canvas.width - holeRadius) {
        hole.speed.x = -hole.speed.x;
      }
      if (hole.y < holeRadius || hole.y > canvas.height - holeRadius) {
        hole.speed.y = -hole.speed.y;
      }
    }
  });

  if (isBallInCurrentHole()) {
    scores[currentHoleIndex].visited = true;
    currentHoleIndex++;
    updateScore();
    if (currentHoleIndex >= numberOfHoles) {
      const elapsedTime = (Date.now() - startTime) / 1000;
      timeRecords.push(elapsedTime.toFixed(2));
      updateResults();
      resetGame();
    }
  }

  if (getHoleWithBall() !== null) {
    {
      const holeWithBall = getHoleWithBall();
      const differentPortalHole = getDifferentPortalHole(holeWithBall, holes)
      if (holeWithBall.type === "portal" && holeWithBall.visited === false) {
        ballPosition = { x: differentPortalHole.x, y: differentPortalHole.y };
        removeHole(holeWithBall, holes);
        removeHole(differentPortalHole, holes);
        //const destinationHole = holes.find(h => h.x === currentHole.destination.x && h.y === currentHole.destination.y);
        //ballPosition = { x: destinationHole.x, y: destinationHole.y };
        for (let i = 0; i < 2; i++) {
          let holePosition;
          do {
            holePosition = generateRandomPosition(portalRadius);
          } while (
            isOverlapping(holePosition, holes) ||
            isOverlapping(holePosition, scores) ||
            isOverlapping(holePosition, [ballPosition])
          );
      
          holes.push({
            ...holePosition,
            visited: false,
            type:"portal",
            speed: { x: 0, y: 0 },
      
          });
        }
      }
      if (holeWithBall.type === "moving"){
        resetGame()
      }
    }
  }

  const elapsedTime = (Date.now() - startTime) / 1000;
  const elapsedTimeFixed = elapsedTime.toFixed(2);
  timerDisplay.textContent = elapsedTimeFixed;

  requestAnimationFrame(draw);
}

function isBallInCurrentHole() {
  const currentHole = scores[currentHoleIndex];
  const distance = Math.hypot(
    ballPosition.x - currentHole.x,
    ballPosition.y - currentHole.y
  );
  return distance < holeRadius + ballRadius;
}

function resetGame() {
  ballPosition = {
    x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius,
    y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius,
  };
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
  resultsList.innerHTML = "";
  timeRecords.forEach((record, index) => {
    const li = document.createElement("li");
    li.textContent = `Attempt ${index + 1}: ${record} seconds`;
    resultsList.appendChild(li);
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const speed = 2;
  if (key === "ArrowUp") {
    ballSpeed.y = -speed;
  } else if (key === "ArrowDown") {
    ballSpeed.y = speed;
  } else if (key === "ArrowLeft") {
    ballSpeed.x = -speed;
  } else if (key === "ArrowRight") {
    ballSpeed.x = speed;
  }
});

window.addEventListener("deviceorientation", (event) => {
  const alpha = event.alpha; // Z
  const beta = event.beta; // X (front to back)
  const gamma = event.gamma; // Y (left to right)

  ballSpeed.x = gamma / 45;
  ballSpeed.y = beta / 45;
});

initializePositions();
draw();
