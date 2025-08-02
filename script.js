const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = e.target.getAttribute('href').slice(1);
    showSection(target);
    console.log(target);
  });
});