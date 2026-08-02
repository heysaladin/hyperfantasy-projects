import * as THREE from "three";
import { team } from "./team.js";

const coreTeam = team.filter((m) => !m.interchangeable);
const flexTeam = team.filter((m) => m.interchangeable);
const PLAYER_MEMBER_ID = "1"; // Dean = the player

// ---------- Mask state ----------
let maskOn = false;
function displayName(member) {
  if (maskOn && member.id === PLAYER_MEMBER_ID) return "You";
  return member.name;
}
function officeTitle() {
  return maskOn ? "█████████████" : "HYPERFANTASY";
}

// ---------- Scene ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe3e8);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("app").appendChild(renderer.domElement);

// ---------- Lights ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.75));
const sun = new THREE.DirectionalLight(0xfff6e8, 1.6);
sun.position.set(14, 22, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -22; sun.shadow.camera.right = 22;
sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
sun.shadow.bias = -0.0004;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xdde8ff, 0.5);
fill.position.set(-10, 12, -8);
scene.add(fill);

// ---------- Diorama base ----------
const ROOM_W = 24;
const ROOM_D = 20;
const WALL_H = 4;
const WALL_T = 0.35;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xd6dade, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

const slab = new THREE.Mesh(
  new THREE.BoxGeometry(ROOM_W + 1.2, 0.5, ROOM_D + 1.2),
  new THREE.MeshStandardMaterial({ color: 0xf2f3f5, roughness: 0.9 })
);
slab.position.y = -0.25;
slab.castShadow = true;
slab.receiveShadow = true;
scene.add(slab);

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#b4763b";
  ctx.fillRect(0, 0, 512, 512);
  const plankH = 512 / 10;
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 ? "#ad6f36" : "#bd7f42";
    ctx.fillRect(0, i * plankH, 512, plankH - 3);
    ctx.fillStyle = "rgba(80,45,15,0.35)";
    ctx.fillRect(0, i * plankH + plankH - 3, 512, 3);
    ctx.fillStyle = "rgba(255,220,170,0.12)";
    for (let j = 0; j < 4; j++) {
      ctx.fillRect(Math.random() * 512, i * plankH + Math.random() * plankH, 60 + Math.random() * 90, 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2.5);
  return tex;
}
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_W, ROOM_D),
  new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.7 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0.005;
floor.receiveShadow = true;
scene.add(floor);

// ---------- Walls + railing ----------
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf7f6f3, roughness: 0.95 });

const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W + WALL_T * 2, WALL_H, WALL_T), wallMat);
backWall.position.set(0, WALL_H / 2, -ROOM_D / 2 - WALL_T / 2);
backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(WALL_T, WALL_H, ROOM_D + WALL_T), wallMat);
rightWall.position.set(ROOM_W / 2 + WALL_T / 2, WALL_H / 2, -WALL_T / 2);
rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xcfe8f5, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0,
});
const railMat = new THREE.MeshStandardMaterial({ color: 0xf2f3f5, roughness: 0.6 });
function railing(len, x, z, ry) {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.BoxGeometry(len, 1.05, 0.06), glassMat);
  glass.position.y = 0.62;
  g.add(glass);
  const top = new THREE.Mesh(new THREE.BoxGeometry(len, 0.09, 0.12), railMat);
  top.position.y = 1.18;
  g.add(top);
  const posts = Math.round(len / 2.4);
  for (let i = 0; i <= posts; i++) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.15, 0.09), railMat);
    post.position.set(-len / 2 + (i * len) / posts, 0.58, 0);
    g.add(post);
  }
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  scene.add(g);
}
railing(ROOM_W, 0, ROOM_D / 2, 0);
railing(ROOM_D, -ROOM_W / 2, 0, Math.PI / 2);

function wallArt(x, y, w, h, color) {
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x3a3f47 }));
  frame.position.set(x, y, -ROOM_D / 2 + 0.06);
  scene.add(frame);
  const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color }));
  art.position.set(x, y, -ROOM_D / 2 + 0.1);
  scene.add(art);
}
wallArt(-8, 2.6, 1.4, 1.0, 0x7fb2d9);
wallArt(-6.2, 2.6, 1.0, 1.0, 0xe8b04a);
wallArt(7, 2.7, 1.8, 1.2, 0x9dc98a);

{
  const tv = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 2.6), new THREE.MeshStandardMaterial({ color: 0x1c1f24 }));
  tv.position.set(ROOM_W / 2 - 0.06, 2.2, 4);
  scene.add(tv);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.32), new THREE.MeshBasicMaterial({ color: 0x8fd0ff }));
  scr.rotation.y = -Math.PI / 2;
  scr.position.set(ROOM_W / 2 - 0.11, 2.2, 4);
  scene.add(scr);
}

