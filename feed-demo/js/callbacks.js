// callbacks.js
// Callbacks: a function you hand to another function, so that function can call it.
// The toast uses two: the click callback (the browser calls it when you click)
// and the setTimeout callback (called 3 seconds later, after showToast has finished).

// ---------- The posts, each with a Save button ----------

const renderPost = (tweet, index) => {
  return `
    <li class="card" data-index="${index}">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-baseline">
          <strong>${tweet.display_name}</strong>
          <span class="text-body-secondary">${tweet.account_name} · ${tweet.posted_at}</span>
        </div>
        <p class="card-text my-2">${tweet.post_text}</p>
        <button class="btn btn-outline-primary btn-sm save-button" type="button">Save</button>
      </div>
    </li>
  `;
};

document.querySelector('#tweets').innerHTML = tweets.map(renderPost).join('');

// ---------- Step 1: the toast, two ways ----------

// A. Each call makes its own toast. The setTimeout callback remembers which one is its own.
const showToastOwn = (message) => {
  const toast = document.createElement('p');
  toast.className = 'toast-note';
  toast.textContent = message;
  document.querySelector('#toasts').append(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// B. One shared toast variable, outside the function. Every call overwrites it,
// so every callback removes whichever toast is in it when the 3 seconds are up.
let sharedToast;

const showToastShared = (message) => {
  sharedToast = document.createElement('p');
  sharedToast.className = 'toast-note';
  sharedToast.textContent = message;
  document.querySelector('#toasts').append(sharedToast);

  setTimeout(() => {
    sharedToast.remove();
  }, 3000);
};

// Which version the Save buttons use. The switch on the right changes it.
let showToast = showToastOwn;

// The click callback: the browser calls this when anything in the list is clicked
const onSaveClick = (event) => {
  const button = event.target.closest('.save-button');
  if (button) {
    const tweet = tweets[button.closest('.card').dataset.index];
    showToast(`Saved ${tweet.display_name}'s post`);
  }
};

document.querySelector('#tweets').addEventListener('click', onSaveClick);

// ---------- Step 2: now or later ----------

// forEach calls its callback right now, once per item
const runForEach = () => {
  const colors = ['red', 'yellow', 'blue'];
  log('#log-foreach', 'Before forEach');
  colors.forEach((color) => {
    log('#log-foreach', `The callback ran for ${color}`);
  });
  log('#log-foreach', 'After forEach');
};

// setTimeout calls its callback later
const runSetTimeout = () => {
  log('#log-timeout', 'Before setTimeout');
  setTimeout(() => {
    log('#log-timeout', 'The callback ran');
  }, 1000);
  log('#log-timeout', 'After setTimeout');
};

// ---------- Step 3: what a later callback can and can't do ----------

// It reads its variables when it runs, not when it was written
const readsWhenItRuns = () => {
  let message = 'the message when the callback was written';
  setTimeout(() => {
    log('#log-reads', `The callback sees: ${message}`);
  }, 1000);
  message = 'the message after it was changed';
  log('#log-reads', 'Changed the message');
};

// A return inside a later callback goes nowhere: getColorLater has already finished
const getColorLater = () => {
  setTimeout(() => {
    return 'blue';
  }, 500);
};

const tryToGetColor = () => {
  const color = getColorLater();
  log('#log-return', `getColorLater() gave back: ${color}`);
};

// ---------- Buttons ----------

[
  ['#run-foreach', runForEach, '#log-foreach'],
  ['#run-timeout', runSetTimeout, '#log-timeout'],
  ['#run-reads', readsWhenItRuns, '#log-reads'],
  ['#run-return', tryToGetColor, '#log-return']
].forEach(([buttonSelector, run, logSelector]) => {
  document.querySelector(buttonSelector).addEventListener('click', () => {
    startLog(logSelector);
    run();
  });
});

// ---------- Not part of the lesson: version switch, logs and code boxes ----------

// Both versions are shown as "const showToast", the name the click callback uses
const showToastCode = () => {
  const prefix = showToast === showToastShared ? 'let sharedToast;\n\n' : '';
  document.querySelector('#code-toast').textContent = `${prefix}const showToast = ${showToast.toString()};`;
};

document.querySelectorAll('[name="toast-version"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    showToast = document.querySelector('#toast-shared').checked ? showToastShared : showToastOwn;
    showToastCode();
  });
});

document.querySelector('#clear-toasts').addEventListener('click', () => {
  document.querySelector('#toasts').innerHTML = '';
});

// Each log keeps its own clock, so two demos running at once don't mix up their times
const logStarts = {};

function startLog(selector) {
  logStarts[selector] = performance.now();
  document.querySelector(selector).innerHTML = '';
}

function log(selector, text) {
  const line = document.createElement('li');
  line.innerHTML = `<span class="log-time">+${Math.round(performance.now() - logStarts[selector])} ms</span> `;
  line.append(text);
  document.querySelector(selector).append(line);
}

// Show a function's real source, with its name, e.g. const runForEach = () => { ... };
function showNamedCode(fn, selector) {
  document.querySelector(selector).textContent = `const ${fn.name} = ${fn.toString()};`;
}

showToastCode();
showNamedCode(onSaveClick, '#code-click');
showNamedCode(runForEach, '#code-foreach');
showNamedCode(runSetTimeout, '#code-timeout');
showNamedCode(readsWhenItRuns, '#code-reads');
document.querySelector('#code-return').textContent =
  `const getColorLater = ${getColorLater.toString()};\n\nconst tryToGetColor = ${tryToGetColor.toString()};`;
