// animation.js — updated to exclude gear animation logic (handled in gears.js)

(function animateHourglass() {
    const svg = document.querySelector("svg");
    if (!svg) return console.warn("SVG not found");

    const topSand = svg.getElementById("topSand");
    const bottomSand = svg.getElementById("bottomSand");
    const sandFall = svg.getElementById("sandFall");

    const DURATION = 60 * 1000;
    let startTime = null;
    let flipped = false;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % DURATION) / DURATION;

        // Animate sand levels
        const topMaxHeight = 80;
        const bottomMaxHeight = 80;
        const topHeight = (1 - progress) * topMaxHeight;
        const bottomHeight = progress * bottomMaxHeight;

        topSand.setAttribute("height", topHeight);
        topSand.setAttribute("y", 260 + (topMaxHeight - topHeight));

        bottomSand.setAttribute("height", bottomHeight);
        bottomSand.setAttribute("y", 360 - bottomHeight);

        // Animate falling stream
        const opacity = Math.sin(progress * Math.PI);
        sandFall.setAttribute("opacity", opacity.toFixed(2));

        // Flip the hourglass every cycle
        if (elapsed % DURATION > DURATION - 100 && !flipped) {
            flipped = true;
            svg.style.transition = "transform 1s ease-in-out";
            svg.style.transformOrigin = "400px 400px";
            svg.style.transform = svg.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
        } else if (elapsed % DURATION < 100) {
            flipped = false;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
