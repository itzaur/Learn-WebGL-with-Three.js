import "./styles/index.scss";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// //Canvas
// const canvas = document.querySelector(".webgl");

// //Debug
// const gui = new dat.GUI();
// const debugObject = {};

// //Scene
// const scene = new THREE.Scene();

// //GLTFLoader
// const gltfLoader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/draco/");
// gltfLoader.setDRACOLoader(dracoLoader);

// const updateAllMaterials = () => {
//   scene.traverse((child) => {
//     if (
//       child instanceof THREE.Mesh &&
//       child.material instanceof THREE.MeshStandardMaterial
//     ) {
//       child.material.envMap = environmentMapTexture;
//       child.material.envMapIntensity = debugObject.envMapIntensity;
//       child.material.needsUpdate = true;
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
// };

// let mixer = null;

// gltfLoader.load("/models/burger.glb", (gltf) => {
//   // gltf.scene.scale.set(0.025, 0.025, 0.025);
//   gltf.scene.scale.set(0.9, 0.9, 0.9);
//   gltf.scene.position.set(0, -4, 0);
//   //   gltf.scene.rotation.y = Math.PI * 0.5;
//   gui
//     .add(gltf.scene.rotation, "y")
//     .min(-Math.PI)
//     .max(Math.PI)
//     .step(0.001)
//     .name("rotationY");

//   mixer = new THREE.AnimationMixer(gltf.scene);
//   //   const action = mixer.clipAction(gltf.animations[1]);
//   //   action.play();
//   scene.add(gltf.scene);

//   updateAllMaterials();
// });

// //Sizes
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// //Camera
// const camera = new THREE.PerspectiveCamera(
//   45,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(0, 4, 8);
// scene.add(camera);

// //Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// /*
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
// directionalLight.position.set(0.25, 3, -2.25);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.target.position.set(0, 100, 100);
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.bottom = -7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.far = 15;

// directionalLight.shadow.normalBias = 0.05;
// scene.add(directionalLight);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
// // scene.add(ambientLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// // scene.add(directionalLightCameraHelper);

// /*
//  * Textures
//  */
// const environmentMapTextureLoader = new THREE.CubeTextureLoader();
// const environmentMapTexture = environmentMapTextureLoader.load([
//   "/textures/environmentMaps/0/px.jpg",
//   "/textures/environmentMaps/0/nx.jpg",
//   "/textures/environmentMaps/0/py.jpg",
//   "/textures/environmentMaps/0/ny.jpg",
//   "/textures/environmentMaps/0/pz.jpg",
//   "/textures/environmentMaps/0/nz.jpg",
// ]);
// environmentMapTexture.outputEncoding = THREE.sRGBEncoding;
// scene.background = environmentMapTexture;

// debugObject.envMapIntensity = 5 / 2;
// gui
//   .add(debugObject, "envMapIntensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .onChange(updateAllMaterials);

// /*
//  * Objects
//  */
// // const floor = new THREE.Mesh(
// //   new THREE.PlaneGeometry(10, 10),
// //   new THREE.MeshStandardMaterial({
// //     color: "#444444",
// //     metalness: 0,
// //     roughness: 0.5,
// //   })
// // );
// // floor.rotation.x = -Math.PI * 0.5;
// // floor.receiveShadow = true;
// // scene.add(floor);

// //Sphere
// // const sphere = new THREE.Mesh(
// //   new THREE.SphereGeometry(1, 32, 32),
// //   new THREE.MeshStandardMaterial()
// // );
// // sphere.position.y = 1;
// // scene.add(sphere);

// //Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   alpha: true,
//   antialias: true,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 3;

// gui
//   .add(renderer, "toneMapping", {
//     none: THREE.NoToneMapping,
//     cineon: THREE.CineonToneMapping,
//     linear: THREE.LinearToneMapping,
//     // custom: THREE.CustomToneMapping,
//     reinhard: THREE.ReinhardToneMapping,
//     ACES: THREE.ACESFilmicToneMapping,
//   })
//   .onFinishChange(() => {
//     renderer.toneMapping = +renderer.toneMapping;
//     updateAllMaterials();
//   });

// gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

// window.addEventListener("resize", () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(20)
//   .step(0.001)
//   .name("lightIntensity");
// gui
//   .add(directionalLight.position, "x")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightX");
// gui
//   .add(directionalLight.position, "y")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightY");
// gui
//   .add(directionalLight.position, "z")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightZ");

// /*
//  * Animate
//  */
// const clock = new THREE.Clock();
// let previousTime = 0;

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - previousTime;
//   previousTime = elapsedTime;

//   //Update controls
//   controls.update();

//   //Update renderer
//   renderer.render(scene, camera);

//   //Update mixer
//   if (mixer !== null) {
//     mixer.update(deltaTime);
//   }

//   //Update tick
//   window.requestAnimationFrame(tick);
// };

// tick();

import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//Canvas
const canvas = document.querySelector(".webgl");

//Debug
const gui = new dat.GUI();
const debugObject = {};

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(3, 4, -1.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.far = 13;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.01)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.01)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.01)
  .name("lightZ");

//Models
let mixer = null;

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMapTexture;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

//Textures
const textureLoader = new THREE.TextureLoader();
const planeTexture = textureLoader.load("/textures/grass/color.jpg");
const planeNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const planeRougnessTexture = textureLoader.load("/textures/grass/rougness.jpg");
const planeAmbientTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
planeTexture.repeat.set(8, 8);
planeNormalTexture.repeat.set(8, 8);
planeRougnessTexture.repeat.set(8, 8);
planeAmbientTexture.repeat.set(8, 8);

planeTexture.magFilter = THREE.NearestFilter;
planeTexture.minFilter = THREE.NearestFilter;

planeTexture.wrapS = THREE.RepeatWrapping;
planeNormalTexture.wrapS = THREE.RepeatWrapping;
planeRougnessTexture.wrapS = THREE.RepeatWrapping;
planeAmbientTexture.wrapS = THREE.RepeatWrapping;

planeTexture.wrapT = THREE.RepeatWrapping;
planeNormalTexture.wrapT = THREE.RepeatWrapping;
planeRougnessTexture.wrapT = THREE.RepeatWrapping;
planeAmbientTexture.wrapT = THREE.RepeatWrapping;

const environmentMapTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = environmentMapTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);
environmentMapTexture.outputEncoding = THREE.sRGBEncoding;
scene.background = environmentMapTexture;
debugObject.envMapIntensity = 2.5;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange(updateAllMaterials);

const gltfLoader = new GLTFLoader();
const gltfModel = gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[1]);
  action.play();

  // gltf.scene.setRotationFromAxisAngle;
  scene.add(gltf.scene);

  updateAllMaterials();

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("rotationY");
});

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 4, 8);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Objects
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: planeTexture,
    normalMap: planeNormalTexture,
    roughnessMap: planeRougnessTexture,
    aoMap: planeAmbientTexture,
    transparent: true,
    color: "#444444",
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0,
  })
);
plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;
scene.add(plane);

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;

gui
  .add(renderer, "toneMapping", {
    none: THREE.NoToneMapping,
    cineon: THREE.CineonToneMapping,
    linear: THREE.LinearToneMapping,
    reinhurd: THREE.ReinhardToneMapping,
    acess: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = +renderer.toneMapping;
    updateAllMaterials();
  });
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.01);

//Animate
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer !== null) {
    mixer.update(deltaTime);
  }

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
