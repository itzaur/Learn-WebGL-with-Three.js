import "./styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { BufferAttribute } from "three";

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

///Parameters
const parameters = {
  count: 10000,
  size: 0.01,
  radius: 10,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: "#ff0000",
  outsideColor: "#0000ff",
};

//GUI
const gui = new dat.GUI();

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const galaxyTexture = textureLoader.load("/textures/particles/4.png");

/*
 * Galaxy
 */
let geometry = null,
  material = null,
  stars = null;

const generateGalaxy = () => {
  if (stars !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(stars);
  }

  /*
   * Geometry
   */
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const branhesAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness;

    positions[i3] = Math.cos(branhesAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branhesAngle + spinAngle) * radius + randomZ;

    //Colors
    const mixedColors = insideColor.clone();
    mixedColors.lerp(outsideColor, radius / parameters.radius);
    colors[i3] = mixedColors.r;
    colors[i3 + 1] = mixedColors.g;
    colors[i3 + 2] = mixedColors.b;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  /*
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaMap: galaxyTexture,
    vertexColors: true,
  });

  /*
   * Stars
   */
  stars = new THREE.Points(geometry, material);
  scene.add(stars);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(3)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(-5)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(3)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(2)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

/*
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update controls
  controls.update();

  //Update rendere
  renderer.render(scene, camera);

  //Update animation
  window.requestAnimationFrame(tick);
};

tick();
