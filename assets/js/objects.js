/* Editorial scenes for About, Services and Contact. Policy objects rest by
   default; the homepage street is managed independently. */
(() => {
  'use strict';
  const stages = [...document.querySelectorAll('[data-object]')];
  if (!stages.length) return;
  if (!window.ShreenathSceneSupport?.live) {
    stages.forEach((stage) => window.ShreenathSceneSupport?.show(stage));
    return;
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let library,
    leaving = false;
  addEventListener('pagehide', (event) => {
    if (!event.persisted) leaving = true;
  });
  const engines = new Set();
  let paused = false;
  const motionButton = document.createElement('button');
  motionButton.type = 'button';
  motionButton.className = 'object-motion-toggle';
  motionButton.setAttribute('data-no-translate', '');
  motionButton.hidden = true;
  stages[0].append(motionButton);
  function syncMotionButton() {
    const gu = window.ShreenathLanguage?.get() === 'gu';
    motionButton.textContent = gu
      ? paused
        ? 'ગતિ ચાલુ કરો'
        : 'ગતિ થોભાવો'
      : paused
        ? 'Resume motion'
        : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.hidden = reduced.matches || ![...engines].some((engine) => engine.ambientMotion);
  }
  motionButton.addEventListener('click', () => {
    paused = !paused;
    syncMotionButton();
    engines.forEach((engine) => engine.requestRender());
  });
  reduced.addEventListener('change', syncMotionButton);
  addEventListener('shreenath:language', syncMotionButton);
  const loadThree = () =>
    (library ||=
      window.SHREENATH_THREE ||
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'));

  async function createObject(stage) {
    if (stage.dataset.initialized) return;
    stage.dataset.initialized = 'true';
    let renderer,
      cleanup = () => {};
    const status = stage.querySelector('.scene-status');
    stage.setAttribute('aria-busy', 'true');
    if (status) status.textContent = 'Preparing the sculpture…';
    const wait = setTimeout(() => {
      if (!stage.classList.contains('is-ready') && status)
        status.textContent = 'The sculpture is taking a little longer to load.';
    }, 10000);
    try {
      const T = await loadThree();
      if (!T) throw new Error('Three.js unavailable');
      if (leaving) {
        clearTimeout(wait);
        return;
      }
      const compact = matchMedia('(max-width: 760px)').matches;
      const viewport = stage.querySelector('.object-viewport');
      const type = stage.dataset.object;
      const ambientMotion = ['about', 'services', 'contact'].includes(type);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(35, 1, 0.1, 35);
      camera.position.set(3.4, 2.7, 6.6);
      camera.lookAt(0, 0, 0);
      renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 2 : 1.7));
      const textAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = !compact;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      viewport.append(renderer.domElement);
      const ambient = new T.HemisphereLight(0xfffcf0, 0x969e83, 3.5);
      scene.add(ambient);
      const sun = new T.DirectionalLight(0xfff1d9, 4);
      sun.position.set(-3, 7, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, {
        left: -4,
        right: 4,
        top: 4,
        bottom: -4,
        near: 0.1,
        far: 20
      });
      sun.shadow.normalBias = 0.025;
      sun.shadow.bias = -0.0002;
      scene.add(sun);
      const fill = new T.DirectionalLight(0xffffff, 2);
      fill.position.set(4, 2, -4);
      scene.add(fill);
      const group = new T.Group();
      scene.add(group);
      const motions = [];
      function sway(object, property, axis, amount, speed, phase = 0) {
        const initial = object[property][axis];
        motions.push((time) => {
          object[property][axis] = initial + Math.sin(time * speed + phase) * amount;
        });
      }
      const mat = (color, metalness = 0.05, roughness = 0.48) =>
        new T.MeshStandardMaterial({ color, metalness, roughness });
      const ivory = mat(0xf3efdf),
        clay = mat(0xbd6848),
        sage = mat(0xa5b695);
      const gold = mat(0xd5b980, 0.55, 0.28),
        ink = mat(0x56604d),
        pale = mat(0xd9dfcf);
      const trackedTextures = [];
      const place = (object, x = 0, y = 0, z = 0) => {
        object.position.set(x, y, z);
        return object;
      };
      function mesh(geometry, material, parent = group) {
        const object = new T.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        parent.add(object);
        return object;
      }
      function shape(w, h, r = 0.13) {
        const s = new T.Shape(),
          x = -w / 2,
          y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        return s;
      }
      function extrude(s, depth, material, parent = group) {
        const g = new T.ExtrudeGeometry(s, {
          depth,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.025,
          bevelThickness: 0.025,
          curveSegments: 24
        });
        g.translate(0, 0, -depth / 2);
        return mesh(g, material, parent);
      }
      const box = (w, h, d, material, parent = group, radius = 0.13) =>
        extrude(shape(w, h, Math.min(radius, w / 3, h / 3)), d, material, parent);
      const sphere = (r, material, parent = group) =>
        mesh(new T.SphereGeometry(r, 24, 16), material, parent);
      const ring = (r, tube, material, parent = group, arc = Math.PI * 2) =>
        mesh(new T.TorusGeometry(r, tube, 12, 72, arc), material, parent);
      function line(points, radius, material, parent = group) {
        return mesh(
          new T.TubeGeometry(
            new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
            50,
            radius,
            10,
            false
          ),
          material,
          parent
        );
      }
      function label(text, w, h, color = '#6d6247', background = '#deca99') {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (background) {
          context.fillStyle = background;
          context.fillRect(0, 0, 512, 256);
        }
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = text.length < 4 ? '160px Georgia, serif' : '52px monospace';
        context.fillText(text, 256, 134);
        const texture = new T.CanvasTexture(canvas);
        texture.colorSpace = T.SRGBColorSpace;
        texture.anisotropy = compact ? textAnisotropy : 1;
        trackedTextures.push(texture);
        return new T.Mesh(
          new T.PlaneGeometry(w, h),
          new T.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            transparent: !background,
            depthWrite: Boolean(background)
          })
        );
      }
      function coin(radius, parent = group, text = '©') {
        const coinGroup = new T.Group();
        parent.add(coinGroup);
        const body = mesh(new T.CylinderGeometry(radius, radius, 0.19, 72), gold, coinGroup);
        body.rotation.x = Math.PI / 2;
        place(ring(radius * 0.89, 0.012, gold, coinGroup), 0, 0, 0.106);
        const face = label(text, radius * 1.45, radius * 0.95, '#927747', null);
        coinGroup.add(face);
        face.position.z = 0.101;
        return coinGroup;
      }
      const plinth = mesh(new T.CylinderGeometry(1.63, 1.65, 0.13, 72), pale);
      plinth.position.y = -1.6;
      const floor = mesh(
        new T.PlaneGeometry(15, 15),
        new T.ShadowMaterial({ color: 0x535c42, opacity: 0.15 }),
        scene
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.68;
      floor.castShadow = false;

      const editorialScene = window.ShreenathEditorialScenes?.build({
        T,
        group,
        materials: { ivory, clay, sage, gold, ink, pale },
        motions,
        type,
        trackedTextures,
        compact,
        textAnisotropy
      });
      if (editorialScene) {
        plinth.visible = false;
        floor.position.y = -1.43;
        camera.lookAt(0, -0.3, 0);
      } else if (type === 'about') {
        function arch(material) {
          const s = new T.Shape();
          s.moveTo(-0.85, -1.32);
          s.lineTo(-0.85, 0.15);
          s.absarc(0, 0.15, 0.85, Math.PI, 0, true);
          s.lineTo(0.85, -1.32);
          s.lineTo(0.48, -1.32);
          s.lineTo(0.48, 0.15);
          s.absarc(0, 0.15, 0.48, 0, Math.PI, false);
          s.lineTo(-0.48, -1.32);
          s.closePath();
          return extrude(s, 0.4, material);
        }
        const left = place(arch(ivory), -0.55, -0.2, -0.22);
        left.rotation.y = -0.14;
        const right = place(arch(clay), 0.59, -0.2, 0.29);
        right.rotation.y = 0.12;
        sway(left, 'rotation', 'y', 0.055, 0.5);
        sway(right, 'rotation', 'y', -0.055, 0.5);
        const guide = place(sphere(0.18, gold), 0, -1.36, 0.8);
        sway(guide, 'position', 'x', 0.28, 0.65);
      } else if (type === 'services') {
        const key = new T.Group();
        group.add(key);
        key.rotation.z = -0.35;
        place(ring(0.58, 0.12, gold, key), -0.24, 0.82, 0.22);
        place(box(0.2, 1.53, 0.13, gold, key), -0.24, -0.23, 0.22);
        place(box(0.46, 0.18, 0.13, gold, key), -0.05, -0.7, 0.22);
        place(box(0.39, 0.17, 0.13, gold, key), -0.09, -0.4, 0.22);
        const fob = new T.Group();
        key.add(fob);
        fob.position.set(0.68, -0.08, -0.08);
        fob.rotation.z = 0.18;
        box(0.72, 1.12, 0.17, clay, fob);
        place(ring(0.07, 0.018, gold, fob), 0, 0.39, 0.105);
        line(
          [
            [-0.16, -0.02, 0.12],
            [-0.035, -0.15, 0.12],
            [0.2, 0.15, 0.12]
          ],
          0.022,
          ivory,
          fob
        );
        place(ring(0.38, 0.022, gold, key), 0.3, 0.66, 0.18).rotation.y = 0.65;
        sway(key, 'rotation', 'z', 0.07, 0.7);
        sway(fob, 'rotation', 'z', 0.11, 0.95);
      } else if (type === 'contact') {
        function bubble(material, x, y, z, tilt) {
          const s = shape(1.75, 1.13, 0.18);
          const object = new T.Group();
          group.add(object);
          object.rotation.z = tilt;
          place(object, x, y, z);
          extrude(s, 0.24, material, object);
          const tail = new T.Shape();
          tail.moveTo(-0.4, -0.5);
          tail.lineTo(-0.4, -0.85);
          tail.lineTo(0.02, -0.5);
          tail.closePath();
          extrude(tail, 0.24, material, object);
          return object;
        }
        const first = bubble(ivory, -0.4, 0.42, -0.15, -0.12);
        place(box(1.14, 0.035, 0.025, pale, first), 0, 0.12, 0.16);
        place(box(0.82, 0.035, 0.025, pale, first), -0.16, -0.09, 0.16);
        const second = bubble(clay, 0.45, -0.49, 0.37, 0.13);
        [-0.4, 0, 0.4].forEach((x, i) => {
          const dot = place(sphere(0.064, ivory, second), x, 0, 0.16);
          sway(dot, 'position', 'y', 0.045, 2, i * 0.8);
        });
        sway(first, 'position', 'y', 0.045, 0.65);
        sway(second, 'position', 'y', -0.045, 0.65);
      } else if (type === 'privacy') {
        const lock = new T.Group();
        group.add(lock);
        lock.rotation.z = -0.15;
        place(ring(0.59, 0.115, gold, lock, Math.PI), 0, 0.45, 0);
        [-0.59, 0.59].forEach((x) => place(box(0.2, 0.55, 0.2, gold, lock), x, 0.24, 0));
        place(box(1.68, 1.2, 0.47, sage, lock), 0, -0.4, 0);
        place(sphere(0.11, ink, lock), 0, -0.3, 0.27);
        place(box(0.085, 0.25, 0.035, ink, lock), 0, -0.46, 0.26);
        sway(lock, 'rotation', 'y', 0.12, 0.55);
      } else if (type === 'terms') {
        const paper = new T.Group();
        group.add(paper);
        paper.rotation.z = -0.14;
        paper.rotation.y = -0.15;
        place(box(1.53, 2.08, 0.08, pale, paper), 0.05, -0.07, -0.07);
        box(1.53, 2.08, 0.075, ivory, paper);
        [0.65, 0.31, 0.08, -0.15].forEach((y, i) =>
          place(box(i === 0 ? 0.85 : 1.06, 0.025, 0.018, pale, paper), i === 0 ? -0.1 : 0, y, 0.075)
        );
        line(
          [
            [-0.51, -0.64, 0.08],
            [-0.37, -0.41, 0.08],
            [-0.23, -0.7, 0.08],
            [-0.05, -0.52, 0.08],
            [0.15, -0.62, 0.08]
          ],
          0.014,
          clay,
          paper
        );
        const pen = new T.Group();
        group.add(pen);
        place(pen, 1, -0.02, 0.32);
        pen.rotation.z = -0.33;
        mesh(new T.CylinderGeometry(0.065, 0.065, 1.85, 20), clay, pen);
        place(mesh(new T.CylinderGeometry(0.069, 0.069, 0.36, 20), gold, pen), 0, 0.83, 0);
        const nib = place(mesh(new T.ConeGeometry(0.064, 0.23, 20), gold, pen), 0, -1.04, 0);
        nib.rotation.z = Math.PI;
        place(box(0.025, 0.45, 0.025, gold, pen), 0.08, 0.62, 0);
        sway(pen, 'position', 'y', 0.08, 0.8);
        sway(pen, 'rotation', 'z', 0.045, 0.8);
      } else if (type === 'cancellations') {
        // A cash-return envelope: an object, not a simulated transaction.
        const envelope = new T.Group();
        group.add(envelope);
        envelope.position.y = -0.15;
        envelope.rotation.set(-0.08, -0.12, -0.12);
        place(box(2.18, 1.36, 0.12, clay, envelope), 0, -0.35, -0.19);
        const flap = new T.Shape();
        flap.moveTo(-1.06, 0.3);
        flap.lineTo(0, 1.18);
        flap.lineTo(1.06, 0.3);
        flap.closePath();
        extrude(flap, 0.06, clay, envelope).position.z = -0.24;
        for (let i = 0; i < 3; i++) {
          const note = new T.Group();
          envelope.add(note);
          note.position.set(-0.09 + i * 0.09, 0.3 + i * 0.2, -0.12 + i * 0.08);
          note.rotation.z = (i - 1) * 0.08;
          box(1.75, 0.86, 0.028, i === 1 ? ivory : sage, note, 0.055);
          place(box(1.53, 0.65, 0.009, pale, note, 0.04), 0, 0, 0.032);
          const mark = label('₹', 0.36, 0.35, '#56604d', null);
          note.add(mark);
          place(mark, 0, 0, 0.041);
          [-0.62, 0.62].forEach((x) =>
            place(box(0.045, 0.43, 0.012, sage, note, 0.01), x, 0, 0.044)
          );
        }
        place(box(2.18, 1.16, 0.1, clay, envelope), 0, -0.46, 0.24);
        line(
          [
            [-1, -0.05, 0.31],
            [0, -0.71, 0.31],
            [1, -0.05, 0.31]
          ],
          0.013,
          gold,
          envelope
        );
        place(box(0.53, 0.28, 0.028, gold, envelope, 0.07), 0, -0.15, 0.32);
        const receipt = place(box(0.62, 1.08, 0.035, ivory), 1.02, -0.8, 0.67);
        receipt.rotation.z = -0.18;
        for (let i = 0; i < 4; i++) {
          const rule = place(
            box(i === 3 ? 0.25 : 0.4, 0.025, 0.016, i === 3 ? clay : pale),
            1.02 + Math.sin(0.18) * (0.28 - i * 0.17),
            -0.52 - i * 0.17,
            0.71
          );
          rule.rotation.z = -0.18;
        }
      } else if (type === 'cookies') {
        const switches = new T.Group();
        group.add(switches);
        switches.rotation.z = -0.24;
        [0.67, -0.04, -0.75].forEach((y, i) => {
          place(box(2.08, 0.46, 0.15, i === 1 ? clay : sage, switches, 0.22), 0, y, 0);
          const knob = place(
            mesh(new T.CylinderGeometry(0.185, 0.185, 0.19, 40), ivory, switches),
            i === 1 ? 0.74 : -0.74,
            y,
            0.16
          );
          knob.rotation.x = Math.PI / 2;
        });
        // Keep the illustrated switches in their set positions: motion here
        // must never suggest that the visitor's actual consent has changed.
        sway(switches, 'rotation', 'y', 0.1, 0.55);
      } else if (type === 'copyright') {
        // An original work, its binding and the maker's embossed seal.
        const folio = new T.Group();
        group.add(folio);
        folio.position.set(-0.24, -0.13, -0.05);
        folio.rotation.set(-0.08, -0.2, -0.16);
        box(1.74, 2.2, 0.23, ink, folio, 0.07);
        place(box(1.59, 2.05, 0.08, pale, folio, 0.045), 0.045, 0, 0.16);
        place(box(1.59, 2.05, 0.035, ivory, folio, 0.045), 0.045, 0, 0.23);
        place(box(0.1, 2.13, 0.045, gold, folio, 0.015), -0.75, 0, 0.255);
        [0.62, 0.43].forEach((y, i) =>
          place(box(i ? 0.65 : 1.01, 0.035, 0.012, pale, folio), -0.12, y, 0.264)
        );
        const seal = label('©', 0.64, 0.64, '#ad674b', null);
        folio.add(seal);
        place(seal, 0.05, -0.33, 0.267);
        place(ring(0.4, 0.016, clay, folio), 0.05, -0.33, 0.278);
        const ribbon = place(box(0.17, 0.59, 0.028, clay, folio, 0.015), 0.54, -1.06, 0.17);
        const stamp = new T.Group();
        group.add(stamp);
        stamp.position.set(0.94, -1.18, 0.53);
        stamp.rotation.z = -0.12;
        box(0.76, 0.15, 0.61, gold, stamp, 0.06);
        place(mesh(new T.CylinderGeometry(0.18, 0.25, 0.42, 32), ink, stamp), 0, 0.3, 0);
        const handle = place(sphere(0.29, clay, stamp), 0, 0.6, 0);
        handle.scale.set(1, 0.7, 1);
      } else if (type === 'accessibility') {
        // One uninterrupted route: no steps or physical-access promises.
        const rampShape = new T.Shape();
        rampShape.moveTo(-1.35, -1.33);
        rampShape.bezierCurveTo(-0.48, -1.33, 0.1, -0.42, 1.19, -0.42);
        rampShape.lineTo(1.19, -0.62);
        rampShape.bezierCurveTo(0.1, -0.62, -0.48, -1.53, -1.35, -1.53);
        rampShape.closePath();
        extrude(rampShape, 0.92, sage);
        const route = [
          [-1.3, -0.75, -0.43],
          [-0.63, -0.55, -0.43],
          [0.18, -0.02, -0.43],
          [1.18, 0.16, -0.43]
        ];
        line(route, 0.027, gold);
        [
          [-1.29, -1.32, -0.75],
          [-0.36, -0.93, -0.39],
          [0.6, -0.5, 0.12],
          [1.15, -0.43, 0.16]
        ].forEach(([x, bottom, top]) => {
          place(
            mesh(new T.CylinderGeometry(0.018, 0.018, top - bottom, 12), gold),
            x,
            (bottom + top) / 2,
            -0.43
          );
        });
        const figure = new T.Group();
        group.add(figure);
        figure.position.set(0.53, 0.66, 0.18);
        place(sphere(0.17, clay, figure), 0, 0.51, 0);
        place(box(0.2, 0.43, 0.16, clay, figure, 0.08), 0, 0.12, 0);
        line(
          [
            [-0.43, 0.3, 0],
            [0, 0.24, 0],
            [0.43, 0.3, 0]
          ],
          0.055,
          clay,
          figure
        );
        line(
          [
            [-0.25, -0.42, 0],
            [0, -0.06, 0],
            [0.25, -0.42, 0]
          ],
          0.057,
          clay,
          figure
        );
        place(ring(0.82, 0.028, gold, figure), 0, 0.05, -0.1);
      } else if (type === '404') {
        place(mesh(new T.CylinderGeometry(0.055, 0.055, 2.3, 16), gold), 0, -0.35, 0);
        const sign = new T.Shape();
        sign.moveTo(-1, 0.3);
        sign.lineTo(0.7, 0.3);
        sign.lineTo(1.13, 0.75);
        sign.lineTo(0.7, 1.2);
        sign.lineTo(-1, 1.2);
        sign.closePath();
        const pointer = extrude(sign, 0.18, clay);
        pointer.rotation.z = -0.14;
        const text = label('404', 1.1, 0.59, '#f6ead6', null);
        group.add(text);
        place(text, -0.12, 0.75, 0.116);
        text.rotation.z = -0.14;
        const lower = place(box(1.04, 0.23, 0.1, ivory), -0.28, -0.45, 0.06);
        lower.rotation.z = 0.13;
        sway(pointer, 'rotation', 'z', 0.035, 0.7);
        sway(text, 'rotation', 'z', 0.035, 0.7);
      } else {
        const ticket = new T.Group();
        group.add(ticket);
        ticket.rotation.z = -0.2;
        ticket.rotation.y = -0.15;
        box(2.55, 1.46, 0.11, ivory, ticket);
        place(ring(0.15, 0.024, clay, ticket), -0.82, 0.33, 0.095);
        [0.02, -0.22, -0.46].forEach((y) =>
          place(box(1.18, 0.022, 0.018, pale, ticket), -0.39, y, 0.084)
        );
        for (let i = 0; i < 8; i++)
          place(box(0.025, 0.76, 0.018, ink, ticket), 0.55 + i * 0.063, 0, 0.084);
        for (let i = 0; i < 8; i++)
          place(box(0.012, 0.06, 0.018, pale, ticket), 0.33, -0.6 + i * 0.17, 0.084);
        sway(ticket, 'rotation', 'y', 0.13, 0.65);
      }

      const baseAngle = type === 'about' ? -0.1 : -0.2;
      // Cache visible model bounds once, without the separate shadow plane or
      // hidden plinth. Fit the phone camera to the model, not empty canvas space.
      group.rotation.y = baseAngle;
      group.updateMatrixWorld(true);
      const modelBounds = new T.Box3();
      group.traverseVisible((object) => {
        if (!object.isMesh) return;
        if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
        modelBounds.union(object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld));
      });
      const modelCentre = modelBounds.getCenter(new T.Vector3());
      const viewDirection = new T.Vector3(3.4, editorialScene ? 3 : 2.7, 6.6).normalize();
      let targetX = 0,
        targetY = baseAngle,
        currentX = 0,
        currentY = baseAngle,
        frame = 0,
        visible = true,
        lost = false,
        disposed = false,
        prepared = false;
      let previousTime = 0,
        sceneTime = 0,
        lastShadow = 0;
      function render(now = performance.now()) {
        frame = 0;
        if (
          disposed ||
          lost ||
          (!visible && stage.classList.contains('is-ready')) ||
          document.hidden
        ) {
          previousTime = 0;
          return;
        }
        const live = ambientMotion && !paused && !reduced.matches;
        // Small, slow-moving sculptures do not need a 60 Hz idle render loop.
        if (previousTime && now - previousTime < 32) {
          requestRender();
          return;
        }
        const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
        previousTime = now;
        if (live) sceneTime += dt;
        motions.forEach((update) => update(reduced.matches ? 0 : sceneTime));
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        group.rotation.x = currentX;
        group.rotation.y = currentY;
        if (!lastShadow || now - lastShadow > 120 || !live) {
          renderer.shadowMap.needsUpdate = true;
          lastShadow = now;
        }
        renderer.render(scene, camera);
        const firstFrame = !stage.classList.contains('is-ready');
        stage.classList.add('is-ready');
        window.ShreenathSceneSupport?.ready(stage);
        stage.setAttribute('aria-busy', 'false');
        clearTimeout(wait);
        if (firstFrame && stage.closest('.editorial-hero,.hero,.error-page'))
          dispatchEvent(new CustomEvent('shreenath:hero-ready'));
        if (status) status.textContent = '';
        if (live || Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.0003)
          requestRender();
        else previousTime = 0;
      }
      function palette() {
        const css = getComputedStyle(document.documentElement);
        [
          [ivory, '--scene-ivory'],
          [clay, '--scene-clay'],
          [sage, '--scene-sage'],
          [pale, '--scene-pale'],
          [ink, '--scene-ink'],
          [gold, '--scene-gold']
        ].forEach(([material, key]) => material.color.set(css.getPropertyValue(key).trim()));
        const dark = document.documentElement.dataset.theme === 'dark';
        ambient.intensity = dark ? 2.6 : 3.5;
        renderer.toneMappingExposure = dark ? 1.05 : 1.25;
        floor.material.opacity = dark ? 0.3 : 0.15;
        requestRender();
      }
      addEventListener('shreenath:appearance', palette);
      // Redraw translated scene signs even while motion is paused.
      addEventListener('shreenath:language', requestRender);
      addEventListener('shreenath:language-fonts', requestRender);
      function requestRender() {
        if (prepared && !frame && !disposed && !lost && visible && !document.hidden)
          frame = requestAnimationFrame(render);
      }
      function reset() {
        targetX = 0;
        targetY = baseAngle;
        if (reduced.matches) {
          currentX = targetX;
          currentY = targetY;
        }
        requestRender();
      }
      function scroll() {
        if (!ambientMotion || reduced.matches || compact || !visible || disposed) return;
        const rect = stage.getBoundingClientRect();
        targetY =
          baseAngle +
          T.MathUtils.clamp(
            (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight,
            -1,
            1
          ) *
            0.22;
        requestRender();
      }
      function pointer(event) {
        if (reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
        const r = stage.getBoundingClientRect();
        targetY = baseAngle + ((event.clientX - r.left) / r.width - 0.5) * 0.3;
        targetX = ((event.clientY - r.top) / r.height - 0.5) * 0.12;
        requestRender();
      }
      function resize() {
        const w = viewport.clientWidth,
          h = viewport.clientHeight;
        if (!w || !h || lost) return;
        const mobile = matchMedia('(max-width: 760px)').matches;
        renderer.setPixelRatio(
          Math.min(
            devicePixelRatio || 1,
            mobile ? 2 : 1.7,
            mobile ? Math.sqrt(1400000 / (w * h)) : Infinity
          )
        );
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = camera.aspect < 1 ? 40 : 35;
        camera.position.set(3.4, 2.7, 6.6);
        camera.lookAt(0, editorialScene ? -0.3 : 0, 0);
        if (mobile && !modelBounds.isEmpty()) {
          camera.fov = 35;
          camera.position.copy(modelCentre).addScaledVector(viewDirection, 8);
          camera.lookAt(modelCentre);
          camera.updateMatrixWorld(true);
          const tangent = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
          const corner = new T.Vector3();
          let distance = 0;
          for (const x of [modelBounds.min.x, modelBounds.max.x]) {
            for (const y of [modelBounds.min.y, modelBounds.max.y]) {
              for (const z of [modelBounds.min.z, modelBounds.max.z]) {
                corner.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
                // Reserve room for small live gestures and idle rotation.
                distance = Math.max(
                  distance,
                  8 + corner.z + (Math.abs(corner.x) * 1.14) / (tangent * camera.aspect),
                  8 + corner.z + (Math.abs(corner.y) * 1.14) / tangent
                );
              }
            }
          }
          camera.position.copy(modelCentre).addScaledVector(viewDirection, Math.max(2, distance));
          camera.lookAt(modelCentre);
        }
        camera.updateProjectionMatrix();
        requestRender();
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(viewport);
      const observer = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) scroll();
          if (visible) requestRender();
          else {
            cancelAnimationFrame(frame);
            frame = 0;
          }
        },
        { rootMargin: '60px' }
      );
      observer.observe(stage);
      stage.addEventListener('pointermove', pointer, { passive: true });
      stage.addEventListener('pointerleave', reset);
      reduced.addEventListener('change', reset);
      const engine = { scroll, reset, requestRender, ambientMotion };
      engines.add(engine);
      syncMotionButton();
      renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        lost = true;
        cancelAnimationFrame(frame);
        frame = 0;
        stage.classList.remove('is-ready');
        stage.setAttribute('aria-busy', 'true');
        window.ShreenathSceneSupport?.show(stage);
      });
      renderer.domElement.addEventListener('webglcontextrestored', () => {
        lost = false;
        palette();
        resize();
        syncMotionButton();
        requestRender();
      });
      cleanup = () => {
        if (disposed) return;
        disposed = true;
        editorialScene?.dispose?.();
        clearTimeout(wait);
        removeEventListener('shreenath:appearance', palette);
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        observer.disconnect();
        engines.delete(engine);
        syncMotionButton();
        stage.removeEventListener('pointermove', pointer);
        stage.removeEventListener('pointerleave', reset);
        reduced.removeEventListener('change', reset);
        removeEventListener('shreenath:language', requestRender);
        removeEventListener('shreenath:language-fonts', requestRender);
        const geometries = new Set(),
          materials = new Set();
        scene.traverse((o) => {
          if (o.geometry) geometries.add(o.geometry);
          if (o.material)
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
              materials.add(m)
            );
        });
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        trackedTextures.forEach((t) => t.dispose());
        renderer.dispose();
      };
      // Let document teardown release GPU resources instead of doing a large
      // synchronous disposal in the navigation/snapshot path. BFCache stays live.
      addEventListener('pagehide', () => {
        cancelAnimationFrame(frame);
        frame = 0;
      });
      palette();
      resize();
      scroll();
      group.rotation.set(currentX, currentY, 0);
      // Compile before the first draw; supporting GPUs compile in parallel
      // instead of stalling the page's transition on the render call.
      await renderer.compileAsync(scene, camera);
      if (disposed || leaving) return;
      prepared = true;
      render();
    } catch {
      clearTimeout(wait);
      cleanup();
      renderer?.dispose();
      renderer?.domElement.remove();
      stage.classList.remove('is-ready');
      stage.setAttribute('aria-busy', 'false');
      window.ShreenathSceneSupport?.show(stage);
      if (stage.closest('.editorial-hero,.hero,.error-page'))
        dispatchEvent(new CustomEvent('shreenath:hero-ready'));
    }
  }
  if ('IntersectionObserver' in window) {
    const loader = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loader.unobserve(entry.target);
            createObject(entry.target);
          }
        }),
      { rootMargin: '240px' }
    );
    stages.forEach((stage) => {
      // Hero artwork is eager even when mobile text pushes it below the fold.
      if (stage.closest('.editorial-hero,.hero,.error-page')) createObject(stage);
      else loader.observe(stage);
    });
  } else {
    stages.forEach(createObject);
  }
  let pending = false;
  addEventListener(
    'scroll',
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          engines.forEach((engine) => engine.scroll());
        });
      }
    },
    { passive: true }
  );
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) engines.forEach((engine) => engine.requestRender());
  });
  addEventListener('pageshow', (event) => {
    if (event.persisted) engines.forEach((engine) => engine.requestRender());
  });
})();
