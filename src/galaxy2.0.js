import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/galaxy/vertex.glsl";
import fragmentShader from "./shaders/galaxy/fragment.glsl";

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = canvas;

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Debug
//     this.gui = new dat.GUI();

//     //Parameters
//     this.parameters = {
//       size: 0.03,
//       count: 1000,
//       branches: 3,
//       spin: 3,
//       radius: 4,
//       randomness: 0.2,
//       randomnessPower: 3,
//       insideColor: 0xff0000,
//       outsideColor: 0x0000ff,
//     };
//     this.geometry = null;
//     this.material = null;
//     this.mesh = null;

//     //Textures
//     this.texture = new THREE.TextureLoader().load(
//       "textures/particles/soap-bubble.png"
//     );

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

//     this.gui
//       .add(this.parameters, "count")
//       .min(100)
//       .max(200000)
//       .step(100)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "branches")
//       .min(1)
//       .max(20)
//       .step(1)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "spin")
//       .min(-5)
//       .max(10)
//       .step(1)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "randomness")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "randomnessPower")
//       .min(1)
//       .max(10)
//       .step(0.001)
//       .onFinishChange(this.addMesh.bind(this));

//     this.gui
//       .add(this.material.uniforms.uSize, "value")
//       .min(1)
//       .max(40)
//       .step(1)
//       .name("uSize");
//   }

//   addMesh() {
//     if (this.mesh !== null) {
//       this.geometry.dispose();
//       this.material.dispose();
//       this.scene.remove(this.mesh);
//     }

//     this.geometry = new THREE.BufferGeometry();
//     this.positions = new Float32Array(this.parameters.count * 3);
//     this.colors = new Float32Array(this.parameters.count * 3);
//     this.scales = new Float32Array(this.parameters.count * 1);

//     this.insideColor = new THREE.Color(this.parameters.insideColor);
//     this.outsideColor = new THREE.Color(this.parameters.outsideColor);

//     for (let i = 0; i < this.parameters.count; i++) {
//       const i3 = i * 3;
//       const radius = this.parameters.radius * Math.random();
//       const branchesAngle =
//         ((i % this.parameters.branches) / this.parameters.branches) *
//         Math.PI *
//         2;
//       const spinAngle = this.parameters.spin * radius;

//       const randomX =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness;
//       const randomY =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness;
//       const randomZ =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness;

//       this.positions[i3] =
//         Math.cos(branchesAngle + spinAngle) * radius + randomX;
//       this.positions[i3 + 1] = randomY;
//       this.positions[i3 + 2] =
//         Math.sin(branchesAngle + spinAngle) * radius + randomZ;

//       const mixedColors = this.insideColor.clone();
//       mixedColors.lerp(this.outsideColor, radius / this.parameters.radius);

//       this.colors[i3] = mixedColors.r;
//       this.colors[i3 + 1] = mixedColors.g;
//       this.colors[i3 + 2] = mixedColors.b;

//       this.scales[i] = Math.random();
//     }

//     this.geometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(this.positions, 3)
//     );
//     this.geometry.setAttribute(
//       "color",
//       new THREE.BufferAttribute(this.colors, 3)
//     );
//     this.geometry.setAttribute(
//       "aScale",
//       new THREE.BufferAttribute(this.scales, 1)
//     );

