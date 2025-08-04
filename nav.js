const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');
const reset = document.querySelector('#reset');

const links = Array.from(navLinks);
const optsArray = Array.from(sections).map(item => item.id);

console.log(sections);
console.log(navLinks);

const showSection = (target) => {
    console.log(target);
    sections.forEach(section => {
        section.classList.toggle('active', section.id === target);
        section.classList.toggle('hidden', section.id !== target);
    });
}

const updateScrollableStatus = () => {
    const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 50;

    console.log('isScrollable', isScrollable)
    
    // seems fake
    window.setTimeout(() => {
        document.documentElement.classList.toggle('is-scrollable', isScrollable);
    }, 10)

}

document.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('a');
    if(!clickedLink) { return; }

    const href = clickedLink.getAttribute('href');
    console.log(clickedLink);

    links.forEach(link => link.classList.remove('active'))

    if (clickedLink.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = href.slice(1);
        showSection(target);

        updateScrollableStatus()
        history.pushState(null, '', `#${target}`);
    }

    if (!clickedLink.href.includes('#init')) {
        clickedLink.classList.toggle('active')
    } else {
        links.forEach(link => link.classList.remove('active'))
    }
});

reset.addEventListener('click', () => {
    setTimeout(() => {
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    }, 10);
})

document.addEventListener( 'DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    console.log('hash', hash);
    if (hash) {
        links.forEach(link => link.href.includes(hash) ? link.classList.toggle('active') : link.classList.remove('active'))
        showSection(hash);
        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 10);
    } else {
        // Show default section if no hash
        showSection('init'); // or whatever your default is
    }
})

document.addEventListener('DOMContentLoaded', updateScrollableStatus);
window.addEventListener('resize', updateScrollableStatus);