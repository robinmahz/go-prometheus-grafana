function initCarGame() {
  const canvas = document.getElementById("carCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const carWidth = 40;
  const carHeight = 60;
  let carX = (canvas.width - carWidth) / 2;
  const carY = canvas.height - carHeight - 10;
  let keys = {};
  let distance = 0;
  let obstacles = [];
  let frame = 0;
  let speedMultiplier = 1;

  const obstacleSpeed = 2; // Balanced speed
  const obstacleGap = 90;  // Slower spawn rate

  // Listen for arrow key controls
  document.onkeydown = e => keys[e.key] = true;
  document.onkeyup = e => keys[e.key] = false;

  function drawCar() {
    ctx.fillStyle = "#2980b9";
    ctx.fillRect(carX, carY, carWidth, carHeight);
  }

  function spawnObstacle() {
    const width = 40;
    obstacles.push({
      x: Math.random() * (canvas.width - width),
      y: -60,
      width,
      height: 60
    });
  }

  let animationFrameId;

  function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.7)"; // semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e74c3c";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
  }

  function loop() {
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Handle left/right controls
    if (keys["ArrowLeft"] && carX > 0) carX -= 3 * speedMultiplier;
    if (keys["ArrowRight"] && carX < canvas.width - carWidth) carX += 3 * speedMultiplier;

    drawCar();

    // Spawn new obstacle every few frames
    if (frame % obstacleGap === 0) spawnObstacle();

    // Move and draw obstacles
    obstacles.forEach(o => {
      o.y += obstacleSpeed * speedMultiplier;
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(o.x, o.y, o.width, o.height);
    });

    // Collision detection
    const collided = obstacles.some(o =>
      o.y + o.height > carY &&
      o.y < carY + carHeight &&
      o.x < carX + carWidth &&
      o.x + o.width > carX
    );

    if (collided) {
      safePlay(gameOverSound);
      drawGameOver();
      cancelAnimationFrame(animationFrameId);
      // Optionally disable controls by clearing keys object
      keys = {};
      return;
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(o => o.y < canvas.height);

    // Update distance score
    distance++;
    document.getElementById("carScore").textContent = distance;

    frame++;
    animationFrameId = requestAnimationFrame(loop);
  }

  loop();
}
