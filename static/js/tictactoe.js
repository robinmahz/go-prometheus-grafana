function initTicTacToe() {
  const c = document.getElementById("tic");
  const ctx = c.getContext("2d");
  const S = c.width;
  const cell = S / 3;

  let board = Array(9).fill(null);
  let curr = "X";
  let over = false;

  function draw() {
    ctx.clearRect(0, 0, S, S);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2c3e50";

    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, S);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(S, i * cell);
      ctx.stroke();
    }

    board.forEach((val, i) => {
      if (val) {
        const x = (i % 3) * cell + cell / 2;
        const y = Math.floor(i / 3) * cell + cell / 2;
        ctx.font = `${cell * 0.5}px bold serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = val === "X" ? "#e74c3c" : "#2ecc71";
        ctx.fillText(val, x, y);
      }
    });
  }

  function win(p) {
    return [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ].some(a => a.every(i => board[i] === p));
  }

  c.onclick = e => {
    if (over) return;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cell);
    const row = Math.floor(y / cell);
    const id = row * 3 + col;

    if (!board[id]) {
      board[id] = curr;
      draw();

      if (win(curr)) {
        ticTacToeScore[curr]++;
        document.getElementById(curr === "X" ? "sx" : "so").textContent = ticTacToeScore[curr];
        document.getElementById("turnIndicator").textContent = `Player ${curr} wins!`;
        safePlay(winSound);
        over = true;
      } else if (board.every(Boolean)) {
        document.getElementById("turnIndicator").textContent = "Draw!";
        safePlay(gameOverSound);
        over = true;
      } else {
        curr = curr === "X" ? "O" : "X";
        document.getElementById("turnIndicator").innerHTML = `Player <span style="color:${curr === "X" ? "#e74c3c" : "#2ecc71"}">${curr}</span>'s turn`;
      }
    }
  };

  draw();
}