// ---------- Labels (with mask-aware registry) ----------
function drawLabel(text, sub) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 170;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 154, 34);
  ctx.fill();
  ctx.strokeStyle = "rgba(60,70,90,0.15)";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 52px system-ui, sans-serif";
  ctx.fillText(text, 256, 72, 460);
  ctx.fillStyle = "#7c3aed";
  ctx.font = "600 32px system-ui, sans-serif";
  ctx.fillText(sub, 256, 124, 460);
  return new THREE.CanvasTexture(c);
}

const labelRegistry = []; // { sprite, getText, getSub }
function labelSprite(getText, getSub, scale = 1) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: drawLabel(getText(), getSub()), transparent: true })
  );
  sprite.scale.set(2.4 * scale, 0.8 * scale, 1);
  labelRegistry.push({ sprite, getText, getSub });
  return sprite;
}
function refreshLabels() {
  for (const l of labelRegistry) {
    l.sprite.material.map.dispose();
    l.sprite.material.map = drawLabel(l.getText(), l.getSub());
    l.sprite.material.needsUpdate = true;
  }
}

function initialsTexture(name) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, "#8b5cf6");
  g.addColorStop(1, "#3b82f6");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 110px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase(), 128, 138);
  return new THREE.CanvasTexture(c);
}

const texLoader = new THREE.TextureLoader();
texLoader.crossOrigin = "anonymous";
function avatarTexture(member, onTex) {
  const fallback = initialsTexture(member.name);
  if (!member.image) return onTex(fallback);
  texLoader.load(
    member.image,
    (tex) => { tex.colorSpace = THREE.SRGBColorSpace; onTex(tex); },
    undefined,
    () => onTex(fallback)
  );
}

const skinTones = [0xf0c297, 0xd9a06b, 0xc68642, 0xf5d0a9];
const shirtColorsC = [0x7c3aed, 0xe0684b, 0x2e8b57, 0xd9a13f, 0x4f7fd9, 0xc94f7c, 0x50b8c9, 0x8a93a6];
const hairColorsC = [0x2b2019, 0x4a3220, 0x111111, 0x5c4033];

// ---------- Workstations ----------
const colliders = [];
const stations = []; // { member, pos, seatPos, seatYaw }

const deskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
const woodMat = new THREE.MeshStandardMaterial({ color: 0xc98a4b, roughness: 0.6 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x2e333b, roughness: 0.4 });
const screenMat = new THREE.MeshBasicMaterial({ color: 0xaee2ff });

const chairColors = [0x4f7fd9, 0xe0684b, 0x4aa86e, 0xd9a13f, 0x9b6bd4, 0x50b8c9];

function buildWorkstation(member, x, z, rotY, chairColor) {
  const g = new THREE.Group();

  const top = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 1), deskMat);
  top.position.y = 0.76;
  top.castShadow = true;
  g.add(top);
  const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.85), woodMat);
  drawer.position.set(0.72, 0.32, 0);
  drawer.castShadow = true;
  g.add(drawer);
  for (const [lx, lz] of [[-0.95, -0.42], [-0.95, 0.42]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.76, 0.07), darkMat);
    leg.position.set(lx, 0.38, lz);
    g.add(leg);
  }

  const mon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.48, 0.05), darkMat);
  mon.position.set(-0.2, 1.22, -0.22);
  g.add(mon);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.4), screenMat);
  scr.position.set(-0.2, 1.22, -0.19);
  g.add(scr);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), darkMat);
  stand.position.set(-0.2, 0.9, -0.22);
  g.add(stand);

  const cMat = new THREE.MeshStandardMaterial({ color: chairColor, roughness: 0.65 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), cMat);
  seat.position.set(-0.1, 0.46, 0.8);
  seat.castShadow = true;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.6, 0.09), cMat);
  back.position.set(-0.1, 0.8, 1.04);
  g.add(back);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42), darkMat);
  pole.position.set(-0.1, 0.22, 0.8);
  g.add(pole);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.05, 16), darkMat);
  foot.position.set(-0.1, 0.03, 0.8);
  g.add(foot);

  avatarTexture(member, (tex) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.04), darkMat);
    frame.position.set(0.55, 1.0, -0.25);
    frame.rotation.y = -0.3;
    g.add(frame);
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), new THREE.MeshBasicMaterial({ map: tex }));
    photo.position.set(0.55, 1.0, -0.225);
    photo.rotation.y = -0.3;
    photo.translateZ(0.021);
    g.add(photo);
  });

  const potP = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0xd96a4b }));
  potP.position.set(-0.85, 0.86, -0.3);
  g.add(potP);
  const leafP = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0x3f9e58 }));
  leafP.position.set(-0.85, 0.98, -0.3);
  g.add(leafP);

  const label = labelSprite(() => displayName(member), () => member.role);
  label.position.set(0, 2.15, 0);
  g.add(label);

  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  scene.add(g);

  // world-space seat position (chair local: -0.1, 0.8)
  const seatLocal = new THREE.Vector3(-0.1, 0, 0.8);
  seatLocal.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
  const seatPos = new THREE.Vector3(x, 0, z).add(seatLocal);

  colliders.push({ x, z, r: 1.3 });
  stations.push({ member, pos: new THREE.Vector3(x, 0, z), seatPos, seatYaw: rotY + Math.PI });
}

