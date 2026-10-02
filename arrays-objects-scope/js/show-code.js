// show-code.js
// Not part of the lesson. Shows the real source code of a function in a <pre>,
// so the code on screen can never be out of date with the code that runs.

// options (optional):
//   block: text on the first line of a block to highlight in blue, e.g. 'for ('.
//          The block runs from that line to its closing }.
//   verb:  an array method to highlight in yellow, e.g. 'forEach'. Every .forEach( is marked.
//   mark:  any other text to mark in red, e.g. a typo like '<='.
const showCode = (fn, selector, options = {}) => {
  // An arrow function saved in a const remembers that name, so we can show it
  const text = `const ${fn.name} = ${fn.toString()};`;
  const element = document.querySelector(selector);
  element.textContent = '';

  // Add text to an element, wrapping the verb and the mark in their own spans
  const appendText = (parent, piece) => {
    let parts = [{ text: piece }];
    if (options.verb) {
      parts = parts.flatMap((part) => {
        if (part.className) return [part];
        return part.text.split(`.${options.verb}(`).flatMap((chunk, position) => {
          if (position === 0) return [{ text: chunk }];
          return [{ text: '.' }, { text: options.verb, className: 'highlight-verb' }, { text: `(${chunk}` }];
        });
      });
    }
    if (options.mark) {
      parts = parts.flatMap((part) => {
        if (part.className) return [part];
        return part.text.split(options.mark).flatMap((chunk, position) => {
          if (position === 0) return [{ text: chunk }];
          return [{ text: options.mark, className: 'highlight-mark' }, { text: chunk }];
        });
      });
    }
    parts.forEach((part) => {
      if (part.className) {
        const span = document.createElement('span');
        span.className = part.className;
        span.textContent = part.text;
        parent.append(span);
      } else {
        parent.append(part.text);
      }
    });
  };

  if (!options.block) {
    appendText(element, text);
    return;
  }

  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.includes(options.block));
  const indent = lines[start].search(/\S/);
  let end = start + 1;
  while (end < lines.length - 1 && !(lines[end].search(/\S/) === indent && lines[end].trim().startsWith('}'))) {
    end = end + 1;
  }

  const block = document.createElement('span');
  block.className = 'highlight-block';
  appendText(element, lines.slice(0, start).join('\n'));
  appendText(block, lines.slice(start, end + 1).join('\n'));
  element.append(block);
  appendText(element, lines.slice(end + 1).join('\n'));
};
