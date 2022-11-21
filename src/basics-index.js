import "./styles/index.scss";
import * as THREE from "three";
// import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import GUI from "lil-gui";
import { NearestFilter } from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = "/textures/door/color.jpg";

/**
 * ANCHOR Textures
 */
// const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("onStart");
// };
// loadingManager.onLoad = () => {
//   console.log("onLoad");
// };
// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };
// loadingManager.onError = () => {
//   console.log("onError");
// };

// const textureLoader = new THREE.TextureLoader(loadingManager);
// // prettier ignore
// const colorTexture = textureLoader.load("/textures/minecraft.png");
// // const colorTexture = textureLoader.load(
// //   "/textures/door/color.jpg",
// //   () => {
// //     console.log("loading finished");
// //   },
// //   () => {
// //     console.log("loading progressing");
// //   },
// //   () => {
// //     console.log("loading error");
// //   }
// // );

// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// // colorTexture.repeat.x = 2;
// // colorTexture.repeat.y = 3;
// // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// // colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// // colorTexture.offset.x = 0.5;
// // colorTexture.offset.y = 0.5;
// // colorTexture.rotation = Math.PI * 0.25;
// // colorTexture.center.x = 0.5;
// // colorTexture.center.y = 0.5;
// colorTexture.generateMipmaps = false;
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.NearestFilter;

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

//ANCHOR Cursor
let cursor = {
  x: 0,
  y: 0,
};

const parameters = {
  color: 0x00ff00,
  spin: () => {
    gsap.to(torus.rotation, {
      y: torus.rotation.y + Math.PI * 2,
      duration: 1.2,
    });
    gsap.to(sphere.rotation, {
      y: sphere.rotation.y + Math.PI * 2,
      duration: 1.2,
    });
    gsap.to(plane.rotation, {
      y: plane.rotation.y + Math.PI * 2,
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
// const geometry = new THREE.BoxGeometry(1, 1, 1);
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

// const material = new THREE.MeshBasicMaterial({
//   map: colorTexture,
//   // color: parameters.color,
//   // wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);

// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// // material.color = new THREE.Color("red");
// material.transparent = true;
// // material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// const material = new THREE.MeshNormalMaterial();

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// material.flatShading = true;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 10;
// material.specular = new THREE.Color(0x1188f);

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// material.map = doorColorTexture;
// material.metalness = 0;
// material.roughness = 1;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMap;

material.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

torus.position.x = 1.5;
scene.add(sphere, plane, torus);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/Igra Sans_Regular.json", (font) => {
  const textGeometry = new TextGeometry("Support for Ukraine", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02 + 0.0615) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02 - 0.0021) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );
  textGeometry.center();

  // textGeometry.computeBoundingBox();
  // console.log(textGeometry.boundingBox);

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  // textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 30; i++) {
    const donut = new THREE.Mesh(donutGeometry, textMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    const scale = Math.random();
    donut.rotation.set(scale, scale, scale);
    scene.add(donut);
  }
});

/**
 * ANCHOR Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 0.4;
// mesh.position.set(0, 0, 0);
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
// gui
//   .add(mesh.position, "y")
//   .min(-3)
//   .max(3)
//   .step(0.01)
//   .name('elevation');

// gui.add(mesh, "visible");
gui.add(material, "wireframe");
// gui.add(mesh.rotation, "x").min(-3).max(3).step(0.01).name("X-rotation");
gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});
gui.add(parameters, "spin");
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(2).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(10).step(0.0001);

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

// scene.add(mesh);

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
  0.1,
  100
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
camera.position.set(1, 1, 2);
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
  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  sphere.rotation.y = 0.15 * elapsedTime;
  plane.rotation.y = 0.15 * elapsedTime;
  torus.rotation.y = 0.15 * elapsedTime;

  window.requestAnimationFrame(tick);
};
tick();
