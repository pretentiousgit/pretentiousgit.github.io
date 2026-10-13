// timeline.js
// Helpers for the side panel. Not part of the lesson: this just shows
// students WHEN things happen, so the timing is visible instead of invisible.

let startTime = performance.now();

// Start counting from zero again (used by the Reload buttons)
const resetClock = () => {
  startTime = performance.now();
  document.querySelector('#timeline').innerHTML = '';
};

// Add a line to the timeline, e.g. "+  812 ms  photo for p3 arrived"
// kind is one of: 'fast', 'slow', 'error', 'warn'
const log = (message, kind = 'slow') => {
  const elapsed = Math.round(performance.now() - startTime);
  const item = document.createElement('li');
  item.className = kind;
  item.innerHTML = `<span class="ms">+${elapsed} ms</span> `;
  item.append(message);
  document.querySelector('#timeline').append(item);
  console.log(`+${elapsed} ms`, message);
};

// Show the real source code of a function in a <pre> on the page.
// Because it reads the function itself, the panel can never be out of date.
const showCode = (fn, selector) => {
  document.querySelector(selector).textContent = fn.toString();
};
