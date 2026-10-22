/* Three editorial environments. Policies deliberately use symbolic objects.
   All furniture is baked by material; only purposeful activity stays dynamic. */
window.ShreenathEditorialScenes = Object.freeze({
  build({
    T,
    group,
    materials: m,
    motions,
    type,
    trackedTextures = [],
    compact = false,
    textAnisotropy = 1
  }) {
    if (!['about', 'services', 'contact'].includes(type)) return false;
    const world = new T.Group(),
      fixed = new T.Group();
    group.add(world);
    world.add(fixed);
    world.position.y = -1.27;
    const sourceGeometry = new Set();
    const timber = new T.MeshStandardMaterial({ color: '#ae8c6c', roughness: 0.8 });
    const skin = new T.MeshStandardMaterial({ color: '#ac8060', roughness: 0.82 });
    const glass = new T.MeshStandardMaterial({
      color: '#7d9d98',
      roughness: 0.27,
      metalness: 0.18
    });
    const mesh = (geometry, material, parent = fixed) => {
      sourceGeometry.add(geometry);
      const o = new T.Mesh(geometry, material);
      o.castShadow = o.receiveShadow = true;
      parent.add(o);
      return o;
    };
    const place = (o, x, y, z) => {
      o.position.set(x, y, z);
      return o;
    };
    function node(x = 0, y = 0, z = 0, parent = world) {
      const g = new T.Group();
      parent.add(g);
      g.position.set(x, y, z);
      return g;
    }
    function roundShape(w, h, r) {
      r = Math.min(r, w * 0.48, h * 0.48);
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
    function block(mat, x, y, z, w, h, d, parent = fixed, r = 0.025) {
      const geometry = new T.ExtrudeGeometry(roundShape(w, h, r), {
        depth: d,
        bevelEnabled: false,
        steps: 1,
        curveSegments: 5
      });
      geometry.translate(0, 0, -d / 2);
      return place(mesh(geometry, mat, parent), x, y, z);
    }
    const ball = (mat, x, y, z, r, parent = fixed) =>
      place(mesh(new T.SphereGeometry(r, 14, 10), mat, parent), x, y, z);
    const cylinder = (mat, x, y, z, r, h, parent = fixed) =>
      place(mesh(new T.CylinderGeometry(r, r, h, 20), mat, parent), x, y, z);
    function surface(mat, x, y, z, w, d, h = 0.05, parent = fixed, r = 0.18) {
      const o = block(mat, x, y, z, w, d, h, parent, r);
      o.rotation.x = -Math.PI / 2;
      return o;
    }
    function rod(mat, a, b, r = 0.018, parent = fixed) {
      const start = new T.Vector3(...a),
        end = new T.Vector3(...b),
        v = end.clone().sub(start),
        mid = start.clone().add(end).multiplyScalar(0.5);
      const o = cylinder(mat, mid.x, mid.y, mid.z, r, v.length(), parent);
      o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.normalize());
      return o;
    }
    function plant(x, z, h = 0.85) {
      cylinder(m.pale, x, 0.16, z, 0.17, 0.3);
      rod(timber, [x, 0.2, z], [x, h - 0.12, z], 0.018);
      [
        [-0.12, -0.07, 0.8],
        [0.12, 0.03, 0.95],
        [0.02, 0.1, 1.12]
      ].forEach(([dx, dz, k]) => {
        const leaf = ball(m.sage, x + dx, h * k, z + dz, 0.19);
        leaf.scale.set(0.75, 1.45, 0.55);
        leaf.rotation.z = dx * 2;
      });
    }
    function book(x, y, z, colour = m.clay) {
      block(colour, x, y, z, 0.065, 0.24, 0.15);
      block(m.ivory, x + 0.006, y, z + 0.075, 0.047, 0.21, 0.008);
    }
    function paper(x, y, z, parent = fixed) {
      const g = node(x, y, z, parent);
      surface(m.ivory, 0, 0, 0, 0.25, 0.33, 0.012, g, 0.012);
      [-0.075, -0.015, 0.045].forEach((zz) =>
        surface(m.pale, -0.018, 0.009, zz, 0.16, 0.009, 0.003, g, 0.002)
      );
      return g;
    }
    function person(x, z, shirt, angle = 0, seated = false) {
      const p = node(x, 0, z);
      p.rotation.y = angle;
      const hip = seated ? 0.34 : 0.37,
        shoulder = hip + 0.25;
      block(shirt, 0, hip + 0.13, 0, 0.2, 0.27, 0.14, p, 0.055);
      ball(skin, 0, shoulder + 0.16, 0.008, 0.078, p);
      const hair = ball(m.ink, 0, shoulder + 0.202, -0.009, 0.078, p);
      hair.scale.y = 0.46;
      [-0.06, 0.06].forEach((xx) => {
        if (seated) {
          block(m.ink, xx, 0.33, 0.065, 0.072, 0.075, 0.21, p);
          rod(m.ink, [xx, 0.33, 0.145], [xx, 0.08, 0.145], 0.034, p);
        } else rod(m.ink, [xx, 0.38, 0], [xx, 0.08, 0.015], 0.034, p);
        block(m.ink, xx, 0.047, seated ? 0.18 : 0.05, 0.084, 0.048, 0.14, p);
      });
      const arm = node(-0.125, shoulder, 0, p);
      rod(shirt, [0, 0, 0], [0, -0.19, 0.025], 0.031, arm);
      ball(skin, 0, -0.215, 0.028, 0.033, arm);
      rod(shirt, [0.127, shoulder, 0], [0.137, shoulder - 0.19, 0.04], 0.031, p);
      ball(skin, 0.137, shoulder - 0.215, 0.045, 0.033, p);
      if (seated) {
        surface(m.sage, 0, 0.285, -0.02, 0.32, 0.32, 0.065, p, 0.055);
        block(m.sage, 0, 0.455, -0.16, 0.32, 0.33, 0.055, p, 0.045);
        [-0.11, 0.11].forEach((xx) =>
          [-0.12, 0.1].forEach((zz) => rod(m.ink, [xx, 0.26, zz], [xx, 0.015, zz], 0.013, p))
        );
      }
      return { group: p, arm };
    }
    function speak(p, phase = 0) {
      p.arm.rotation.x = -0.9;
      motions.push((t) => {
        p.arm.rotation.x = -0.9 + Math.sin(t * 0.7 + phase) * 0.09;
      });
    }
    function monitor(x, y, z, parent = fixed) {
      block(m.ink, x, y, z, 0.32, 0.22, 0.027, parent, 0.018);
      block(glass, x, y, z + 0.017, 0.282, 0.18, 0.008, parent, 0.012);
      rod(m.ink, [x, y - 0.1, z], [x, y - 0.24, z], 0.018, parent);
      surface(m.ink, x, y - 0.25, z, 0.19, 0.13, 0.014, parent, 0.025);
    }
    function arch(x, z, w = 1.25, h = 1.6) {
      const s = new T.Shape(),
        outer = w / 2,
        inner = outer - 0.085,
        cy = h - outer;
      s.moveTo(-outer, 0);
      s.lineTo(-outer, cy);
      s.absarc(0, cy, outer, Math.PI, 0, true);
      s.lineTo(outer, 0);
      s.lineTo(inner, 0);
      s.lineTo(inner, cy);
      s.absarc(0, cy, inner, 0, Math.PI, false);
      s.lineTo(-inner, 0);
      s.closePath();
      const g = new T.ExtrudeGeometry(s, { depth: 0.095, bevelEnabled: false, curveSegments: 20 });
      g.translate(0, 0, -0.0475);
      place(mesh(g, m.ivory), x, 0, z);
    }
    const signs = [];
    function sign(text, x, y, z, w, h = 0.22) {
      const canvas = document.createElement('canvas');
      canvas.width = compact ? Math.min(1536, Math.round((192 * w) / h)) : 1024;
      canvas.height = 192;
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = compact ? textAnisotropy : 1;
      trackedTextures.push(texture);
      const material = new T.MeshBasicMaterial({
        map: texture,
        transparent: true,
        toneMapped: !compact,
        side: T.DoubleSide
      });
      place(mesh(new T.PlaneGeometry(w, h), material, world), x, y, z);
      signs.push({ canvas, texture, text });
    }
    function redrawSigns() {
      signs.forEach(({ canvas, texture, text }) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#efe9d9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#344137';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const gujarati = window.ShreenathLanguage?.get() === 'gu';
        const copy = window.ShreenathLanguage?.text(text) || text;
        const font = gujarati ? '500 SIZEpx "Hind Vadodara",sans-serif' : '600 SIZEpx sans-serif';
        let size = compact ? (gujarati ? 112 : 106) : gujarati ? 74 : 65;
        ctx.font = font.replace('SIZE', size);
        const available = canvas.width - 74;
        if (compact) size *= Math.min(1, available / Math.max(1, ctx.measureText(copy).width));
        ctx.font = font.replace('SIZE', size);
        ctx.fillText(copy, canvas.width / 2, 100, available);
        texture.needsUpdate = true;
      });
    }
    addEventListener('shreenath:language', redrawSigns);
    addEventListener('shreenath:language-fonts', redrawSigns);
    if (type === 'about') {
      // Three chapters from the supplied story, without invented dates or
      // pretending that these symbolic pavilions reproduce the real premises.
      surface(m.pale, 0, -0.075, 0, 4, 2.7, 0.15, fixed, 0.6);
      surface(m.ivory, 0, 0.012, 0, 3.88, 2.58, 0.018, fixed, 0.54);
      [-1.2, 1.2].forEach((x, i) => {
        block(m.ivory, x, 0.6, -0.48, 1.06, 1.16, 0.09);
        block(timber, x - 0.49, 0.58, -0.16, 0.065, 1.1, 0.69);
        surface(i ? m.sage : m.clay, x, 1.2, -0.16, 1.2, 0.88, 0.065, fixed, 0.08);
        block(timber, x, 0.31, -0.03, 0.82, 0.5, 0.3);
        surface(m.ivory, x, 0.58, -0.03, 0.91, 0.41, 0.04);
        paper(x - 0.12, 0.607, 0.01);
        speak(person(x, -0.29, i ? m.sage : m.ivory), i * 2);
      });
      sign('Anupam Auto', -1.2, 1.04, 0.285, 1.05, 0.2);
      sign('Jamkandorana', -1.2, 0.16, 0.57, 1.04, 0.16);
      sign('Dhoraji', 1.2, 1.04, 0.285, 1.04, 0.2);
      arch(0, -0.85, 0.86, 1.63);
      sign('Shreenath Auto', 0, 1.37, -0.79, 1.19, 0.23);
      const route = new T.CatmullRomCurve3([
        new T.Vector3(-1.2, 0.065, 0.72),
        new T.Vector3(-0.52, 0.065, 0.58),
        new T.Vector3(0, 0.065, 0.08),
        new T.Vector3(0.57, 0.065, 0.6),
        new T.Vector3(1.2, 0.065, 0.72)
      ]);
      mesh(new T.TubeGeometry(route, 44, 0.022, 8, false), m.gold);
      const marker = ball(m.clay, -1.2, 0.12, 0.72, 0.057, world);
      motions.push((t) => {
        marker.position.copy(route.getPoint((1 - Math.cos(t * 0.24)) * 0.5));
        marker.position.y = 0.12;
      });
      speak(person(-0.82, 0.86, m.clay, Math.PI), 1.4);
      speak(person(1.18, 0.87, m.ivory, Math.PI), 2.4);
      plant(-1.69, -0.69, 0.65);
      plant(1.67, -0.7, 0.7);
    } else if (type === 'services') {
      // A document atelier: organise, review and prepare. It illustrates the
      // consultancy's work without implying that it issues official approvals.
      surface(m.pale, 0, -0.075, 0, 3.75, 2.7, 0.15, fixed, 0.65);
      surface(m.ivory, 0, 0.012, 0, 3.63, 2.58, 0.018, fixed, 0.6);
      block(m.ivory, -0.86, 0.69, -0.81, 1.38, 1.35, 0.1);
      for (let row = 0; row < 2; row++) {
        surface(timber, -0.86, 0.44 + row * 0.46, -0.65, 1.4, 0.39, 0.035);
        for (let i = 0; i < 8; i++)
          book(-1.38 + i * 0.14, 0.58 + row * 0.46, -0.63, [m.ivory, m.sage, m.clay][i % 3]);
      }
      surface(timber, 0.04, 0.53, 0.05, 2.28, 0.8, 0.075, fixed, 0.22);
      [-0.76, 0.84].forEach((x) => block(m.ivory, x, 0.27, 0.05, 0.1, 0.5, 0.54));
      monitor(0.64, 0.86, -0.05);
      paper(-0.63, 0.576, 0.04);
      paper(0.06, 0.576, 0.1);
      speak(person(0.28, -0.4, m.sage, 0, true), 0.4);
      speak(person(-0.5, 0.69, m.clay, Math.PI, true), 2.4);
      [-0.94, -0.57].forEach((x, i) => {
        surface(m.pale, x, 0.61, 0.02, 0.29, 0.36, 0.034);
        for (let j = 0; j < 3; j++) paper(x, 0.636 + j * 0.012, 0.02);
      });
      const reviewed = paper(-0.14, 0.595, 0.04, world);
      motions.push((t) => {
        reviewed.position.x = -0.14 + Math.sin(t * 0.32) * 0.22;
        reviewed.rotation.y = Math.sin(t * 0.32) * 0.05;
      });
      sign('Your next step', 0.85, 1.3, -0.65, 1.11, 0.23);
      rod(m.gold, [0.35, 0.1, -0.7], [0.35, 1.45, -0.7], 0.02);
      rod(m.gold, [1.38, 0.1, -0.7], [1.38, 1.45, -0.7], 0.02);
      plant(1.5, 0.45, 0.87);
      plant(-1.55, 0.63, 0.6);
    } else {
      // A welcoming conversation lounge: curved seating, a host and a visitor.
      surface(m.pale, 0, -0.075, 0, 3.6, 2.75, 0.15, fixed, 0.86);
      surface(m.ivory, 0, 0.012, 0, 3.48, 2.63, 0.018, fixed, 0.8);
      arch(-0.72, -0.87, 1.28, 1.76);
      // A translucent screen has one face and needs no refraction render pass.
      const screenMaterial = glass.clone();
      screenMaterial.transparent = true;
      screenMaterial.opacity = 0.2;
      screenMaterial.depthWrite = false;
      screenMaterial.side = T.DoubleSide;
      place(mesh(new T.PlaneGeometry(0.92, 1.48), screenMaterial), 0.78, 0.78, -0.89);
      [0.29, 1.27].forEach((x) => rod(m.gold, [x, 0.05, -0.89], [x, 1.53, -0.89], 0.013));
      rod(m.gold, [0.29, 1.53, -0.89], [1.27, 1.53, -0.89], 0.013);
      surface(timber, -0.73, 0.54, -0.23, 0.94, 0.55, 0.065, fixed, 0.14);
      block(m.ivory, -0.73, 0.27, -0.23, 0.75, 0.5, 0.36, fixed, 0.07);
      monitor(-0.8, 0.82, -0.33);
      const host = person(-0.75, -0.64, m.sage, 0, true);
      speak(host, 0.5);
      // The guest sits at the small conversation table, with a bag beside them.
      speak(person(0.62, 0.6, m.clay, Math.PI, true), 2.1);
      cylinder(m.gold, 0.55, 0.22, 0.1, 0.043, 0.42);
      surface(m.ivory, 0.55, 0.46, 0.1, 0.71, 0.6, 0.055, fixed, 0.29);
      paper(0.51, 0.495, 0.1);
      cylinder(m.ivory, 0.75, 0.537, 0.05, 0.037, 0.07);
      block(timber, 1.02, 0.16, 0.68, 0.2, 0.27, 0.12, fixed, 0.035);
      const handle = mesh(new T.TorusGeometry(0.065, 0.012, 6, 18, Math.PI), timber);
      handle.position.set(1.02, 0.305, 0.68);
      plant(1.33, -0.32, 0.96);
      plant(-1.4, 0.58, 0.61);
      const folder = paper(-0.48, 0.582, -0.12, world);
      motions.push((t) => {
        folder.rotation.y = Math.sin(t * 0.4) * 0.04;
      });
    }
    // Merge static furniture by material, preserving the three scenes' shapes.
    fixed.updateMatrixWorld(true);
    world.updateMatrixWorld(true);
    const inverse = new T.Matrix4().copy(world.matrixWorld).invert(),
      batches = new Map();
    fixed.traverse((o) => {
      if (!o.isMesh || o.material.transparent) return;
      const geometry = o.geometry
        .clone()
        .applyMatrix4(new T.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
      const list = batches.get(o.material) || [];
      list.push(geometry);
      batches.set(o.material, list);
    });
    // Keep the single transparent screen separate so its UVs and sorting survive.
    const transparent = [];
    fixed.traverse((o) => {
      if (o.isMesh && o.material.transparent) transparent.push(o);
    });
    transparent.forEach((o) => world.attach(o));
    fixed.clear();
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
        k = 0;
      parts.forEach((g) => {
        positions.set(g.attributes.position.array, v * 3);
        normals.set(g.attributes.normal.array, v * 3);
        const n = g.index ? g.index.count : g.attributes.position.count;
        for (let i = 0; i < n; i++) indices[k++] = v + (g.index ? g.index.array[i] : i);
        v += g.attributes.position.count;
        g.dispose();
      });
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(positions, 3));
      g.setAttribute('normal', new T.BufferAttribute(normals, 3));
      g.setIndex(new T.BufferAttribute(indices, 1));
      g.computeBoundingSphere();
      const o = new T.Mesh(g, material);
      o.castShadow = o.receiveShadow = true;
      fixed.add(o);
    });
    const retained = new Set();
    world.traverse((o) => {
      if (o.geometry) retained.add(o.geometry);
    });
    sourceGeometry.forEach((g) => {
      if (!retained.has(g)) g.dispose();
    });
    redrawSigns();
    return {
      dispose() {
        removeEventListener('shreenath:language', redrawSigns);
        removeEventListener('shreenath:language-fonts', redrawSigns);
      }
    };
  }
});
