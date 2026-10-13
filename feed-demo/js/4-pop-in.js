// 4-pop-in.js
// Example 4: one post, popping in over time.
// The phone asks the server for each key of the post separately.
// The answers come back in stages: byline, then text, then the counts, then the photo.

// The post as the server has it: the first tweet from tweets.js, reshaped.
// byline and interactions are sub-objects: each one arrives as a single answer.
// id is the server's name for this post. The phone gets it but never shows it.
// The phone starts with none of it.
const firstTweet = tweets[0];
const serverTweet = {
  id: '1843920557301',
  byline: {
    display_name: firstTweet.display_name,
    account_name: firstTweet.account_name,
    posted_at: firstTweet.posted_at
  },
  post_text: firstTweet.post_text,
  interactions: {
    reply_count: firstTweet.reply_count,
    repost_count: firstTweet.repost_count,
    like_count: firstTweet.like_count
  },
  image_url: 'https://example.com/photos/lorem-ipsum.jpg'
};
const KEYS = Object.keys(serverTweet);

// How long the server takes to answer for each key, in milliseconds.
// Small things are quick; the photo is a big file, so it is slowest.
const DELAYS = {
  id: 300,
  byline: 300,
  post_text: 1000,
  interactions: 2000,
  image_url: 3000
};

// Pretend to ask the server for one key.
// A random extra 0 to 0.3 seconds makes it feel like a real network.
const fetchField = (key) => {
  const delay = DELAYS[key] + Math.random() * 300;
  return new Promise((resolve) => {
    setTimeout(() => resolve(serverTweet[key]), delay);
  });
};

// The post before anything has arrived: a grey placeholder bar in every slot
const renderSkeleton = () => {
  return `
    <div class="card placeholder-glow">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-baseline">
          <strong class="placeholder col-4" data-field="display_name"></strong>
          <span class="text-body-secondary">
            <span class="placeholder col-3" data-field="account_name"></span> ·
            <span class="placeholder col-1" data-field="posted_at"></span>
          </span>
        </div>
        <p class="card-text my-2 placeholder col-12" data-field="post_text"></p>
        <div class="image-slot placeholder col-12 mb-2" data-field="image_url"></div>
        <div class="d-flex gap-4 small text-body-secondary">
          <span><span class="placeholder col-2" data-field="reply_count"></span> replies</span>
          <span><span class="placeholder col-2" data-field="repost_count"></span> reposts</span>
          <span><span class="placeholder col-2" data-field="like_count"></span> likes</span>
        </div>
      </div>
    </div>
  `;
};

// A grey box with an X through it: the wireframe sign for "a picture goes here"
const imageBox = `
  <svg class="image-box" viewBox="0 0 160 90" preserveAspectRatio="none" role="img" aria-label="Photo">
    <line x1="0" y1="0" x2="160" y2="90"/>
    <line x1="160" y1="0" x2="0" y2="90"/>
  </svg>`;

// Swap one placeholder on the phone for its value
const fillSlot = (field, value) => {
  const slot = document.querySelector(`#post [data-field="${field}"]`);
  if (field === 'image_url') {
    slot.innerHTML = imageBox;  // a real app would use <img src="${value}">
  } else {
    slot.textContent = value;
  }
  slot.classList.remove('placeholder', 'col-1', 'col-2', 'col-3', 'col-4', 'col-12');
  slot.classList.add('arrived');
};

// One key has arrived: put it on the phone
const fillField = (key, value) => {
  if (key === 'id') {
    // Nothing on the phone shows the id. It came along anyway.
  } else if (typeof value === 'object') {
    // A sub-object: one answer, several slots, all filled at the same moment
    Object.keys(value).forEach((field) => fillSlot(field, value[field]));
  } else {
    fillSlot(key, value);
  }
  arrived(key, value);
};

// --- Three ways to ask for the keys. Pick one with the buttons. ---

// A. Ask for one key, wait for it, then ask for the next.
//    "await" inside a loop pauses the whole loop.
const oneAtATime = async () => {
  for (const key of KEYS) {
    const value = await fetchField(key);
    fillField(key, value);
  }
};

// B. Ask for every key at once, but show nothing until the last answer is in.
//    Promise.all waits for every request in the array.
const waitForEverything = async () => {
  const values = await Promise.all(KEYS.map(fetchField));
  KEYS.forEach((key, index) => fillField(key, values[index]));
};

// C. Ask for every key at once, and fill in each one the moment it lands.
//    No await: .then says "run this later, when the answer comes back".
const popInAsItArrives = () => {
  KEYS.forEach((key) => {
    fetchField(key).then((value) => fillField(key, value));
  });
};

const strategies = {
  oneAtATime: oneAtATime,
  waitForEverything: waitForEverything,
  popInAsItArrives: popInAsItArrives
};

// --- Panel helpers. Not part of the lesson: they show what arrived, and when. ---

const postSlot = document.querySelector('#post');
const objectView = document.querySelector('#object-view');
const controls = document.querySelector('#controls');
let arrivedCount = 0;

// The object on the phone, one line per key: "waiting…" until that key arrives
const showEmptyObject = () => {
  objectView.innerHTML = '';
  const addLine = (text, key) => {
    const line = document.createElement('span');
    line.className = 'line';
    line.textContent = text;
    if (key) line.dataset.key = key;
    objectView.append(line);
  };
  addLine('{');
  KEYS.forEach((key) => addLine(`  ${key}: waiting…`, key));
  addLine('}');
};

const arrived = (key, value) => {
  arrivedCount = arrivedCount + 1;

  // Written the way it looks in code: keys without quotes, sub-objects indented
  const text = JSON.stringify(value, null, 2)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/\n/g, '\n  ');
  const line = objectView.querySelector(`[data-key="${key}"]`);
  const unused = key === 'id' ? '   // not shown on the phone' : '';
  line.textContent = `  ${key}: ${text},${unused}`;
  line.classList.add('arrived', 'filled');

  let note = '';
  if (key === 'id') note = ' (nothing on the phone uses it)';
  if (typeof value === 'object') note = ` (${Object.keys(value).length} values at once)`;
  log(`${arrivedCount}. ${key} arrived${note}`);
  if (arrivedCount === KEYS.length) {
    log('everything has arrived', 'fast');
    controls.disabled = false;
  }
};

const chosenStrategy = () => document.querySelector('[name="strategy"]:checked').value;

const loadPost = () => {
  resetClock();
  controls.disabled = true;
  arrivedCount = 0;
  postSlot.innerHTML = renderSkeleton();
  showEmptyObject();
  log('started loading the post', 'fast');
  strategies[chosenStrategy()]();
  showCode(strategies[chosenStrategy()], '#code');
};

document.querySelectorAll('[name="strategy"]').forEach((radio) => {
  radio.addEventListener('change', loadPost);
});
document.querySelector('#reload').addEventListener('click', loadPost);

showCode(fetchField, '#code-fetch');
showCode(fillField, '#code-fill');
loadPost();
