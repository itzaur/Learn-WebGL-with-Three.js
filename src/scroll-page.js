import "./styles/index.scss";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

/*
 * Debug
 */
// const gui = new dat.GUI();

// const parameters = {
//   materialColor: "#ffeded",
//   count: 500,
//   size: 0.4,
//   radius: 5,
//   objectDistance: 4,
// };

// /*
//  * Base
//  */
// // Canvas
// const canvas = document.querySelector("canvas.webgl");

// // Scene
// const scene = new THREE.Scene();

// /*
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 1, 0);
// scene.add(directionalLight);

// // const directionalLightHelper = new THREE.DirectionalLightHelper(
// //   directionalLight,
// //   0.5
// // );
// // scene.add(directionalLightHelper);

// /*
//  * Textures
//  */
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("textures/gradients/3.jpg");
// texture.magFilter = THREE.NearestFilter;

// const particlesTexture = textureLoader.load("textures/particles/4.png");

// /*
//  * Objects
//  */
// const material = new THREE.MeshToonMaterial({
//   color: parameters.materialColor,
//   gradientMap: texture,
// });

// const object1 = new THREE.Mesh(
//   new THREE.TorusGeometry(1, 0.4, 16, 60),
//   material
// );

// const object2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

// const object3 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
//   material
// );

// const objects = [object1, object2, object3];

// object1.position.y = 0;
// object2.position.y = -parameters.objectDistance * 1;
// object3.position.y = -parameters.objectDistance * 2;
// object1.position.x = 2;
// object2.position.x = -2;
// object3.position.x = 2;

// scene.add(object1, object2, object3);

// /*
//  * Particles
//  */
// //Geometry
// const particlesGeometry = new THREE.BufferGeometry();
// const positions = new Float32Array(parameters.count * 3);

// for (let i = 0; i < parameters.count; i++) {
//   const i3 = i * 3;
//   const radius = Math.random() * parameters.radius;
//   positions[i3] = (Math.random() - 0.5) * radius * 10;
//   positions[i3 + 1] =
//     parameters.objectDistance * 0.5 -
//     Math.random() * parameters.objectDistance * objects.length;
//   positions[i3 + 2] = (Math.random() - 0.5) * radius * 10;
// }

// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

// //Material
// const particlesMaterial = new THREE.PointsMaterial({
//   size: parameters.size,
//   sizeAttenuation: true,
//   depthWrite: false,
//   color: parameters.materialColor,
//   alphaMap: particlesTexture,
//   transparent: true,
// });

// //Points
// const points = new THREE.Points(particlesGeometry, particlesMaterial);

// scene.add(points);

// /*
//  * Sizes
//  */
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// // window.addEventListener("resize", () => {
// //   // Update sizes
// //   sizes.width = window.innerWidth;
// //   sizes.height = window.innerHeight;

// //   // Update camera
// //   camera.aspect = sizes.width / sizes.height;
// //   camera.updateProjectionMatrix();

// //   // Update renderer
// //   renderer.setSize(sizes.width, sizes.height);
// //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// // });

// gui.addColor(parameters, "materialColor").onChange(() => {
//   material.color.set(parameters.materialColor);
//   particlesMaterial.color.set(parameters.materialColor);
// });

// /*
//  * Camera
//  */
// //Group
// // const cameraGroup = new THREE.Group();
// // scene.add(cameraGroup);

// // // Base camera
// // const camera = new THREE.PerspectiveCamera(
// //   35,
// //   sizes.width / sizes.height,
// //   0.1,
// //   100
// // );
// // camera.position.z = 6;
// // cameraGroup.add(camera);

// /*
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   alpha: true,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /*
//  * Scroll
//  */
// let scrollY = window.scrollY;
// let currentSection = 0;

// window.addEventListener("scroll", () => {
//   scrollY = window.scrollY;
//   const newSection = Math.round(scrollY / sizes.height);

//   if (newSection !== currentSection) {
//     currentSection = newSection;

//     gsap.to(objects[currentSection].rotation, {
//       duration: 1.5,
//       ease: "power2.inOut",
//       x: "+=6",
//       y: "+=3",
//       z: "+=1.5",
//     });
//   }
// });

// const cursor = {
//   x: 0,
//   y: 0,
// };

// window.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / sizes.width - 0.5;
//   cursor.y = -(e.clientY / sizes.height - 0.5);
// });

// /*
//  * Animate
//  */
// const clock = new THREE.Clock();
// let previousTime = 0;

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - previousTime;
//   previousTime = elapsedTime;

