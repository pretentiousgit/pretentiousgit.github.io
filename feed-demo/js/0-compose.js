// 0-compose.js
// Example 0: one form, three ways to send it.
// Form, GET: the browser sends the form itself. The page reloads, and the post rides along in the URL.
// Form, POST: the browser sends the form itself, but this server only hands out files.
//   Nothing here can receive a POST, so the browser shows an error page (404 or 405).
// JavaScript: the same POST form, plus one submit listener. preventDefault() stops the
//   browser's form behaviour, and JavaScript sends the post without leaving the page.

const form = document.querySelector('#compose');
const textBox = document.querySelector('#post-text');
const list = document.querySelector('#tweets');

// The same card as the other examples. status is the small grey text after the byline.
const renderPost = (tweet, status) => {
  return `
    <li class="card">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-baseline">
          <strong>${tweet.display_name}</strong>
          <span class="text-body-secondary">${tweet.account_name} · <span class="post-status">${status}</span></span>
        </div>
        <p class="card-text my-2"></p>
      </div>
    </li>
  `;
};

// Put a post at the top of the feed. The text goes in with textContent,
// so whatever someone types shows up as text, never as HTML.
const addPostToFeed = (tweet, status) => {
  list.insertAdjacentHTML('afterbegin', renderPost(tweet, status));
  const card = list.firstElementChild;
  card.querySelector('.card-text').textContent = tweet.post_text;
  return card;
};

const newPost = (text) => {
  return {
    display_name: 'You',
    account_name: '@you',
    post_text: text
  };
};

// Pretend the trip to the server and back takes 2 seconds
const NETWORK_DELAY = 2000;

// JAVASCRIPT: runs when the form is submitted, instead of the browser's own sending.
const sendWithJavaScript = (event) => {
  event.preventDefault();  // "Browser, don't send this form. I've got it."
  log('Submit caught. preventDefault() stopped the page from reloading', 'fast');

  const tweet = newPost(textBox.value);
  const card = addPostToFeed(tweet, 'sending…');
  log('Post shown on the phone right away, marked "sending…"', 'fast');
  form.reset();

  // setTimeout stands in for the slow trip to the server
  setTimeout(() => {
    card.querySelector('.post-status').textContent = 'now';
    log('Server answered: saved', 'slow');
  }, NETWORK_DELAY);
};

// FORM, GET: the page has just reloaded. Did the URL bring a post with it?
// e.g. 0-compose.html?post_text=hello
const showPostFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const text = params.get('post_text');
  if (text) {
    addPostToFeed(newPost(text), 'from the URL, not saved');
    log(`The page reloaded. The URL carried: post_text=${text}`, 'warn');
    log('Nothing was saved. Open the page without the ?... part and the post is gone', 'warn');
  }
  return text;
};

// --- Mode switch. Not part of the lesson: it changes the form and draws the panel on the right. ---

const tryLines = {
  get: 'Post something, then watch the address bar. The page reloads, and your words are in the URL.',
  post: 'Open DevTools → Network and tick "Preserve log", then post. This server only hands out files, so it can’t take a POST: expect a 404 or 405. To come back, click the address bar and press Enter. Reloading would send the POST again.',
  javascript: 'Post something. The page doesn’t reload: JavaScript stops the form, shows your post right away, and saves it in the background.'
};

const setMode = (mode) => {
  // JavaScript mode keeps the POST form and adds one listener
  form.method = mode === 'get' ? 'get' : 'post';
  if (mode === 'javascript') {
    form.addEventListener('submit', sendWithJavaScript);
  } else {
    form.removeEventListener('submit', sendWithJavaScript);
  }
  document.querySelector('#try-line').textContent = tryLines[mode];
  showFormCode(mode);
};

// The form's HTML as it is right now, without the Bootstrap classes
const showFormCode = (mode) => {
  let code = `<form action="${form.getAttribute('action')}" method="${form.getAttribute('method')}">
  <textarea name="post_text"></textarea>
  <button type="submit">Post</button>
</form>`;
  if (mode === 'javascript') {
    code += `\n\n<script>\n  form.addEventListener('submit', sendWithJavaScript);\n</script>`;
  }
  document.querySelector('#code-form').textContent = code;
};

document.querySelectorAll('[name="send-mode"]').forEach((radio) => {
  radio.addEventListener('change', () => setMode(radio.value));
});

list.innerHTML = tweets.map((tweet) => renderPost(tweet, tweet.posted_at)).join('');
list.querySelectorAll('.card-text').forEach((paragraph, index) => {
  paragraph.textContent = tweets[index].post_text;
});

log('Page loaded', 'fast');

// Only a GET submit brings a post back in the URL, so come back in GET mode
if (showPostFromUrl()) {
  document.querySelector('[name="send-mode"][value="get"]').checked = true;
}
setMode(document.querySelector('[name="send-mode"]:checked').value);

showCode(sendWithJavaScript, '#code-javascript');
showCode(showPostFromUrl, '#code-url');
