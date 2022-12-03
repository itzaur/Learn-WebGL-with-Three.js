import "./styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/*
 * Mouse
 */
const mouse = new THREE.Vector2();
let currentIntersect = null;

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -((e.clientY / sizes.height) * 2 - 1);
});

window.addEventListener("click", () => {
  //   if (currentIntersect) {
  //     console.log("click on sphere");
  //   }
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log("click on sphere1");
        break;
      case object2:
        console.log("click on sphere2");
        break;
      case object3:
        console.log("click on sphere3");
        break;
    }
  }
});

//Debug
const gui = new dat.GUI();

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 4);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

//Raycaster
const raycaster = new THREE.Raycaster();

/*
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.position.set(-2, 0, 0);

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object3.position.set(2, 0, 0);
scene.add(object1, object2, object3);

/*
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update controls
  controls.update();

  //Update renderer
  renderer.render(scene, camera);

  //Update objects
  object1.position.y = Math.sin(elapsedTime * 0.4) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 0.9;
  object3.position.y = Math.sin(elapsedTime * 1.2) * 0.7;

  raycaster.setFromCamera(mouse, camera);

  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(10, 0, 0);
  //   rayDirection.normalize();
  //   raycaster.set(rayOrigin, rayDirection);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set(0xff0000);
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set(0x0000ff);
    // console.log(intersects[0]);
  }

  if (intersects.length) {
    if (currentIntersect === null) {
      console.log("mouse enter");
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect !== null) {
      console.log("mouse leave");
    }

    currentIntersect = null;
  }

  //Update animation
  window.requestAnimationFrame(tick);
};

tick();
