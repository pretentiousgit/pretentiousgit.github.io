// Apple tab only. When "Show grids" is on, measure every control against the
// 44pt module: mark it as a fit or a miss, and pin a note with its height.
const MODULE = 44;
const screen = document.querySelector('main');

const controls = () => [
  ...screen.querySelectorAll('input:not([type="radio"], [type="checkbox"]), select, textarea, button'),
  // Each toggle row is a touch target; the segmented control counts once
  ...screen.querySelectorAll('fieldset:has([type="checkbox"]) > div'),
  ...screen.querySelectorAll('fieldset:has([type="radio"]) > div:last-of-type'),
];

const clear = () => {
  screen.querySelectorAll('.module-note').forEach((note) => note.remove());
  screen.querySelectorAll('[data-module]').forEach((el) => el.removeAttribute('data-module'));
};

const describe = (height) => {
  const off = height - Math.max(1, Math.round(height / MODULE)) * MODULE;

  if (off === 0) return `${height} ✓`;
  return off < 0 ? `${height} · ${-off} short` : `${height} · ${off} over`;
};

const check = () => {
  clear();

  // Positions are measured from the top-left of the scrolling content
  const frame = screen.getBoundingClientRect();
  const originTop = frame.top + screen.clientTop - screen.scrollTop;
  const originLeft = frame.left + screen.clientLeft;

  const results = controls().map((control) => {
    const box = control.getBoundingClientRect();
    const height = Math.round(box.height);
    const top = Math.round(box.top - originTop);
    const fits = height % MODULE === 0;

    // The segmented control is three pieces; mark them all
    const pieces = control.matches('fieldset:has([type="radio"]) > div')
      ? control.parentElement.querySelectorAll(':scope > div')
      : [control];
    pieces.forEach((piece) => {
      piece.dataset.module = fits ? 'fit' : 'miss';
    });

    const note = document.createElement('span');
    note.className = 'module-note';
    note.dataset.module = fits ? 'fit' : 'miss';
    note.textContent = describe(height);
    note.style.top = `${top}px`;
    note.style.left = `${box.right - originLeft - 6}px`;
    screen.append(note);

    return { fits, onLine: top % MODULE === 0 };
  });

  const fitting = results.filter(({ fits }) => fits).length;
  const onLine = results.filter(({ onLine }) => onLine).length;

  window.parent.postMessage({
    type: 'grid-summary',
    text: `${fitting} of ${results.length} controls are a whole number of 44pt modules tall. ${onLine} of ${results.length} start on a 44pt line.`,
  }, '*');
};

window.addEventListener('message', ({ data }) => {
  if (data?.type !== 'show-grid') return;

  if (data.on) {
    check();
  } else {
    clear();
  }
});