//   for (const object of objects) {
//     object.rotation.x += deltaTime * 0.1;
//     object.rotation.y += deltaTime * 0.12;
//   }

//   // camera.position.y = (-scrollY / sizes.height) * parameters.objectDistance;
//   // cameraGroup.position.x +=
//   //   (cursor.x - cameraGroup.position.x) * 2.5 * deltaTime;
//   // cameraGroup.position.y +=
//   //   (cursor.y - cameraGroup.position.y) * 2.5 * deltaTime;

//   // Render
//   // renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Parameters
    this.color = "#e2e2e2";
    this.count = 500;
    this.size = 0.1;
    this.radius = 4;
    this.objectDistance = 4;
    this.previousTime = 0;
    this.scrollY = window.scrollY;
    this.currentSection = 0;
    this.cursor = {
      x: 0,
      y: 0,
    };

    //Scene
    this.scene = new THREE.Scene();

    //Camera
    this.cameraGroup = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 6;
    this.cameraGroup.add(this.camera);
    this.scene.add(this.cameraGroup);

    //Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 0);
    this.scene.add(this.directionalLight);

    //Textures
    this.textureLoader = new THREE.TextureLoader();
    this.texture = this.textureLoader.load("textures/particles/3.png");

    //Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Clock
    this.clock = new THREE.Clock();

    this.addMesh();
    this.render();
    this.addParticles();

    window.addEventListener("resize", () => {
      this.resize();
    });

    window.addEventListener("scroll", () => {
      this.scroll();
    });

    window.addEventListener("mousemove", this.mousemove);
  }

  addMesh() {
    this.material = new THREE.MeshToonMaterial({ color: this.color });
    this.object1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.3, 20, 100),
      this.material
    );
    this.object2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.5, 32),
      this.material
    );
    this.object3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16),
      this.material
    );

    this.object1.position.x = 2;
    this.object2.position.x = -2;
    this.object3.position.x = 2;
    this.object1.position.y = this.objectDistance * 0;
    this.object2.position.y = -this.objectDistance * 1;
    this.object3.position.y = -this.objectDistance * 2;

    this.objects = [this.object1, this.object2, this.object3];

    this.scene.add(this.object1, this.object2, this.object3);
  }

  addParticles() {
    this.particlesGeometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      this.positions[i3] = (Math.random() - 0.5) * this.radius;
      this.positions[i3 + 1] =
        this.objectDistance * 0.5 -
        Math.random() * this.objectDistance * this.objects.length;
      this.positions[i3 + 2] = (Math.random() - 0.5) * this.radius;

      this.colors[i3] = Math.random();
      this.colors[i3 + 1] = Math.random();
      this.colors[i3 + 2] = Math.random();
    }

    this.particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3)
    );

    this.particlesMaterial = new THREE.PointsMaterial({
      transparent: true,
      size: this.size,
      sizeAttenuation: true,
      depthWrite: false,
      alphaMap: this.texture,
      vertexColors: true,
    });

    this.points = new THREE.Points(
      this.particlesGeometry,
      this.particlesMaterial
    );
    this.scene.add(this.points);
  }

  render() {
    // this.time++;
    this.elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = this.elapsedTime - this.previousTime;
    this.previousTime = this.elapsedTime;

    for (const object of this.objects) {
      object.rotation.x += this.deltaTime * 0.1;
      object.rotation.z += this.deltaTime * 0.12;
    }

    this.cameraGroup.position.x +=
      (this.cursor.x - this.cameraGroup.position.x) * 2.5 * this.deltaTime;
    this.cameraGroup.position.y +=
      (this.cursor.y - this.cameraGroup.position.y) * 2.5 * this.deltaTime;

    this.camera.position.y =
      (-this.scrollY / this.height) * this.objectDistance;

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  scroll() {
    this.scrollY = window.scrollY;
    this.newSection = Math.round(this.scrollY / this.height);

    if (this.newSection !== this.currentSection) {
      this.currentSection = this.newSection;

      gsap.to(this.objects[this.currentSection].rotation, {
        x: "+=6",
        y: "+=3",
        z: "+=1.5",
        duration: 1.5,
        ease: "power3.in",
      });
    }
  }

  mousemove = (e) => {
    this.cursor.x = e.clientX / this.width - 0.5;
    this.cursor.y = -(e.clientY / this.height - 0.5);
  };

  update() {}
}

new Sketch(document.querySelector(".webgl"));
