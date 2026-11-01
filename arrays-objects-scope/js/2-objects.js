// 2-objects.js
// Example 2: objects.
// Same walk as example 1, but now each item in the array is an object.
// An object keeps named values (properties). Each box has three: color, size and shape.

// ---------- MODEL: the data ----------

const boxes = [
  { color: 'red', size: 60, shape: 'square' },
  { color: 'yellow', size: 80, shape: 'square' },
  { color: 'blue', size: 100, shape: 'square' }
];

// ---------- VIEW: one object becomes one box ----------

// box.color and box.shape become CSS class names. box.size becomes the width and height in pixels.
const makeBox = (box, position) => {
  return `<div class="box ${box.color} ${box.shape}" style="width: ${box.size}px; height: ${box.size}px;">${position}</div>`;
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

// ---------- CONTROLLER ----------

// Step 1: walk the array one box per click
let position = 0;

const loadNextBox = () => {
  const row = document.querySelector('#load-row');
  row.innerHTML += makeBox(boxes[position], position);
  position = position + 1;
};

// Step 2: change one property of one object. Find the box by position, then the property by key.
const growBox1 = () => {
  boxes[1].size = boxes[1].size + 20;
  drawBoxes('#change-row');
};

const paintBox0Blue = () => {
  boxes[0].color = 'blue';
  drawBoxes('#change-row');
};

// Step 3: change the shape property. makeBox turns it into a CSS class name,
// and the CSS rule for that class does the rest.
const makeBox2Circle = () => {
  boxes[2].shape = 'circle';
  drawBoxes('#add-row');
};

const makeBox2Square = () => {
  boxes[2].shape = 'square';
  drawBoxes('#add-row');
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

// Each step 2 and 3 button: run its function, then flash the box it changed
const buttons = [
  ['#grow-1', growBox1, '#change-row', 1],
  ['#paint-0', paintBox0Blue, '#change-row', 0],
  ['#circle-2', makeBox2Circle, '#add-row', 2],
  ['#square-2', makeBox2Square, '#add-row', 2]
];
buttons.forEach(([selector, action, rowSelector, position]) => {
  document.querySelector(selector).addEventListener('click', () => {
    action();
    showModel();
    document.querySelector(rowSelector).children[position].classList.add('new');
  });
});
// ---------- Not part of the lesson ----------

// Put the boxes back to how they started
const resetBoxes = () => {
  boxes.splice(0, boxes.length,
    { color: 'red', size: 60, shape: 'square' },
    { color: 'yellow', size: 80, shape: 'square' },
    { color: 'blue', size: 100, shape: 'square' }
  );
  drawBoxes('#change-row');
  drawBoxes('#add-row');
  showModel();
};

// innerHTML += rebuilds every box in the row, so take the grow-in mark off the old ones first
const clearNew = () => {
  document.querySelectorAll('#load-row .new').forEach((box) => box.classList.remove('new'));
};

// Writes one object the way it looks in code: { color: 'red', size: 60 }
const objectText = (object) => {
  const pairs = Object.keys(object).map((key) => {
    const value = object[key];
    return `${key}: ${typeof value === 'string' ? `'${value}'` : value}`;
  });
  return `{ ${pairs.join(', ')} }`;
};

// The array as it is right now, under the boxes in steps 2 and 3
const showModel = () => {
  const lines = boxes.map((box, index) => `  ${objectText(box)}${index < boxes.length - 1 ? ',' : ''}`);
  const text = ['boxes = [', ...lines, ']'].join('\n');
  document.querySelectorAll('.model-text').forEach((element) => {
    element.textContent = text;
  });
  // Stop growing at 160px, and only offer the shape box 2 does not already have
  document.querySelector('#grow-1').disabled = boxes[1].size >= 160;
  document.querySelector('#circle-2').disabled = boxes[2].shape === 'circle';
  document.querySelector('#square-2').disabled = boxes[2].shape === 'square';
  // Step 3's HTML block: the tag makeBox wrote for box 2
  document.querySelector('#html-box-2').textContent = makeBox(boxes[2], 2).replace('" style', '"\n     style');
  // Step 1's code block shows the live array too
  showLoadCode();
};

// Steps 2 and 3 share the array, so when a step opens,
// redraw its row in case the other step changed the array
document.querySelectorAll('#step-change, #step-add').forEach((panel) => {
  panel.addEventListener('show.bs.collapse', () => {
    drawBoxes(`#${panel.querySelector('.box-row').id}`);
  });
});

// Step 1's code block: the array with each item's position beside it,
// an arrow at the next position, then the code that walks it
const showLoadCode = () => {
  const lines = boxes.map((box, index) => `  ${objectText(box)}${index < boxes.length - 1 ? ',' : ''}`);
  const width = Math.max(...lines.map((line) => line.length)) + 2;
  const arrayLines = lines.map((line, index) => {
    const arrow = index === position ? `  ← position = ${position}` : '';
    return `${line.padEnd(width)}// ${index}${arrow}`;
  });
  const end = position >= boxes.length
    ? `];  // position = ${position}: past the end, nothing left to load`
    : '];';

  document.querySelector('#code-load').textContent = [
    'const boxes = [',
    ...arrayLines,
    end,
    '',
    `const makeBox = ${makeBox.toString()};`,
    '',
    'let position = 0;',
    '',
    `const loadNextBox = ${loadNextBox.toString()};`
  ].join('\n');
};

// After each click: grow in the new box, move the arrow, and stop at the end of the array
const markLoaded = () => {
  const row = document.querySelector('#load-row');
  if (row.lastElementChild) row.lastElementChild.classList.add('new');
  document.querySelector('#load').disabled = position >= boxes.length;
  showLoadCode();
};

document.querySelectorAll('.reset-boxes').forEach((button) => {
  button.addEventListener('click', resetBoxes);
});

drawBoxes('#change-row');
drawBoxes('#add-row');
showModel();
showCode(growBox1, '#code-grow-1');
showCode(paintBox0Blue, '#code-paint-0');
showCode(makeBox2Circle, '#code-circle-2');
showCode(makeBox2Square, '#code-square-2');
