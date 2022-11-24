import "./styles/index.scss";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Canvas
const canvas = document.querySelector(".webgl");

//Debug
const gui = new dat.GUI();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,

  wallsHeight: 2.5,
  houseWidth: 4,

  roofHeight: 2,

  doorWidth: 2,
  doorHeight: 2,
};

//Scene
const scene = new THREE.Scene();

//Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullScreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullScreen) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/particles/2.png");
// const doorTexture = textureLoader.load("/textures/door/color.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorDisplacementTexture = textureLoader.load("/textures/door/height.jpg");
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");

// const bricksTexture = textureLoader.load("/textures/bricks/color.jpg");
// const bricksAmbientOcclusionTexture = textureLoader.load(
//   "/textures/bricks/ambientOcclusion.jpg"
// );
// const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
// const bricksRoughnessTexture = textureLoader.load(
//   "/textures/bricks/roughness.jpg"
// );

// const grassTexture = textureLoader.load("/textures/grass/color.jpg");
// const grassAmbientOcclusionTexture = textureLoader.load(
//   "/textures/grass/ambientOcclusion.jpg"
// );
// const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
// const grassRoughnessTexture = textureLoader.load(
//   "/textures/grass/roughness.jpg"
// );

// grassTexture.repeat.set(8, 8);
// grassAmbientOcclusionTexture.repeat.set(8, 8);
// grassNormalTexture.repeat.set(8, 8);
// grassRoughnessTexture.repeat.set(8, 8);

// grassTexture.wrapS = THREE.RepeatWrapping;
// grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
// grassNormalTexture.wrapS = THREE.RepeatWrapping;
// grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

// grassTexture.wrapT = THREE.RepeatWrapping;
// grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
// grassNormalTexture.wrapT = THREE.RepeatWrapping;
// grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

//Fog
// const fog = new THREE.Fog("#262637", 1, 15);
// scene.fog = fog;

/**
 * House
 */
// const house = new THREE.Group();
// scene.add(house);

//Walls
// const walls = new THREE.Mesh(
//   new THREE.BoxGeometry(sizes.houseWidth, sizes.wallsHeight, sizes.houseWidth),
//   new THREE.MeshStandardMaterial({
//     map: bricksTexture,
//     aoMap: bricksAmbientOcclusionTexture,
//     normalMap: bricksNormalTexture,
//     roughnessMap: bricksRoughnessTexture,
//   })
// );
// walls.position.y = sizes.wallsHeight / 2;
// walls.geometry.setAttribute(
//   "uv2",
//   new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
// );
// house.add(walls);

//Roof
// const roof = new THREE.Mesh(
//   new THREE.ConeGeometry(3.5, sizes.roofHeight, 4),
//   new THREE.MeshStandardMaterial({ color: "#b35f45" })
// );
// roof.position.y = sizes.wallsHeight + sizes.roofHeight / 2;
// roof.rotation.y = Math.PI * 0.25;
// house.add(roof);

//Door
// const door = new THREE.Mesh(
//   new THREE.PlaneGeometry(sizes.doorWidth, sizes.doorHeight, 100, 100),
//   new THREE.MeshStandardMaterial({
//     map: doorTexture,
//     aoMap: doorAmbientOcclusionTexture,
//     alphaMap: doorAlphaTexture,
//     transparent: true,
//     normalMap: doorNormalTexture,
//     roughnessMap: doorRoughnessTexture,
//     displacementMap: doorDisplacementTexture,
//     displacementScale: 0.1,
//     metalnessMap: doorMetalnessTexture,
//   })
// );
// door.position.set(0, sizes.doorHeight / 2, sizes.houseWidth / 2 + 0.01);
// door.geometry.setAttribute(
//   "uv2",
//   new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
// );
// house.add(door);

//Floor
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(20, 20),
//   new THREE.MeshStandardMaterial({
//     map: grassTexture,
//     aoMap: grassAmbientOcclusionTexture,
//     normalMap: grassNormalTexture,
//     roughnessMap: grassRoughnessTexture,
//   })
// );
// floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = 0;
// floor.geometry.setAttribute(
//   "uv2",
//   new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
// );

// scene.add(floor);

//Graves
// const graves = new THREE.Group();
// scene.add(graves);

// const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
// const graveMaterial = new THREE.MeshStandardMaterial({ color: "gray" });

// for (let i = 0; i < 50; i++) {
//   const angle = Math.random() * Math.PI * 2;
//   const radius = 3 + Math.random() * 6;
//   const grave = new THREE.Mesh(graveGeometry, graveMaterial);
//   const x = Math.cos(angle) * radius;
//   const z = Math.sin(angle) * radius;
//   grave.position.set(x, 0.3, z);
//   grave.rotation.y = (Math.random() - 0.5) * 0.4;
//   grave.rotation.z = (Math.random() - 0.5) * 0.4;
//   grave.castShadow = true;
//   graves.add(grave);
// }

//Ghosts
// const ghost1 = new THREE.PointLight(0xff0000, 2, 3);
// const ghost2 = new THREE.PointLight(0x00ff00, 2, 3);
// const ghost3 = new THREE.PointLight(0x0000ff, 2, 3);
// scene.add(ghost1, ghost2, ghost3);

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 2, 5);
scene.add(camera);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
gui.add(ambientLight, "intensity").min(-3).max(3).step(0.001);
scene.add(ambientLight);

// const doorLight = new THREE.PointLight(0xffffff, 1, 7);
// doorLight.position.set(0, 2.2, 2.5);
// scene.add(doorLight);
// const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.2);
// scene.add(pointLightHelper);

//Moonlight
// const moonlight = new THREE.DirectionalLight("#b9d5ff", 0.12);
// gui.add(moonlight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonlight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonlight.position, "z").min(-5).max(5).step(0.001);
// moonlight.position.set(4, 5, -2);
// scene.add(moonlight);

/**
 * Particles
 */
//Geometry
const particlesGeometry = new THREE.BufferGeometry();
let count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  alphaMap: particlesTexture,
  transparent: true,
  //   alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
// particlesMaterial.color = new THREE.Color("lightgreen");

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
);
scene.add(cube);

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor("#262637");

/**
 * Shadows
 */
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// moonlight.castShadow = true;
// doorLight.castShadow = true;
// doorLight.shadow.mapSize.width = 256;
// doorLight.shadow.mapSize.height = 256;
// doorLight.shadow.camera.far = 7;
// floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update renderer
  renderer.render(scene, camera);

  //Update controls
  controls.update();

  //Update particles
  //   particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  //Update ghosts
  //   const ghost1Angle = elapsedTime * 0.5;
  //   ghost1.position.x = Math.cos(ghost1Angle) * 6;
  //   ghost1.position.z = Math.sin(ghost1Angle) * 6;
  //   ghost1.position.y = Math.sin(elapsedTime) * 3;

  //   const ghost2Angle = -elapsedTime * 0.2;
  //   ghost2.position.x = Math.cos(ghost2Angle) * 4;
  //   ghost2.position.z = Math.sin(ghost2Angle) * 4;
  //   ghost2.position.y = Math.sin(elapsedTime) * 3;

  //   const ghost3Angle = -elapsedTime * 0.12;
  //   ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.4));
  //   ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.8));
  //   ghost3.position.y = Math.sin(elapsedTime) * 3;

  //Call animation
  window.requestAnimationFrame(tick);
};

tick();
