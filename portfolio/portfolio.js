// Draws the portfolio in the browser from portfolio.json, so saving that file and refreshing is enough.
// assets.json is generated: it lists the web sizes and placeholder for each image.
// An image that isn't in assets.json yet is loaded straight from img/<file>.

const SIZES = {
    lead: '(width < 758px) 100vw, min(70vw, 960px)',
    half: '(width < 758px) 100vw, min(35vw, 480px)',
    third: '(width < 758px) 100vw, min(24vw, 320px)',
    strip: '(width < 758px) 33vw, min(14vw, 190px)',
    sheet: '(width < 758px) 50vw, min(20vw, 290px)',
};
const SECTION_SIZES = { strip: 'strip', even: 'third', side: 'half', process: 'half' };
const MIN_LOADER_MS = 700;
const MAX_IMAGE_WAIT_MS = 3000;

const main = document.querySelector('main');
const footer = document.querySelector('footer');
const startedAt = performance.now();
let data;
let assets = {};

const esc = (text = '') => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// The same small formatting as the rest of the file: [text](url) and *italics*.
const inline = (text = '') => esc(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>');

const paragraphs = (items = [], cls = '') => items
    .map((p) => `<p${cls ? ` class="${cls}"` : ''}>${inline(p)}</p>`)
    .join('');

const frame = (image, sizes, { eager = false, largest = null, position = null } = {}) => {
    const asset = assets[image.file];
    const cls = image.fit === 'contain' ? ' contain' : '';
    const pos = position ? `style="object-position:${esc(position)}" ` : '';
    const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
    const alt = `alt="${esc(image.alt)}"`;
    if (!asset) {
        return `<div class="frame${cls}"><img src="img/${esc(image.file)}" ${pos}${alt} decoding="async" ${load}></div>`;
    }
    const widths = asset.widths.filter((w) => !largest || w <= largest);
    const use = widths.length ? widths : asset.widths.slice(0, 1);
    const url = (w) => `img/${asset.stem}-${w}.webp`;
    return `<div class="frame${cls}" style="--ph:url(${asset.placeholder});aspect-ratio:${asset.width}/${asset.height}">`
        + `<img src="${url(use[use.length - 1])}" srcset="${use.map((w) => `${url(w)} ${w}w`).join(', ')}" `
        + `sizes="${SIZES[sizes]}" ${pos}width="${asset.width}" height="${asset.height}" ${alt} decoding="async" ${load}></div>`;
};

const videoLine = (v) => `<p class="meta link">Video: <a href="${esc(v.url)}">${esc(v.label)}</a> (${esc(v.duration)})</p>`;

const videoEmbed = (v, heading) => {
    const match = /\/shorts\/([\w-]+)/.exec(v.url);
    if (!match) return '';
    return `<iframe class="video" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="${esc(`${heading}: ${v.label}`)}" `
        + 'loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
};

const section = (s, first) => {
    const layout = s.layout || 'lead';
    const images = s.images || [];
    const videos = s.videos || [];
    const tag = first ? 'h3' : 'h4';
    const words = [
        s.heading ? `<${tag}>${inline(s.heading)}</${tag}>` : '',
        s.credits ? `<p class="meta">${s.credits.map(inline).join('<br>')}</p>` : '',
        paragraphs(s.paragraphs),
        videos.map(videoLine).join(''),
        paragraphs(s.links, 'meta link'),
        paragraphs(s.notes, 'meta'),
        videos.map((v) => videoEmbed(v, s.heading)).join(''),
    ].join('');
    const figures = images.map((image, i) => {
        const key = SECTION_SIZES[layout] || (i === 0 ? 'lead' : 'third');
        const caption = image.caption ? `<figcaption>${inline(image.caption)}</figcaption>` : '';
        return `<figure>${frame(image, key, { eager: first && i === 0 })}${caption}</figure>`;
    }).join('');
    const embed = s.embed
        ? `<iframe class="app" src="${esc(s.embed.src)}" title="${esc(s.embed.title)}" loading="lazy"></iframe>`
        : '';
    const group = s.caption ? `<figcaption class="group">${inline(s.caption)}</figcaption>` : '';
    return `<div class="work"><div class="words">${words}</div>`
        + `<div class="photos layout-${esc(layout)} rest-${Math.max(0, images.length - 1)}">${figures}${embed}${group}</div></div>`;
};

// On the contact sheet, a title with a slash breaks after it: "Minor Mending /" then "Pocket Hatch".
const sheetTitle = (title) => title.split(/\s*\/\s*/).map(inline).join(' /<br>');

const contactSheet = () => {
    const cells = data.works.map((w, i) => {
        const image = { file: w.thumbnail, alt: '', fit: w.thumbnailFit };
        const shot = frame(image, 'sheet', { eager: i < 4, largest: 480, position: w.thumbnailPosition });
        return `<li><a href="#${esc(w.slug)}">${shot}<span class="slug">`
            + `<span class="no">${String(i + 1).padStart(2, '0')}</span><span class="name">${sheetTitle(w.title)}</span>`
            + `<span class="yr">${esc(w.years)}</span></span></a></li>`;
    }).join('');
    return `<div class="statement"><p class="lede">${inline(data.statement.lede)}</p>${paragraphs(data.statement.paragraphs)}</div>`
        + `<ul class="contact">${cells}</ul>`;
};

const workPage = (i) => {
    const w = data.works[i];
    const count = data.works.length;
    const prev = data.works[(i - 1 + count) % count];
    const next = data.works[(i + 1) % count];
    return w.sections.map((s, n) => section(s, n === 0)).join('')
        + `<div class="pager"><a href="#${esc(prev.slug)}">&larr; ${inline(prev.title)}</a>`
        + `<a href="#">project list</a><a href="#${esc(next.slug)}">${inline(next.title)} &rarr;</a></div>`;
};

// Photos stay hidden over their tiny placeholder until they have loaded, then fade in.
const revealWhenLoaded = () => {
    main.querySelectorAll('.frame img').forEach((img) => {
        const show = () => img.closest('.frame').classList.add('loaded');
        if (img.complete) {
            show();
        } else {
            img.addEventListener('load', show);
            img.addEventListener('error', show);
        }
    });
};

const render = () => {
    const slug = decodeURIComponent(location.hash.slice(1));
    const index = data.works.findIndex((w) => w.slug === slug);
    const { title, subtitle } = data.site;
    main.innerHTML = index >= 0 ? workPage(index) : contactSheet();
    document.title = index >= 0
        ? `${data.works[index].title}, ${data.works[index].years}: ${title}`
        : `${title}: ${subtitle}`;
    document.querySelector('.home-title').textContent = title;
    document.querySelector('.home-subtitle').textContent = subtitle;
    footer.innerHTML = paragraphs(data.site.credits, 'meta');
    revealWhenLoaded();
    window.scrollTo(0, 0);
};

// The loader: bubbles.js only reacts to the pointer, so this keeps them rising inside the logo.
const startBubbles = () => {
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || typeof createParticle !== 'function') return () => {};
    const timer = setInterval(() => {
        createParticle(8 + Math.random() * 40, 12 + Math.random() * 48);
    }, 90);
    return () => clearInterval(timer);
};

const firstImages = () => {
    const images = [...main.querySelectorAll('img[fetchpriority="high"]')];
    const loaded = images.map((img) => (img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
    })));
    const timeout = new Promise((resolve) => { setTimeout(resolve, MAX_IMAGE_WAIT_MS); });
    return Promise.race([Promise.all(loaded), timeout]);
};

const fetchJson = async (path) => {
    // no-cache asks the server whether the file changed, so a saved edit shows on refresh.
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
};

const start = async () => {
    const stopBubbles = startBubbles();
    try {
        const [content, generated] = await Promise.all([
            fetchJson('portfolio.json'),
            fetchJson('assets.json').catch(() => ({})),
        ]);
        data = content;
        assets = generated;
        render();
        window.addEventListener('hashchange', render);
        await firstImages();
        const left = MIN_LOADER_MS - (performance.now() - startedAt);
        if (left > 0) await new Promise((resolve) => { setTimeout(resolve, left); });
    } catch (error) {
        console.error(error);
        main.innerHTML = '<p class="problem">This portfolio couldn’t load. Please try refreshing the page.</p>';
    }
    stopBubbles();
    document.body.classList.remove('loading');
};

start();
