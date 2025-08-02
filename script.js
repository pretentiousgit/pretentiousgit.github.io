
const logoPath = document.querySelector('.st0');
const overlay = document.getElementById("particleOverlay");
const particleGroup = overlay.querySelector("g[mask]"); // Get the masked group
const particles = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseMove = 0;
let particleId = 0;
let isOverYellowPath = false;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Convert screen coordinates to SVG coordinates
const getOverlayCoords = (e) => {
  const rect = overlay.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  
  const svgX = (clientX - rect.left) * (63 / rect.width);
  const svgY = (clientY - rect.top) * (72 / rect.height);
  return { x: svgX, y: svgY };
};

// Global mouse tracking with hit detection
document.addEventListener("mousemove", (e) => {
  // Check what element is under the mouse
  if (logoPath) {
    // Convert screen coords to SVG coords and test the path
    const point = logoPath.ownerSVGElement.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(logoPath.getScreenCTM().inverse());
    
    isOverYellowPath = logoPath.isPointInFill(svgPoint);
    console.log('Path hit!', isOverYellowPath)
     if (isOverYellowPath) {
        const coords = getOverlayCoords(e);
        mouseX = coords.x;
        mouseY = coords.y;
        lastMouseMove = Date.now();
    }
  }
});

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  
  if (logoPath) {
    // Use same hit detection logic as mouse
    const point = logoPath.ownerSVGElement.createSVGPoint();
    point.x = touch.clientX;
    point.y = touch.clientY;
    const svgPoint = point.matrixTransform(logoPath.getScreenCTM().inverse());
    
    isOverYellowPath = logoPath.isPointInFill(svgPoint);
    
    if (isOverYellowPath) {
      // Convert touch coords using existing function
      const coords = getOverlayCoords(touch);
      mouseX = coords.x;
      mouseY = coords.y;
      lastMouseMove = Date.now();
    }
  }
}, { passive: true });

// Scroll-triggered particle bursts
let lastScrollTime = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastScrollTime > 500) { // Throttle to every 500ms
    const xCore = randomInt(5, 31.5);
    const yCore = randomInt(12, 72);

    // Create a small burst
    if (particles.length < 20) { // Don't overwhelm with particles
      createParticle(xCore, yCore); // Center of 63x72 viewBox
      createParticle(xCore, yCore);
    }
    lastScrollTime = now;
  }
}, { passive: true });

// Create a new particle
const createParticle = (x, y) => {
  const particle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  // Random offset from mouse position
  const offsetX = (Math.random() - 0.5) * 8;
  const offsetY = (Math.random() - 0.5) * 8;

  const particleData = {
    id: particleId++,
    element: particle,
    x: x + offsetX,
    y: y + offsetY,
    baseVelX: (Math.random() - 0.5) * 0.5, // Smaller base velocity for logo scale
    baseVelY: (Math.random() - 0.5) * 0.5,
    sineOffset: Math.random() * Math.PI * 2,
    sineFreq: 0.02 + Math.random() * 0.03,
    sineAmp: 3 + Math.random() * 5, // Smaller amplitude for logo scale
    age: 0,
    maxAge: 120 + Math.random() * 80,
    size: 0.5 + Math.random() * 1, // Smaller particles for logo scale
  };

  // Set initial attributes
  particle.setAttribute("cx", particleData.x);
  particle.setAttribute("cy", particleData.y);
  particle.setAttribute("r", particleData.size);
  particle.setAttribute("opacity", 0.8);
  particle.classList.add("particle");

  particleGroup.appendChild(particle);
  particles.push(particleData);
};

// Update particle positions with sine wave movement
const updateParticles = () => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age++;

    // Calculate sine wave offset perpendicular to base velocity
    const sineValue = Math.sin(p.age * p.sineFreq + p.sineOffset);

    // Create perpendicular vector to base velocity
    const velLength = Math.sqrt(
      p.baseVelX * p.baseVelX + p.baseVelY * p.baseVelY
    );
    const perpX = velLength > 0 ? -p.baseVelY / velLength : 1;
    const perpY = velLength > 0 ? p.baseVelX / velLength : 0;

    // Apply base velocity + sine wave modulation
    p.x += p.baseVelX + perpX * sineValue * p.sineAmp * 0.02;
    p.y += p.baseVelY + perpY * sineValue * p.sineAmp * 0.02;

    // Fade out over time
    const opacity = Math.max(0, 0.8 * (1 - p.age / p.maxAge));

    // Update visual properties
    p.element.setAttribute("cx", p.x);
    p.element.setAttribute("cy", p.y);
    p.element.setAttribute("opacity", opacity);

    // Remove if too old or out of bounds (with some padding)
    if (p.age >= p.maxAge || p.x < -10 || p.x > 73 || p.y < -10 || p.y > 82) {
      particleGroup.removeChild(p.element);
      particles.splice(i, 1);
    }
  }
};

// Spawn particles every 100ms if mouse is over yellow path
setInterval(() => {
  if (
    Date.now() - lastMouseMove < 200 &&
    isOverYellowPath &&
    mouseX > 0 &&
    mouseY > 0
  ) {
    createParticle(mouseX, mouseY);
  }
}, 100);

// Animation loop
const animate = () => {
  updateParticles();
  requestAnimationFrame(animate);
};

animate();
