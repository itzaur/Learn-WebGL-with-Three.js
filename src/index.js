import "./styles/index.scss";
import * as THREE from "three";

console.log(THREE);

//Scene
const scene = new THREE.Scene();

//Cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// // mesh.position.x = 0.7;
// // mesh.position.y = -0.6;
// // mesh.position.z = 0.4;
// mesh.position.set(0.7, -0.6, 0.4);
// mesh.position.normalize();
// // mesh.rotation.x = 0.6;
// // mesh.rotation.y = 0.6;
// // mesh.rotation.z = 0.4;
// // mesh.rotation.reorder("YXZ");
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 1.5);
// // mesh.rotation.x = Math.PI * 0.25;
// // mesh.rotation.y = Math.PI * 0.25;
// mesh.scale.set(1.8, 1, 1);

//Group
const group = new THREE.Group();
scene.add(group);
group.position.set(0, 1.2, 0);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
group.add(cube2);
cube2.position.set(-1.5, 0, 0);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
group.add(cube3);
cube3.position.set(1.5, 0, 0);

//Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// scene.add(mesh);

//Sizes
const sizes = {
  width: 800,
  height: 600,
};

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
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
renderer.render(scene, camera);
