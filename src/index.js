import "./styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
directionalLight.position.set(-1, 0.5, 2);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 10;
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight); //works with MeshStandardMaterial and MeshPhysicalMaterial

const spotLight = new THREE.SpotLight(0x78ff00, 0.4, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
// scene.add(spotLight);

spotLight.target.position.x = -0.5;
scene.add(spotLight.target);

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// ANCHOR Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

/**
 * Objects
 */
//Textures
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
// material.side = THREE.DoubleSide;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
cube.castShadow = true;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;
torus.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.receiveShadow = true;

scene.add(cube, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  cube.position.x = Math.cos(elapsedTime);
  cube.position.z = Math.sin(elapsedTime);
  cube.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //Update shadow position
  sphereShadow.position.x = cube.position.x;
  sphereShadow.position.z = cube.position.z;
  sphereShadow.material.opacity = (1 - cube.position.y) * 0.3;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

// //Canvas
// const canvas = document.querySelector(".webgl");

// //Scene
// const scene = new THREE.Scene();

// //Sizes
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// /**
//  * Lights
//  */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// pointLight.castShadow = true;
// scene.add(pointLight);

// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1);
// spotLight.position.set(-1, 2, 3);
// spotLight.castShadow = true;
// scene.add(spotLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
// directionalLight.position.set(1, 0.5, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1, 1, 1);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

// //Helpers
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// });
// scene.add(spotLightHelper);

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

// /**
//  * Objects
//  */
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.4;

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.castShadow = true;

// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
// cube.position.x = -1.5;
// cube.castShadow = true;

// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 32, 64),
//   material
// );
// torus.position.x = 1.5;
// torus.castShadow = true;

// const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.65;
// plane.receiveShadow = true;

// scene.add(sphere, cube, torus, plane);

// //Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(1, 1, 2);
// scene.add(camera);

// //Renderer
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;

// //Clock
// const clock = new THREE.Clock();

// //Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// /**
//  * Animate
//  */
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   //Update renderer
//   renderer.render(scene, camera);

//   //Update controls
//   controls.update();

//   //Update animation from each frame
//   window.requestAnimationFrame(tick);
// };
// tick();
