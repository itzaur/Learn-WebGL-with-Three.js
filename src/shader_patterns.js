// import "../src/styles/index.scss";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "lil-gui";
// import vertexPatterns from "./shaders/test/main.vertex.patterns.glsl";
// import fragmentPatterns from "./shaders/test/main.fragment.patterns.glsl";

// export default class Sketch {
//   constructor(canvas) {
//     //Canvas
//     this.canvas = canvas;

//     //Debug
//     this.gui = new dat.GUI();

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Parameters
//     this.count = 500;

//     //Scene
//     this.scene = new THREE.Scene();

//     //Textures
//     this.texture = new THREE.TextureLoader().load(
//       "/textures/1462705837299158059.jpg"
//     );

//     //Lights
//     this.directionallight = new THREE.DirectionalLight(0xffffff, 0.8);
//     this.directionallight.position.set(1, 1, 0);
//     this.scene.add(this.directionallight);

//     //Camera
//     this.camera = new THREE.PerspectiveCamera(
//       35,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.z = 3;
//     this.scene.add(this.camera);

//     //Controls
//     this.controls = new OrbitControls(this.camera, this.canvas);
//     this.controls.enableDamping = true;

//     //Clock
//     this.clock = new THREE.Clock();

//     //Renderer
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas,
//       antialias: true,
//     });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.addMesh();
//     this.render();
//     window.addEventListener("resize", () => {
//       this.resize();
//     });
//   }

//   addMesh() {
//     this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
//     this.material = new THREE.RawShaderMaterial({
//       vertexShader: vertexPatterns,
//       fragmentShader: fragmentPatterns,
//       side: THREE.DoubleSide,
//       uniforms: {
//         uFrequency: { value: new THREE.Vector2(10, 5) },
//         uColor: { value: new THREE.Color("brown") },
//         uTime: { value: 0 },
//       },
//     });
//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.mesh.scale.y = 2 / 3;
//     this.scene.add(this.mesh);
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();
//     this.material.uniforms.uTime.value = this.elapsedTime;

//     this.controls.update();
//     this.renderer.render(this.scene, this.camera);
//     window.requestAnimationFrame(this.render.bind(this));
//   }

//   resize() {
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }
// }

// new Sketch(document.querySelector(".webgl"));

import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/test/main.vertex.patterns.glsl";
import fragmentShader from "./shaders/test/main.fragment.patterns.glsl";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Debug
    this.gui = new dat.GUI();

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Scene
    this.scene = new THREE.Scene();

    //Textures
    this.texture = new THREE.TextureLoader().load(
      "/textures/1462705837299158059.jpg"
    );

    //Camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    //Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    //Clock
    this.clock = new THREE.Clock();

    //Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      // alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.addMesh();
    this.render();
    window.addEventListener("resize", () => {
      this.resize();
    });
    window.addEventListener("dblclick", () => {
      this.dblclick();
    });
  }

  addMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const count = this.geometry.attributes.position.count;
    this.randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.randoms[i] = Math.random();
    }

    this.geometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(this.randoms, 1)
    );

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color("orange") },
        uTime: { value: 0 },
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTexture: { value: this.texture },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.y = 2 / 3;
    this.scene.add(this.mesh);

    // this.gui
    //   .add(this.material.uniforms.uFrequency.value, "x")
    //   .min(0)
    //   .max(20)
    //   .step(0.01)
    //   .name("frequencyX");
    // this.gui
    //   .add(this.material.uniforms.uFrequency.value, "y")
    //   .min(0)
    //   .max(20)
    //   .step(0.01)
    //   .name("frequencyY");
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = this.elapsedTime;

    this.controls.update();
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

  dblclick() {
    const fullscreen = document.fullscreenElement || document.webkitFullscreen;

    if (!fullscreen) {
      if (this.canvas.requestFullscreen) {
        this.canvas.requestFullscreen();
      } else if (this.canvas.webkitRequestFullscreen) {
        this.canvas.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}

new Sketch(document.querySelector(".webgl"));
