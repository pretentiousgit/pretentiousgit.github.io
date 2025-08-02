const offset1 = document.getElementById("offset1");
const offset2 = document.getElementById("offset2");
const heatContainer = document.getElementById("heatContainer");

const offsetAnimDuration = 8000;
const offsetStart = 1;
const offsetEnd = -1;
const fps = 60;
const diff = 1000 / fps / offsetAnimDuration;

let isAnimating = false;

function getOffset(el) {
  return Number(el.getAttribute("dy"));
}

function setOffset(el, val) {
  return el.setAttribute("dy", val.toString());
}

function animOffsets() {
  if (!isAnimating) return;

  let offset1Value = getOffset(offset1) - diff;
  let offset2Value = getOffset(offset2) - diff;

  if (offset1Value < offsetEnd) {
    offset1Value = offsetStart;
  }
  if (offset2Value < offsetEnd) {
    offset2Value = offsetStart;
  }

  setOffset(offset1, offset1Value);
  setOffset(offset2, offset2Value);

  window.requestAnimationFrame(animOffsets);
}

function startHeatWave() {
  if (isAnimating) return;
  isAnimating = true;
  window.requestAnimationFrame(animOffsets);
}

function stopHeatWave() {
  isAnimating = false;
}

// Desktop hover events
heatContainer.addEventListener("mouseenter", startHeatWave);
heatContainer.addEventListener("mouseleave", stopHeatWave);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Set initial offset values
  setOffset(offset1, offsetStart);
  setOffset(offset2, offsetStart - 0.5);
});
