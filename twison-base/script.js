// here we import our file from another source
import promiseData from './data.js'
import initGame from './game.js'

document.addEventListener("DOMContentLoaded", async () => {
  const json = await promiseData("./game.json");
  console.log(json);
  
  initGame(json);
});
