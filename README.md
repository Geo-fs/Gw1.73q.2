# 🕰️ Mechanical Hourglass with Steampunk Gears

This project renders a fully animated, high-resolution mechanical hourglass surrounded by a synchronized, rotating field of 200–300 interconnected steampunk-style gears. The animation runs at 60fps and is built using SVG, JavaScript, and browser-native technologies.

---

## 📂 Files in This Repository

- `hourglass.svg`  
  Contains the base vector graphics for the hourglass and reusable SVG gear definitions.

- `animation.js`  
  Animates the falling sand and hourglass flipping every 60 seconds. It no longer handles gear animations.

- `gears.js`  
  Dynamically generates and animates a dense, interconnected mesh of steampunk-style bronze gears with lighting and machined textures.

---

## 🖥️ How to Run (DevTools Console Injection)

To display the animated hourglass and background gears on any web page, paste the following code into your browser’s Developer Tools Console (`F12` > Console tab):

```js
(async () => {
    const existing = document.getElementById('mechanical-hourglass');
    if (existing) return alert("Hourglass already running!");

    const container = document.createElement('div');
    container.id = 'mechanical-hourglass';
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.innerHTML = `
        #mechanical-hourglass {
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(#1e1e1e, #000);
            z-index: 999999;
            overflow: hidden;
        }
        svg {
            width: 100%;
            height: 100%;
            transform-origin: 400px 400px;
        }
    `;
    document.head.appendChild(style);

    const svgURL    = "https://raw.githubusercontent.com/Geo-fs/Gw1.73q.2/main/hourglass.svg";
    const animURL   = "https://raw.githubusercontent.com/Geo-fs/Gw1.73q.2/main/animation.js";
    const gearsURL  = "https://raw.githubusercontent.com/Geo-fs/Gw1.73q.2/main/gears.js";

    try {
        const [svgRes, animRes, gearsRes] = await Promise.all([
            fetch(svgURL),
            fetch(animURL),
            fetch(gearsURL)
        ]);

        if (!svgRes.ok) throw new Error("Failed to load hourglass.svg");
        if (!animRes.ok) throw new Error("Failed to load animation.js");
        if (!gearsRes.ok) throw new Error("Failed to load gears.js");

        const svgText = await svgRes.text();
        container.innerHTML = svgText;

        const animScript = document.createElement('script');
        animScript.textContent = await animRes.text();
        document.body.appendChild(animScript);

        const gearsScript = document.createElement('script');
        gearsScript.textContent = await gearsRes.text();
        document.body.appendChild(gearsScript);

    } catch (err) {
        alert("Error loading hourglass: " + err.message);
        console.error(err);
    }
})();