coreTeam.forEach((m, i) => {
  const color = chairColors[i % chairColors.length];
  if (i < 3) {
    buildWorkstation(m, -7 + i * 6.2, -ROOM_D / 2 + 1.6, 0, color);
  } else {
    buildWorkstation(m, ROOM_W / 2 - 1.6, -3 + (i - 3) * 5.4, -Math.PI / 2, color);
  }
});

// Flex zone: incubation tubes (Zordon-style) — dormant until called
const tubes = [];
flexTeam.forEach((m, i) => {
  const x = -ROOM_W / 2 + 2.0;
  const z = ROOM_D / 2 - 2.4 - i * 3.6;
  const g = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 0.3, 24),
    new THREE.MeshStandardMaterial({ color: 0x2e333b, metalness: 0.6, roughness: 0.35 })
  );
  base.position.y = 0.15;
  base.castShadow = true;
  g.add(base);

  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.78, 0.06, 24),
    new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
  );
  glow.position.y = 0.33;
  g.add(glow);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 2.1, 24, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0x9be8f5, transparent: true, opacity: 0.18,
      roughness: 0.05, side: THREE.DoubleSide,
    })
  );
  glass.position.y = 1.4;
  g.add(glass);

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.2, 24),
    new THREE.MeshStandardMaterial({ color: 0x2e333b, metalness: 0.6, roughness: 0.35 })
  );
  cap.position.y = 2.55;
  g.add(cap);

  const tubeLight = new THREE.PointLight(0x67e8f9, 3, 4, 2);
  tubeLight.position.y = 1.3;
  g.add(tubeLight);

  // dormant occupant, floating inside
  const occupant = buildCharacter({
    shirt: 0x64748b, skin: skinTones[i % skinTones.length], hair: 0x111111, pants: 0x334155,
  });
  occupant.group.position.y = 0.45;
  occupant.group.rotation.y = Math.PI / 2; // face into the room
  occupant.armL.rotation.x = 0;
  occupant.armR.rotation.x = 0;
  g.add(occupant.group);

  const label = labelSprite(() => displayName(m), () => m.role, 0.85);
  label.position.set(0, 3.1, 0);
  g.add(label);

  g.position.set(x, 0, z);
  scene.add(g);
  colliders.push({ x, z, r: 1.1 });
  stations.push({ member: m, pos: new THREE.Vector3(x, 0, z), seatPos: null, seatYaw: Math.PI / 2 });
  tubes.push({ occupant, glow, phase: i * 2.1 });
});

// ---------- Decor ----------
function plant(x, z, s = 1) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26 * s, 0.2 * s, 0.42 * s, 12),
    new THREE.MeshStandardMaterial({ color: 0xe6e2da, roughness: 0.8 })
  );
  pot.position.y = 0.21 * s;
  pot.castShadow = true;
  g.add(pot);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.14 * s, 0.85 * s, 7),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x3f9e58 : 0x2f8f4e, roughness: 0.8 })
    );
    const a = (i / 6) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.13 * s, 0.8 * s, Math.sin(a) * 0.13 * s);
    leaf.rotation.set(Math.sin(a) * 0.35, 0, Math.cos(a) * 0.35);
    leaf.castShadow = true;
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  scene.add(g);
  colliders.push({ x, z, r: 0.5 * s });
}
plant(-ROOM_W / 2 + 1.2, -ROOM_D / 2 + 1.2, 1.3);
plant(ROOM_W / 2 - 1.2, ROOM_D / 2 - 1.2, 1.2);
plant(2.5, 3.5, 0.9);

