// 3-scope.js
// Example 3: scope as boxes.
// Every call to a function gets its own box (its own scope) with its own variables.
// Code inside the box can see out to the page, but the box is gone when the call ends.

// ---------- MODEL: made on the page, outside every function, so every function can see them ----------

const boxes = ['red', 'yellow', 'blue'];
const palette = ['red', 'yellow', 'blue'];

// ---------- VIEW ----------

const makeBox = (color, position) => {
  return `<div class="box ${color}">${position}</div>`;
};

const drawBoxes = (rowSelector) => {
  const row = document.querySelector(rowSelector);
  row.innerHTML = '';
  for (let position = 0; position < boxes.length; position = position + 1) {
    row.innerHTML += makeBox(boxes[position], position);
  }
};

// ---------- CONTROLLER ----------

// Step 1: every call gets a fresh box. color and position are made new each time,
// so two calls never share them, and they are gone when the call ends.
const addColoredBox = (color) => {
  const position = boxes.length;   // where this call's box will land
  boxes[position] = color;
  drawBoxes('#call-row');
};

// Step 2: the colour is not handed in. The call reaches out to the page for it.
const addFromPalette = (choice) => {
  const color = palette[choice];   // palette is out on the page: the call can see out
  const position = boxes.length;   // made fresh for this call, like before
  boxes[position] = color;
  drawBoxes('#palette-row');
};

// ---------- Buttons ----------

document.querySelectorAll('[data-color]').forEach((button) => {
  button.addEventListener('click', () => {
    const color = button.dataset.color;
    addColoredBox(color);
    markNewBox('#call-row');
    showCall('#call-boxes', 'addColoredBox', [
      `color = '${color}'`,
      `position = ${boxes.length - 1}`
    ]);
  });
});

document.querySelectorAll('[data-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = Number(button.dataset.choice);
    addFromPalette(choice);
    markNewBox('#palette-row');
    showCall('#palette-calls', 'addFromPalette', [
      `choice = ${choice}`,
      `color = '${palette[choice]}'`,
      `position = ${boxes.length - 1}`
    ]);
    showPicked(choice);
  });
});

// ---------- Not part of the lesson: draws the scope diagrams ----------

let pickedTimer;

// Each array chip on the page shows its array as tiny squares
const drawChips = () => {
  const arrays = { boxes: boxes, palette: palette };
  document.querySelectorAll('.mini-row[data-array]').forEach((squares) => {
    squares.innerHTML = arrays[squares.dataset.array]
      .map((color) => `<span class="mini ${color}"></span>`)
      .join('');
  });
};

// The box a call just added grows in, and the boxes chip catches up
const markNewBox = (rowSelector) => {
  document.querySelector(rowSelector).lastElementChild.classList.add('new');
  drawChips();
};

// Step 2: light up the palette chip on the page, and the square the call picked
const showPicked = (choice) => {
  clearTimeout(pickedTimer);
  const chip = document.querySelector('#chip-palette');
  chip.classList.add('seen');
  chip.querySelectorAll('.mini')[choice].classList.add('picked');
  pickedTimer = setTimeout(() => {
    chip.classList.remove('seen');
    chip.querySelectorAll('.mini').forEach((mini) => mini.classList.remove('picked'));
  }, 1500);
};

const resetBoxes = () => {
  boxes.splice(0, boxes.length, 'red', 'yellow', 'blue');
  drawBoxes('#call-row');
  drawBoxes('#palette-row');
  drawChips();
  resetCallCounts();
  document.querySelectorAll('.call-boxes').forEach((area) => { area.innerHTML = ''; });
};

document.querySelectorAll('.reset-boxes').forEach((button) => {
  button.addEventListener('click', resetBoxes);
});

// The steps share the boxes array, so when a step opens, redraw its row
document.querySelectorAll('.accordion-collapse').forEach((panel) => {
  panel.addEventListener('show.bs.collapse', () => {
    drawBoxes(`#${panel.querySelector('.box-row').id}`);
    drawChips();
  });
});

drawBoxes('#call-row');
drawBoxes('#palette-row');
drawChips();
showCode(addColoredBox, '#code-call');
// Step 2's code block also shows the palette array the call reaches out to
document.querySelector('#code-palette').textContent =
  `const palette = [${palette.map((color) => `'${color}'`).join(', ')}];\n\n` +
  `const ${addFromPalette.name} = ${addFromPalette.toString()};`;
