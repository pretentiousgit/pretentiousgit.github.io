// One entry per design system. To add another, add an entry here and
// drop its page into forms/ — the side menu builds itself from this list.
// grid says what "Show grids" can reveal: 'columns' for a column grid,
// 'module' for Apple's 44pt module. Those pages load grid-overlay.js, which
// listens for the button. Pages without it have nothing to show.
// viewports marks pages whose layout follows the browser's width, so the
// phone and desktop buttons appear above them.
// Each system's own breakpoints, largest first, for the pages whose layout
// follows the browser's width. columnsFrom names the breakpoint at which the
// form's column classes switch on (col-md-* and tablet:grid-col-*).
const bootstrapViewports = {
  system: 'Bootstrap',
  columnsFrom: 'md',
  breakpoints: [
    ['xxl', 1400],
    ['xl', 1200],
    ['lg', 992],
    ['md', 768],
    ['sm', 576],
    ['xs', 0],
  ],
};

const uswdsViewports = {
  system: 'USWDS',
  columnsFrom: 'tablet',
  breakpoints: [
    ['widescreen', 1400],
    ['desktop-lg', 1200],
    ['desktop', 1024],
    ['tablet-lg', 880],
    ['tablet', 640],
    ['mobile-lg', 480],
    ['mobile', 0],
  ],
};

const systems = [
  {
    id: 'unstyled',
    label: 'Unstyled',
    file: 'forms/unstyled.html',
    note: 'No stylesheet at all. Every control is drawn by the browser, as defined in the HTML standard.',
    guideline: 'HTML Standard: Forms',
    url: 'https://html.spec.whatwg.org/multipage/forms.html',
  },
  {
    id: 'uswds',
    grid: 'columns',
    viewports: uswdsViewports,
    label: 'USWDS',
    file: 'forms/uswds.html',
    note: 'The U.S. Web Design System, using the official stylesheet. Same native inputs as the unstyled form, with usa-* classes added.',
    guideline: 'USWDS: Components',
    url: 'https://designsystem.digital.gov/components/overview/',
  },
  {
    id: 'apple',
    grid: 'module',
    label: 'Apple HIG',
    file: 'forms/apple.html',
    note: 'Apple’s Human Interface Guidelines. Apple ships no web stylesheet, so this is the unstyled markup plus one hand-written CSS file.',
    guideline: 'Human Interface Guidelines: Components',
    url: 'https://developer.apple.com/design/human-interface-guidelines/components',
  },
  {
    id: 'material',
    grid: 'columns',
    label: 'Material',
    file: 'forms/material.html',
    note: 'Google’s Material Design 3, using the official Material Web components. The native inputs are replaced by md-* custom elements.',
    guideline: 'Material Design 3: Components',
    url: 'https://m3.material.io/components',
  },
  {
    id: 'bootstrap',
    grid: 'columns',
    viewports: bootstrapViewports,
    label: 'Bootstrap',
    file: 'forms/bootstrap.html',
    note: 'Bootstrap 5, using the official stylesheet and nothing else. Same native inputs as the unstyled form, with Bootstrap’s form and 12-column grid classes added.',
    guideline: 'Bootstrap: Forms',
    url: 'https://getbootstrap.com/docs/5.3/forms/overview/',
  },
  {
    id: 'spotify-style',
    grid: 'columns',
    viewports: bootstrapViewports,
    label: 'Spotify-style',
    file: 'forms/spotify-style.html',
    note: 'A style study, not Spotify’s code: the Bootstrap page with one extra stylesheet imitating Spotify’s look. Archived copies of spotify.com from 2014–2016 use Bootstrap’s grid class names.',
    guideline: 'spotify.com in June 2015 (Internet Archive)',
    url: 'https://web.archive.org/web/20150601000000/https://www.spotify.com/us/',
  },
];

