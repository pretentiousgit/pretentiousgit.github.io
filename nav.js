const sections = document.querySelectorAll('section');

const optsArray = Array.from(sections).map(item => item.id);
console.log(sections);

const showSection = (target) => {
    console.log(target);
    sections.forEach(section => {
        section.classList.toggle('active', section.id === target);
    });
}

document.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('a');
    const href = clickedLink.getAttribute('href');

    if (clickedLink.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = href.slice(1);
        showSection(target);
    }
});