// 2-collection.js
// Example 2: an array of objects becomes a list of posts.
// One template, run once per item, with map.

// The template for ONE tweet. index says which item in the array it is.
const renderTweet = (tweet, index) => {
  return `
    <li class="card tweet" data-index="${index}" tabindex="0">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-baseline">
          <strong>${tweet.display_name}</strong>
          <span class="text-body-secondary">${tweet.account_name} · ${tweet.posted_at}</span>
        </div>
        <p class="card-text my-2">${tweet.post_text}</p>
        <div class="d-flex gap-4 small text-body-secondary">
          <span>${tweet.reply_count} replies</span>
          <span>${tweet.repost_count} reposts</span>
          <span>${tweet.like_count} likes</span>
        </div>
      </div>
    </li>
  `;
};

const list = document.querySelector('#tweets');
const arrayView = document.querySelector('#array-view');

// map runs renderTweet on every item; join glues the HTML together
const drawTweets = () => {
  list.innerHTML = tweets.map(renderTweet).join('');
  showArray(tweets);
};

// --- Side panel: the whole array, one block per item, so each item can light up ---

const addBlock = (text, index) => {
  const block = document.createElement('span');
  block.className = 'line';
  block.textContent = text;
  if (index !== undefined) block.dataset.index = index;
  arrayView.append(block);
};

const showArray = (array) => {
  arrayView.innerHTML = '';
  addBlock('[');
  array.forEach((item, index) => {
    // Write it out the way it looks in tweets.js: keys without quotes
    const text = JSON.stringify(item, null, 2)
      .replace(/"(\w+)":/g, '$1:')
      .replace(/\n/g, '\n  ');
    addBlock(`  ${text},`, index);
  });
  addBlock(']');
};

// Light up one item in the panel and scroll the panel to it
const highlightItem = (index) => {
  arrayView.querySelectorAll('[data-index]').forEach((block) => {
    const isThisOne = block.dataset.index === index;
    block.classList.toggle('highlight', isThisOne);
    if (isThisOne) {
      arrayView.scrollTo({ top: block.offsetTop - 16, behavior: 'smooth' });
    }
  });
};

// Point at (or tab to) a tweet: its object lights up in the array
let currentIndex;

const inspect = (event) => {
  const tweet = event.target.closest('.tweet');
  if (tweet && tweet.dataset.index !== currentIndex) {
    currentIndex = tweet.dataset.index;
    highlightItem(currentIndex);
  }
};

list.addEventListener('mouseover', inspect);
list.addEventListener('focusin', inspect);

drawTweets();
showCode(renderTweet, '#code');
showCode(drawTweets, '#code-draw');
