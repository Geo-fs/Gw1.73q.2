// gears.js
(function createGearBackground() {
    const svg = document.querySelector("svg");
    if (!svg) return console.warn("SVG not found");

    const NS = "http://www.w3.org/2000/svg";
    const GEAR_COUNT = 250;
    const center = { x: 400, y: 400 };

    const gearsGroup = document.createElementNS(NS, "g");
    gearsGroup.setAttribute("id", "background-cogs");
    gearsGroup.setAttribute("transform", `translate(${center.x} ${center.y})`);
    svg.appendChild(gearsGroup);

    // Define radial gradient for lighting
    const defs = svg.querySelector("defs") || document.createElementNS(NS, "defs");
    svg.insertBefore(defs, svg.firstChild);

    const gradient = document.createElementNS(NS, "radialGradient");
    gradient.setAttribute("id", "bronze-light");
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#ffcc88" stop-opacity="1"/>
        <stop offset="100%" stop-color="#5a3d1a" stop-opacity="1"/>
    `;
    defs.appendChild(gradient);

    // Create a subtle machined texture using filter
    const filter = document.createElementNS(NS, "filter");
    filter.setAttribute("id", "machined");
    filter.innerHTML = `
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
        <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="1">
            <feDistantLight azimuth="180" elevation="60" />
        </feDiffuseLighting>
    `;
    defs.appendChild(filter);

    const createGear = (cx, cy, r, teeth, rotationDirection = 1) => {
        const gear = document.createElementNS(NS, "g");
        const path = document.createElementNS(NS, "path");
        const angleStep = (2 * Math.PI) / teeth;
        let d = "";

        for (let i = 0; i < teeth; i++) {
            const angle = i * angleStep;
            const outerX = cx + Math.cos(angle) * (r + 4);
            const outerY = cy + Math.sin(angle) * (r + 4);
            const innerX = cx + Math.cos(angle + angleStep / 2) * r;
            const innerY = cy + Math.sin(angle + angleStep / 2) * r;
            d += `M${innerX},${innerY} L${outerX},${outerY} `;
        }

        path.setAttribute("d", d);
        path.setAttribute("fill", "url(#bronze-light)");
        path.setAttribute("filter", "url(#machined)");
        gear.appendChild(path);
        gear.setAttribute("data-radius", r);
        gear.setAttribute("data-dir", rotationDirection);
        gear.setAttribute("transform", `translate(${cx} ${cy})`);
        gearsGroup.appendChild(gear);
        return gear;
    };

    const gears = [];

    for (let i = 0; i < GEAR_COUNT; i++) {
        const r = Math.random() * 15 + 5;
        const teeth = Math.round(r * 1.5);
        const angle = Math.random() * 2 * Math.PI;
        const dist = 50 + Math.sqrt(i) * 15 + Math.random() * 30;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const direction = i % 2 === 0 ? 1 : -1;

        const gear = createGear(x, y, r, teeth, direction);
        gears.push(gear);
    }

    // Animate at 60fps
    let last = performance.now();
    function animateGears(now) {
        const delta = (now - last) / 1000;
        last = now;

        gears.forEach(gear => {
            const r = +gear.getAttribute("data-radius");
            const dir = +gear.getAttribute("data-dir");
            const angle = (dir * 60 * delta) / r; // simple velocity formula
            const current = gear.getAttribute("data-angle") || 0;
            const newAngle = (+current + angle) % 360;
            gear.setAttribute("data-angle", newAngle);
            const [tx, ty] = gear.getAttribute("transform").match(/[-\d.]+/g).slice(0, 2);
            gear.setAttribute("transform", `translate(${tx} ${ty}) rotate(${newAngle})`);
        });

        requestAnimationFrame(animateGears);
    }

    requestAnimationFrame(animateGears);
})();