{
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(2, 2.4, 0.5), new THREE.MeshStandardMaterial({ color: 0xf0ede6 }));
  shelf.position.set(2.2, 1.2, -ROOM_D / 2 + 0.3);
  shelf.castShadow = true;
  scene.add(shelf);
  const bookColors = [0xd9534f, 0x5bc0de, 0xf0ad4e, 0x5cb85c, 0x9b6bd4];
  for (let r = 0; r < 3; r++) {
    for (let b = 0; b < 5; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.5, 0.3),
        new THREE.MeshStandardMaterial({ color: bookColors[(r + b) % 5] })
      );
      book.position.set(1.55 + b * 0.18 + Math.random() * 0.04, 0.55 + r * 0.75, -ROOM_D / 2 + 0.35);
      scene.add(book);
    }
  }
  colliders.push({ x: 2.2, z: -ROOM_D / 2 + 0.3, r: 1.1 });
}

{
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x8a93a6, roughness: 0.85 });
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1), sofaMat);
  base.position.y = 0.3;
  base.castShadow = true;
  g.add(base);
  const backr = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 0.25), sofaMat);
  backr.position.set(0, 0.75, -0.38);
  g.add(backr);
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 1), sofaMat);
    arm.position.set(s * 1.42, 0.68, 0);
    g.add(arm);
  }
  for (const [px, color] of [[-0.7, 0xe8b04a], [0.7, 0xd96a4b]]) {
    const cush = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.15), new THREE.MeshStandardMaterial({ color }));
    cush.position.set(px, 0.72, -0.28);
    cush.rotation.x = -0.15;
    g.add(cush);
  }
  g.position.set(-6.5, 0, 2.5);
  scene.add(g);
  colliders.push({ x: -6.5, z: 2.5, r: 1.6 });

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 40),
    new THREE.MeshStandardMaterial({ color: 0x7fb2d9, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-6.5, 0.015, 4.6);
  rug.receiveShadow = true;
  scene.add(rug);

  const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 24), woodMat);
  ct.position.set(-6.5, 0.42, 4.8);
  ct.castShadow = true;
  scene.add(ct);
  const ctLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.42, 10), darkMat);
  ctLeg.position.set(-6.5, 0.21, 4.8);
  scene.add(ctLeg);
  colliders.push({ x: -6.5, z: 4.8, r: 0.8 });

  // TV stand + TV facing the sofa
  const tvStand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.55), woodMat);
  tvStand.position.set(-6.5, 0.25, 7.6);
  tvStand.castShadow = true;
  scene.add(tvStand);
  const loungeTv = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 0.08), darkMat);
  loungeTv.position.set(-6.5, 1.15, 7.65);
  loungeTv.castShadow = true;
  scene.add(loungeTv);
  const loungeScr = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.95), new THREE.MeshBasicMaterial({ color: 0x8fd0ff }));
  loungeScr.rotation.y = Math.PI;
  loungeScr.position.set(-6.5, 1.15, 7.6);
  scene.add(loungeScr);
  colliders.push({ x: -6.5, z: 7.6, r: 1.4 });

  // game console on the stand
  const consoleBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.1, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.35 })
  );
  consoleBox.position.set(-5.75, 0.55, 7.5);
  consoleBox.rotation.y = 0.25;
  scene.add(consoleBox);
  const consoleStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.03, 0.33),
    new THREE.MeshStandardMaterial({ color: 0x1c1f24 })
  );
  consoleStripe.position.set(-5.75, 0.55, 7.5);
  consoleStripe.rotation.y = 0.25;
  scene.add(consoleStripe);

  // controllers on the coffee table
  for (const [ox, oz, ry, accent] of [[-0.22, 0.05, 0.5, 0x4f7fd9], [0.2, -0.08, -0.7, 0xe0684b]]) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.15), darkMat);
    pad.position.set(-6.5 + ox, 0.5, 4.8 + oz);
    pad.rotation.y = ry;
    scene.add(pad);
    for (const s of [-1, 1]) {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.025, 0.04, 8),
        new THREE.MeshStandardMaterial({ color: accent })
      );
      stick.position.set(-6.5 + ox + s * 0.06 * Math.cos(ry), 0.55, 4.8 + oz - s * 0.06 * Math.sin(ry));
      scene.add(stick);
    }
  }
}

// sofa seats (shared by NPCs and the player)
const sofaSeats = [
  { pos: new THREE.Vector3(-7.2, 0, 2.55), yaw: 0, y: 0.16, occupied: false },
  { pos: new THREE.Vector3(-5.8, 0, 2.55), yaw: 0, y: 0.16, occupied: false },
];

