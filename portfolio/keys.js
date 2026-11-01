// Arrow-key navigation for the portfolio.
//
//   Right arrow   next work (from the contact sheet: the first work)
//   Left arrow    previous work (from the contact sheet: the last work)
//   Escape        back to the contact sheet
//
// It follows the links already on the page, so the order always matches portfolio.json
// and needs no changes when works are added or moved.

const targetFor = (key) => {
    const pager = document.querySelectorAll('.pager a');
    const contact = document.querySelectorAll('.contact a');

    if (key === 'Escape') return pager.length ? '#' : null;

    // On a work page, the pager's first link is the previous work and its last is the next.
    const links = pager.length ? pager : contact;
    if (!links.length) return null;
    const link = key === 'ArrowRight' && !pager.length ? links[0]
        : key === 'ArrowLeft' && pager.length ? links[0]
        : links[links.length - 1];
    return link.getAttribute('href');
};

document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) return;
    // Leaves browser shortcuts alone, such as Alt + Left for going back.
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

    const target = targetFor(e.key);
    if (target === null) return;

    e.preventDefault();
    location.hash = target;
});