const list = document.querySelector('#system-list');
const stage = document.querySelector('#stage');
const box = document.querySelector('#guideline');
const note = document.querySelector('#guideline-note');
const link = document.querySelector('#guideline-link');
const gridButton = document.querySelector('#grid-toggle');
const gridLegends = document.querySelectorAll('.grid-legend');
const gridHint = document.querySelector('#grid-hint');
const gridSummary = document.querySelector('#grid-summary');

const main = document.querySelector('main');
const viewportTools = document.querySelector('#viewport-tools');
const viewportButtons = document.querySelectorAll('[data-viewport]:is(button)');
const viewportReadout = document.querySelector('#viewport-readout');

let current = systems[0];
let gridOn = false;
let viewport = 'desktop';

// Name the breakpoint the form is seeing at the frame's current width
const updateReadout = () => {
  if (!current.viewports) return;

  const { system, columnsFrom, breakpoints } = current.viewports;
  const width = stage.clientWidth;
  const [name] = breakpoints.find(([, min]) => width >= min);
  const [, columnsMin] = breakpoints.find(([breakpoint]) => breakpoint === columnsFrom);
  const layout = width >= columnsMin
    ? 'columns sit side by side'
    : `below ${columnsFrom} (${columnsMin}), so columns stack`;

  viewportReadout.textContent = `${width} wide · ${system} breakpoint ${name} · ${layout}`;
};

// Size the frame as a phone or a desktop window, or leave it filling the
// page for forms that do not use this
const updateViewport = () => {
  const available = Boolean(current.viewports);

  main.classList.toggle('has-viewports', available);
  viewportTools.hidden = !available;
  stage.dataset.viewport = available ? viewport : '';
  viewportButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.viewport === viewport));
  });
  updateReadout();
};

viewportButtons.forEach((button) => {
  button.addEventListener('click', () => {
    viewport = button.dataset.viewport;
    updateViewport();
  });
});

new ResizeObserver(updateReadout).observe(stage);

// The form lives in its own frame, so the button cannot restyle it directly.
// It sends the frame a message; grid-overlay.js in that page does the rest.
const updateGrid = () => {
  const available = Boolean(current.grid);

  gridButton.disabled = !available;
  gridButton.textContent = gridOn && available ? 'Hide grids' : 'Show grids';
  gridButton.setAttribute('aria-pressed', String(gridOn && available));
  gridLegends.forEach((legend) => {
    legend.hidden = !(gridOn && legend.dataset.kind === current.grid);
  });
  gridHint.hidden = available;
  gridSummary.hidden = true;

  stage.contentWindow.postMessage({ type: 'show-grid', on: gridOn }, '*');
};

gridButton.addEventListener('click', () => {
  gridOn = !gridOn;
  updateGrid();
});

// A newly loaded form starts without the overlay, so tell it the current state
stage.addEventListener('load', updateGrid);

// A form may answer with a one-line summary of what it measured
window.addEventListener('message', ({ data, source }) => {
  if (data?.type === 'grid-summary' && source === stage.contentWindow && gridOn) {
    gridSummary.textContent = data.text;
    gridSummary.hidden = false;
  }
});

const show = (system) => {
  current = system;
  updateViewport();
  stage.src = system.file;
  stage.title = `${system.label} form`;

  list.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-current', String(button.dataset.id === system.id));
  });

  note.textContent = system.note;
  link.textContent = system.guideline;
  link.href = system.url;
  box.hidden = false;

  // Remember the choice in the address bar so a reload keeps it
  history.replaceState(null, '', `#${system.id}`);
};

systems.forEach((system) => {
  const item = document.createElement('li');
  const button = document.createElement('button');

  button.type = 'button';
  button.textContent = system.label;
  button.dataset.id = system.id;
  button.addEventListener('click', () => show(system));

  item.append(button);
  list.append(item);
});

const requested = systems.find(({ id }) => id === location.hash.slice(1));
show(requested ?? systems[0]);
