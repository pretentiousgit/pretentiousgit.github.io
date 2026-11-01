// 3-fave.js
// Example 3: is a fave fast or slow?
// Both. The heart turns red the instant you click it (client, on the phone).
// Saving the like takes a trip to the server, which takes time (we fake it with setTimeout).

const heartIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 4.4 2.5h1.6c.8-1.3 2.3-2.5 4.4-2.5 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/>
  </svg>`;

// The same template as example 2, with a heart button added
const renderTweet = (tweet, index) => {
  return `
    <li class="card" data-index="${index}">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-baseline">
          <strong>${tweet.display_name}</strong>
          <span class="text-body-secondary">${tweet.account_name} · ${tweet.posted_at}</span>
        </div>
        <p class="card-text my-2">${tweet.post_text}</p>
        <div class="d-flex align-items-center gap-4 small text-body-secondary">
          <span>${tweet.reply_count} replies</span>
          <span>${tweet.repost_count} reposts</span>
          <button class="heart-button" type="button" aria-pressed="false" aria-label="Like this post by ${tweet.display_name}">
            ${heartIcon} ${tweet.like_count}
          </button>
        </div>
      </div>
    </li>
  `;
};

const list = document.querySelector('#tweets');

const drawTweets = () => {
  list.innerHTML = tweets.map(renderTweet).join('');
};

// Pretend the trip to the server and back takes 2 seconds
const NETWORK_DELAY = 2000;

// 1. CLIENT: runs the moment the heart is clicked. No waiting.
//    aria-pressed="true" is what turns the heart red (see shell.css).
const faveTweet = (button) => {
  const isFaved = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!isFaved));

  const tweet = tweets[button.closest('.card').dataset.index];
  if (connectionCanDrop()) {
    sendWithInterrupt(button, tweet, !isFaved);
  } else {
    sendToServer(tweet, !isFaved);
  }
};

// 2. NETWORK + SERVER: setTimeout stands in for the slow trip to the server.
//    The code inside it runs later, after NETWORK_DELAY milliseconds.
const sendToServer = (tweet, faved) => {
  const request = showClicked(tweet, faved, '#rows-works');
  setTimeout(() => {
    showSaved(request);
  }, NETWORK_DELAY);
};

// 3. WHEN THE CONNECTION DROPS: the same trip, but it can be cut off.
//    clearTimeout cancels the timer, so the server never gets the like.
//    The phone already showed a red heart, so now it has to take it back.
const sendWithInterrupt = (button, tweet, faved) => {
  const request = showClicked(tweet, faved, '#rows-drops');
  const timer = setTimeout(() => {
    showSaved(request);
  }, NETWORK_DELAY);

  request.interruptButton.addEventListener('click', () => {
    clearTimeout(timer);
    button.setAttribute('aria-pressed', String(!faved));
    showFailed(request, faved);
    showPhoneMessage(`Couldn't ${faved ? 'like' : 'unlike'} this post. Check your connection.`);
  });
};

// One listener for the whole list: was the click on a heart?
list.addEventListener('click', (event) => {
  const button = event.target.closest('.heart-button');
  if (button) faveTweet(button);
});

// --- Diagram helpers. Not part of the lesson: they draw the panels on the right. ---

let requestCount = 0;

// Clicks go to whichever scenario is open on the right
const connectionCanDrop = () => document.querySelector('#scenario-drops').classList.contains('show');

const spinnerIcon = `
  <svg class="spinner" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" class="spinner-track"/>
    <path d="M12 3a9 9 0 0 1 9 9" class="spinner-arc"/>
  </svg>`;

const checkIcon = `
  <svg class="check" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5"/>
  </svg>`;

const crossIcon = `
  <svg class="cross" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18"/>
  </svg>`;

// Adds a row: "Clicked" in the client panel, a moving line, "Waiting…" in the server panel.
// Rows in the "connection drops" scenario also get an Interrupt button.
const showClicked = (tweet, faved, rowsSelector) => {
  const rows = document.querySelector(rowsSelector);
  const canInterrupt = rows.dataset.interruptible === 'true';
  requestCount = requestCount + 1;
  const id = `request-${requestCount}`;
  rows.querySelector('.no-requests')?.remove();

  rows.insertAdjacentHTML('afterbegin', `
    <div class="diagram-row" id="${id}">
      <div class="cell client-cell">
        <div class="status">${faved ? '♥' : '♡'} Clicked</div>
        <div class="detail">${faved ? 'Like' : 'Unlike'} on ${tweet.display_name}'s post</div>
      </div>
      <div class="cell network-cell">
        ${spinnerIcon}
        <div class="track"><div class="fill" style="animation-duration: ${NETWORK_DELAY}ms"></div></div>
        ${canInterrupt ? '<button class="btn btn-danger interrupt" type="button">Interrupt</button>' : ''}
      </div>
      <div class="cell server-cell">
        <div class="status waiting">Waiting…</div>
        <div class="detail">&nbsp;</div>
      </div>
    </div>
  `);

  // Keep the five newest rows so the diagram does not grow forever
  const allRows = rows.querySelectorAll('.diagram-row');
  if (allRows.length > 5) allRows[allRows.length - 1].remove();

  const row = document.querySelector(`#${id}`);
  return { row: row, interruptButton: row.querySelector('.interrupt'), startedAt: performance.now() };
};

const elapsedSince = (request) => Math.round(performance.now() - request.startedAt).toLocaleString();

// Fills in the server panel once the timeout has finished
const showSaved = (request) => {
  request.row.classList.add('done');
  request.row.querySelector('.spinner').outerHTML = checkIcon;
  request.interruptButton?.remove();
  request.row.querySelector('.server-cell').innerHTML = `
    <div class="status saved">Saved</div>
    <div class="detail">after ${elapsedSince(request)} ms</div>
  `;
};

// The connection dropped: the server never heard, and the client took the heart back
const showFailed = (request, faved) => {
  request.row.classList.add('failed');
  request.row.querySelector('.spinner').outerHTML = crossIcon;
  request.interruptButton.remove();
  request.row.querySelector('.client-cell .status').textContent = `${faved ? '♡' : '♥'} Taken back`;
  request.row.querySelector('.server-cell').innerHTML = `
    <div class="status lost">Never arrived</div>
    <div class="detail">connection lost after ${elapsedSince(request)} ms</div>
  `;
};

// A short message at the bottom of the phone, like a real app shows
const phoneMessage = document.querySelector('#phone-message');
let phoneMessageTimer;

const showPhoneMessage = (text) => {
  phoneMessage.textContent = text;
  phoneMessage.hidden = false;
  clearTimeout(phoneMessageTimer);
  phoneMessageTimer = setTimeout(() => { phoneMessage.hidden = true; }, 3000);
};

drawTweets();
showCode(faveTweet, '#code');
showCode(sendToServer, '#code-server');
showCode(sendWithInterrupt, '#code-interrupt');
showCode(renderTweet, '#code-template');
