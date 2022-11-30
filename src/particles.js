import "./styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferAttribute } from "three";

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
//  * Textures
//  */
// const textureLoader = new THREE.TextureLoader();
// const pointTexture = textureLoader.load("/textures/particles/11.png");

// /**
//  * Particles
//  */
// //Geometry
// const particlesGeometry = new THREE.BufferGeometry();
// const count = 25000;
// const positions = new Float32Array(count * 3);
// const colors = new Float32Array(count * 3);

// for (let i = 0; i < count * 3; i++) {
//   positions[i] = (Math.random() - 0.5) * 20;
//   colors[i] = Math.random();
// }

// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );
// particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// //Material
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.1,
//   sizeAttenuation: true,
//   alphaMap: pointTexture,
//   // alphaTest: 0.001,
//   // depthTest: false,
//   transparent: true,
//   depthWrite: false,
//   blending: THREE.AdditiveBlending,
//   vertexColors: true,
// });

// //Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// //Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(2, 2, 4);
// scene.add(camera);

// //Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// //Renderer
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   //Update renderer
//   renderer.render(scene, camera);

//   //Update controls
//   controls.update();

//   for (let i = 0; i < count; i++) {
//     const i3 = i * 3;

//     const x = particlesGeometry.attributes.position.array[i3];
//     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
//       elapsedTime + x
//     );
//   }

//   particlesGeometry.attributes.position.needsUpdate = true;

//   //Update animation
//   window.requestAnimationFrame(tick);
// };
// tick();

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 4);
scene.add(camera);

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/particles/3.png");

/*
 * Particles
 */
//Particles geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute("position", new BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new BufferAttribute(colors, 3));

//Particles material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  alphaMap: particlesTexture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update controls
  controls.update();

  //Update renderer
  renderer.render(scene, camera);

  //Update animation
  window.requestAnimationFrame(tick);

  //Update particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // console.log(particlesGeometry.attributes.position.array[i3 + 1]);
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // particles.position.x = Math.cos(elapsedTime);
  // particles.position.z = Math.sin(elapsedTime);
  // particles.position.y = Math.sin(elapsedTime * 3);
};

tick();

//Resize
window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Doubleclick
window.addEventListener("dblclick", () => {
  const fullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreen) {
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
