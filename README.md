# Mechanical Hourglass Animation

This repository contains a detailed SVG mechanical hourglass with animated sand flow and rotating cogwheels background, plus JavaScript to animate the sand timer with a 60-second flip cycle.

## Usage

1. Include the SVG and JS on your webpage.
2. Or inject dynamically from browser console:

```js
(async () => {
  const container = document.createElement('div');
  container.id = 'mechanical-hourglass';
  document.body.appendChild(container);

  const style = document.createElement('style');
  style.textContent = `
    #mechanical-hourglass {
      position: fixed;
      top:0; left:0; width:100vw; height:100vh;
      background: radial-gradient(#1e1e1e, #000);
      z-index:999999; overflow:hidden;
    }
    svg {
      width: 100%; height: 100%;
      transform-origin: 400px 400px;
    }
  `;
  document.head.appendChild(style);

  const svgText = await fetch('hourglass.svg').then(r => r.text());
  container.innerHTML = svgText;

  const scriptText = await fetch('animation.js').then(r => r.text());
  const scriptEl = document.createElement('script');
  scriptEl.textContent = scriptText;
  document.body.appendChild(scriptEl);
})();
