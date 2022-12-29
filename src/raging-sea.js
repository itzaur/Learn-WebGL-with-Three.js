import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/water/main.vertex.glsl";
import fragmentShader from "./shaders/water/main.fragment.glsl";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Debug
    this.gui = new dat.GUI();
    this.debugObject = {};

    //Colors
    this.debugObject.depthColor = "#186691";
    this.debugObject.surfaceColor = "#9bd8ff";

    //Scene
    this.scene = new THREE.Scene();

    //Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 1);
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
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.addMesh();
    this.render();
    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  addMesh() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 512, 512);
    this.material = new THREE.ShaderMaterial({
      // wireframe: true
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIteration: { value: 4 },

        uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
        uSurfaceColor: {
          value: new THREE.Color(this.debugObject.surfaceColor),
        },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    });

    this.water = new THREE.Mesh(this.geometry, this.material);
    this.water.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.water);

    this.gui
      .add(this.material.uniforms.uBigWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uBigWavesElevation");
    this.gui
      .add(this.material.uniforms.uBigWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequencyX");
    this.gui
      .add(this.material.uniforms.uBigWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequencyY");
    this.gui
      .add(this.material.uniforms.uBigWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uBigWavesSpeed");
    this.gui
      .addColor(this.debugObject, "depthColor")
      .onChange(() =>
        this.material.uniforms.uDepthColor.value.set(
          this.debugObject.depthColor
        )
      );
    this.gui
      .addColor(this.debugObject, "surfaceColor")
      .onChange(() =>
        this.material.uniforms.uSurfaceColor.value.set(
          this.debugObject.surfaceColor
        )
      );
    this.gui
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uColorOffset");
    this.gui
      .add(this.material.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uColorMultiplier");
    this.gui
      .add(this.material.uniforms.uSmallWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uSmallWavesElevation");
    this.gui
      .add(this.material.uniforms.uSmallWavesFrequency, "value")
      .min(0)
      .max(30)
      .step(0.001)
      .name("uSmallWavesFrequency");
    this.gui
      .add(this.material.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uSmallWavesSpeed");
    this.gui
      .add(this.material.uniforms.uSmallWavesIteration, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("uSmallWavesIteration");
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
}

new Sketch(document.querySelector(".webgl"));

// import "../src/styles/index.scss";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "lil-gui";
// import vertexShader from "./shaders/water/main.vertex.glsl";
// import fragmentShader from "./shaders/water/main.fragment.glsl";

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = canvas;

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Debug
//     this.gui = new dat.GUI();
//     this.debugObjects = {};

//     //Colors
//     this.debugObjects.depthColor = 0x0000ff;
//     this.debugObjects.surfaceColor = "#e5e5e5";

//     //Scene
//     this.scene = new THREE.Scene();

//     //Camera
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(1, 1, 1);
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
//       alpha: true,
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
//     this.geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
//     this.material = new THREE.ShaderMaterial({
//       side: THREE.DoubleSide,
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       uniforms: {
//         uTime: { value: 0 },

//         uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
//         uBigWavesElevation: { value: 0.2 },
//         uBigWavesSpeed: { value: 0.75 },

//         uSmallWavesFrequency: { value: 3 },
//         uSmallWavesElevation: { value: 0.2 },
//         uSmallWavesSpeed: { value: 0.15 },
//         uSmallWavesIteration: { value: 3 },

//         uDepthColor: { value: new THREE.Color(this.debugObjects.depthColor) },
//         uSurfaceColor: {
//           value: new THREE.Color(this.debugObjects.surfaceColor),
//         },
//         uColorOffset: { value: 0.08 },
//         uColorMultiplier: { value: 2 },
//       },
//     });
//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.mesh.rotation.x = -Math.PI * 0.5;
//     this.scene.add(this.mesh);

//     this.gui.add(this.material, "wireframe");
//     this.gui
//       .add(this.material.uniforms.uBigWavesFrequency.value, "x")
//       .min(0)
//       .max(10)
//       .step(0.01)
//       .name("uBigWavesFrequencyX");
//     this.gui
//       .add(this.material.uniforms.uBigWavesElevation, "value")
//       .min(0)
//       .max(1)
//       .step(0.01)
//       .name("uBigWavesElevation");
//     this.gui
//       .add(this.material.uniforms.uBigWavesFrequency.value, "y")
//       .min(0)
//       .max(10)
//       .step(0.01)
//       .name("uBigWavesFrequencyY");
//     this.gui
//       .add(this.material.uniforms.uBigWavesSpeed, "value")
//       .min(0)
//       .max(6)
//       .step(0.01)
//       .name("uBigWavesSpeed");
//     this.gui.addColor(this.debugObjects, "depthColor").onChange(() => {
//       this.material.uniforms.uDepthColor.value.set(
//         this.debugObjects.depthColor
//       );
//     });
//     this.gui.addColor(this.debugObjects, "surfaceColor").onChange(() => {
//       this.material.uniforms.uSurfaceColor.value.set(
//         this.debugObjects.surfaceColor
//       );
//     });
//     this.gui
//       .add(this.material.uniforms.uColorOffset, "value")
//       .min(0)
//       .max(1)
//       .step(0.01)
//       .name("uColorOffset");
//     this.gui
//       .add(this.material.uniforms.uColorMultiplier, "value")
//       .min(0)
//       .max(6)
//       .step(0.01)
//       .name("uColorMultiplier");
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