const sign = labelSprite(() => `${officeTitle()} OFFICE`, () => "come say hi to the team", 1.7);
sign.position.set(0, WALL_H + 0.9, -ROOM_D / 2);
scene.add(sign);

// ---------- Characters ----------
function buildCharacter({
  shirt = 0x7c3aed, skin = 0xf0c297, hair = 0x2b2019, pants = 0x2e3a52,
  female = false, glasses = false, hijab = null, genji = false,
} = {}) {
  const g = new THREE.Group();
  const skinM = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
  const shirtM = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 });
  const pantsM = new THREE.MeshStandardMaterial({ color: pants, roughness: 0.7 });
  const hairM = new THREE.MeshStandardMaterial({ color: hair, roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.26), shirtM);
  body.position.y = 0.72;
  body.castShadow = true;
  g.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.32, 0.32), skinM);
  head.position.y = 1.14;
  head.castShadow = true;
  g.add(head);
  if (hijab) {
    const hijabM = new THREE.MeshStandardMaterial({ color: hijab, roughness: 0.85 });
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.32), hijabM);
    hood.position.set(0, 1.17, -0.06);
    hood.castShadow = true;
    g.add(hood);
    const drape = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.3), hijabM);
    drape.position.set(0, 0.93, -0.03);
    g.add(drape);
  } else {
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.34), hairM);
    hairTop.position.y = 1.3;
    g.add(hairTop);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.2, 0.1), hairM);
    hairBack.position.set(0, 1.16, -0.13);
    g.add(hairBack);
    if (female) {
      // long hair down to the shoulders
      const hairLong = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.12), hairM);
      hairLong.position.set(0, 1.02, -0.15);
      g.add(hairLong);
      for (const s of [-1, 1]) {
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.26), hairM);
        side.position.set(s * 0.19, 1.1, -0.04);
        g.add(side);
      }
    }
    if (genji) {
      // curtain fringe, parted in the middle
      for (const s of [-1, 1]) {
        const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.17, 0.04), hairM);
        fringe.position.set(s * 0.1, 1.21, 0.16);
        fringe.rotation.z = -s * 0.22;
        g.add(fringe);
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.2), hairM);
        side.position.set(s * 0.185, 1.14, -0.02);
        g.add(side);
      }
    }
  }

  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0x222222 }));
    eye.position.set(s * 0.08, 1.15, 0.165);
    g.add(eye);
  }

  if (glasses) {
    const rimM = new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.3 });
    for (const s of [-1, 1]) {
      const lens = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.1, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.45 })
      );
      lens.position.set(s * 0.08, 1.15, 0.175);
      g.add(lens);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.18), rimM);
      arm.position.set(s * 0.165, 1.16, 0.08);
      g.add(arm);
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.02), rimM);
    bridge.position.set(0, 1.16, 0.175);
    g.add(bridge);
  }

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.13), shirtM);
  armL.position.set(-0.28, 0.75, 0);
  armL.castShadow = true;
  g.add(armL);
  const armR = armL.clone();
  armR.position.x = 0.28;
  g.add(armR);

  const legGeo = new THREE.BoxGeometry(0.15, 0.46, 0.17);
  legGeo.translate(0, -0.23, 0); // pivot at hip
  const legL = new THREE.Mesh(legGeo, pantsM);
  legL.position.set(-0.11, 0.47, 0);
  legL.castShadow = true;
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.11;
  g.add(legR);

  return { group: g, armL, armR, legL, legR };
}

// ---------- Player ----------
const player = buildCharacter();
player.group.position.set(-2, 0, 6);
scene.add(player.group);

const blob = new THREE.Mesh(
  new THREE.CircleGeometry(0.32, 24),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 })
);
blob.rotation.x = -Math.PI / 2;
blob.position.y = 0.01;
scene.add(blob);

// ---------- NPCs ----------
const npcs = [];
function randomFreePoint() {
  for (let i = 0; i < 20; i++) {
    const x = THREE.MathUtils.randFloat(-ROOM_W / 2 + 1.5, ROOM_W / 2 - 1.5);
    const z = THREE.MathUtils.randFloat(-ROOM_D / 2 + 1.5, ROOM_D / 2 - 1.5);
    let ok = true;
    for (const c of colliders) {
      if (Math.hypot(x - c.x, z - c.z) < c.r + 0.6) { ok = false; break; }
    }
    if (ok) return new THREE.Vector3(x, 0, z);
  }
  return new THREE.Vector3(0, 0, 6);
}

