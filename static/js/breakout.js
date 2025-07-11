function initBreakoutGame(container) {
  const canvas = container.querySelector("#breakout");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const paddleWidth = 75;
  const paddleHeight = 10;
  let paddleX = (canvas.width - paddleWidth) / 2;

  let ballX = canvas.width / 2;
  let ballY = canvas.height - 30;
  let dx = 2;
  let dy = -2;
  const ballRadius = 8;

  const brickRowCount = 3;
  const brickColumnCount = 5;
  const brickWidth = 70;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  let score = 0;

  let bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Remove keyboard controls

  // Add mouse movement control for paddle
  function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    let relativeX = e.clientX - rect.left;
    if (relativeX - paddleWidth / 2 > 0 && relativeX + paddleWidth / 2 < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

  container.addEventListener("mousemove", mouseMoveHandler);

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#e67e22";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.fillStyle = "#c0392b";
          ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ballX > b.x &&
            ballX < b.x + brickWidth &&
            ballY > b.y &&
            ballY < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
            container.querySelector("#breakoutScore").textContent = score;
            safePlay(pongHitSound);

            if (score === brickRowCount * brickColumnCount) {
              container.querySelector("#breakoutGameOver").textContent = "You Win!";
              safePlay(winSound);
              cancelAnimationFrame(animationFrameId);
              container.removeEventListener("mousemove", mouseMoveHandler);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  let animationFrameId;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();

    if (collisionDetection()) return;

    // Ball collision with walls and paddle
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;
    }
    if (ballY + dy < ballRadius) {
      dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        dy = -dy;
        safePlay(pongHitSound);
      } else {
        container.querySelector("#breakoutGameOver").textContent = "Game Over!";
        safePlay(gameOverSound);
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener("mousemove", mouseMoveHandler);
        return;
      }
    }

    ballX += dx;
    ballY += dy;
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}
