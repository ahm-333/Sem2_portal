/* Study Hub 3D Living Codex: Interactive Pop-Up Book Assembly
 * Three.js r186 is vendored locally. Native scroll drives the choreography.
 */
(function () {
  'use strict';
  let current = null;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = (a, b, value) => {
    const x = clamp((value - a) / (b - a));
    return x * x * (3 - 2 * x);
  };

  const stages = [
    ['كل مادة... كانت فكرة على ورقة.', 'حرّك السكرول وشوف إزاي الأوراق بتتجمع والكتاب بيفتح أبوابه.'],
    ['الأوراق اتجمعت، والصفحات بتتفتح.', 'ستة مسارات دراسية كاملة بين دفتي كتاب واحد ينبض بالحياة.'],
    ['الأفكار بتخرج من الصفحات لمجسمات حية.', 'معمارية، رسوميات، قواعد بيانات، وأنظمة... متجسدة في مكان واحد.'],
    ['كتابك مفتوح، ومساحتك جاهزة.', 'Study Hub مفتوح لمصادرك، سكاشنك، ومذاكرتك. يلا نبدأ.']
  ];

  function createFallback() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas rendering is unavailable');
    let width = 1, height = 1;

    // 14 floating parchment pages for fallback
    const pageCount = 14;
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      const angle = (i / pageCount) * Math.PI * 2;
      const dist = 240 + (i % 4) * 40;
      pages.push({
        scatterX: Math.cos(angle) * dist,
        scatterY: Math.sin(angle) * dist * 0.65,
        targetX: (i % 2 === 0 ? -60 : 60) + (i % 3) * 6,
        targetY: (i % 3) * 4,
        rot: (i * 0.4) - 1.2,
        w: 48,
        h: 64,
        color: i % 2 === 0 ? '#f8fafc' : '#f1f5f9'
      });
    }

    return {
      canvas,
      mode: 'canvas',
      resize(w, h) {
        width = w;
        height = h;
        canvas.width = w;
        canvas.height = h;
      },
      draw(time, p, pointer, impulse) {
        const ctx = context;
        const cx = width * 0.5 + pointer.x * 24;
        const cy = height * 0.52 + pointer.y * 24;

        // Background
        ctx.fillStyle = '#080c1d';
        ctx.fillRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(width, height) * 0.6);
        glow.addColorStop(0, '#1c2452');
        glow.addColorStop(0.5, '#0f1430');
        glow.addColorStop(1, '#080c1d');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        const assemble = smooth(0.04, 0.38, p);
        const open = smooth(0.32, 0.60, p);
        const pop = smooth(0.52, 0.82, p);

        // 1. Floating & Assembling Pages
        for (let i = 0; i < pageCount; i++) {
          const pg = pages[i];
          const tau = smooth(i * 0.02, i * 0.02 + 0.28, p);
          const curX = cx + pg.scatterX * (1 - tau) + pg.targetX * tau + Math.sin(time + i) * 6 * (1 - tau);
          const curY = cy + pg.scatterY * (1 - tau) + pg.targetY * tau + Math.cos(time + i) * 6 * (1 - tau);
          const curRot = pg.rot * (1 - tau);

          ctx.save();
          ctx.translate(curX, curY);
          ctx.rotate(curRot);
          ctx.fillStyle = pg.color;
          ctx.globalAlpha = 0.3 + tau * 0.7;
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 8;
          ctx.fillRect(-pg.w * 0.5, -pg.h * 0.5, pg.w, pg.h);
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(-pg.w * 0.5, -pg.h * 0.5, pg.w, pg.h);
          ctx.restore();
        }

        // 2. Open Isometric Book Base
        if (assemble > 0.15) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.globalAlpha = assemble;

          // Back Cover
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-160 * open, 50);
          ctx.lineTo(160, 50);
          ctx.lineTo(130, 85);
          ctx.lineTo(-130 * open, 85);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Left Open Page Leaf
          if (open > 0.05) {
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 45);
            ctx.lineTo(-150 * open, 45 - 20 * open);
            ctx.lineTo(-120 * open, -35 * open);
            ctx.lineTo(0, -10 * open);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Right Open Page Leaf
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 45);
          ctx.lineTo(150, 45 - 20 * open);
          ctx.lineTo(120, -35 * open);
          ctx.lineTo(0, -10 * open);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Gold Spine Accent
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -10 * open);
          ctx.lineTo(0, 45);
          ctx.stroke();

          ctx.restore();
        }

        // 3. 3D Pop-Up Origami Models Extrusion
        if (pop > 0.02) {
          ctx.save();
          ctx.translate(cx, cy);
          const rise = pop * 110;

          // Central Architecture Tower
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12 * pop;

          ctx.beginPath();
          ctx.moveTo(-25, 10);
          ctx.lineTo(25, 10);
          ctx.lineTo(25, 10 - rise);
          ctx.lineTo(0, -15 - rise);
          ctx.lineTo(-25, 10 - rise);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing Spire Orb
          ctx.beginPath();
          ctx.arc(0, -25 - rise, 8 * (1 + impulse * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          // Left Database Cylinders Stack
          const leftX = -75 * open;
          const leftY = 15 - rise * 0.55;
          for (let c = 0; c < 3; c++) {
            ctx.beginPath();
            ctx.ellipse(leftX, leftY - c * 14, 26, 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#0d9488';
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();
          }

          // Right Graphics Prism & OS Ring
          const rightX = 75;
          const rightY = 15 - rise * 0.55;
          ctx.save();
          ctx.translate(rightX, rightY);
          ctx.rotate(time * 1.5);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(-16, -16, 32, 32);
          ctx.restore();

          // Golden Quill Arcs
          ctx.beginPath();
          ctx.arc(95, -rise * 0.4, 25, 0, Math.PI * 1.4);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        }

        // Impulse Shockwave
        if (impulse > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, (1 - impulse) * Math.max(width, height) * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245, 158, 11, ${impulse * 0.8})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        }
      },
      dispose() {
        canvas.width = 1;
        canvas.height = 1;
      }
    };
  }

  function createWebGL(THREE) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080c1d');

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 150);

    // Dynamic Uniforms for Post-Processing & Lighting
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uImpulse: { value: 0 },
      uPointer: { value: new THREE.Vector2() }
    };

    // Lights
    const ambientLight = new THREE.AmbientLight('#a5b4fc', 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#fffbeb', 2.2);
    keyLight.position.set(6, 14, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 1.3);
    fillLight.position.set(-8, 6, -5);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight('#f59e0b', 1.8, 18);
    coreLight.position.set(0, 2.5, 0);
    scene.add(coreLight);

    // Premium Materials
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.2
    });
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xfdfcf8,
      roughness: 0.82,
      metalness: 0.05
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85
    });
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.6
    });
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      roughness: 0.25,
      metalness: 0.6
    });
    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.25,
      metalness: 0.6
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });

    // 1. The 3D Book Entity Hierarchy
    const book = new THREE.Group();
    scene.add(book);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.4, 20);
    const spine = new THREE.Mesh(spineGeo, coverMat);
    spine.rotation.x = Math.PI * 0.5;
    spine.position.set(0, -0.22, 0);
    book.add(spine);

    // Back Cover Base
    const backCoverGeo = new THREE.BoxGeometry(6.4, 0.08, 4.4);
    const backCover = new THREE.Mesh(backCoverGeo, coverMat);
    backCover.position.set(0, -0.26, 0);
    book.add(backCover);

    // Left Page Block
    const leftBlockGeo = new THREE.BoxGeometry(2.95, 0.22, 4.15);
    const leftBlock = new THREE.Mesh(leftBlockGeo, pageMat);
    leftBlock.position.set(-1.5, -0.11, 0);
    book.add(leftBlock);

    // Right Page Block
    const rightBlockGeo = new THREE.BoxGeometry(2.95, 0.22, 4.15);
    const rightBlock = new THREE.Mesh(rightBlockGeo, pageMat);
    rightBlock.position.set(1.5, -0.11, 0);
    book.add(rightBlock);

    // Front Cover Hinge (Pivots around Spine at x = 0)
    const coverHinge = new THREE.Group();
    coverHinge.position.set(0, 0, 0);
    const coverFlapGeo = new THREE.BoxGeometry(3.1, 0.08, 4.3);
    const coverFlap = new THREE.Mesh(coverFlapGeo, coverMat);
    coverFlap.position.set(1.55, 0.04, 0);
    coverHinge.add(coverFlap);

    // Gold Cover Emblem
    const emblemGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 6);
    const emblem = new THREE.Mesh(emblemGeo, goldMat);
    emblem.position.set(1.55, 0.09, 0);
    coverHinge.add(emblem);

    book.add(coverHinge);

    // 2. The Pop-Up Origami Architecture Group
    const popup = new THREE.Group();
    popup.position.set(0, 0.02, 0);
    popup.scale.set(0.001, 0.001, 0.001);
    book.add(popup);

    // Centerpiece: Architecture & AI Logic Tower
    const tBaseGeo = new THREE.BoxGeometry(1.05, 0.38, 1.05);
    const tBase = new THREE.Mesh(tBaseGeo, coverMat);
    tBase.position.set(0, 0.19, 0);
    popup.add(tBase);

    const tMidGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const tMid = new THREE.Mesh(tMidGeo, goldMat);
    tMid.position.set(0, 0.72, 0);
    popup.add(tMid);

    const tSpireGeo = new THREE.CylinderGeometry(0.08, 0.3, 0.9, 8);
    const tSpire = new THREE.Mesh(tSpireGeo, cyanMat);
    tSpire.position.set(0, 1.45, 0);
    popup.add(tSpire);

    const tOrbGeo = new THREE.IcosahedronGeometry(0.24, 1);
    const tOrb = new THREE.Mesh(tOrbGeo, goldMat);
    tOrb.position.set(0, 2.0, 0);
    popup.add(tOrb);

    // Left Page: Database Cylinders Stack
    const dbCylGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 24);
    const dbDiscs = [];
    for (let c = 0; c < 3; c++) {
      const disc = new THREE.Mesh(dbCylGeo, emeraldMat);
      disc.position.set(-1.45, 0.12 + c * 0.18, -0.65);
      popup.add(disc);
      dbDiscs.push(disc);
    }

    // Left Page: Data Structures Binary Tree
    const treeGroup = new THREE.Group();
    treeGroup.position.set(-1.45, 0.15, 0.65);
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const rootNode = new THREE.Mesh(nodeGeo, goldMat);
    rootNode.position.set(0, 0.85, 0);
    treeGroup.add(rootNode);

    const childLeft = new THREE.Mesh(nodeGeo, cyanMat);
    childLeft.position.set(-0.45, 0.45, 0);
    treeGroup.add(childLeft);

    const childRight = new THREE.Mesh(nodeGeo, cyanMat);
    childRight.position.set(0.45, 0.45, 0);
    treeGroup.add(childRight);

    const treeLinesGeo = new THREE.BufferGeometry();
    const treeLinePos = new Float32Array([
      0, 0.85, 0, -0.45, 0.45, 0,
      0, 0.85, 0, 0.45, 0.45, 0
    ]);
    treeLinesGeo.setAttribute('position', new THREE.BufferAttribute(treeLinePos, 3));
    const treeLines = new THREE.LineSegments(treeLinesGeo, new THREE.LineBasicMaterial({ color: '#f59e0b', lineWidth: 2 }));
    treeGroup.add(treeLines);
    popup.add(treeGroup);

    // Right Page: Computer Graphics Wireframe Prism
    const crystalGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const crystal = new THREE.Mesh(crystalGeo, wireMat);
    crystal.position.set(1.45, 0.85, -0.55);
    popup.add(crystal);

    const crystalRingGeo = new THREE.TorusGeometry(0.68, 0.022, 8, 48);
    const crystalRing = new THREE.Mesh(crystalRingGeo, purpleMat);
    crystalRing.position.set(1.45, 0.85, -0.55);
    popup.add(crystalRing);

    // Right Page: Operating Systems Kinetic Rings
    const osRing1Geo = new THREE.TorusGeometry(0.48, 0.024, 8, 40);
    const osRing1 = new THREE.Mesh(osRing1Geo, goldMat);
    osRing1.position.set(1.45, 0.6, 0.65);
    popup.add(osRing1);

    const osRing2Geo = new THREE.TorusGeometry(0.34, 0.02, 8, 32);
    const osRing2 = new THREE.Mesh(osRing2Geo, cyanMat);
    osRing2.position.set(1.45, 0.6, 0.65);
    popup.add(osRing2);

    // Right Page: Technical Reports Floating Golden Quill
    const quillGeo = new THREE.ConeGeometry(0.07, 1.05, 6);
    const quill = new THREE.Mesh(quillGeo, goldMat);
    quill.position.set(1.9, 0.95, 0.05);
    quill.rotation.z = -0.55;
    quill.rotation.y = 0.35;
    popup.add(quill);

    // 3. Floating Scattered Pages (Assembly Phase 0 -> 1)
    const floatPageCount = 14;
    const floatPageGeo = new THREE.PlaneGeometry(2.5, 3.7);
    const floatPages = new THREE.InstancedMesh(floatPageGeo, pageMat, floatPageCount);
    floatPages.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(floatPages);

    const pageScatters = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < floatPageCount; i++) {
      const a = (i / floatPageCount) * Math.PI * 2;
      const dist = 10 + (i % 5) * 2.2;
      pageScatters.push({
        sx: Math.cos(a) * dist,
        sy: 2 + Math.sin(i * 1.7) * 4.5,
        sz: Math.sin(a) * dist * 0.85,
        rx: (i * 1.5) % Math.PI,
        ry: (i * 2.1) % Math.PI,
        rz: (i * 0.9) % Math.PI
      });
    }

    // 4. Starlight & Knowledge Glyph Particles
    const dustCount = 130;
    const dustGeo = new THREE.OctahedronGeometry(0.042, 0);
    const dustMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
    const dust = new THREE.InstancedMesh(dustGeo, dustMat, dustCount);
    for (let i = 0; i < dustCount; i++) {
      const a = i * 2.399963;
      const r = 2.5 + (i % 12) * 0.65;
      dummy.position.set(Math.cos(a) * r, 0.5 + (i % 16) * 0.45, Math.sin(a) * r);
      dummy.rotation.set(a, a * 0.7, 0);
      dummy.scale.setScalar(0.4 + (i % 5) * 0.3);
      dummy.updateMatrix();
      dust.setMatrixAt(i, dummy.matrix);
    }
    scene.add(dust);

    // 5. Single-Pass Post-Processing
    const target = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true });
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const postUniforms = {
      image: { value: target.texture },
      resolution: { value: new THREE.Vector2(1, 1) },
      ...uniforms
    };

    const postMaterial = new THREE.ShaderMaterial({
      uniforms: postUniforms,
      depthTest: false,
      depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `
        uniform sampler2D image;
        uniform vec2 resolution;
        uniform float uProgress;
        uniform float uImpulse;
        varying vec2 vUv;
        void main() {
          vec2 dir = vUv - 0.5;
          vec2 offset = dir * (0.0005 + uProgress * 0.0012 + uImpulse * 0.003);
          vec3 col = vec3(
            texture2D(image, vUv + offset).r,
            texture2D(image, vUv).g,
            texture2D(image, vUv - offset).b
          );
          vec3 bloom = vec3(0.0);
          for (int i = 0; i < 8; i++) {
            float angle = float(i) * 0.785398;
            vec2 d = vec2(cos(angle), sin(angle)) * 3.0 / resolution;
            bloom += max(texture2D(image, vUv + d).rgb - 0.55, vec3(0.0));
          }
          col += bloom * 0.14;
          col = vec3(1.0) - exp(-col * 1.45);
          col *= 1.0 - 0.22 * pow(length(dir) * 1.25, 2.0);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `
    });
    postScene.add(new THREE.Mesh(quadGeo, postMaterial));

    return {
      canvas: renderer.domElement,
      mode: 'webgl',
      resize(width, height) {
        const scale = Math.min(1.25, window.devicePixelRatio || 1, 1600 / width);
        renderer.setSize(width, height, false);
        target.setSize(Math.round(width * scale), Math.round(height * scale));
        postUniforms.resolution.value.set(target.width, target.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      },
      draw(time, p, pointer, impulse) {
        uniforms.uTime.value = time;
        uniforms.uProgress.value = p;
        uniforms.uImpulse.value = impulse;
        uniforms.uPointer.value.set(pointer.x, pointer.y);

        // 1. Floating Pages Gathering (Phase 0 -> 1)
        for (let i = 0; i < floatPageCount; i++) {
          const s = pageScatters[i];
          const tau = smooth(i * 0.018, i * 0.018 + 0.24, p);
          const hover = (1 - tau) * 0.25;

          const px = s.sx * (1 - tau) + (i % 2 === 0 ? -1.5 : 1.5) * tau + Math.sin(time * 1.5 + i) * hover;
          const py = s.sy * (1 - tau) + (-0.08 + (i % 4) * 0.02) * tau + Math.cos(time * 1.2 + i) * hover;
          const pz = s.sz * (1 - tau) + Math.sin(time * 1.8 + i) * hover;

          const rx = s.rx * (1 - tau) - Math.PI * 0.5 * tau;
          const ry = s.ry * (1 - tau);
          const rz = s.rz * (1 - tau);

          dummy.position.set(px, py, pz);
          dummy.rotation.set(rx, ry, rz);
          dummy.scale.setScalar(tau > 0.98 ? 0.001 : 1);
          dummy.updateMatrix();
          floatPages.setMatrixAt(i, dummy.matrix);
        }
        floatPages.instanceMatrix.needsUpdate = true;

        // 2. Book Orientation & Cover Hinge Opening
        const open = smooth(0.24, 0.52, p);
        coverHinge.rotation.z = -Math.PI * 0.96 * open;

        // Book orientation tilts toward camera
        const tilt = smooth(0.1, 0.45, p);
        book.rotation.x = 0.55 * tilt;
        book.rotation.y = time * 0.08 * (1 - tilt) + pointer.x * 0.35;
        book.position.y = -0.6 * tilt + pointer.y * 0.25;

        // 3. Pop-Up Origami Rise & Dynamic Animation (Phase 2)
        const pop = smooth(0.48, 0.76, p);
        popup.scale.set(pop, pop, pop);
        popup.position.y = 0.02 + pop * 0.12;

        if (pop > 0.01) {
          // Central Spire Orb pulse
          tOrb.rotation.y = time * 1.5;
          tOrb.position.y = 2.0 + Math.sin(time * 3) * 0.08;

          // Database Discs rotation
          for (let c = 0; c < 3; c++) {
            dbDiscs[c].rotation.y = time * (0.8 + c * 0.3);
          }

          // Graphics Crystal & Ring
          crystal.rotation.set(time * 1.4, time * 1.1, 0);
          crystalRing.rotation.set(time * 0.6, time * 0.8, p * 2);

          // OS Kinetic Rings
          osRing1.rotation.set(time * 1.2, 0, time * 0.8);
          osRing2.rotation.set(0, time * 1.6, time * 0.5);

          // Quill Gentle Floating
          quill.position.y = 0.95 + Math.sin(time * 2.5) * 0.08;
          quill.rotation.z = -0.55 + Math.sin(time * 2) * 0.08;
        }

        // 4. Starlight & Dust Motion
        dust.rotation.y = time * 0.04;

        // 5. Core Light & Impulse Reactivity
        coreLight.intensity = 1.2 + pop * 2.5 + impulse * 2.0;

        // 6. Camera Journey (Phase 3 Fly-in)
        const travel = smooth(0.82, 1.0, p);
        const closing = smooth(0.88, 1.0, p);
        const camZ = 13.5 - smooth(0.08, 0.55, p) * 3.0;

        if (travel > 0) {
          camera.position.set(
            pointer.x * 1.8 * (1 - travel),
            1.5 * (1 - travel) - travel * 1.5,
            camZ - travel * 26.0
          );
          camera.lookAt(0, 0.5, camera.position.z - 15);
        } else {
          camera.position.set(pointer.x * 1.8, 1.8 + pointer.y * 1.2, camZ);
          camera.lookAt(pointer.x * 0.4, 0.2 + pointer.y * 0.2, 0);
        }

        if (closing > 0) camera.fov = 45 + closing * 20;
        else camera.fov = 45;
        camera.updateProjectionMatrix();

        renderer.setRenderTarget(target);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      },
      dispose() {
        for (const geometry of [
          spineGeo,
          backCoverGeo,
          leftBlockGeo,
          rightBlockGeo,
          coverFlapGeo,
          emblemGeo,
          tBaseGeo,
          tMidGeo,
          tSpireGeo,
          tOrbGeo,
          dbCylGeo,
          nodeGeo,
          treeLinesGeo,
          crystalGeo,
          crystalRingGeo,
          osRing1Geo,
          osRing2Geo,
          quillGeo,
          floatPageGeo,
          dustGeo,
          quadGeo
        ]) {
          geometry.dispose();
        }

        for (const material of [
          coverMat,
          pageMat,
          goldMat,
          cyanMat,
          emeraldMat,
          purpleMat,
          wireMat,
          dustMat,
          postMaterial
        ]) {
          material.dispose();
        }

        floatPages.dispose();
        dust.dispose();
        target.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }

  window.mountRiftIntro = async ({ host, onSeen, onSkip, cancelled = () => false }) => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return null;

    const element = document.createElement('section');
    element.className = 'rift-intro';
    element.setAttribute('aria-label', 'رحلة الكتاب التفاعلي ثلاثي الأبعاد');
    element.innerHTML = [
      '<div class="rift-scene">',
      '  <div class="rift-stage" aria-hidden="true"></div>',
      '  <header class="rift-header">',
      '    <a href="index.html" class="rift-wordmark" lang="en">Study Hub<span aria-hidden="true"> / </span><span>Codex</span></a>',
      '    <div class="rift-matrix-hud" aria-hidden="true">',
      '      <div class="matrix-pill">',
      '        <span class="matrix-pulse"></span>',
      '        <span data-matrix-state>الكتاب: أوراق متفرقة</span>',
      '      </div>',
      '      <div class="matrix-courses-bar">',
      '        <span class="course-dot dot-0" title="معمارية الحاسوب"></span>',
      '        <span class="course-dot dot-1" title="الرسم بالحاسوب"></span>',
      '        <span class="course-dot dot-2" title="قواعد البيانات"></span>',
      '        <span class="course-dot dot-3" title="هياكل البيانات"></span>',
      '        <span class="course-dot dot-4" title="نظم التشغيل"></span>',
      '        <span class="course-dot dot-5" title="كتابة التقارير"></span>',
      '      </div>',
      '    </div>',
      '    <button type="button" class="rift-skip" data-intro-skip>تخطّي المقدمة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 7v11h11"/></svg></button>',
      '  </header>',
      '  <div class="rift-copy">',
      '    <div class="rift-phase-badge" aria-hidden="true"><span class="badge-num">01</span><span class="badge-label">أوراق متفرقة</span></div>',
      '    <h1></h1>',
      '    <p></p>',
      '  </div>',
      '  <div class="rift-final" aria-hidden="true">',
      '    <span class="rift-final-tag">سنة ثانية — الترم الأول • الذكاء الاصطناعي</span>',
      '    <strong lang="en">Study Hub</strong>',
      '    <span>كتابك مفتوح. رحلتك للمذاكرة تبدأ الآن.</span>',
      '  </div>',
      '  <footer class="rift-footer">',
      '    <div class="rift-scroll-cue">',
      '      <span class="rift-mouse" aria-hidden="true"></span>',
      '      <span>اسكرول لتجميع وفتح الكتاب</span>',
      '    </div>',
      '    <span class="rift-caption">حرّك الماوس لتغيير زاوية الرؤية ثلاثية الأبعاد • اضغط لنبضة الضوء</span>',
      '    <span class="rift-percent" aria-hidden="true">0%</span>',
      '  </footer>',
      '  <div class="rift-progress" aria-hidden="true"><span></span></div>',
      '  <p class="sr-only" role="status" aria-live="polite" data-rift-status></p>',
      '</div>'
    ].join('\n');

    host.before(element);

    let graphics;
    try {
      const THREE = await import(new URL('js/vendor/three/three.module.js', document.baseURI).href);
      if (cancelled() || !element.isConnected) return null;
      graphics = createWebGL(THREE);
    } catch {
      if (cancelled() || !element.isConnected) return null;
      graphics = createFallback();
    }

    const stage = element.querySelector('.rift-stage');
    stage.append(graphics.canvas);
    element.dataset.renderMode = graphics.mode;

    let destroyed = false, frame = 0, last = 0, time = 0, progress = 0, phase = -1, frames = 0, renderMs = 0, notified = false, impulse = 0;

    graphics.canvas.addEventListener('webglcontextlost', event => {
      if (destroyed) return;
      event.preventDefault();
      graphics.dispose();
      graphics = createFallback();
      stage.replaceChildren(graphics.canvas);
      element.dataset.renderMode = graphics.mode;
      resize();
    }, { once: true });

    const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const scene = element.querySelector('.rift-scene');
    const copy = element.querySelector('.rift-copy');
    const title = copy.querySelector('h1');
    const description = copy.querySelector('p');

    function resize() {
      if (destroyed) return;
      const rect = scene.getBoundingClientRect();
      graphics.resize(Math.max(1, rect.width), Math.max(1, rect.height));
    }

    function setProgress(p) {
      progress = p;
      const next = p < 0.2 ? 0 : p < 0.49 ? 1 : p < 0.83 ? 2 : 3;
      if (next !== phase) {
        phase = next;
        title.textContent = stages[phase][0];
        description.textContent = stages[phase][1];
        const statusEl = element.querySelector('[data-rift-status]');
        if (statusEl) statusEl.textContent = stages[phase][0];
        element.dataset.phase = String(phase);

        const badgeNum = element.querySelector('.badge-num');
        const badgeLabel = element.querySelector('.badge-label');
        if (badgeNum && badgeLabel) {
          badgeNum.textContent = '0' + (phase + 1);
          const stageNames = ['تشتت الأفكار', 'تجليد وفتح الكتاب', 'انبثاق المجسمات الحية', 'انطلاق البوابة'];
          badgeLabel.textContent = stageNames[phase];
        }

        const matrixLabel = element.querySelector('[data-matrix-state]');
        if (matrixLabel) {
          const stateNames = [
            'الكتاب: أوراق متفرقة في الفضاء',
            'جاري تجليد الصفحات وفتح الكتاب',
            'المجسمات نشطة • 6 مسارات دراسية',
            'كتابك مفتوح ومساحتك جاهزة'
          ];
          matrixLabel.textContent = stateNames[phase];
        }
      }

      // Course dots active states in HUD
      element.querySelectorAll('.course-dot').forEach((dot, idx) => {
        const threshold = 0.45 + idx * 0.06;
        dot.classList.toggle('active', p >= threshold);
      });

      const final = smooth(0.82, 0.98, p);
      copy.style.opacity = String(1 - final);
      copy.style.transform = `translateY(${final * -35}px)`;
      copy.style.visibility = final > 0.9 ? 'hidden' : 'visible';

      const finalEl = element.querySelector('.rift-final');
      if (finalEl) {
        finalEl.style.opacity = String(final);
        finalEl.style.transform = `translateY(${(1 - final) * 40}px) scale(${0.88 + final * 0.12})`;
      }

      const progressSpan = element.querySelector('.rift-progress>span');
      if (progressSpan) progressSpan.style.transform = `scaleX(${p})`;

      const percentEl = element.querySelector('.rift-percent');
      if (percentEl) percentEl.textContent = Math.round(p * 100) + '%';

      if (p > 0.99 && !notified) {
        notified = true;
        onSeen();
      }
    }

    function tick(stamp) {
      frame = 0;
      if (destroyed || document.hidden) return;
      const delta = Math.min(50, stamp - last);
      last = stamp;
      time += delta * 0.001;
      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;
      impulse *= 0.96;

      const start = window.performance.now();
      graphics.draw(time, progress, pointer, impulse);
      renderMs = window.performance.now() - start;
      frames++;

      frame = window.requestAnimationFrame(tick);
    }

    function visibility() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden && !destroyed) {
        last = window.performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    }

    element.addEventListener('pointermove', event => {
      const box = scene.getBoundingClientRect();
      target.x = (event.clientX - box.left) / box.width - 0.5;
      target.y = -((event.clientY - box.top) / box.height - 0.5);
    });

    element.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
    });

    element.addEventListener('pointerdown', event => {
      if (!event.target.closest('button,a')) impulse = 1;
    });

    element.querySelector('[data-intro-skip]').addEventListener('click', onSkip);
    element.querySelector('.rift-wordmark').addEventListener('click', event => {
      event.preventDefault();
      onSkip();
    });

    const driver = { p: 0 };
    const timeline = gsap.to(driver, {
      p: 1,
      duration: 1,
      paused: true,
      ease: 'none',
      onUpdate: () => setProgress(driver.p)
    });

    const distance = () => Math.min(2600, Math.max(1800, window.innerHeight * 2.4));
    element.style.height = (window.innerHeight + distance()) + 'px';

    const trigger = ScrollTrigger.create({
      id: 'sem2-rift-intro',
      trigger: element,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: scene,
      pinSpacing: false,
      scrub: 0.55,
      animation: timeline,
      invalidateOnRefresh: true,
      onRefresh: () => {
        element.style.height = (scene.getBoundingClientRect().height + distance()) + 'px';
        resize();
      }
    });

    const observer = new window.ResizeObserver(resize);
    observer.observe(scene);

    document.addEventListener('visibilitychange', visibility);
    resize();
    setProgress(0);
    visibility();

    const handle = {
      element,
      trigger,
      timeline,
      destroy() {
        if (destroyed) return;
        destroyed = true;
        if (frame) window.cancelAnimationFrame(frame);
        observer.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        trigger.kill();
        timeline.kill();
        graphics.dispose();
        element.remove();
        if (current === handle) current = null;
      },
      diagnostics: () => ({
        progress,
        phase,
        mode: graphics.mode,
        frames,
        renderMs: Number(renderMs.toFixed(2)),
        impulse,
        pointer: { ...pointer },
        destroyed
      })
    };

    current = handle;
    return handle;
  };

  window.riftDiagnostics = () => current?.diagnostics() || null;
})();
