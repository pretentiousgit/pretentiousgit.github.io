// Loaded by every form that is built on a layout grid. The "Show grids"
// button in the side menu sends a message; this switches a class on the
// page, and css/grid-overlay.css does the highlighting.
window.addEventListener('message', ({ data }) => {
  if (data?.type === 'show-grid') {
    document.documentElement.classList.toggle('show-grid', data.on);
  }
});