const memberStyles = {
  "2": { female: true, glasses: true },        // Dita
  "4": { female: true, hijab: 0xc9748a },      // Rofi
  "5": { genji: true, hair: 0x111111 },        // Eko
  "6": { female: true, hair: 0x4a3220 },       // Anna
};

function spawnNpc(member, i, seat) {
  const char = buildCharacter({
    shirt: shirtColorsC[(i + 1) % shirtColorsC.length],
    skin: skinTones[i % skinTones.length],
    hair: hairColorsC[i % hairColorsC.length],
    pants: [0x2e3a52, 0x4a4038, 0x37474f][i % 3],
    ...memberStyles[member.id],
  });
  scene.add(char.group);

  const tag = labelSprite(() => displayName(member), () => member.role, 0.62);
  tag.position.y = 1.85;
  char.group.add(tag);

  const npc = {
    member, char, seat,
    state: "sitting",
    timer: THREE.MathUtils.randFloat(4, 14),
    target: null,
    walkTime: Math.random() * 10,
    speed: THREE.MathUtils.randFloat(0.85, 1.25),
  };
  if (seat && Math.random() < 0.75) {
    sitNpc(npc);
    npc.timer = THREE.MathUtils.randFloat(15, 75);
  } else {
    npc.state = "idle";
    npc.char.group.position.copy(randomFreePoint());
    npc.char.group.rotation.y = Math.random() * Math.PI * 2;
    npc.timer = THREE.MathUtils.randFloat(1, 4);
  }
  npcs.push(npc);
}

function sitNpc(npc, seat = npc.seat) {
  npc.state = "sitting";
  // shorter chill on the sofa so seats rotate between NPCs; longer focus time at own desk
  npc.timer = "occupied" in seat
    ? THREE.MathUtils.randFloat(18, 40)
    : THREE.MathUtils.randFloat(45, 90);
  npc.curSeat = seat;
  if ("occupied" in seat) seat.occupied = true;
  const g = npc.char.group;
  g.position.copy(seat.pos);
  g.position.y = seat.y ?? 0.12;
  // reset full rotation: after quaternion slerp, setting rotation.y alone can flip 180°
  g.rotation.set(0, seat.yaw, 0);
  npc.char.legL.rotation.x = -1.45;
  npc.char.legR.rotation.x = -1.45;
  npc.char.armL.rotation.x = -0.5;
  npc.char.armR.rotation.x = -0.5;
}
function standNpc(npc) {
  if (npc.curSeat && "occupied" in npc.curSeat) npc.curSeat.occupied = false;
  npc.curSeat = null;
  npc.char.legL.rotation.x = 0;
  npc.char.legR.rotation.x = 0;
  npc.char.armL.rotation.x = 0;
  npc.char.armR.rotation.x = 0;
  npc.char.group.position.y = 0;
}

// core team (except player/Dean) sit at their desk chairs
coreTeam.forEach((m, i) => {
  if (m.id === PLAYER_MEMBER_ID) return;
  const st = stations.find((s) => s.member.id === m.id);
  spawnNpc(m, i, { pos: st.seatPos, yaw: st.seatYaw, y: 0.12 });
});

function updateNpc(npc, dt) {
  npc.timer -= dt;
  const g = npc.char.group;

  if (npc.state === "sitting") {
    // subtle breathing bob
    g.position.y = (npc.curSeat?.y ?? 0.12) + Math.sin(performance.now() / 900 + npc.walkTime) * 0.008;
    if (npc.timer <= 0) {
      standNpc(npc);
      npc.state = "walking";
      npc.target = randomFreePoint();
    }
    return;
  }

  if (npc.state === "idle") {
    if (npc.timer <= 0) {
      const freeSofa = sofaSeats.find((s) => !s.occupied);
      const roll = Math.random();
      if (npc.seat && roll < 0.4) {
        npc.state = "toSeat";
        npc.targetSeat = npc.seat;
        npc.target = npc.seat.pos.clone();
      } else if (freeSofa && roll < 0.8) {
        freeSofa.occupied = true; // reserve so nobody races for it
        npc.state = "toSeat";
        npc.targetSeat = freeSofa;
        npc.target = freeSofa.pos.clone();
      } else {
        npc.state = "walking";
        npc.target = randomFreePoint();
      }
    }
    return;
  }

  // walking / toSeat
  const p = g.position;
  const dir = npc.target.clone().sub(p);
  dir.y = 0;
  const dist = dir.length();
  if (dist < 0.25) {
    if (npc.state === "toSeat") {
      sitNpc(npc, npc.targetSeat ?? npc.seat);
    } else {
      npc.state = "idle";
      npc.timer = THREE.MathUtils.randFloat(2, 6);
      standNpc(npc);
    }
    return;
  }
  dir.normalize();
  p.addScaledVector(dir, npc.speed * dt);
  p.x = THREE.MathUtils.clamp(p.x, -ROOM_W / 2 + 0.4, ROOM_W / 2 - 0.4);
  p.z = THREE.MathUtils.clamp(p.z, -ROOM_D / 2 + 0.4, ROOM_D / 2 - 0.4);

  // colliders (skip when heading to own seat and close)
  const nearSeat = npc.state === "toSeat" && dist < 1.6;
  if (!nearSeat) {
    for (const c of colliders) {
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      const min = c.r + 0.3;
      if (d < min && d > 0.0001) {
        p.x = c.x + (dx / d) * min;
        p.z = c.z + (dz / d) * min;
      }
    }
  }

  const targetYaw = Math.atan2(dir.x, dir.z);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetYaw);
  g.quaternion.slerp(q, 1 - Math.pow(0.01, dt));

  // relaxed walk anim
  npc.walkTime += dt * 6.5;
  const swing = Math.sin(npc.walkTime) * 0.4;
  npc.char.legL.rotation.x = swing;
  npc.char.legR.rotation.x = -swing;
  npc.char.armL.rotation.x = -swing * 0.7;
  npc.char.armR.rotation.x = swing * 0.7;
  g.position.y = Math.abs(Math.sin(npc.walkTime)) * 0.03;
}

