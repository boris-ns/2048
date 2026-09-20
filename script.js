const MATRIX_SIZE = 4;

let state = [];

addEventListener("load", (event) => {
  initGameState();

  const randomEmptyCell1 = getRandomFreeCell();
  applyToCell(randomEmptyCell1[0], randomEmptyCell1[1], 2);
  const randomEmptyCell2 = getRandomFreeCell();
  applyToCell(randomEmptyCell2[0], randomEmptyCell2[1], 4);
  const randomEmptyCell3 = getRandomFreeCell();
  applyToCell(randomEmptyCell3[0], randomEmptyCell3[1], 8);
  const randomEmptyCell4 = getRandomFreeCell();
  applyToCell(randomEmptyCell4[0], randomEmptyCell4[1], 16);

  initHTMLBoard();
  render();
});

function initGameState() {
  state = [];

  for (let i = 0; i < MATRIX_SIZE; ++i) {
    state.push([]);

    for (let j = 0; j < MATRIX_SIZE; ++j) {
      state[i].push(0);
    }
  }
}

function getRandomFreeCell() {
  const emptyStates = [];

  for (let i = 0; i < MATRIX_SIZE; ++i) {
    for (let j = 0; j < MATRIX_SIZE; ++j) {
      if (state[i][j] === 0) {
        emptyStates.push([i, j]);
      }
    }
  }

  // TODO possible issue if there are no empty cells
  const randomEmptyCell =
    emptyStates[Math.floor(Math.random() * emptyStates.length)];

  return randomEmptyCell;
}

function applyToCell(i, j, value) {
  state[i][j] = value;
}

function initHTMLBoard() {
  const container = document.querySelector("#board");

  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellSpan = document.createElement("span");
      cellSpan.textContent = getCellValue(cell);
      cellSpan.setAttribute("id", getCellIdName(i, j));

      container.appendChild(cellSpan);
    });
  });
}

function getCellValue(value) {
  return value === 0 ? "" : value;
}

function getCellIdName(i, j) {
  return `cell-${i}-${j}`;
}

function getCellClassName(value) {
  return `cell-${value}`;
}

document.addEventListener("keydown", (event) => {
  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }

  switch (event.key) {
    case "ArrowUp":
      console.log("UP");
      break;
    case "ArrowDown":
      console.log("DOWN");
      break;
    case "ArrowLeft":
      console.log("LEFT");
      break;
    case "ArrowRight":
      moveRight();
      render();
      break;
  }
});

function moveRight() {
  for (let i = 0; i < state.length; ++i) {
    for (let j = 0; j < state.length; ++j) {
      if (state[i][j] === 0) {
        continue;
      }

      // There's no space to push elements to right
      if (j + 1 >= MATRIX_SIZE) {
        continue;
      }

      // Cant place new value over existing one
      if (state[i][j + 1] !== 0) {
        continue;
      }

      // TODO handle merging
      state[i][j + 1] = state[i][j]; // move right
      state[i][j] = 0;
    }
  }
}

function render() {
  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const element = document.querySelector(`#${getCellIdName(i, j)}`);
      element.textContent = getCellValue(cell);
      element.className = getCellClassName(cell);
    });
  });
}
