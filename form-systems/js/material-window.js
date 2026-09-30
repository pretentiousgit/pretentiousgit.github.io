// Resizes the preview window on the Material page. The layout itself is
// pure CSS: material.css reacts to the window's width, not to this script.
const device = document.querySelector('#device');
const chips = document.querySelectorAll('md-filter-chip[data-width]');

const resize = (chosen) => {
  device.style.width = chosen.dataset.width;
  chips.forEach((chip) => {
    chip.selected = chip === chosen;
  });
};

chips.forEach((chip) => chip.addEventListener('click', () => resize(chip)));
