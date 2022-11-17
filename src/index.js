import "./styles/index.scss";
import * as THREE from "three";
// import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import GUI from "lil-gui";
import { NearestFilter } from "three";

// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = "/textures/door/color.jpg";

/**
 * ANCHOR Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
// prettier ignore
const colorTexture = textureLoader.load("/textures/minecraft.png");
// const colorTexture = textureLoader.load(
//   "/textures/door/color.jpg",
//   () => {
//     console.log("loading finished");
//   },
//   () => {
//     console.log("loading progressing");
//   },
//   () => {
//     console.log("loading error");
//   }
// );

const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

//ANCHOR Cursor
let cursor = {
  x: 0,
  y: 0,
};

const parameters = {
  color: 0x00ff00,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + Math.PI * 2,
      duration: 1.2,
    });
  },
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

//Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
// console.log(geometry.attributes.uv);
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute("position", positionsAttribute);

// let count = 5000;
// const positionsArray = new Float32Array(count * 3 * 3);
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// const geometry = new THREE.BufferGeometry();
// for (let i = 0; i < count * 3 * 3; i++) {
//   positionsArray[i] = (Math.random() - 0.5) * 4;
// }
// geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // color: parameters.color,
  // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 0.4;
mesh.position.set(0, 0, 0);
// mesh.position.normalize();
// mesh.rotation.x = 0.6;
// mesh.rotation.y = 0.6;
// mesh.rotation.z = 0.4;
// mesh.rotation.reorder("YXZ");
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 1.5);
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;
// mesh.scale.set(1, 1, 1);

//ANCHOR Debug
const gui = new GUI({ width: 500 });
// gui.hide();
// prettier-ignore
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name('elevation');

gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.add(mesh.rotation, "x").min(-3).max(3).step(0.01).name("X-rotation");
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});
gui.add(parameters, "spin");

//Group
// const group = new THREE.Group();
// scene.add(group);
// group.position.set(0, 1.2, 0);

// const cube1 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// group.add(cube1);

// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// );
// group.add(cube2);
// cube2.position.set(-1.5, 0, 0);

// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0x0000ff })
// );
// group.add(cube3);
// cube3.position.set(2.2, 0, 0);

//Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

scene.add(mesh);

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

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.z = 3;
// camera.position.y = 1;
// camera.position.x = 0.6;
camera.position.set(0.6, 0.5, 3);
// camera.lookAt(new THREE.Vector3(2, 1, -2));
// camera.lookAt(mesh.position);

scene.add(camera);

// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(camera.position));
// console.log(mesh.position.normalize());

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.render(scene, camera);

// let time = Date.now();

//Clock
const clock = new THREE.Clock();
// console.log(clock);

//GSAP
// gsap.to(mesh.position, {
//   x: 2,
//   duration: 1,
//   delay: 1,
// });
// gsap.to(mesh.position, {
//   x: 0.6,
//   ease: "none",
//   duration: 1,
//   delay: 2,
// });
// gsap
//   .timeline({ repeat: -1, duration: 1 })
//   .to(mesh.position, {
//     x: 2,
//   })
//   .to(mesh.position, {
//     x: 0.7,
//     ease: "back.out(1.7)",
//   });

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const tick = () => {
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  // group.rotation.x = elapsedTime * Math.PI * 2;
  // cube1.position.x = Math.cos(elapsedTime);
  // cube1.position.y = Math.sin(elapsedTime);
  // camera.lookAt(cube1.position);
  // cube2.rotation.y += 0.01;
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);
  // camera.lookAt(mesh.position);

  // mesh.rotation.x = Math.cos(elapsedTime);
  // mesh.rotation.y = Math.sin(elapsedTime);
  controls.update();

  renderer.render(scene, camera);

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);

  window.requestAnimationFrame(tick);
};
tick();
