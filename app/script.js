const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };

let dx = 1;
let dy = 0;

let score = 0;
let gameRunning = true;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  } else if (event.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  } else if (event.key === "ArrowLeft" && dx === 0) {
    dx = -1;
    dy = 0;
  } else if (event.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }
}

function drawGame() {

  if (!gameRunning) return;

  ctx.clearRect(0, 0, 400, 400);

  // Draw snake
  snake.forEach(part => {
    ctx.fillStyle = "lime";
    ctx.fillRect(part.x * 20, part.y * 20, 18, 18);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * 20, food.y * 20, 18, 18);

  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // Wall collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= 20 ||
    head.y >= 20
  ) {
    gameOver();
    return;
  }

  // Self collision
  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {

    eatSound.currentTime = 0;
    eatSound.play();

    score++;

    document.getElementById("score").innerText = score;

    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };

  } else {
    snake.pop();
  }
}

function gameOver() {

  gameRunning = false;

  clearInterval(gameLoop);

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  setTimeout(() => {
    alert("Game Over! Score: " + score);
    location.reload();
  }, 200);
}

const gameLoop = setInterval(drawGame, 100);
