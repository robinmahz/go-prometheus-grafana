function initPongGame() {
  const container = document.getElementById("gameContainer");
  container.innerHTML = `
    <canvas id="pong" width="480" height="320" style="border:1px solid #000;"></canvas>
    <div style="margin-top: 10px;">
      <strong>Score:</strong> <span id="pongScore">0</span>
    </div>
    <div id="pongGameOver" style="font-size: 30px; color: red; margin-top: 10px;"></div>
    <button id="restartPong" style="margin-top: 10px; padding: 8px 16px; font-size: 16px; display: none;">🔁 Restart Game</button>
  `;

  const canvas = document.getElementById("pong");
  const ctx = canvas.getContext("2d");

  const paddleWidth = 80;
  const paddleHeight = 10;
  const ballRadius = 8;
  const paddleY = canvas.height - paddleHeight - 10;

  let paddleX;
  let ballX, ballY, ballDX, ballDY;
  let score;
  let gameOver;
  let collisionLocked = false;

  const scoreDisplay = document.getElementById("pongScore");
  const gameOverDisplay = document.getElementById("pongGameOver");
  const restartButton = document.getElementById("restartPong");

  function resetGame() {
    paddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = 1.5;
    ballDY = -1.5;
    score = 0;
    gameOver = false;
    collisionLocked = false;
    scoreDisplay.textContent = score;
    gameOverDisplay.textContent = "";
    restartButton.style.display = "none";
  }

  document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    paddleX = mouseX - paddleWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
  });

  function drawPaddle() {
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();
  }

  function update() {
    if (gameOver) {
      gameOverDisplay.textContent = "Game Over!";
      restartButton.style.display = "inline-block";
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();

    ballX += ballDX;
    ballY += ballDY;

    // Wall collision
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) ballDX = -ballDX;
    if (ballY - ballRadius < 0) ballDY = -ballDY;

    // Paddle collision with locking
    const ballBottom = ballY + ballRadius;
    const paddleTop = paddleY;
    const paddleBottom = paddleY + paddleHeight;

    const hittingPaddle =
      ballBottom >= paddleTop &&
      ballY <= paddleBottom &&
      ballX >= paddleX &&
      ballX <= paddleX + paddleWidth;

    if (hittingPaddle && !collisionLocked) {
      ballDY = -Math.abs(ballDY); // Always bounce upward
      score++;
      scoreDisplay.textContent = score;
      collisionLocked = true;
    }

    if (ballY + ballRadius < paddleY) {
      collisionLocked = false;
    }

    // Game over
    if (ballY - ballRadius > canvas.height) {
      gameOver = true;
    }

    requestAnimationFrame(update);
  }

  restartButton.onclick = () => {
    resetGame();
    update();
  };

  resetGame();
  update();
}
