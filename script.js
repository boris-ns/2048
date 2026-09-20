const MATRIX_SIZE = 4;
const ZERO_CELL_VALUE = 0;

let state = [];
let isGameOver = false;

addEventListener("load", (event) => {
  state = initGameBoard();

  insertAtRandomCell();
  insertAtRandomCell();

  initHTMLBoard();
  render();
});

function initGameBoard() {
  const state = [];

  for (let i = 0; i < MATRIX_SIZE; ++i) {
    state.push([]);

    for (let j = 0; j < MATRIX_SIZE; ++j) {
      state[i].push(ZERO_CELL_VALUE);
    }
  }

  return state;
}

function insertAtRandomCell() {
  const position = getRandomFreeCell();

  if (!position) {
    isGameOver = true;
    return;
  }

  state[position[0]][position[1]] = Math.random() < 0.9 ? 2 : 4;
}

function getRandomFreeCell() {
  const emptyStates = [];

  for (let i = 0; i < MATRIX_SIZE; ++i) {
    for (let j = 0; j < MATRIX_SIZE; ++j) {
      if (state[i][j] === ZERO_CELL_VALUE) {
        emptyStates.push([i, j]);
      }
    }
  }

  if (!emptyStates.length) {
    return null;
  }

  const randomEmptyCell =
    emptyStates[Math.floor(Math.random() * emptyStates.length)];

  return randomEmptyCell;
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
  return value === ZERO_CELL_VALUE ? "" : value;
}

function getCellIdName(i, j) {
  return `cell-${i}-${j}`;
}

function getCellClassName(value) {
  return `cell-${value}`;
}

document.addEventListener("keydown", (event) => {
  if (isGameOver) {
    return;
  }

  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }

  const previousState = state;

  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
  }

  if (JSON.stringify(state) !== JSON.stringify(previousState)) {
    insertAtRandomCell();

    if (isGameOver) {
      showGameOver();
    }
  }

  render();
});

function showGameOver() {
  const headerElement = document.querySelector("#header");
  headerElement.textContent = "GAME OVER! :(";
}

function moveUp() {
  transposeState();
  moveLeft();
  transposeState();
}

function moveDown() {
  transposeState();
  moveRight();
  transposeState();
}

function moveLeft() {
  reverseRows();
  moveRight();
  reverseRows();
}

function moveRight() {
  state = state.map((row) => {
    let newRowState = row.filter((v) => v !== ZERO_CELL_VALUE);

    for (let i = newRowState.length - 1; i > 0; --i) {
      if (newRowState[i] === newRowState[i - 1]) {
        newRowState[i] = 0;
        newRowState[i - 1] *= 2;
        --i; // skip, because we merged it
      }
    }

    newRowState = newRowState.filter((v) => v !== ZERO_CELL_VALUE);

    while (newRowState.length < 4) {
      newRowState.unshift(ZERO_CELL_VALUE);
    }

    return newRowState;
  });
}

function reverseRows() {
  state = state.map((row) => row.reverse());
}

function transposeState() {
  const transposed = initGameBoard();

  for (let j = 0; j < MATRIX_SIZE; ++j) {
    for (let i = 0; i < MATRIX_SIZE; ++i) {
      transposed[i][j] = state[j][i];
    }
  }

  state = transposed;
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
