// 3-array-methods.js
// Example 3: loops and arrays.
// A for loop can walk an array, but it is generic: you have to read it closely
// to find out what it is for. forEach, map, filter and find say what they do in
// their name. Each one calls your arrow function once per item.
//
// Every function here makes its own boxes array inside itself, so each code box
// on the page holds everything you need to read it.

// ---------- VIEW ----------

const makeBox = (color, position) => {
  return `<div class="box ${color}">${position}</div>`;
};

// ---------- CONTROLLER ----------

// Step 1: making a new array. A for loop needs a second array made outside it,
// a counter, and a stop condition: three places to get something wrong.
const buildWithLoop = () => {
  const boxes = ['red', 'yellow', 'blue'];
  const boxHtml = [];
  for (let position = 0; position < boxes.length; position = position + 1) {
    boxHtml.push(makeBox(boxes[position], position));
  }
  return boxHtml;
};

// The same loop with one typo: <= instead of <. It runs once too many,
// and boxes[3] does not exist.
const buildWithTypo = () => {
  const boxes = ['red', 'yellow', 'blue'];
  const boxHtml = [];
  for (let position = 0; position <= boxes.length; position = position + 1) {
    boxHtml.push(makeBox(boxes[position], position));
  }
  return boxHtml;
};

// forEach does the counting and the stopping, so that typo can't happen.
// You still make the new array outside and push into it yourself.
const buildWithForEach = () => {
  const boxes = ['red', 'yellow', 'blue'];
  const boxHtml = [];
  boxes.forEach((color, position) => {
    boxHtml.push(makeBox(color, position));
  });
  return boxHtml;
};

// Step 1, part 2: while a loop runs, nothing else on the page can.
// This one stops after 3 seconds. One that waits for something never stops.
const waitThreeSeconds = () => {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // keep checking the clock. Nothing else on the page runs until this ends.
  }
};

// Step 2 (map vs forEach, one line at a time) lives in 3-step-through.js

// Step 3: filter keeps every box the arrow function says yes to, in a new array.
// find stops at the first yes, and gives back that one box, not an array.
const onlyRedBoxes = () => {
  const boxes = [
    { color: 'red', size: 60 },
    { color: 'yellow', size: 80 },
    { color: 'blue', size: 100 },
    { color: 'red', size: 100 },
    { color: 'yellow', size: 60 }
  ];
  return boxes.filter((box) => {
    return box.color === 'red';
  });
};

const firstBigBox = () => {
  const boxes = [
    { color: 'red', size: 60 },
    { color: 'yellow', size: 80 },
    { color: 'blue', size: 100 },
    { color: 'red', size: 100 },
    { color: 'yellow', size: 60 }
  ];
  return boxes.find((box) => {
    return box.size === 100;
  });
};

// ---------- Buttons: run the function, then show what it gave back ----------

// Step 1: each build function gives back an array of HTML. Put it on the page.
[
  ['#run-build-loop', buildWithLoop, '#build-loop-row'],
  ['#run-build-typo', buildWithTypo, '#build-typo-row'],
  ['#run-build-foreach', buildWithForEach, '#build-foreach-row']
].forEach(([buttonSelector, build, rowSelector]) => {
  document.querySelector(buttonSelector).addEventListener('click', () => {
    const row = document.querySelector(rowSelector);
    row.innerHTML = build().join('');
    markNew(rowSelector);
  });
});

document.querySelector('#run-while').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = 'Running: the page is stuck…';
  // Let the browser draw the button's new label before the loop takes over
  requestAnimationFrame(() => {
    setTimeout(() => {
      waitThreeSeconds();
      button.disabled = false;
      button.textContent = 'Run a while loop for 3 seconds';
    }, 0);
  });
});

document.querySelector('#run-filter').addEventListener('click', () => {
  const redBoxes = onlyRedBoxes();
  showGaveBack('#filter-row', '#filter-result', 'onlyRedBoxes()', redBoxes);
  outlineMatches(redBoxes);
});

document.querySelector('#run-find').addEventListener('click', () => {
  const bigBox = firstBigBox();
  showGaveBack('#find-row', '#find-result', 'firstBigBox()', bigBox);
  outlineMatches([bigBox]);
});

// ---------- Not part of the lesson ----------

// Step 3 draws the five boxes being searched. This is a copy of the array made
// inside onlyRedBoxes and firstBigBox: keep all three the same.
const searchedBoxes = [
  { color: 'red', size: 60 },
  { color: 'yellow', size: 80 },
  { color: 'blue', size: 100 },
  { color: 'red', size: 100 },
  { color: 'yellow', size: 60 }
];

const makeSizedBox = (box, position) => {
  return `<div class="box ${box.color}" style="width: ${box.size}px; height: ${box.size}px;">${position}</div>`;
};

// Writes a value the way it looks in code: 'red', 60, { color: 'red', size: 60 }, [ ... ]
const valueText = (value) => {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${value.map((item) => `  ${valueText(item)}`).join(',\n')}\n]`;
  }
  if (typeof value === 'object') {
    const pairs = Object.keys(value).map((key) => `${key}: ${valueText(value[key])}`);
    return `{ ${pairs.join(', ')} }`;
  }
  return String(value);
};

// Draw whatever came back (an array, one object, or nothing) and write it out underneath
const showGaveBack = (rowSelector, resultSelector, call, value) => {
  const row = document.querySelector(rowSelector);
  row.innerHTML = '';
  let items = [];
  if (Array.isArray(value)) items = value;
  else if (value !== undefined) items = [value];
  items.forEach((item, position) => {
    row.innerHTML += makeSizedBox(item, position);
  });
  [...row.children].forEach((box) => box.classList.add('new'));
  document.querySelector(resultSelector).textContent = `${call} gave back:\n${valueText(value)}`;
};

const markNew = (rowSelector) => {
  [...document.querySelector(rowSelector).children].forEach((box) => box.classList.add('new'));
};

// Step 3: outline the searched boxes that came back. filter and find keep the
// original order, so walk both lists together and match by value.
const outlineMatches = (matches) => {
  const row = document.querySelector('#source-row');
  let next = 0;
  searchedBoxes.forEach((box, position) => {
    const match = matches[next];
    const isMatch = match !== undefined && match.color === box.color && match.size === box.size;
    row.children[position].classList.toggle('match', isMatch);
    if (isMatch) next = next + 1;
  });
};

const sourceRow = document.querySelector('#source-row');
searchedBoxes.forEach((box, position) => {
  sourceRow.innerHTML += makeSizedBox(box, position);
});

// Blue: the generic loop, which takes reading to understand.
// Yellow: the array method, whose name says what it does.
showCode(buildWithLoop, '#code-build-loop', { block: 'for (' });
showCode(buildWithTypo, '#code-build-typo', { block: 'for (', mark: '<=' });
showCode(buildWithForEach, '#code-build-foreach', { verb: 'forEach' });
showCode(waitThreeSeconds, '#code-while', { block: 'while (' });

// Step 1, part 2: a page clock that ticks every tenth of a second, so you can see it stop
const clockStart = Date.now();
setInterval(() => {
  document.querySelector('#page-clock').textContent = `${((Date.now() - clockStart) / 1000).toFixed(1)} s`;
}, 100);
showCode(onlyRedBoxes, '#code-filter', { verb: 'filter' });
showCode(firstBigBox, '#code-find', { verb: 'find' });
