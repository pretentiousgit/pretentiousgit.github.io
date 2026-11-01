// 3-step-through.js
// Example 3, step 2: map vs forEach, one line at a time.
// A short script written flat, one thought per line, nothing wrapped in a function yet.
// "Run next line" runs the script up to the next statement, for real, and shows
// which variables exist so far and what is on the page.

// The script. This text is both what is shown and what runs.
const program = [
  "const targetRow = document.querySelector('#steps-row');",
  "const boxes = ['red', 'yellow', 'blue'];",
  'const makeBox = (color, position) => {\n  return `<div class="box ${color}">${position}</div>`;\n};',
  "targetRow.innerHTML = '';",
  'boxes.forEach((color, position) => {\n  targetRow.innerHTML += makeBox(color, position);\n});',
  'const boxHtml = boxes.map((color, position) => {\n  return makeBox(color, position);\n});',
  "const blueBoxHtml = boxHtml.filter((html) => {\n  return html.includes('blue');\n});",
  "targetRow.innerHTML = blueBoxHtml.join('');"
];

// The variables the script makes, in the order it makes them
const variableNames = ['targetRow', 'boxes', 'makeBox', 'boxHtml', 'blueBoxHtml'];

// ---------- Not part of the lesson: runs the script and draws the panel ----------

let linesRun = 0;
let shownBefore = [];

// Run the first `count` statements from a fresh, empty row, and hand back every variable they made.
// Only names whose `const` line has run are read: this page has its own makeBox elsewhere,
// and the script's makeBox must not show up before its own line runs.
const runProgram = (count) => {
  document.querySelector('#steps-row').innerHTML = '';
  const ran = program.slice(0, count).join('\n');
  const made = variableNames.filter((name) => ran.includes(`const ${name} =`));
  const reads = made.map((name) => `${name}: ${name}`).join(', ');
  return new Function(`${ran}\nreturn { ${reads} };`)();
};

// Write a statement into the code box, with its array method name picked out in yellow
const appendStatement = (codeBox, statement, state) => {
  const block = document.createElement('span');
  block.className = `statement ${state}`;
  const verb = ['forEach', 'map', 'filter'].find((name) => statement.includes(`.${name}(`));
  if (verb) {
    const [before, after] = statement.split(`.${verb}(`);
    const name = document.createElement('span');
    name.className = 'highlight-verb';
    name.textContent = verb;
    block.append(`${before}.`, name, `(${after}`);
  } else {
    block.textContent = statement;
  }
  codeBox.append(block);
};

// One variable's value, written short enough to read
const variableText = (value) => {
  if (value instanceof HTMLElement) return `<${value.tagName.toLowerCase()} id="${value.id}">`;
  if (typeof value === 'function') return `${value.toString().split('\n')[0]} … }`;
  return valueText(value);
};

const drawStepper = () => {
  const codeBox = document.querySelector('#step-code');
  codeBox.textContent = '';
  program.forEach((statement, position) => {
    let state = 'upcoming';
    if (position < linesRun - 1) state = 'done';
    if (position === linesRun - 1) state = 'just-ran';
    appendStatement(codeBox, statement, state);
  });

  const rowBefore = document.querySelector('#steps-row').innerHTML;
  const variables = runProgram(linesRun);
  const row = document.querySelector('#steps-row');
  if (row.innerHTML !== rowBefore) {
    [...row.children].forEach((box) => box.classList.add('new'));
  }

  const varsBox = document.querySelector('#step-vars');
  varsBox.textContent = '';
  const shownNow = variableNames.filter((name) => variables[name] !== undefined);
  if (shownNow.length === 0) varsBox.textContent = 'Nothing yet.';
  shownNow.forEach((name) => {
    const line = document.createElement('span');
    line.className = shownBefore.includes(name) ? 'variable' : 'variable new-variable';
    line.textContent = `${name} = ${variableText(variables[name])}`;
    varsBox.append(line);
  });
  shownBefore = shownNow;

  document.querySelector('#step-next').disabled = linesRun >= program.length;
};

document.querySelector('#step-next').addEventListener('click', () => {
  linesRun = linesRun + 1;
  drawStepper();
});

document.querySelector('#step-reset').addEventListener('click', () => {
  linesRun = 0;
  shownBefore = [];
  drawStepper();
});

drawStepper();
