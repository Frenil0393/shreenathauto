/* A small Indian street, built from reusable geometry.
   Decorative illustration: left-hand traffic, signals and a document-check bay.
   No assets or physics engine are fetched beyond the shared Three.js module. */
(() => {
  'use strict';
  const host = document.querySelector('#road-scene');
  if (!host) return;
  if (!window.ShreenathSceneSupport?.live) {
    window.ShreenathSceneSupport?.show(host);
    return;
  }
  const status = host.querySelector('.scene-status'),
    button = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let renderer,
    cleanup = () => {},
    leaving = false;
  const wait = setTimeout(() => {
    if (status && !host.classList.contains('is-ready'))
      status.textContent = 'Preparing the street scene…';
  }, 10000);
  addEventListener('pagehide', (event) => {
    if (!event.persisted) leaving = true;
  });
  async function build() {
    try {
      const T = await (window.SHREENATH_THREE ||
        import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'));
      if (!T) throw new Error('Three.js unavailable');
      if (leaving) {
        clearTimeout(wait);
        return;
      }
      const compact = innerWidth < 761 || window.ShreenathSceneSupport?.limitedGraphics;
      const scene = new T.Scene(),
        world = new T.Group(),
        street = new T.Group();
      scene.add(world);
      world.add(street);
      const camera = new T.OrthographicCamera(-7, 7, 6, -6, 0.1, 70);
      camera.position.set(9, 12, 15);
      camera.lookAt(0, 0.1, 0);
      camera.updateMatrixWorld();
      renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.75 : 1.6));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = !compact;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.append(renderer.domElement);
      const ambient = new T.HemisphereLight(0xfff8e8, 0x84907b, 3.2);
      scene.add(ambient);
      const sun = new T.DirectionalLight(0xfff1dc, 3.5);
      sun.position.set(-4, 10, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, {
        left: -8,
        right: 8,
        top: 7,
        bottom: -7,
        near: 0.1,
        far: 25
      });
      sun.shadow.normalBias = 0.025;
      sun.shadow.bias = -0.0003;
      scene.add(sun);
      const fill = new T.DirectionalLight(0xffffff, 1.6);
      fill.position.set(6, 4, -5);
      scene.add(fill);
      const ownedGeometry = new Set(),
        ownedMaterials = new Set(),
        textures = new Set();
      const mat = (color, roughness = 0.65, metalness = 0.02) => {
        const m = new T.MeshStandardMaterial({ color, roughness, metalness });
        ownedMaterials.add(m);
        return m;
      };
      const m = {
        paper: mat('#eeeadd'),
        paving: mat('#d4d7c9'),
        road: mat('#424941'),
        accent: mat('#bd6848', 0.36, 0.12),
        ink: mat('#27332e'),
        glass: mat('#384d4b', 0.25, 0.2),
        tyre: mat('#212620', 0.85),
        chrome: mat('#b3b8a9', 0.3, 0.55),
        cream: mat('#eae7d8'),
        blue: mat('#7e9899'),
        yellow: mat('#d5ad49'),
        green: mat('#587962'),
        khaki: mat('#ac9367'),
        skin: mat('#9c7050'),
        leaf: mat('#778b65'),
        bark: mat('#8a7358'),
        orange: mat('#cd6941'),
        white: mat('#f1eee1'),
        red: mat('#bd483a'),
        signalOff: mat('#29362c'),
        redOn: mat('#e64934'),
        amberOn: mat('#f5b83c'),
        greenOn: mat('#59b978')
      };
      [m.redOn, m.amberOn, m.greenOn].forEach((material) => {
        material.emissive.copy(material.color);
        material.emissiveIntensity = 0.7;
      });
      const geometry = {
        box: new T.BoxGeometry(1, 1, 1),
        cylinder: new T.CylinderGeometry(1, 1, 1, 12),
        sphere: new T.SphereGeometry(1, 12, 8),
        cone: new T.ConeGeometry(1, 1, 12),
        crown: new T.IcosahedronGeometry(1, 1)
      };
      Object.values(geometry).forEach((g) => ownedGeometry.add(g));
      function part(parent, shape, material, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
        const mesh = new T.Mesh(geometry[shape], material);
        mesh.position.set(x, y, z);
        mesh.scale.set(sx, sy, sz);
        mesh.rotation.set(rx, ry, rz);
        mesh.castShadow = mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      }
      const box = (p, material, x, y, z, w, h, d, ry = 0) =>
        part(p, 'box', material, x, y, z, w, h, d, 0, ry);
      const ball = (p, material, x, y, z, r) => part(p, 'sphere', material, x, y, z, r, r, r);
      // Merge a model by material once. Hundreds of small details become a few
      // draw calls; transformed models reuse their baked geometries.
      function bake(group, dynamic = false, fade = false) {
        group.updateMatrixWorld(true);
        const inverse = new T.Matrix4().copy(group.matrixWorld).invert(),
          batches = new Map();
        group.traverse((object) => {
          if (!object.isMesh) return;
          const transform = new T.Matrix4().multiplyMatrices(inverse, object.matrixWorld);
          const g = object.geometry.clone().applyMatrix4(transform);
          const entry = batches.get(object.material) || [];
          entry.push(g);
          batches.set(object.material, entry);
        });
        group.clear();
        const paint = [];
        batches.forEach((parts, material) => {
          let vertices = 0,
            count = 0;
          parts.forEach((g) => {
            vertices += g.attributes.position.count;
            count += g.index ? g.index.count : g.attributes.position.count;
          });
          const positions = new Float32Array(vertices * 3),
            normals = new Float32Array(vertices * 3),
            indices = new Uint32Array(count);
          let v = 0,
            index = 0;
          parts.forEach((g) => {
            positions.set(g.attributes.position.array, v * 3);
            normals.set(g.attributes.normal.array, v * 3);
            const length = g.index ? g.index.count : g.attributes.position.count;
            for (let j = 0; j < length; j++)
              indices[index++] = v + (g.index ? g.index.array[j] : j);
            v += g.attributes.position.count;
            g.dispose();
          });
          const g = new T.BufferGeometry();
          g.setAttribute('position', new T.BufferAttribute(positions, 3));
          g.setAttribute('normal', new T.BufferAttribute(normals, 3));
          g.setIndex(new T.BufferAttribute(indices, 1));
          g.computeBoundingSphere();
          ownedGeometry.add(g);
          let surface = material;
          if (fade) {
            surface = material.clone();
            surface.transparent = true;
            ownedMaterials.add(surface);
            paint.push({ surface, source: material });
          }
          const mesh = new T.Mesh(g, surface);
          mesh.castShadow = !dynamic;
          mesh.receiveShadow = !dynamic;
          group.add(mesh);
        });
        return paint;
      }
      // One continuous ground for every viewport, without a model perimeter.
      const openGround = new T.Group();
      world.add(openGround);
      box(openGround, m.paving, 0, 0.005, 0, 160, 0.04, 160);
      box(openGround, m.road, 0, 0.045, 0, 160, 0.055, 2.3);
      // The foreground extends beneath the screen-space feather, so no physical
      // asphalt edge appears before it fades to paper at the hero divider.
      box(openGround, m.road, 0, 0.045, 0, 2.3, 0.057, 160);
      for (let i = -72; i <= 72; i++) {
        const distance = i * 0.55;
        if (Math.abs(distance) > 4.65)
          box(openGround, m.white, distance, 0.078, 0, 0.24, 0.008, 0.025);
        if (Math.abs(distance) > 3.35)
          box(openGround, m.white, 0, 0.08, distance, 0.025, 0.008, 0.18);
      }
      bake(openGround);
      box(street, m.road, 2.98, 0.045, -1.61, 3.9, 0.057, 0.86);
      for (let i = -8; i <= 8; i++) {
        const x = i * 0.55;
        if (Math.abs(x) > 1.4) box(street, m.white, x, 0.078, 0, 0.24, 0.008, 0.025);
        const z = i * 0.4;
        if (Math.abs(z) > 1.45) box(street, m.white, 0, 0.08, z, 0.025, 0.008, 0.18);
      }
      // Crossings and stop lines. Indian traffic keeps to the left.
      [-1.5, 1.5].forEach((edge) => {
        for (let i = 0; i < 7; i++) {
          box(street, m.white, edge, 0.083, -0.91 + i * 0.3, 0.24, 0.009, 0.14);
          box(street, m.white, -0.91 + i * 0.3, 0.084, edge, 0.14, 0.009, 0.24);
        }
      });
      box(street, m.white, -1.85, 0.083, -0.59, 0.055, 0.008, 0.94);
      box(street, m.white, 1.85, 0.083, 0.59, 0.055, 0.008, 0.94);
      box(street, m.white, -0.59, 0.083, 1.85, 0.94, 0.008, 0.055);
      box(street, m.white, 0.59, 0.083, -1.85, 0.94, 0.008, 0.055);
      // Black-and-yellow kerbs, broken at the inspection bay entrance.
      for (let i = 0; i < 22; i++) {
        const x = -4.72 + i * 0.45;
        if (Math.abs(x) < 1.35) continue;
        box(street, i % 2 ? m.ink : m.yellow, x, 0.12, 1.23, 0.43, 0.13, 0.14);
        if (x < 1.2) box(street, i % 2 ? m.ink : m.yellow, x, 0.12, -1.23, 0.43, 0.13, 0.14);
      }
      // A purpose-built office pavilion: a clear entrance, two service stations
      // and a cutaway roof that reveals the people without a second render pass.
      const office = new T.Group();
      world.add(office);
      office.position.set(-3.32, 0.075, -2.5);
      const oak = mat('#aa8062', 0.76),
        graphite = mat('#39413e', 0.48, 0.1);
      const upholstery = mat('#8f9d90', 0.88);
      const officeLight = mat('#fff2d2', 0.5);
      officeLight.emissive.set('#ffe5b8');
      officeLight.emissiveIntensity = 0.38;
      function softBox(parent, material, x, y, z, w, h, d, radius = 0.04) {
        const r = Math.min(radius, w / 3, h / 3),
          shape = new T.Shape();
        const l = -w / 2,
          b = -h / 2;
        shape.moveTo(l + r, b);
        shape.lineTo(l + w - r, b);
        shape.quadraticCurveTo(l + w, b, l + w, b + r);
        shape.lineTo(l + w, b + h - r);
        shape.quadraticCurveTo(l + w, b + h, l + w - r, b + h);
        shape.lineTo(l + r, b + h);
        shape.quadraticCurveTo(l, b + h, l, b + h - r);
        shape.lineTo(l, b + r);
        shape.quadraticCurveTo(l, b, l + r, b);
        const g = new T.ExtrudeGeometry(shape, {
          depth: d,
          bevelEnabled: false,
          curveSegments: 4,
          steps: 1
        });
        g.translate(0, 0, -d / 2);
        ownedGeometry.add(g);
        const mesh = new T.Mesh(g, material);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      }
      // Floating stone threshold and a continuous, lightly jointed interior floor.
      softBox(office, m.cream, 0, 0.045, 0, 2.96, 0.09, 2.06, 0.04);
      box(office, m.paper, 0, 0.097, 0, 2.79, 0.016, 1.9);
      [-0.45, 0.45].forEach((x) => box(office, m.paving, x, 0.107, 0, 0.009, 0.002, 1.84));
      box(office, m.paving, 0, 0.107, 0.32, 2.73, 0.002, 0.009);
      // Rear service wall and one stone return; the street-facing corner is glass.
      box(office, m.cream, 0, 0.72, -0.98, 2.94, 1.28, 0.085);
      box(office, m.cream, -1.43, 0.72, -0.28, 0.085, 1.28, 1.48);
      box(office, oak, -0.17, 0.8, -0.928, 2.3, 0.92, 0.025);
      for (let i = 0; i < 22; i++)
        box(office, m.cream, -1.24 + i * 0.102, 0.8, -0.905, 0.018, 0.9, 0.018);
      // A narrow roof over the storage wall, plus a clean portal across the front.
      softBox(office, m.cream, 0, 1.39, -0.76, 3.04, 0.12, 0.51, 0.04);
      softBox(office, m.cream, 0, 1.39, 0.99, 3.04, 0.28, 0.16, 0.04);
      box(office, m.cream, 1.44, 1.39, 0.05, 0.085, 0.12, 1.77);
      box(office, officeLight, 0, 1.285, 0.935, 2.73, 0.018, 0.018);
      [-1.4, 0.66, 1.4].forEach((x) => box(office, graphite, x, 0.735, 1.0, 0.023, 1.18, 0.025));
      box(office, graphite, 1.43, 0.735, -0.92, 0.025, 1.18, 0.025);
      box(office, graphite, 0, 0.135, 1.0, 2.8, 0.025, 0.025);
      box(office, graphite, 1.43, 0.135, 0.04, 0.025, 0.025, 1.92);
      // Quiet storage credenza, with just a few document folders.
      softBox(office, m.cream, -0.18, 0.3, -0.79, 2.15, 0.37, 0.22, 0.025);
      [-0.88, -0.18, 0.52].forEach((x) =>
        box(office, graphite, x, 0.39, -0.67, 0.14, 0.012, 0.015)
      );
      for (let i = 0; i < 5; i++)
        box(office, i % 2 ? m.cream : m.accent, -0.94 + i * 0.075, 0.58, -0.79, 0.05, 0.18, 0.11);
      // One fitted counter with two workspaces and a rounded timber front.
      softBox(office, oak, -0.18, 0.32, -0.1, 2.28, 0.4, 0.42, 0.07);
      softBox(office, m.cream, -0.18, 0.535, -0.1, 2.36, 0.055, 0.49, 0.025);
      box(office, graphite, -0.18, 0.135, 0.118, 2.08, 0.038, 0.018);
      [-0.74, 0.36].forEach((x) => {
        softBox(office, graphite, x + 0.12, 0.715, -0.22, 0.28, 0.2, 0.027, 0.018);
        box(office, m.blue, x + 0.12, 0.715, -0.238, 0.24, 0.16, 0.006);
        box(office, graphite, x + 0.12, 0.59, -0.22, 0.022, 0.07, 0.024);
        box(office, graphite, x + 0.12, 0.57, -0.22, 0.14, 0.014, 0.09);
        box(office, graphite, x + 0.09, 0.571, -0.31, 0.22, 0.012, 0.065);
        box(office, m.white, x - 0.18, 0.573, 0.015, 0.18, 0.018, 0.14, 0.09);
        box(office, m.accent, x - 0.2, 0.588, 0.015, 0.03, 0.009, 0.1);
      });
      function officeSeat(x, z, angle, shirt, adviser) {
        const group = new T.Group();
        office.add(group);
        group.position.set(x, 0.11, z);
        group.rotation.y = angle;
        // Upholstered chair and grounded, bent legs rather than standing figures.
        softBox(group, adviser ? graphite : upholstery, 0, 0.235, 0, 0.29, 0.065, 0.29, 0.024);
        softBox(group, adviser ? graphite : upholstery, 0, 0.385, -0.132, 0.29, 0.3, 0.045, 0.035);
        [-0.1, 0.1].forEach((xx) =>
          [-0.1, 0.1].forEach((zz) => box(group, graphite, xx, 0.11, zz, 0.022, 0.2, 0.022))
        );
        softBox(group, shirt, 0, 0.405, -0.005, 0.19, 0.235, 0.13, 0.035);
        ball(group, m.skin, 0, 0.583, 0.003, 0.071);
        part(group, 'sphere', graphite, 0, 0.622, -0.013, 0.071, 0.035, 0.066);
        [-0.055, 0.055].forEach((xx) => {
          box(group, graphite, xx, 0.272, 0.067, 0.069, 0.071, 0.19);
          box(group, graphite, xx, 0.155, 0.13, 0.06, 0.2, 0.062);
          softBox(group, graphite, xx, 0.05, 0.16, 0.074, 0.04, 0.115, 0.013);
        });
        [-0.116, 0.116].forEach((xx) => {
          box(group, shirt, xx, 0.414, 0.053, 0.051, 0.058, 0.18);
          ball(group, m.skin, xx, 0.414, 0.156, 0.027);
        });
        if (adviser) box(group, m.white, 0.04, 0.442, 0.063, 0.035, 0.045, 0.008);
      }
      officeSeat(-0.74, -0.52, 0, m.blue, true);
      officeSeat(0.36, -0.52, 0, m.cream, true);
      officeSeat(-0.74, 0.47, Math.PI, m.green, false);
      officeSeat(0.36, 0.47, Math.PI, m.accent, false);
      // A customer in the dedicated right-hand aisle, clear of chairs and glazing.
      const arriving = person(office);
      arriving.group.position.set(1.02, 0.11, 0.52);
      arriving.group.rotation.y = -0.4;
      box(arriving.group, m.cream, 0.14, 0.29, 0.075, 0.025, 0.17, 0.12);
      // Entrance mat, level access and a sculptural planter set off the front.
      box(office, graphite, 1.03, 0.11, 0.89, 0.55, 0.015, 0.24);
      softBox(office, m.cream, 1.03, 0.038, 1.14, 0.76, 0.075, 0.31, 0.028);
      part(office, 'cylinder', m.paving, -1.19, 0.22, 0.76, 0.115, 0.22, 0.115);
      part(office, 'crown', m.leaf, -1.19, 0.46, 0.76, 0.14, 0.23, 0.14);
      bake(office);
      // Thin, individually sorted panes avoid layered box faces and allow a clear
      // view inside. No transmission/refraction pass or additional lights needed.
      const officeGlass = mat('#b8d4cf', 0.21, 0.08);
      officeGlass.transparent = true;
      officeGlass.opacity = 0.14;
      officeGlass.depthWrite = false;
      officeGlass.side = T.DoubleSide;
      const glassPlane = new T.PlaneGeometry(1, 1);
      ownedGeometry.add(glassPlane);
      function officePane(x, y, z, w, h, rotation = 0) {
        const mesh = new T.Mesh(glassPlane, officeGlass);
        mesh.position.set(office.position.x + x, office.position.y + y, office.position.z + z);
        mesh.scale.set(w, h, 1);
        mesh.rotation.y = rotation;
        mesh.castShadow = mesh.receiveShadow = false;
        world.add(mesh);
      }
      officePane(-0.375, 0.73, 1.002, 2.025, 1.15);
      officePane(1.43, 0.73, 0.04, 1.92, 1.15, Math.PI / 2);
      // Hinged glass door sits inside the entry rather than projecting into the road.
      officePane(1.205, 0.73, 0.79, 0.6, 1.15, -1.0);
      // A separate shaded checkpoint. No official insignia.
      [1.87, 3.41].forEach((x) =>
        part(street, 'cylinder', m.chrome, x, 0.54, -2.97, 0.025, 1, 0.025)
      );
      box(street, m.cream, 2.64, 1.09, -2.88, 1.95, 0.07, 0.98);
      box(street, m.accent, 2.64, 1.055, -2.38, 1.95, 0.12, 0.035);
      box(street, m.cream, 2.64, 0.3, -2.92, 0.85, 0.45, 0.42);
      box(street, m.ink, 2.64, 0.54, -2.92, 0.94, 0.045, 0.5);
      for (const x of [-4.2, 3.95]) {
        part(street, 'cylinder', m.bark, x, 0.52, 2.37, 0.065, 0.94, 0.065);
        part(street, 'crown', m.leaf, x, 1.22, 2.37, 0.48, 0.66, 0.46);
        box(street, m.paper, x, 0.13, 2.37, 0.7, 0.22, 0.7);
      }
      // A modest yellow barricade and reflective cones beside the bay.
      const barricade = new T.Group();
      street.add(barricade);
      [-0.5, 0.5].forEach((x) => {
        box(barricade, m.yellow, x, 0.34, 0, 0.055, 0.55, 0.055);
        box(barricade, m.ink, x, 0.09, 0, 0.25, 0.055, 0.28);
      });
      box(barricade, m.yellow, 0, 0.5, 0, 1.2, 0.17, 0.06);
      for (let i = 0; i < 5; i++)
        box(barricade, m.ink, -0.48 + i * 0.24, 0.5, 0.035, 0.07, 0.17, 0.012);
      barricade.position.set(3.88, 0, -2.18);
      barricade.rotation.y = -0.16;
      [1.2, 1.58, 4.55].forEach((x) => {
        box(street, m.ink, x, 0.09, -1.18, 0.17, 0.025, 0.17);
        part(street, 'cone', m.orange, x, 0.23, -1.18, 0.074, 0.27, 0.074);
        part(street, 'cylinder', m.white, x, 0.24, -1.18, 0.039, 0.055, 0.039);
      });
      bake(street);
      const streetSigns = [];
      function drawSign(record) {
        const { canvas, text, texture } = record;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e9e5d5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#344137';
        let size = compact ? 92 : text === 'SHREENATH AUTO OFFICE' ? 72 : 37;
        const copy = window.ShreenathLanguage?.text(text) ?? text;
        const font =
          window.ShreenathLanguage?.get() === 'gu'
            ? '500 SIZEpx "Hind Vadodara", sans-serif'
            : 'bold SIZEpx sans-serif';
        ctx.font = font.replace('SIZE', size);
        if (compact)
          size *= Math.min(1, (canvas.width - 64) / Math.max(1, ctx.measureText(copy).width));
        ctx.font = font.replace('SIZE', size);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(copy, canvas.width / 2, canvas.height / 2 + 3, canvas.width - 64);
        texture.needsUpdate = true;
      }
      function sign(text, x, y, z, width, angle = 0, height = width / 4, parent = world) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(2048, Math.round((128 * width) / height));
        canvas.height = 128;
        const texture = new T.CanvasTexture(canvas);
        texture.colorSpace = T.SRGBColorSpace;
        texture.anisotropy = compact ? Math.min(4, renderer.capabilities.getMaxAnisotropy()) : 1;
        textures.add(texture);
        const record = { canvas, text, texture };
        streetSigns.push(record);
        drawSign(record);
        const material = new T.MeshBasicMaterial({
          map: texture,
          side: T.DoubleSide,
          toneMapped: !compact
        });
        ownedMaterials.add(material);
        const g = new T.PlaneGeometry(width, height);
        ownedGeometry.add(g);
        const mesh = new T.Mesh(g, material);
        mesh.position.set(x, y, z);
        mesh.rotation.y = angle;
        parent.add(mesh);
      }
      sign('DOCUMENT CHECK', 2.64, 0.92, -2.36, 1.45);
      sign('SHREENATH AUTO OFFICE', -3.32, 1.465, -1.419, 2.6, 0, 0.24);
      // A small neighbourhood market, kept clear of the inspection lane.
      // Shop details, people and produce share material batches, not draw calls.
      const market = new T.Group();
      world.add(market);
      const rearDistrict = new T.Group(),
        rearBuildings = new T.Group();
      world.add(rearDistrict);
      rearDistrict.add(rearBuildings);
      function shop(x, z, width, colour, label, angle = 0, parent = market, signParent = world) {
        const g = new T.Group();
        parent.add(g);
        g.position.set(x, 0.075, z);
        g.rotation.y = angle;
        box(g, m.cream, 0, 0.62, 0, width, 1.24, 1.02);
        box(g, m.ink, 0, 0.57, 0.516, width - 0.16, 0.98, 0.025);
        box(g, oak, 0, 0.14, 0.65, width + 0.13, 0.12, 1.35);
        box(g, m.cream, 0, 1.28, 0, width + 0.12, 0.1, 1.14);
        box(g, colour, 0, 1.07, 0.76, width + 0.16, 0.06, 0.63);
        box(g, colour, 0, 1, 0.99, width + 0.16, 0.15, 0.045);
        for (let i = 0; i < 7; i++)
          box(g, m.cream, -width * 0.45 + i * width * 0.15, 1.105, 0.76, 0.055, 0.008, 0.62);
        [-0.39, 0.12, 0.6].forEach((y) =>
          box(g, oak, 0, 0.52 + y * 0.5, 0.53, width - 0.24, 0.025, 0.18)
        );
        for (let row = 0; row < 3; row++)
          for (let col = 0; col < 6; col++) {
            box(
              g,
              [m.yellow, m.green, m.accent, m.cream][(row + col) % 4],
              -width * 0.34 + col * width * 0.135,
              0.39 + row * 0.19,
              0.56,
              0.105,
              0.13,
              0.095
            );
          }
        sign(
          label,
          x + Math.sin(angle) * 0.603,
          1.25,
          z + Math.cos(angle) * 0.603,
          width - 0.15,
          angle,
          0.2,
          signParent
        );
        return g;
      }
      shop(4.55, -3.13, 1.58, m.green, 'KIRANA');
      shop(2.75, -4.13, 1.65, m.blue, 'CYCLE REPAIR');
      shop(-3.27, -4.2, 1.08, m.accent, 'STATIONERY', Math.PI / 2);
      // Continue the neighbourhood along BOTH sides of the rear road. These
      // outer blocks belong to the wide crop, outside the compact mobile model.
      [-1, 1].forEach((side) => {
        box(rearBuildings, m.paper, side * 2.6, 0.08, -8, 2.85, 0.12, 8.3);
        for (let i = 0; i < 19; i++)
          box(
            rearBuildings,
            i % 2 ? m.ink : m.yellow,
            side * 1.27,
            0.13,
            -4.4 - i * 0.4,
            0.12,
            0.15,
            0.38
          );
        const labels =
          side < 0 ? ['DAIRY', 'TAILOR', 'GENERAL STORE'] : ['PHARMACY', 'KIRANA', 'FRUIT & VEG'];
        labels.forEach((label, i) => {
          const z = -5.7 - i * 2.3 + (side > 0 ? -0.4 : 0),
            angle = side < 0 ? Math.PI / 2 : -Math.PI / 2;
          const block = shop(
            side * 2.5,
            z,
            1.65 + i * 0.08,
            [m.blue, m.green, m.accent][i],
            label,
            angle,
            rearBuildings,
            rearDistrict
          );
          // Varied upper rooms, shaded windows and restrained roof details.
          if (i !== 1) {
            box(block, m.paper, 0, 1.65, -0.05, 1.7, 0.65, 0.99);
            box(block, m.cream, 0, 2, -0.05, 1.82, 0.07, 1.12);
            [-0.4, 0.4].forEach((x) => {
              box(block, m.glass, x, 1.67, 0.454, 0.38, 0.31, 0.015);
              box(block, m.cream, x, 1.89, 0.52, 0.46, 0.045, 0.2);
              box(block, m.chrome, x, 1.67, 0.47, 0.017, 0.31, 0.02);
            });
            if (i === 2) part(block, 'cylinder', m.ink, 0.43, 2.18, -0.15, 0.2, 0.32, 0.2);
          }
          const shopper = person(rearBuildings, false, false, [m.cream, m.blue, m.accent][i]);
          shopper.group.position.set(side * 1.56, 0.15, z + 0.38);
          shopper.group.rotation.y = side < 0 ? -Math.PI / 2 : Math.PI / 2;
          box(shopper.group, oak, 0.16, 0.18, 0.08, 0.13, 0.19, 0.075);
        });
        [-6.8, -9.1].forEach((z) => {
          box(rearBuildings, m.cream, side * 3.66, 0.2, z, 0.5, 0.22, 0.5);
          part(rearBuildings, 'cylinder', m.bark, side * 3.66, 0.62, z, 0.045, 0.78, 0.045);
          part(rearBuildings, 'crown', m.leaf, side * 3.66, 1.2, z, 0.37, 0.53, 0.37);
          part(rearBuildings, 'cylinder', m.ink, side * 1.42, 0.96, z, 0.02, 1.7, 0.02);
          box(rearBuildings, m.ink, side * 1.42, 1.83, z, 0.31, 0.055, 0.2);
          box(rearBuildings, m.cream, side * 1.42, 1.8, z, 0.25, 0.015, 0.15);
        });
      });
      bake(rearBuildings);
      const chai = new T.Group();
      market.add(chai);
      chai.position.set(2.65, 0.075, 2.47);
      chai.rotation.y = -0.23;
      box(chai, oak, 0, 0.3, 0, 1.05, 0.52, 0.46);
      box(chai, m.chrome, 0, 0.585, 0, 1.13, 0.045, 0.53);
      [-0.5, 0.5].forEach((x) => part(chai, 'cylinder', m.ink, x, 0.7, -0.18, 0.018, 1.3, 0.018));
      box(chai, m.accent, 0, 1.36, 0.03, 1.25, 0.08, 0.91);
      box(chai, m.cream, 0, 1.31, 0.475, 1.25, 0.13, 0.035);
      part(chai, 'cylinder', m.chrome, -0.26, 0.72, 0, 0.12, 0.22, 0.12);
      part(chai, 'sphere', m.chrome, -0.26, 0.85, 0, 0.13, 0.04, 0.13);
      box(chai, m.ink, -0.26, 0.9, 0, 0.09, 0.025, 0.035);
      [-0.04, 0.11, 0.26].forEach((x) =>
        part(chai, 'cylinder', m.cream, x, 0.64, 0.13, 0.032, 0.065, 0.032)
      );
      sign('CHAI & NASHTA', 2.65, 1.4, 2.97, 1.14, -0.23, 0.18);
      // Timber produce cart: baskets of mangoes, tomatoes and leafy vegetables.
      const cart = new T.Group();
      market.add(cart);
      cart.position.set(-2.52, 0.075, 2.38);
      cart.rotation.y = 0.15;
      box(cart, m.green, 0, 0.36, 0, 0.96, 0.12, 0.5);
      [-0.36, 0.36].forEach((x) =>
        part(cart, 'cylinder', m.tyre, x, 0.17, 0, 0.16, 0.045, 0.16, 0, 0, Math.PI / 2)
      );
      [-0.3, 0, 0.3].forEach((x, index) => {
        box(cart, oak, x, 0.455, 0, 0.27, 0.09, 0.43);
        for (let a = 0; a < 2; a++)
          for (let b = 0; b < 3; b++)
            ball(
              cart,
              [m.yellow, m.red, m.leaf][index],
              x - 0.065 + a * 0.13,
              0.54,
              -0.13 + b * 0.13,
              0.058
            );
      });
      box(cart, m.chrome, 0.58, 0.48, 0, 0.28, 0.025, 0.36);
      // A bench and a practical litter bin beside the tea stall.
      box(market, oak, 3.74, 0.34, 2.95, 0.78, 0.07, 0.32);
      box(market, oak, 3.74, 0.55, 3.08, 0.78, 0.32, 0.04);
      [3.45, 4.03].forEach((x) => box(market, m.ink, x, 0.18, 2.95, 0.045, 0.31, 0.28));
      part(market, 'cylinder', m.green, 4.5, 0.28, 1.73, 0.14, 0.42, 0.14);
      part(market, 'cylinder', m.ink, 4.5, 0.5, 1.73, 0.15, 0.035, 0.15);
      // Different clothing, head angles and carried bags keep the street human.
      function customer(x, z, angle, cloth, bag = false) {
        const p = person(market, false, false, cloth);
        p.group.position.set(x, 0.09, z);
        p.group.rotation.y = angle;
        part(p.group, 'sphere', m.ink, 0, 0.574, -0.008, 0.071, 0.035, 0.066);
        p.arm.rotation.x = -0.3;
        if (bag) {
          box(p.group, oak, 0.16, 0.18, 0.08, 0.13, 0.19, 0.075);
          box(p.group, m.cream, 0.16, 0.3, 0.08, 0.035, 0.065, 0.025);
        }
        return p;
      }
      customer(2.65, 2.13, 0.1, m.cream);
      customer(2.33, 3.22, Math.PI, m.blue, true);
      customer(3.05, 3.26, Math.PI + 0.2, m.accent);
      customer(-2.54, 1.9, 0.15, m.cream);
      customer(-3.16, 2.91, 2.5, m.green, true);
      customer(4.42, -2.28, Math.PI, m.accent, true);
      customer(3.16, -3.38, Math.PI, m.khaki);
      const cycle = new T.Group();
      market.add(cycle);
      cycle.position.set(2.72, 0.09, -3.54);
      cycle.rotation.y = Math.PI / 2;
      const rim = new T.TorusGeometry(0.16, 0.019, 6, 18);
      ownedGeometry.add(rim);
      [-0.25, 0.25].forEach((z) => {
        const wheel = new T.Mesh(rim, m.tyre);
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(0, 0.17, z);
        cycle.add(wheel);
        part(cycle, 'cylinder', m.chrome, 0, 0.17, z, 0.012, 0.3, 0.012, 0, 0, Math.PI / 2);
      });
      function cycleTube(a, b, material = m.green) {
        const start = new T.Vector3(...a),
          end = new T.Vector3(...b),
          direction = end.clone().sub(start);
        const midpoint = start.clone().add(end).multiplyScalar(0.5);
        const tube = part(
          cycle,
          'cylinder',
          material,
          midpoint.x,
          midpoint.y,
          midpoint.z,
          0.014,
          direction.length(),
          0.014
        );
        tube.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize());
      }
      const rear = [0, 0.17, -0.25],
        pedal = [0, 0.15, 0],
        seat = [0, 0.42, -0.1],
        head = [0, 0.43, 0.18],
        front = [0, 0.17, 0.25];
      [
        [rear, pedal],
        [rear, seat],
        [seat, pedal],
        [seat, head],
        [head, pedal],
        [head, front]
      ].forEach(([a, b]) => cycleTube(a, b));
      box(cycle, m.ink, 0, 0.455, -0.1, 0.12, 0.035, 0.13);
      box(cycle, m.chrome, 0, 0.48, 0.18, 0.22, 0.022, 0.022);
      bake(market);
      // Four compact signals. Coloured lights retain their meaning in all themes.
      const signals = [];
      function signal(x, z, angle, axis) {
        const group = new T.Group();
        world.add(group);
        group.position.set(x, 0.075, z);
        group.rotation.y = angle;
        part(group, 'cylinder', m.ink, 0, 0.6, 0, 0.025, 1.2, 0.025);
        box(group, m.ink, 0, 1.12, 0.025, 0.19, 0.48, 0.14);
        bake(group);
        const bulbs = [0, 1, 2].map((i) =>
          ball(group, m.signalOff, 0, 1.265 - i * 0.145, 0.108, 0.052)
        );
        signals.push({ bulbs, axis });
      }
      signal(-1.94, -1.18, -Math.PI / 2, 'main');
      signal(1.94, 1.18, Math.PI / 2, 'main');
      signal(-1.18, 1.94, 0, 'cross');
      signal(1.18, -1.94, Math.PI, 'cross');
      function person(parent, police = false, helmet = false, clothing = m.blue) {
        const p = new T.Group();
        parent.add(p);
        const cloth = police ? m.khaki : clothing;
        box(p, cloth, 0, 0.35, 0, 0.19, 0.25, 0.12);
        [-0.054, 0.054].forEach((x) => {
          box(p, cloth, x, 0.15, 0, 0.07, 0.22, 0.08);
          box(p, m.ink, x, 0.043, 0.025, 0.085, 0.05, 0.13);
        });
        ball(p, m.skin, 0, 0.53, 0, 0.071);
        if (police) {
          part(p, 'cylinder', m.khaki, 0, 0.584, 0, 0.083, 0.047, 0.083);
          box(p, m.khaki, 0, 0.575, 0.064, 0.13, 0.018, 0.065);
          box(p, m.ink, 0, 0.27, 0.005, 0.2, 0.024, 0.127);
        }
        if (helmet) part(p, 'sphere', m.ink, 0, 0.55, -0.003, 0.082, 0.084, 0.079);
        const arm = new T.Group();
        arm.position.set(-0.125, 0.44, 0);
        p.add(arm);
        box(arm, cloth, 0, -0.08, 0, 0.06, 0.18, 0.065);
        if (police) {
          // A small open palm reads as a stop gesture when the arm rises.
          box(arm, m.skin, 0, -0.188, 0, 0.027, 0.06, 0.066);
          [-0.024, -0.008, 0.008, 0.024].forEach((z) =>
            box(arm, m.skin, 0, -0.229, z, 0.022, 0.039, 0.012)
          );
          box(arm, m.skin, 0, -0.182, 0.045, 0.025, 0.03, 0.035);
        } else ball(arm, m.skin, 0, -0.185, 0, 0.033);
        box(p, cloth, 0.13, 0.34, 0, 0.06, 0.2, 0.065);
        ball(p, m.skin, 0.13, 0.22, 0, 0.033);
        return { group: p, arm };
      }
      const officer = person(world, true);
      officer.group.position.set(2.66, 0.075, -2.19);
      const helper = person(world, true);
      helper.group.position.set(1.2, 0.075, -2.7);
      helper.group.rotation.y = -0.5;
      const visitor = person(world);
      visitor.group.rotation.y = Math.PI / 2;
      box(visitor.group, m.white, 0.14, 0.29, 0.1, 0.015, 0.17, 0.14);
      [officer, helper, visitor].forEach((character) => {
        character.group.remove(character.arm);
        bake(character.group, true);
        bake(character.arm, true);
        character.group.add(character.arm);
      });
      // Vehicle models face local +Z. All use the same wheel and box geometries.
      function vehicle(type, paint) {
        const group = new T.Group();
        const truck = type === 'truck',
          auto = type === 'auto',
          bike = type === 'bike';
        // Isolate bodywork from shared uniforms, road signs and number plates.
        const bodyPaint = paint.clone(),
          secondaryPaint = m.green.clone();
        ownedMaterials.add(bodyPaint);
        ownedMaterials.add(secondaryPaint);
        const length = truck ? 1.24 : bike ? 0.63 : auto ? 0.75 : 0.83;
        const width = truck ? 0.47 : bike ? 0.18 : 0.39;
        function wheel(x, z, r = 0.095) {
          part(group, 'cylinder', m.tyre, x, r, z, r, 0.055, r, 0, 0, Math.PI / 2);
          part(
            group,
            'cylinder',
            m.chrome,
            x * 1.03,
            r,
            z,
            r * 0.46,
            0.058,
            r * 0.46,
            0,
            0,
            Math.PI / 2
          );
        }
        if (bike) {
          wheel(0, -0.23, 0.1);
          wheel(0, 0.23, 0.1);
          box(group, bodyPaint, 0, 0.23, 0, 0.16, 0.13, 0.33);
          box(group, m.ink, 0, 0.3, -0.08, 0.17, 0.035, 0.2);
          box(group, m.chrome, 0, 0.32, 0.22, 0.28, 0.025, 0.025);
          box(group, m.white, 0, 0.28, 0.295, 0.1, 0.055, 0.04);
          const rider = person(group, false, true);
          rider.group.scale.setScalar(0.7);
          rider.group.position.set(0, 0.12, -0.04);
          rider.arm.rotation.x = -1;
        } else {
          const wheelX = width / 2 + 0.02;
          if (auto) {
            wheel(0, 0.25);
            [-wheelX, wheelX].forEach((x) => wheel(x, -0.24));
          } else
            for (const x of [-wheelX, wheelX])
              for (const z of truck ? [-0.41, 0.39] : [-0.25, 0.25])
                wheel(x, z, truck ? 0.11 : 0.095);
          if (truck) {
            box(group, m.cream, 0, 0.23, 0, 0.44, 0.13, 1.2);
            box(group, bodyPaint, 0, 0.4, 0.38, 0.46, 0.35, 0.39);
            box(group, m.glass, 0, 0.5, 0.584, 0.35, 0.16, 0.014);
            box(group, secondaryPaint, 0, 0.48, -0.24, 0.47, 0.51, 0.82);
            for (let i = 0; i < 5; i++)
              box(group, m.khaki, 0, 0.48, -0.57 + i * 0.17, 0.48, 0.025, 0.025);
          } else if (auto) {
            box(group, secondaryPaint, 0, 0.23, -0.015, 0.38, 0.19, 0.62);
            box(group, bodyPaint, 0, 0.53, -0.04, 0.41, 0.07, 0.63);
            box(group, m.glass, 0, 0.41, 0.237, 0.34, 0.21, 0.02);
            [-0.18, 0.18].forEach((x) => box(group, bodyPaint, x, 0.41, -0.29, 0.032, 0.24, 0.035));
            box(group, m.ink, 0, 0.32, -0.1, 0.31, 0.055, 0.3);
          } else {
            box(group, bodyPaint, 0, 0.22, 0, 0.39, 0.2, 0.79);
            box(group, m.glass, 0, 0.375, -0.025, 0.32, 0.17, 0.42);
            box(group, bodyPaint, 0, 0.47, -0.04, 0.34, 0.04, 0.32);
          }
          [-width * 0.31, width * 0.31].forEach((x) =>
            box(group, m.white, x, 0.25, length / 2 + 0.006, 0.085, 0.04, 0.018)
          );
          box(
            group,
            truck || auto ? m.yellow : m.white,
            0,
            0.175,
            length / 2 + 0.02,
            0.14,
            0.035,
            0.016
          );
          [-width * 0.34, width * 0.34].forEach((x) =>
            box(group, m.red, x, 0.25, -length / 2, 0.07, 0.04, 0.016)
          );
        }
        const materials = bake(group, true, true);
        world.add(group);
        return {
          group,
          length,
          materials,
          bodyPaint,
          secondaryPaint,
          originalPaint: paint,
          s: 0,
          speed: 0,
          opacity: -1
        };
      }
      const lanes = [
        { axis: 'main', direction: 1, start: -5.6, end: 5.6, actors: [] },
        { axis: 'main', direction: -1, start: -5.6, end: 5.6, actors: [] },
        { axis: 'cross', direction: 1, start: -4.3, end: 4.3, actors: [] },
        { axis: 'cross', direction: -1, start: -4.3, end: 4.3, actors: [] }
      ];
      function add(lane, type, material, s) {
        const actor = vehicle(type, material);
        actor.s = s;
        lane.actors.push(actor);
        return actor;
      }
      add(lanes[0], 'car', m.accent, -2.5);
      add(lanes[0], 'truck', m.blue, -4.3);
      add(lanes[1], 'auto', m.yellow, -0.3);
      add(lanes[1], 'car', m.cream, -3.1);
      add(lanes[2], 'bike', m.accent, -2.35);
      add(lanes[2], 'car', m.blue, -3.6);
      add(lanes[3], 'bike', m.cream, 0.9);
      add(lanes[3], 'auto', m.yellow, -2.4);
      const inspection = vehicle('car', m.cream);
      inspection.group.rotation.y = Math.PI / 2;
      const allActors = [...lanes.flatMap((lane) => lane.actors), inspection];
      let lastPhase = '';
      const smooth = (value) => {
        const t = T.MathUtils.clamp(value, 0, 1);
        return t * t * (3 - 2 * t);
      };
      function fadeActor(actor, opacity) {
        actor.group.visible = opacity > 0.005;
        if (Math.abs(actor.opacity - opacity) < 0.003) return;
        actor.opacity = opacity;
        actor.materials.forEach(({ surface }) => {
          surface.opacity = opacity;
        });
      }
      function traffic(seconds, dt) {
        const phase = seconds % 30;
        // Long clearance intervals let the final vehicle clear before cross traffic.
        const main = phase < 10 ? 2 : phase < 12 ? 1 : 0;
        const cross = phase >= 16 && phase < 23 ? 2 : phase >= 23 && phase < 25 ? 1 : 0;
        const state = main + ':' + cross;
        if (state !== lastPhase) {
          signals.forEach((signal) =>
            signal.bulbs.forEach((bulb, i) => {
              const active = signal.axis === 'main' ? main : cross;
              bulb.material =
                i === (active === 2 ? 2 : active === 1 ? 1 : 0)
                  ? [m.redOn, m.amberOn, m.greenOn][i]
                  : m.signalOff;
            })
          );
          lastPhase = state;
        }
        lanes.forEach((lane) => {
          lane.actors.sort((a, b) => b.s - a.s);
          let leader = null;
          lane.actors.forEach((actor) => {
            const stop = -1.87 - actor.length / 2;
            let available = leader
              ? leader.s - leader.length / 2 - actor.s - actor.length / 2 - 0.28
              : Infinity;
            if ((lane.axis === 'main' ? main : cross) !== 2 && actor.s <= stop + 0.025)
              available = Math.min(available, stop - actor.s);
            const cruising = lane.axis === 'main' ? 0.85 : 0.76;
            const desired = Math.min(cruising, Math.sqrt(Math.max(0, 2 * 1.1 * available)));
            actor.speed += T.MathUtils.clamp(desired - actor.speed, -1.65 * dt, 0.62 * dt);
            actor.s += Math.max(0, Math.min(actor.speed * dt, available));
            if (lane.axis === 'main') {
              actor.group.position.set(lane.direction * actor.s, 0.078, -0.57 * lane.direction);
              actor.group.rotation.y = (lane.direction * Math.PI) / 2;
            } else {
              actor.group.position.set(0.57 * lane.direction, 0.078, lane.direction * actor.s);
              actor.group.rotation.y = lane.direction === 1 ? 0 : Math.PI;
            }
            const visibleEdge = lane.axis === 'main' ? 4.65 : 3.3;
            fadeActor(actor, smooth((visibleEdge + 0.45 - Math.abs(actor.s)) / 0.6));
            leader = actor;
          });
          // Recycle only beyond the cutaway, and only when entry spacing is clear.
          lane.actors.forEach((actor) => {
            if (
              actor.s > lane.end &&
              lane.actors.every(
                (other) => other === actor || other.s > lane.start + actor.length + 0.65
              )
            ) {
              actor.s = lane.start;
              actor.speed = 0.4;
            }
          });
        });
        // A service lane stays separate from through traffic; arrivals, a short
        // inspection, then a release repeat without blocking the junction.
        const checkTime = seconds % 22;
        let x;
        if (checkTime < 6) x = 0.94 + 1.72 * smooth(checkTime / 6);
        else if (checkTime < 13.8) x = 2.66;
        else if (checkTime < 20) x = 2.66 + 2.54 * smooth((checkTime - 13.8) / 6.2);
        else x = 5.2;
        inspection.group.position.set(x, 0.079, -1.67);
        fadeActor(inspection, smooth(checkTime / 1.2) * (1 - smooth((checkTime - 18) / 2)));
        // Raise the hand at 2s, well before the car finishes braking at 6s.
        // Lower it from 12–13.2s; the car waits until 13.8s before moving.
        const stopGesture = smooth((checkTime - 2) / 1.1) * (1 - smooth((checkTime - 12) / 1.2));
        officer.arm.rotation.x = T.MathUtils.lerp(0, -Math.PI / 2, stopGesture);
        officer.arm.rotation.z = 0;
        officer.group.rotation.y = -0.13 - 0.29 * smooth((checkTime - 13.2) / 1.4);
        // A visitor approaches the second officer with a document, then listens.
        const visit = seconds % 30;
        const walk = visit < 8 ? smooth(visit / 8) : visit < 22 ? 1 : 1 - smooth((visit - 22) / 8);
        visitor.group.position.set(
          1.64 - walk * 0.13,
          0.079 + (walk > 0 && walk < 1 ? Math.abs(Math.sin(seconds * 4)) * 0.013 : 0),
          -3.35 + walk * 0.68
        );
        visitor.group.rotation.y =
          visit < 22 ? (-Math.PI / 2) * smooth((walk - 0.8) / 0.2) : Math.PI;
        helper.arm.rotation.x = -0.65 + (walk > 0.98 ? Math.sin(seconds) * 0.15 : 0);
      }
      let frame = 0,
        last = 0,
        simulation = 0,
        visible = true,
        paused = false,
        lost = false,
        disposed = false,
        prepared = false;
      let targetX = 0,
        targetY = 0,
        angleX = 0,
        angleY = 0;
      function requestRender() {
        if (prepared && !frame && visible && !document.hidden && !lost && !disposed)
          frame = requestAnimationFrame(render);
      }
      function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
      function render(now) {
        frame = 0;
        if (
          (!visible && host.classList.contains('is-ready')) ||
          document.hidden ||
          lost ||
          disposed
        ) {
          last = 0;
          return;
        }
        // Mobile animation is intentionally capped at 30 fps; simulation uses time.
        if (compact && last && now - last < 31) {
          requestRender();
          return;
        }
        const dt = last ? Math.min((now - last) / 1000, 0.06) : 0;
        last = now;
        const moving = !paused && !reduced.matches;
        if (moving) simulation += dt;
        const easing = 1 - Math.exp(-7 * (dt || 1 / 60));
        angleX += (targetX - angleX) * easing;
        angleY += (targetY - angleY) * easing;
        const settling = Math.abs(targetX - angleX) + Math.abs(targetY - angleY) > 0.0002;
        world.rotation.set(angleX, angleY, 0);
        if (settling) renderer.shadowMap.needsUpdate = true;
        traffic(simulation, moving ? dt : 0);
        renderer.render(scene, camera);
        if (!host.classList.contains('is-ready')) {
          host.classList.add('is-ready');
          window.ShreenathSceneSupport?.ready(host);
          host.setAttribute('aria-busy', 'false');
          clearTimeout(wait);
          if (status) status.textContent = '';
          dispatchEvent(new CustomEvent('shreenath:hero-ready'));
        }
        if (moving || settling) requestRender();
        else last = 0;
      }
      function palette() {
        const style = getComputedStyle(document.documentElement),
          color = (name) => style.getPropertyValue(name).trim();
        m.paper.color.set(color('--scene-ivory'));
        m.paving.color.set(color('--scene-pale'));
        m.accent.color.set(color('--scene-clay'));
        const dark = document.documentElement.dataset.theme === 'dark';
        m.road.color.set(dark ? '#303830' : '#424941');
        ambient.intensity = dark ? 2.6 : 3.2;
        renderer.toneMappingExposure = dark ? 0.95 : 1.05;
        const customColour = document.documentElement.dataset.accent === 'custom';
        allActors.forEach((actor) => {
          actor.bodyPaint.color.copy(customColour ? m.accent.color : actor.originalPaint.color);
          actor.secondaryPaint.color.copy(customColour ? m.accent.color : m.green.color);
          if (customColour) actor.secondaryPaint.color.multiplyScalar(0.58);
          actor.materials.forEach(({ surface, source }) => surface.color.copy(source.color));
        });
        renderer.shadowMap.needsUpdate = true;
        requestRender();
      }
      function resize() {
        if (disposed || lost) return;
        const w = host.clientWidth,
          h = host.clientHeight;
        if (!w || !h) return;
        const hero = host.closest('.hero--immersive'),
          divider = hero?.querySelector('.hero-bottom');
        if (divider) {
          const cutoff = Math.max(
            0,
            hero.getBoundingClientRect().bottom - divider.getBoundingClientRect().top
          );
          hero.style.setProperty('--hero-road-cutoff', `${cutoff}px`);
        }
        const wide = innerWidth > 760;
        // Every viewport looks into the same open street. The mobile gradient,
        // rather than a rectangular model base, defines the visible boundary.
        openGround.visible = true;
        rearDistrict.visible = true;
        // A full-width canvas needs a bounded pixel budget, especially on Retina
        // displays. Geometry and simulation work stay unchanged.
        renderer.setPixelRatio(
          Math.min(
            devicePixelRatio || 1,
            compact ? 1.75 : 1.6,
            Math.sqrt((compact ? 1400000 : 2400000) / (w * h))
          )
        );
        renderer.setSize(w, h, false);
        const bounds = new T.Box3(
          new T.Vector3(-5.1, -0.3, wide ? -3.65 : -4.25),
          new T.Vector3(5.1, 1.9, 3.65)
        ).applyMatrix4(camera.matrixWorldInverse);
        const extent = bounds.getSize(new T.Vector3()),
          aspect = w / h;
        const immersive = host.closest('.hero--immersive');
        const half =
          Math.max(extent.y / 2, extent.x / (2 * aspect)) *
          (immersive ? (wide ? 0.94 : 1.01) : 1.1);
        const centre = immersive ? bounds.getCenter(new T.Vector3()) : new T.Vector3();
        // Shift the junction towards the clear right-hand side on wide screens.
        // Phones get a centred, full-width view below the copy.
        if (immersive && innerWidth > 760)
          centre.x -= half * aspect * Math.min(0.34, Math.max(0, (aspect - 1.1) * 0.55));
        camera.left = centre.x - half * aspect;
        camera.right = centre.x + half * aspect;
        camera.top = centre.y + half;
        camera.bottom = centre.y - half;
        camera.updateProjectionMatrix();
        renderer.shadowMap.needsUpdate = true;
        requestRender();
      }
      function pointer(event) {
        if (!fine.matches || reduced.matches || paused || event.pointerType !== 'mouse') return;
        const r = host.getBoundingClientRect();
        targetX = ((event.clientY - r.top) / r.height - 0.5) * 0.035;
        targetY = ((event.clientX - r.left) / r.width - 0.5) * 0.09;
        requestRender();
      }
      function reset() {
        targetX = targetY = 0;
        requestRender();
      }
      function language() {
        if (disposed) return;
        streetSigns.forEach(drawSign);
        requestRender();
      }
      function motion() {
        if (button) {
          button.hidden = reduced.matches;
          button.textContent = paused ? 'Resume motion' : 'Pause motion';
          button.setAttribute('aria-pressed', String(paused));
        }
        reset();
      }
      function toggle() {
        paused = !paused;
        motion();
      }
      function visibility() {
        if (document.hidden) stop();
        else requestRender();
      }
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) requestRender();
          else stop();
        },
        { rootMargin: '30px' }
      );
      io.observe(host);
      host.addEventListener('pointermove', pointer, { passive: true });
      host.addEventListener('pointerleave', reset);
      button?.addEventListener('click', toggle);
      reduced.addEventListener('change', motion);
      addEventListener('shreenath:appearance', palette);
      document.addEventListener('visibilitychange', visibility);
      addEventListener('shreenath:language', language);
      addEventListener('shreenath:language-fonts', language);
      renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        lost = true;
        stop();
        host.classList.remove('is-ready');
        host.setAttribute('aria-busy', 'true');
        window.ShreenathSceneSupport?.show(host);
      });
      renderer.domElement.addEventListener('webglcontextrestored', () => {
        lost = false;
        palette();
        resize();
        motion();
      });
      const show = (event) => {
        if (event.persisted) {
          palette();
          resize();
        }
      };
      // Stop animation on exit. The document owns its GPU resources; traversing
      // and disposing every mesh during pagehide stalls the outgoing transition.
      const hide = () => {
        stop();
      };
      addEventListener('pageshow', show);
      addEventListener('pagehide', hide);
      cleanup = () => {
        if (disposed) return;
        disposed = true;
        stop();
        clearTimeout(wait);
        ro.disconnect();
        io.disconnect();
        host.removeEventListener('pointermove', pointer);
        host.removeEventListener('pointerleave', reset);
        button?.removeEventListener('click', toggle);
        reduced.removeEventListener('change', motion);
        removeEventListener('shreenath:appearance', palette);
        document.removeEventListener('visibilitychange', visibility);
        removeEventListener('shreenath:language', language);
        removeEventListener('shreenath:language-fonts', language);
        removeEventListener('pageshow', show);
        removeEventListener('pagehide', hide);
        ownedGeometry.forEach((g) => g.dispose());
        ownedMaterials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
      };
      palette();
      resize();
      motion();
      traffic(0, 0);
      await renderer.compileAsync(scene, camera);
      if (disposed || leaving) return;
      prepared = true;
      render(performance.now());
    } catch {
      cleanup();
      clearTimeout(wait);
      renderer?.dispose();
      renderer?.domElement.remove();
      host.classList.remove('is-ready');
      host.setAttribute('aria-busy', 'false');
      if (button) button.hidden = true;
      window.ShreenathSceneSupport?.show(host);
      dispatchEvent(new CustomEvent('shreenath:hero-ready'));
    }
  }
  build();
})();
