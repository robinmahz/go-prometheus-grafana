// 🔊 Audio Setup
const pongHitSound   = new Audio('https://www.soundjay.com/button/beep-07.wav');
const snakeEatSound  = new Audio('https://www.soundjay.com/button/beep-10.wav');
const winSound       = new Audio('https://www.soundjay.com/button/beep-06.wav');
const gameOverSound  = new Audio('https://www.soundjay.com/button/fail-buzzer-01.wav');
[pongHitSound, snakeEatSound, winSound, gameOverSound].forEach(a => a.load());

function safePlay(audio) {
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

// 🎯 Global Settings
let ticTacToeScore = { X: 0, O: 0 };
let snakeSpeed = 150;
const speeds = { easy: 200, normal: 150, hard: 100 };

// 🚀 Game Launcher
function startGame(game) {
  const container = document.getElementById("gameContainer");
  container.innerHTML = `<div id="scoreBoard" style="margin-top:20px;font-weight:bold;"></div>`;
  const scoreBoard = document.getElementById("scoreBoard");

  if (game === "snakeGame") {
    container.insertAdjacentHTML("beforeend", `
      <div style="margin:10px 0;">
        Difficulty: 
        <select onchange="snakeSpeed=speeds[this.value];startGame('snakeGame')">
          <option value="easy">Easy</option>
          <option value="normal" selected>Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div id="turnIndicator">Snake Game</div>
      <canvas id="snakeCanvas" width="300" height="300"></canvas>
      <div id="scoreBoard">Snake Score: <span id="snakeScore">0</span></div>
      <button id="resetBtn" onclick="startGame('snakeGame')">Restart Snake</button>
    `);
    setTimeout(() => initSnakeGame(), 100);
  }

  if (game === "carGame") {
    scoreBoard.innerHTML = `Distance: <span id="carScore">0</span> m`;
    container.insertAdjacentHTML("beforeend", `
      <canvas id="carCanvas" width="400" height="300"></canvas>
      <p style="margin-top:10px;font-weight:bold;">←  →  to steer</p>
      <button id="resetBtn" onclick="startGame('carGame')">Restart Car Game</button>
    `);
    setTimeout(() => initCarGame(), 100);
  }

  if (game === "pongGame") {
    scoreBoard.innerHTML = `Pong Score: <span id="pongScore">0</span>`;
    container.insertAdjacentHTML("beforeend", `
      <canvas id="pong" width="400" height="300"></canvas>
      <button id="resetBtn" onclick="startGame('pongGame')">Restart Pong</button>
    `);
    setTimeout(() => initPongGame(), 100);
  }

  if (game === "ticTacToe") {
    scoreBoard.innerHTML = `Tic Tac Toe | X: <span id="sx">${ticTacToeScore.X}</span> – O: <span id="so">${ticTacToeScore.O}</span>`;
    container.insertAdjacentHTML("beforeend", `
      <div id="turnIndicator">Player <span style="color:#e74c3c">X</span>'s turn</div>
      <canvas id="tic" width="300" height="300"></canvas>
      <button id="resetBtn" onclick="startGame('ticTacToe')">Restart Game</button>
    `);
    setTimeout(() => initTicTacToe(), 100);
  }

  if (game === "breakout") {
  scoreBoard.innerHTML = `Breakout Score: <span id="breakoutScore">0</span>`;
  container.insertAdjacentHTML("beforeend", `
    <canvas id="breakout" width="480" height="320" style="background:#222; display:block; margin: 10px auto; border: 2px solid #555;"></canvas>
    <div id="breakoutGameOver" style="color:#f39c12; font-weight:bold; text-align:center; margin-top: 10px; min-height: 24px;"></div>
    <button id="resetBtn" onclick="startGame('breakout')">Restart Breakout</button>
  `);
  setTimeout(() => initBreakoutGame(container), 100);
}

}