// ---------- Camera: 360° orbit + zoom ----------
let camDist = 17;
let camYaw = Math.PI / 4;
let camPitch = 0.72; // radians above horizon
let dragging = false;
let lastX = 0, lastY = 0;

renderer.domElement.addEventListener("pointerdown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
addEventListener("pointerup", () => (dragging = false));
addEventListener("pointermove", (e) => {
  if (!dragging) return;
  camYaw -= (e.clientX - lastX) * 0.005;
  camPitch = THREE.MathUtils.clamp(camPitch + (e.clientY - lastY) * 0.004, 0.15, 1.35);
  lastX = e.clientX;
  lastY = e.clientY;
});
addEventListener("wheel", (e) => {
  camDist = THREE.MathUtils.clamp(camDist + e.deltaY * 0.012, 7, 32);
});

function camOffset() {
  return new THREE.Vector3(
    Math.sin(camYaw) * Math.cos(camPitch),
    Math.sin(camPitch),
    Math.cos(camYaw) * Math.cos(camPitch)
  ).multiplyScalar(camDist);
}
camera.position.copy(player.group.position).add(camOffset());
camera.lookAt(player.group.position);

// ---------- Input ----------
const keys = {};
addEventListener("keydown", (e) => (keys[e.code] = true));
addEventListener("keyup", (e) => (keys[e.code] = false));

// sit on the sofa with E
let playerSeat = null;
addEventListener("keydown", (e) => {
  if (e.code !== "KeyE" || playerSeat) return;
  const pp = player.group.position;
  const seat = sofaSeats.find((s) => !s.occupied && Math.hypot(pp.x - s.pos.x, pp.z - s.pos.z) < 2.4);
  if (!seat) return;
  playerSeat = seat;
  seat.occupied = true;
  player.group.position.copy(seat.pos).setY(seat.y);
  player.group.rotation.set(0, seat.yaw, 0);
  player.legL.rotation.x = -1.45;
  player.legR.rotation.x = -1.45;
  player.armL.rotation.x = -0.5;
  player.armR.rotation.x = -0.5;
});
function playerStandUp() {
  playerSeat.occupied = false;
  playerSeat = null;
  player.legL.rotation.x = 0;
  player.legR.rotation.x = 0;
  player.armL.rotation.x = 0;
  player.armR.rotation.x = 0;
  player.group.position.y = 0;
}

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  document.getElementById("hint").style.display = "block";
  document.getElementById("mask-toggle").style.display = "flex";
});

// ---------- Mask toggle ----------
const maskCheckbox = document.getElementById("mask-checkbox");
maskCheckbox.addEventListener("change", () => {
  maskOn = maskCheckbox.checked;
  refreshLabels();
  document.title = maskOn ? "Virtual Office" : "Hyperfantasy Virtual Office";
  currentMemberId = null; // force card refresh
  if (card.classList.contains("visible")) card.classList.remove("visible");
});

// ---------- Member card ----------
const card = document.getElementById("member-card");
const cardSlot = card.querySelector(".avatar-slot");
const cardName = card.querySelector("h2");
const cardRole = card.querySelector("h3");
const cardBio = card.querySelector("p");
let currentMemberId = null;

