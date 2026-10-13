// 5-one-post.js
// Example 4: one object becomes one post.
// Copied from feed-demo/js/1-object.js. Changes here do not affect feed-demo.
// Each value is just the name of its own key, so the card shows
// exactly which key fills which spot.

const post = {
  account_name: 'account_name',
  posted_at: 'posted_at',
  like_count: 'like_count',
  post_comment: 'post_comment'
};

// The template: every ${...} reads one key from the object.
// data-field="..." marks which key each part of the card came from.
const renderPost = (post) => {
  return `
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <strong data-field="account_name">${post.account_name}</strong>
        <small class="text-body-secondary" data-field="posted_at">${post.posted_at}</small>
      </div>
      <div class="card-body">
        <p class="card-text" data-field="like_count"><strong>${post.like_count}</strong> likes</p>
        <p class="card-text">
          <strong data-field="account_name">${post.account_name}</strong>
          <span data-field="post_comment">${post.post_comment}</span>
        </p>
        <button class="btn btn-primary btn-sm" type="button">Like</button>
      </div>
    </div>
  `;
};

const postSlot = document.querySelector('#post');
const objectView = document.querySelector('#object-view');

const drawPost = () => {
  postSlot.innerHTML = renderPost(post);
  showObject(post);
};

// --- Side panel: write the object out one key per line, so each line can light up ---

const addLine = (text, key) => {
  const line = document.createElement('span');
  line.className = 'line';
  line.textContent = text;
  if (key) line.dataset.key = key;
  objectView.append(line);
};

const showObject = (object) => {
  objectView.innerHTML = '';
  addLine('{');
  Object.keys(object).forEach((key) => {
    addLine(`  ${key}: ${JSON.stringify(object[key])},`, key);
  });
  addLine('}');
};

const highlightKey = (key) => {
  objectView.querySelectorAll('[data-key]').forEach((line) => {
    line.classList.toggle('highlight', line.dataset.key === key);
  });
};

// Point at any part of the card: light up the key it came from
postSlot.addEventListener('mouseover', (event) => {
  const field = event.target.closest('[data-field]');
  highlightKey(field ? field.dataset.field : null);
});
postSlot.addEventListener('mouseleave', () => highlightKey(null));

drawPost();
showCode(renderPost, '#code');
