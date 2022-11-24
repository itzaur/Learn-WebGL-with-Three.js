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
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog("#262637", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorDisplacementTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
// const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
// const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

const houseSizes = {
  houseWidth: 4,
  wallsHight: 2.5,
  roofHight: 1.5,
  doorHight: 2,
};

//Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    houseSizes.houseWidth,
    houseSizes.wallsHight,
    houseSizes.houseWidth
  ),
  new THREE.MeshStandardMaterial({
    map: bricksTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = houseSizes.wallsHight * 0.5;
house.add(walls);

//Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, houseSizes.roofHight, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = houseSizes.wallsHight + houseSizes.roofHight / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, houseSizes.doorHight, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = houseSizes.houseWidth / 2 + 0.01;
door.position.y = houseSizes.doorHight / 2;
house.add(door);

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "green" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.6, 0, houseSizes.houseWidth / 2 + 0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1, 0, houseSizes.houseWidth / 2 + 0.25);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.75, 0.75, 0.75);
bush3.position.set(-2, 0, houseSizes.houseWidth / 2 + 0.75);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.5, 0.5, 0.5);
bush4.position.set(-3.1, 0, houseSizes.houseWidth / 2 + 1);

house.add(bush1, bush2, bush3, bush4);

//Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "gray" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

//Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
//Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5;
scene.add(ambientLight);

//Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(
  0,
  houseSizes.wallsHight - 0.2,
  houseSizes.houseWidth / 2 + 0.8
);
house.add(doorLight);

// const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.2);
// house.add(doorLightHelper);

//Ghosts
const ghost1 = new THREE.PointLight(0xff0000, 2, 3);
const ghost2 = new THREE.PointLight(0x00ff00, 2, 3);
const ghost3 = new THREE.PointLight(0x0000ff, 2, 3);
scene.add(ghost1, ghost2, ghost3);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
// directionalLight.position.set(-1, 0.5, 2);
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.camera.right = 2;
// directionalLight.shadow.camera.bottom = -2;
// directionalLight.shadow.camera.left = -2;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 6;
// // directionalLight.shadow.radius = 10;
// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// directionalLightCameraHelper.visible = false;
// scene.add(directionalLightCameraHelper);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
// pointLight.position.set(-1, 1, 0);
// // scene.add(pointLight);
// pointLight.castShadow = true;
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.mapSize.height = 1024;
// pointLight.shadow.camera.near = 0.1;
// pointLight.shadow.camera.far = 5;

// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// pointLightCameraHelper.visible = false;
// scene.add(pointLightCameraHelper);

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// // scene.add(rectAreaLight); //works with MeshStandardMaterial and MeshPhysicalMaterial

// const spotLight = new THREE.SpotLight(0x78ff00, 0.4, 10, Math.PI * 0.3);
// spotLight.position.set(0, 2, 2);
// // scene.add(spotLight);

// spotLight.target.position.x = -0.5;
// scene.add(spotLight.target);

// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.fov = 30;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 6;

// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// spotLightCameraHelper.visible = false;
// scene.add(spotLightCameraHelper);

// ANCHOR Helpers
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// });

/**
 * Objects
 */
// Material
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.4;
// material.side = THREE.DoubleSide;

// Objects
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.position.x = -1.5;
// sphere.castShadow = true;

// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
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

// scene.add(cube, plane);

// const sphereShadow = new THREE.Mesh(
//   new THREE.PlaneGeometry(1.5, 1.5),
//   new THREE.MeshBasicMaterial({
//     color: 0x000000,
//     transparent: true,
//     alphaMap: simpleShadow,
//   })
// );
// sphereShadow.rotation.x = -Math.PI * 0.5;
// sphereShadow.position.y = plane.position.y + 0.01;
// scene.add(sphereShadow);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor("#262637");
// renderer.shadowMap.enabled = false;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
doorLight.castShadow = true;
moonLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2);

  const ghost3Angle = -elapsedTime * 0.16;
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

  // Update objects
  // sphere.rotation.y = 0.1 * elapsedTime;
  // cube.rotation.y = 0.1 * elapsedTime;
  // cube.position.x = Math.cos(elapsedTime);
  // cube.position.z = Math.sin(elapsedTime);
  // cube.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //Update shadow position
  // sphereShadow.position.x = cube.position.x;
  // sphereShadow.position.z = cube.position.z;
  // sphereShadow.material.opacity = (1 - cube.position.y) * 0.3;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // cube.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
