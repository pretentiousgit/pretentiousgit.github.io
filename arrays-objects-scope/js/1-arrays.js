// 1-arrays.js
// Example 1: arrays.
// The boxes on the page are drawn from one array of colour names.

// ---------- MODEL: the data ----------

const boxes = ['red', 'yellow', 'blue'];

// ---------- VIEW: draws the boxes from the model ----------

// One colour name becomes one box. The number in it is its position in the array.
const makeBox = (color, position) => {
  return `<div class="box ${color}">${position}</div>`;
};

// Step 1: walk the array one box per click.
// position remembers where we are, the way a loop would.
let position = 0;

const loadNextBox = () => {
  const row = document.querySelector('#load-row');
  row.innerHTML += makeBox(boxes[position], position);
  position = position + 1;
};

// Steps 2 and 3: empty one row, then walk the whole array and add every box to it.
// The same walk as step 1, done all at once with a for loop.
const drawBoxes = (rowSelector) => {
  const row = document.querySelector(rowSelector);
  row.innerHTML = '';
  for (let position = 0; position < boxes.length; position = position + 1) {
    row.innerHTML += makeBox(boxes[position], position);
  }
};

// ---------- CONTROLLER: what each button does ----------

// Step 2: add a box to the front or the end of the ARRAY, then redraw
const addInFront = () => {
  boxes.unshift('red');
  drawBoxes('#add-row');
};

const addAtEnd = () => {
  boxes.push('blue');
  drawBoxes('#add-row');
};

// Step 3: forEach changes the boxes on the PAGE. The array is not touched.
const paintWithForEach = () => {
  document.querySelectorAll('#paint-row .box').forEach((box) => {
    box.style.backgroundColor = '#333333';
    box.style.color = 'white';
  });
};

// Refresh redraws the page from the array, so the paint is gone
const refresh = () => {
  drawBoxes('#paint-row');
};

document.querySelector('#load').addEventListener('click', () => {
  clearNew();
  loadNextBox();
  markLoaded();
});
document.querySelector('#load-reset').addEventListener('click', () => {
  position = 0;
  document.querySelector('#load-row').innerHTML = '';
  markLoaded();
});
document.querySelector('#add-in-front').addEventListener('click', () => {
  addInFront();
  showArray();
  markNew(0);
});
document.querySelector('#add-at-end').addEventListener('click', () => {
  addAtEnd();
  showArray();
  markNew(boxes.length - 1);
});
document.querySelector('#paint').addEventListener('click', paintWithForEach);
document.querySelector('#refresh').addEventListener('click', refresh);

// Not part of the lesson: makes the new box grow in, so you can see where it landed
const markNew = (position) => {
  document.querySelector('#add-row').children[position].classList.add('new');
};

// Not part of the lesson: writes the array out under the boxes in steps 2 and 3
const showArray = () => {
  document.querySelectorAll('.array-line').forEach((line) => {
    line.textContent = `boxes = [${boxes.map((color) => `'${color}'`).join(', ')}]`;
  });
};

// Not part of the lesson: steps 2 and 3 share the array, so when a step opens,
// redraw its row in case the other step changed the array
document.querySelectorAll('#step-add, #step-foreach').forEach((panel) => {
  panel.addEventListener('show.bs.collapse', () => {
    drawBoxes(`#${panel.querySelector('.box-row').id}`);
    showArray();
  });
});

// Not part of the lesson: step 1's code block. It shows the array with each item's
// position written under it, an arrow at the next position, then the code that walks it.
const showLoadCode = () => {
  const items = boxes.map((color) => `'${color}'`);
  const start = 'const boxes = ['.length;
  const columns = [];
  let column = start;
  items.forEach((item) => {
    columns.push(column);
    column = column + item.length + 2;
  });

  let numbers = '';
  columns.forEach((col, index) => {
    numbers = numbers.padEnd(col) + index;
  });
  const arrow = position < boxes.length
    ? ''.padEnd(columns[position]) + `↑ position = ${position}`
    : ''.padEnd(start) + `position = ${position}: past the end, nothing left to load`;

  document.querySelector('#code-load').textContent = [
    `const boxes = [${items.join(', ')}];`,
    `//${numbers.slice(2)}`,
    `//${arrow.slice(2)}`,
    '',
    `const makeBox = ${makeBox.toString()};`,
    '',
    `let position = 0;`,
    '',
    `const loadNextBox = ${loadNextBox.toString()};`
  ].join('\n');
};

// innerHTML += rebuilds every box in the row, so take the grow-in mark off the old ones first
const clearNew = () => {
  document.querySelectorAll('#load-row .new').forEach((box) => box.classList.remove('new'));
};

// After each click: grow in the new box, move the arrow, and stop at the end of the array
const markLoaded = () => {
  const row = document.querySelector('#load-row');
  if (row.lastElementChild) row.lastElementChild.classList.add('new');
  document.querySelector('#load').disabled = position >= boxes.length;
  showLoadCode();
};

showLoadCode();
drawBoxes('#add-row');
drawBoxes('#paint-row');
showArray();
showCode(addInFront, '#code-front');
showCode(addAtEnd, '#code-end');
showCode(paintWithForEach, '#code-paint');
