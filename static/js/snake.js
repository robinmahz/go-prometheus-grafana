function initSnakeGame(difficulty = "medium") {
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const gridSize = 20;
  const tileX = canvas.width / gridSize;
  const tileY = canvas.height / gridSize;

  let snake = [{ x: 5, y: 5 }];
  let food = spawnFood();
  let direction = { x: 1, y: 0 };
  let nextDirection = direction;
  let score = 0;
  let gameOver = false;

  // Set snake speed based on difficulty (ms delay)
  let snakeSpeed;
  switch (difficulty) {
    case "easy":
      snakeSpeed = 250;  // slower, easier to play
      break;
    case "hard":
      snakeSpeed = 75;   // fast, challenging
      break;
    case "medium":
    default:
      snakeSpeed = 150;  // balanced default
  }

  function spawnFood() {
    return {
      x: Math.floor(Math.random() * tileX),
      y: Math.floor(Math.random() * tileY)
    };
  }

  document.onkeydown = e => {
    if (e.key === "ArrowUp" && direction.y === 0) nextDirection = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y === 0) nextDirection = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x === 0) nextDirection = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) nextDirection = { x: 1, y: 0 };
  };

  function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e74c3c";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
  }

  function loop() {
    if (gameOver) {
      drawGameOver();
      return;
    }

    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("snakeScore").textContent = score;
      safePlay(snakeEatSound);
      food = spawnFood();
    } else {
      snake.pop();
    }

    if (
      head.x < 0 || head.y < 0 || head.x >= tileX || head.y >= tileY ||
      snake.slice(1).some(s => s.x === head.x && s.y === head.y)
    ) {
      gameOver = true;
      safePlay(gameOverSound);
      drawGameOver();
      return;
    }

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.fillStyle = "green";
    snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));

    setTimeout(loop, snakeSpeed);
  }

  loop();
}
