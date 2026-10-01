// call-boxes.js
// Not part of the lesson. Draws one box for one function call, with that call's
// own variables as chips. The box fades when the call is over, then disappears.
// Used by the scope example.

const callCounts = {};

// name: the function's name. chips: that call's variables, as text.
// Returns the call number, so a caller can label things to match.
const showCall = (areaSelector, name, chips) => {
  callCounts[name] = (callCounts[name] || 0) + 1;
  const call = document.createElement('div');
  call.className = 'scope call running new';
  call.innerHTML = `
    <span class="scope-label">${name} · call ${callCounts[name]}</span>
    <div class="chips">
      ${chips.map((chip) => `<span class="chip seen">${chip}</span>`).join('')}
    </div>`;
  document.querySelector(areaSelector).append(call);

  setTimeout(() => {
    call.classList.remove('running');
    call.classList.add('ended');
    call.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.remove('seen');
      chip.classList.add('dormant');
    });
  }, 2000);
  setTimeout(() => call.remove(), 3500);
  return callCounts[name];
};

// Start every function's call count again from 1
const resetCallCounts = () => {
  Object.keys(callCounts).forEach((name) => { delete callCounts[name]; });
};
