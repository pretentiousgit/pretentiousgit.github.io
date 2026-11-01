// Fills the homepage's sections from home.json, so saving that file and refreshing is enough.
// The empty <section> shells stay in index.html because nav.js switches between them.
//
// Each section in home.json is a list of blocks, drawn in order:
//   { "p": "A paragraph." }
//   { "h4": "A small heading" }
//   { "list": ["One item", "Another item"] }
//   { "entry": { "title": "...", "url": "...", "also": [{ "title": "...", "url": "..." }], "text": "..." } }
// Text can use [links](url) and *italics*.

const SHOW_LOADER_AFTER_MS = 200;

const esc = (text = '') => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const inline = (text = '') => esc(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>');

const titleLink = ({ title, url }) => `<a class="title" href="${esc(url)}">${inline(title)}</a>`;

const block = (b) => {
    if (b.h4) return `<h4>${inline(b.h4)}</h4>`;
    if (b.list) return `<ul>${b.list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`;
    if (b.entry) {
        const { title, url, also = [], text } = b.entry;
        return `<p>${[{ title, url }, ...also].map(titleLink).join('')} ${inline(text)}</p>`;
    }
    return `<p>${inline(b.p)}</p>`;
};

// A fast load shows no loader at all; a slow one gets the logo and its bubbles.
const startLoader = () => {
    let bubbles;
    const timer = setTimeout(() => {
        document.body.classList.add('loading');
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches && typeof createParticle === 'function') {
            bubbles = setInterval(() => createParticle(8 + Math.random() * 40, 12 + Math.random() * 48), 90);
        }
    }, SHOW_LOADER_AFTER_MS);
    return () => {
        clearTimeout(timer);
        clearInterval(bubbles);
        document.body.classList.remove('loading');
    };
};

const start = async () => {
    const stopLoader = startLoader();
    try {
        // no-cache asks the server whether the file changed, so a saved edit shows on refresh.
        const response = await fetch('home.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`home.json: ${response.status}`);
        const { subtitle, sections } = await response.json();
        document.querySelector('header h2').textContent = subtitle;
        Object.entries(sections).forEach(([id, blocks]) => {
            document.getElementById(id).innerHTML = blocks.map(block).join('');
        });
    } catch (error) {
        console.error(error);
        document.getElementById('init').innerHTML = '<p>This page couldn’t load. Please try refreshing.</p>';
    }
    stopLoader();
    // nav.js measures the page on resize to decide whether to show its back-to-top button.
    window.dispatchEvent(new Event('resize'));
};

start();
