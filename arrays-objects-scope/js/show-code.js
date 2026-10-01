// show-code.js
// Not part of the lesson. Shows the real source code of a function in a <pre>,
// so the code on screen can never be out of date with the code that runs.

const showCode = (fn, selector) => {
  // An arrow function saved in a const remembers that name, so we can show it
  document.querySelector(selector).textContent = `const ${fn.name} = ${fn.toString()};`;
};
