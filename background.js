// background.js
// Implements Layers 2-4: front gears, wires & boxes, rear gear wall

(function() {
  // Load Three.js if not already present
  function loadThree(onLoad) {
    if (window.THREE) return onLoad();
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r147/three.min.js';
    script.onload = onLoad;
    document.head.appendChild(script);
  }

  // Main initialization
  function initBackground() {
    const container = document.getElementById('mechanical-hourglass') || document.body;
    
    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // Lighting - overhead only
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 1, 0.5).normalize();
    scene.add(dirLight);

    // Groups for each layer
    const frontGears  = new THREE.Group(); scene.add(frontGears);
    const boxesGroup  = new THREE.Group(); scene.add(boxesGroup);
    const wiresGroup  = new THREE.Group(); scene.add(wiresGroup);
    const rearGears   = new THREE.Group(); scene.add(rearGears);

    // Gear SVG data list (replace URLs with your GitHub raw paths)
    const gearData = [
      { url: 'https://raw.githubusercontent.com/Geo-fs/Gw1.73q.2/main/gears/gear1.svg', size: 500 },
      { url: 'https://raw.githubusercontent.com/Geo-fs/Gw1.73q.2/main/gears/gear2.svg', size: 450 },
      /* ... up to gear10.svg, 50mm */
    ];

    // Loader for SVG shapes
    const svgLoader = new THREE.SVGLoader();

    // Helper: create gear mesh from SVG
    function createGearMesh(svgUrl, pitchMm, depth = 8) {
      return new Promise((resolve, reject) => {
        svgLoader.load(svgUrl, data => {
          const shapes = [];
          data.paths.forEach(path => shapes.push(...path.toShapes(true)));
          const geom = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: false });
          const mat  = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 1,
            roughness: 0.2
          });
          const mesh = new THREE.Mesh(geom, mat);
          // Store rotation ratio (inverse of pitch circumference)
          mesh.userData.rotationSpeed = (1 / pitchMm) * 0.5;
          resolve(mesh);
        }, undefined, reject);
      });
    }

    // Layer 2: Front gears
    Promise.all(gearData.map(g => createGearMesh(g.url, g.size))).then(gears => {
      // Layout a row of front gears horizontally
      gears.forEach((gear, i) => {
        gear.position.set((i - gears.length/2) * 120, 0, 20);
        frontGears.add(gear);
      });
    });

    // Layer 3: Wires & Boxes
    const boxHomes = [
      new THREE.Vector3(-150, 100, 0),
      new THREE.Vector3(  80,  90, 0),
      new THREE.Vector3(-100,-120,0),
      new THREE.Vector3( 120,-100,0)
    ];

    boxHomes.forEach((home, idx) => {
      // Create box
      const boxGeo = new THREE.BoxGeometry(20, 20, 20);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        metalness: 1,
        roughness: 0.3
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.copy(home);
      box.userData.home = home.clone();
      boxesGroup.add(box);

      // Create copper wire as TubeGeometry
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(home.x, home.y + 40, 0),
        new THREE.Vector3(home.x * 0.3, home.y * 0.5, 0)
      ]);
      const wireGeo = new THREE.TubeGeometry(curve, 40, 1.5, 8, false);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0xB87333,
        metalness: 1,
        roughness: 0.4
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.userData.box = box;
      wiresGroup.add(wire);
    });

    // Layer 4: Rear gear wall - dense, smoky, out-of-focus
    // Generate many random small gears behind at z = -50
    for (let i = 0; i < 80; i++) {
      const idx  = Math.floor(Math.random()*gearData.length);
      const { url, size } = gearData[idx];
      createGearMesh(url, size, 4).then(gear => {
        gear.position.set(
          THREE.MathUtils.randFloatSpread(800),
          THREE.MathUtils.randFloatSpread(600),
          -50
        );
        gear.scale.setScalar(THREE.MathUtils.randFloat(0.3, 0.7));
        gear.material.transparent = true;
        gear.material.opacity = 0.15;
        rearGears.add(gear);
      });
    }

    // Animate boxes movement & wires
    function updateBoxesAndWires(time) {
      boxesGroup.children.forEach((box, i) => {
        const home = box.userData.home;
        const t    = time / 10000 + i;
        box.position.x = home.x + Math.sin(t) * 15;
        box.position.y = home.y + Math.cos(t) * 15;
      });
      wiresGroup.children.forEach(wire => {
        const box = wire.userData.box;
        const start = new THREE.Vector3(box.userData.home.x, box.userData.home.y + 40, 0);
        const end   = box.position.clone();
        const curve = new THREE.CatmullRomCurve3([start, end]);
        wire.geometry.dispose();
        wire.geometry = new THREE.TubeGeometry(curve, 40, 1.5, 8, false);
      });
    }

    // Render loop
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime() * 1000;

      // Rotate front gears
      frontGears.children.forEach(g => g.rotation.z += g.userData.rotationSpeed * delta);
      // Rotate rear gears (slower, opposite)
      rearGears.children.forEach(g => g.rotation.z -= g.userData.rotationSpeed * delta * 0.5);

      updateBoxesAndWires(elapsed);

      renderer.render(scene, camera);
    })();

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  loadThree(initBackground);
})();
