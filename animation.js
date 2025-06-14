(function animateHourglass() {
    const svg = document.querySelector("svg");
    if (!svg) return console.warn("SVG not found");

    function getParts() {
        return {
            topSand: svg.querySelector("#topSand"),
            bottomSand: svg.querySelector("#bottomSand"),
            sandFall: svg.querySelector("#sandFall"),
        };
    }

    function waitForSVGElements(readyCallback) {
        const observer = new MutationObserver(() => {
            const { topSand, bottomSand, sandFall } = getParts();
            if (topSand && bottomSand && sandFall) {
                observer.disconnect();
                readyCallback(topSand, bottomSand, sandFall);
            }
        });
        observer.observe(svg, { childList: true, subtree: true });

        // Also check immediately in case DOM is already ready
        const { topSand, bottomSand, sandFall } = getParts();
        if (topSand && bottomSand && sandFall) {
            observer.disconnect();
            readyCallback(topSand, bottomSand, sandFall);
        }
    }

    function startAnimation(topSand, bottomSand, sandFall) {
        const DURATION = 60 * 1000;
        let startTime = null;
        let flipped = false;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % DURATION) / DURATION;

            const topMaxHeight = 80;
            const bottomMaxHeight = 80;

            const topHeight = (1 - progress) * topMaxHeight;
            const bottomHeight = progress * bottomMaxHeight;

            topSand.setAttribute("height", topHeight);
            topSand.setAttribute("y", 260 + (topMaxHeight - topHeight));

            bottomSand.setAttribute("height", bottomHeight);
            bottomSand.setAttribute("y", 360 - bottomHeight);

            sandFall.setAttribute("opacity", Math.sin(progress * Math.PI).toFixed(2));

            if (elapsed % DURATION > DURATION - 100 && !flipped) {
                flipped = true;
                svg.style.transition = "transform 1s ease-in-out";
                svg.style.transformOrigin = "400px 400px";
                svg.style.transform =
                    svg.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
            } else if (elapsed % DURATION < 100) {
                flipped = false;
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    waitForSVGElements(startAnimation);
})();
