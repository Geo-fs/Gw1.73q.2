(() => {
  const NS = "http://www.w3.org/2000/svg";

  const container = document.getElementById('mechanical-hourglass');
  if (!container) return;

  const svg = container.querySelector('svg');
  if (!svg) return;

  const topSand = svg.getElementById('topSand');
  const bottomSand = svg.getElementById('bottomSand');
  const sandFall = svg.getElementById('sandFall');

  let flip = false;
  let startTime = null;
  const DURATION = 60 * 1000; // 60 seconds

  // Cogwheels group
  const cogs = svg.getElementById('background-cogs');
  let cogRotation = 0;

  // Animate sand levels and cog rotations
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) % DURATION;
    const progress = elapsed / DURATION;

    // Sand levels:
    // Top sand height decreases from full to empty.
    // Bottom sand height increases from empty to full.

    const topHeight = 140 * (1 - progress);
    const bottomHeight = 160 * progress;

    // Update topSand rect height and y to simulate lowering sand
    topSand.setAttribute('height', topHeight);
    topSand.setAttribute('y', -250 + (140 - topHeight));

    // Update bottomSand rect height and y to simulate filling sand
    bottomSand.setAttribute('height', bottomHeight);
    bottomSand.setAttribute('y', 250 - bottomHeight);

    // Sand falling (triangle) opacity: peak around middle progress
    let fallOpacity = Math.sin(progress * Math.PI) * 0.8;
    sandFall.setAttribute('opacity', fallOpacity);

    // Rotate cogs
    cogRotation += 0.15;
    cogs.setAttribute('transform', `translate(400 400) rotate(${cogRotation})`);

    // Flip hourglass every 60s
    if (elapsed >= DURATION - 16) {
      if (!flip) {
        flip = true;
        // Animate flip - rotate 180 degrees over 1 second
        svg.style.transition = 'transform 1s ease-in-out';
        svg.style.transformOrigin = '400px 400px';
        svg.style.transform = 'rotate(180deg)';
      }
    } else {
      if (flip) {
        flip = false;
        svg.style.transition = 'transform 1s ease-in-out';
        svg.style.transformOrigin = '400px 400px';
        svg.style.transform = 'rotate(0deg)';
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
