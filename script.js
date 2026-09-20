const MATRIX_SIZE = 4;
const ZERO_CELL_VALUE = 0;

let state = [];

addEventListener("load", (event) => {
  state = initGameBoard();

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

function getRandomFreeCell() {
  const emptyStates = [];

  for (let i = 0; i < MATRIX_SIZE; ++i) {
    for (let j = 0; j < MATRIX_SIZE; ++j) {
      if (state[i][j] === ZERO_CELL_VALUE) {
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
  return value === ZERO_CELL_VALUE ? "" : value;
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

  render();
});

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
    const newRowState = row.filter((v) => v !== 0);

    // todo handle merging

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
