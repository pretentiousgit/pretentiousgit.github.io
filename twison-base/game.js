function cleanPassageText(passage) {
  const cleanText = passage.text
    // Remove Twine transitions 
    .replace(/\(t8n-[^)]+\)/g, '')
    // Remove numbered choices
    .replace(/^\d+\.\s+/gm, '')
    // Clean multiple newlines but preserve paragraph breaks
    .replace(/\n{3,}/g, '\n\n')
    // Remove Harlowe italics
    .replace(/\/\//g, '')
    // Remove square brackets from choices
    .replace(/\[\[(.+?)->(.+?)\]\]/g, '$1');
  
  passage.text = cleanText;
  return passage;
}


// The function where you make the main text block
function createDisplayText(text){
  try{
    return text.split('\n').join('<br>');
  } catch (err){
    console.log(err)
  }
}


function gameLabel(string){
  let header = document.querySelector("header");
  if(!header) {
    header = document.createElement("header");
    document.body.prepend(header);
  }
  
  header.innerText = '';
  let title = document.createElement("h1")
  title.innerText = string;
  header.append(title);
}

// game.js
async function initGame(twison_export){
  console.log('Loading passages...')
  const {passages} = twison_export;
  const display = document.querySelector('#story-display');
  const choices = document.querySelector('#choices');
  
  const cleanText = passages.map(item => cleanPassageText(item));
  
  // State management
  const gameState = {
    currentPassage: null,
    history: [],
    gameTitle: twison_export.name // Name of game becomes page title
  };

  // Load page header
  gameLabel(gameState.gameTitle);
  
  
  // When loaded on click, show passage contents
  const showPassage = (pid) => {
    const passage = cleanText.find(p => p.pid === pid);
    gameState.currentPassage = passage;
    
    // this is where your game is loaded as text
    display.innerHTML = createDisplayText(passage.text)
    
    choices.innerHTML = passage.links?.map(link => 
      `<button data-pid="${link.pid}">${link.name}</button>`
    ).join('') || '';
    
    // Set our title to the current game passage
    document.title = gameState.currentPassage ? 
    `${gameState.currentPassage.name} | ${gameState.gameTitle}` : 
    gameState.gameTitle;
  };

  choices.addEventListener('click', (e) => {
    if(e.target.matches('button')) {
      const nextPid = e.target.dataset.pid;
      // this stores our game history
      gameState.history.push(gameState.currentPassage.pid);
      showPassage(nextPid);
    }
  });

  console.log('Ready!');
  
  // Start game
  showPassage('1');
  
  // Reset game
  document.querySelector('#restart').addEventListener('click', () => {
    showPassage('1');
  });
};

export default initGame;