//     this.material = new THREE.ShaderMaterial({
//       //   size: this.parameters.size,
//       //   sizeAttenuation: true,
//       depthWrite: false,
//       depthTest: false,
//       blending: THREE.AdditiveBlending,
//       //   alphaMap: this.texture,
//       transparent: true,
//       vertexColors: true,
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       uniforms: {
//         uSize: { value: 8 * this.renderer.setPixelRatio() },
//       },
//     });
//     this.mesh = new THREE.Points(this.geometry, this.material);
//     this.scene.add(this.mesh);

//     // this.gui
//     //   .add(this.material.uniforms.uSize, "value")
//     //   .min(1)
//     //   .max(10)
//     //   .step(1)
//     //   .name("uSize");
//   }

//   render() {
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

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = canvas;

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Parameters
//     this.parameters = {
//       count: 50000,
//       size: 0.01,
//       radius: 4,
//       branches: 3,
//       spin: 4,
//       insideColor: 0xff0000,
//       outsideColor: 0x0000ff,
//       randomness: 0.2,
//       randomnessPower: 3,
//     };
//     this.geometry = null;
//     this.material = null;
//     this.mesh = null;

//     //Debug
//     this.gui = new dat.GUI();

//     //Scene
//     this.scene = new THREE.Scene();

//     //Camera
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(2, 2, 2);
//     this.scene.add(this.camera);

//     //Controls
//     this.controls = new OrbitControls(this.camera, this.canvas);
//     this.controls.enableDamping = true;

//     //Clock
//     this.clock = new THREE.Clock();

//     //Renderer
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas,
//       alpha: true,
//       antialias: true,
//     });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.addMesh();
//     this.render();
//     window.addEventListener("resize", () => {
//       this.resize();
//     });
//     this.addGui();
//   }

//   addMesh() {
//     if (this.mesh !== null) {
//       this.geometry.dispose();
//       this.material.dispose();
//       this.scene.remove(this.mesh);
//     }

//     this.geometry = new THREE.BufferGeometry();
//     this.positions = new Float32Array(this.parameters.count * 3);
//     this.colors = new Float32Array(this.parameters.count * 3);
//     this.randomness = new Float32Array(this.parameters.count * 3);

//     this.scales = new Float32Array(this.parameters.count * 1);
//     this.insideColor = new THREE.Color(this.parameters.insideColor);
//     this.outsideColor = new THREE.Color(this.parameters.outsideColor);

//     for (let i = 0; i < this.parameters.count; i++) {
//       const i3 = i * 3;
//       const radius = Math.random() * this.parameters.radius;
//       const branchesAngle =
//         ((i % this.parameters.branches) / this.parameters.branches) *
//         Math.PI *
//         2;
//       const spinAngle = this.parameters.spin * radius;

//       const randomX =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness *
//         radius;
//       const randomY =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness *
//         radius;
//       const randomZ =
//         Math.pow(Math.random(), this.parameters.randomnessPower) *
//         (Math.random() < 0.5 ? 1 : -1) *
//         this.parameters.randomness *
//         radius;

//       this.positions[i3] = Math.cos(branchesAngle) * radius;
//       this.positions[i3 + 1] = 0;
//       this.positions[i3 + 2] = Math.sin(branchesAngle) * radius;

//       this.randomness[i3] = randomX;
//       this.randomness[i3 + 1] = randomY;
//       this.randomness[i3 + 2] = randomZ;

//       const mixedColor = this.insideColor.clone();
//       mixedColor.lerp(this.outsideColor, radius / this.parameters.radius);

//       this.colors[i3] = mixedColor.r;
//       this.colors[i3 + 1] = mixedColor.g;
//       this.colors[i3 + 2] = mixedColor.b;

//       this.scales[i] = Math.random();
//     }

//     this.geometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(this.positions, 3)
//     );
//     this.geometry.setAttribute(
//       "color",
//       new THREE.BufferAttribute(this.colors, 3)
//     );
//     this.geometry.setAttribute(
//       "aScale",
//       new THREE.BufferAttribute(this.scales, 1)
//     );
//     this.geometry.setAttribute(
//       "aRandomness",
//       new THREE.BufferAttribute(this.randomness, 3)
//     );

//     this.material = new THREE.ShaderMaterial({
//       // size: this.parameters.size,
//       // sizeAttenuation: true,
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       depthWrite: false,
//       blending: THREE.AdditiveBlending,
//       transparent: true,
//       vertexColors: true,
//       uniforms: {
//         uSize: { value: 30.0 * this.renderer.getPixelRatio() },
//         uTime: { value: 0 },
//       },
//     });

//     this.mesh = new THREE.Points(this.geometry, this.material);
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

//   addGui() {
//     this.gui
//       .add(this.parameters, "count")
//       .min(100)
//       .max(200000)
//       .step(100)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "branches")
//       .min(1)
//       .max(20)
//       .step(1)
//       .onFinishChange(this.addMesh.bind(this));
//     this.gui
//       .add(this.parameters, "spin")
//       .min(-5)
//       .max(5)
//       .step(1)
//       .onFinishChange(this.addMesh.bind(this));

//     // this.gui
//     //   .add(this.material.uniforms.uSize, "value")
//     //   .min(0)
//     //   .max(55)
//     //   .step(1)
//     //   .name("uSize")
//     //   .onChange(this.addMesh.bind(this));
//   }
// }

// new Sketch(document.querySelector(".webgl"));

export default class Sketch {
  constructor(options) {
    this.canvas = options.dom;

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Debug
    this.gui = new dat.GUI();

    //Parameters
    this.parameters = {
      count: 100000,
      size: 0.02,
      radius: 4,
      branches: 3,
      randomness: 0.2,
      randomnessPower: 3,
    };
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    //Textures
    this.texture = new THREE.TextureLoader().load("textures/particles/13.png");

    //Scene
    this.scene = new THREE.Scene();

    //Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(2, 2, 2);
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
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.addMesh();
    this.render();
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.addGui();
  }

  addMesh() {
    if (this.mesh !== null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
    }

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.parameters.count * 3);
    this.scales = new Float32Array(this.parameters.count * 1);
    this.randomness = new Float32Array(this.parameters.count * 3);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.parameters.radius;
      const branchesAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;

      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;

      this.positions[i3] = Math.cos(branchesAngle) * radius;
      this.positions[i3 + 1] = 0;
      this.positions[i3 + 2] = Math.sin(branchesAngle) * radius;

      this.randomness[i3] = randomX;
      this.randomness[i3 + 1] = randomY;
      this.randomness[i3 + 2] = randomZ;

      this.scales[i] = Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.scales, 1)
    );
    this.geometry.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(this.randomness, 3)
    );

    this.material = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: this.parameters.size * this.renderer.getPixelRatio() },
        uTexture: { value: this.texture },
      },
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
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

  addGui() {
    this.gui
      .add(this.parameters, "count")
      .min(100)
      .max(200000)
      .step(100)
      .name("count")
      .onFinishChange(() => {
        this.addMesh();
      });
    this.gui
      .add(this.parameters, "size")
      .min(0)
      .max(50)
      .step(0.001)
      .name("size")
      .onFinishChange(() => {
        this.addMesh();
      });
    this.gui
      .add(this.parameters, "branches")
      .min(1)
      .max(50)
      .step(1)
      .name("branches")
      .onFinishChange(() => {
        this.addMesh();
      });
  }
}

new Sketch({ dom: document.querySelector(".webgl") });