function showCard(member) {
  if (currentMemberId === member.id) return;
  currentMemberId = member.id;
  cardName.textContent = displayName(member);
  cardRole.textContent = member.role;
  cardBio.textContent = member.bio;
  cardSlot.innerHTML = "";
  if (member.image) {
    const img = document.createElement("img");
    img.src = member.image;
    img.onerror = () => { img.remove(); addInitials(member); };
    cardSlot.appendChild(img);
  } else {
    addInitials(member);
  }
  card.classList.add("visible");
}
function addInitials(member) {
  const div = document.createElement("div");
  div.className = "ph";
  div.textContent = displayName(member).split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  cardSlot.appendChild(div);
}
function hideCard() {
  currentMemberId = null;
  card.classList.remove("visible");
}

// ---------- Main loop ----------
const clock = new THREE.Clock();
const SPEED = 3.6;
const PLAYER_R = 0.35;
let walkTime = 0;
const targetQuat = new THREE.Quaternion();
const upAxis = new THREE.Vector3(0, 1, 0);

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // camera-relative movement basis
  const fwdDir = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
  const rightDir = new THREE.Vector3(-fwdDir.z, 0, fwdDir.x);

  const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
  const r = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
  const moving = f !== 0 || r !== 0;

  if (moving && playerSeat) playerStandUp();

  if (moving) {
    const dir = new THREE.Vector3()
      .addScaledVector(fwdDir, f)
      .addScaledVector(rightDir, r)
      .normalize();
    const p = player.group.position;
    p.addScaledVector(dir, SPEED * dt);

    p.x = THREE.MathUtils.clamp(p.x, -ROOM_W / 2 + PLAYER_R, ROOM_W / 2 - PLAYER_R);
    p.z = THREE.MathUtils.clamp(p.z, -ROOM_D / 2 + PLAYER_R, ROOM_D / 2 - PLAYER_R);

    for (const c of colliders) {
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      const min = c.r + PLAYER_R;
      if (d < min && d > 0.0001) {
        p.x = c.x + (dx / d) * min;
        p.z = c.z + (dz / d) * min;
      }
    }

    targetQuat.setFromAxisAngle(upAxis, Math.atan2(dir.x, dir.z));
    player.group.quaternion.slerp(targetQuat, 1 - Math.pow(0.001, dt));

    walkTime += dt * 10;
    const swing = Math.sin(walkTime) * 0.55;
    player.legL.rotation.x = swing;
    player.legR.rotation.x = -swing;
    player.armL.rotation.x = -swing * 0.8;
    player.armR.rotation.x = swing * 0.8;
    player.group.position.y = Math.abs(Math.sin(walkTime)) * 0.04;
  } else if (!playerSeat) {
    walkTime = 0;
    player.legL.rotation.x *= 0.8;
    player.legR.rotation.x *= 0.8;
    player.armL.rotation.x *= 0.8;
    player.armR.rotation.x *= 0.8;
    player.group.position.y *= 0.8;
  }

  blob.position.x = player.group.position.x;
  blob.position.z = player.group.position.z;

  // NPCs
  for (const npc of npcs) updateNpc(npc, dt);

  // tube occupants: dormant, gently floating
  const t = performance.now() / 1000;
  for (const tube of tubes) {
    tube.occupant.group.position.y = 0.45 + Math.sin(t * 0.8 + tube.phase) * 0.08;
    tube.glow.material.color.setHSL(0.52, 0.85, 0.55 + Math.sin(t * 1.5 + tube.phase) * 0.12);
  }

  // camera follow
  const camTarget = player.group.position.clone().add(camOffset());
  camera.position.lerp(camTarget, 1 - Math.pow(0.0005, dt));
  const look = player.group.position.clone().setY(0.8);
  camera.lookAt(look);

  // proximity → member card (desks + wandering NPCs)
  let nearest = null;
  let nearestD = 2.9;
  const pp = player.group.position;
  for (const s of stations) {
    const d = Math.hypot(pp.x - s.pos.x, pp.z - s.pos.z);
    if (d < nearestD) { nearestD = d; nearest = s.member; }
  }
  for (const npc of npcs) {
    const np = npc.char.group.position;
    const d = Math.hypot(pp.x - np.x, pp.z - np.z);
    if (d < Math.min(nearestD, 1.8)) { nearestD = d; nearest = npc.member; }
  }
  if (nearest) showCard(nearest);
  else hideCard();

  renderer.render(scene, camera);
}
animate();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
