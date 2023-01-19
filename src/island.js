// import "./styles/index.scss";
// import * as THREE from "three";
// import * as dat from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
// import { gsap } from "gsap";
// import { MathUtils } from "three";

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = canvas;

//     //Debug
//     this.gui = new dat.GUI();

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Colors
//     this.colors = [
//       new THREE.Color(0x963cbd),
//       new THREE.Color(0xff6f61),
//       new THREE.Color(0xc5299b),
//       new THREE.Color(0xfeae51),
//       // new THREE.Color("#6C00FF"),
//       // new THREE.Color("#3C79F5"),
//       // new THREE.Color("#2DCDDF"),
//       // new THREE.Color("#F2DEBA"),
//     ];

//     //Hover
//     this.hover = false;
//     this.uniforms = {
//       uHover: 0,
//     };

//     //Resize
//     this.resize = () => this.onResize();
//     this.mousemove = (e) => this.onMousemove(e);
//   }

//   init() {
//     this.createScene();
//     this.createLights();
//     this.createCamera();
//     this.createOrbitControls();
//     this.createRenderer();
//     this.createRaycaster();
//     this.createLoader();
//     this.addGui();

//     this.loadModel().then(() => {
//       this.addListeners();

//       this.renderer.setAnimationLoop(() => {
//         this.update();
//         this.render();
//         this.controls.update();
//       });
//     });
//   }

//   createScene() {
//     this.scene = new THREE.Scene();
//   }

//   createLights() {
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//     this.directionalLight.position.set(1, 1, 1);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.shadow.mapSize.set(1024, 1024);
//     this.directionalLight.shadow.camera.far = 15;
//     this.directionalLight.shadow.normalBias = 0.09;
//     this.scene.add(this.directionalLight);

//     // this.scene.add(new THREE.CameraHelper(this.directionalLight.shadow.camera));
//   }

//   createCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(2, 1.5, -1);
//     this.scene.add(this.camera);
//   }

//   createOrbitControls() {
//     this.controls = new OrbitControls(this.camera, this.canvas);
//     this.controls.enableDamping = true;
//   }

//   createRenderer() {
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas,
//       alpha: true,
//       antialias: true,
//     });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     this.renderer.physicallyCorrectLights = true;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.outputEncoding = THREE.sRGBEncoding;
//   }

//   createRaycaster() {
//     this.mouse = new THREE.Vector2();
//     this.raycaster = new THREE.Raycaster();
//     this.point = new THREE.Vector3();
//     this.intersects = [];
//   }

//   updateAllMaterials() {
//     this.scene.traverse((child) => {
//       if (
//         child instanceof THREE.Mesh &&
//         child.material instanceof THREE.MeshStandardMaterial
//       ) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         child.material.needsUpdate = true;
//       }
//     });
//   }

//   createLoader() {
//     this.loadingManager = new THREE.LoadingManager();

//     this.loadingManager.onLoad = () => {
//       document.documentElement.classList.add("model-loaded");
//     };

//     this.gltfLoader = new GLTFLoader(this.loadingManager);
//     this.dracoLoader = new DRACOLoader();
//     this.dracoLoader.setDecoderPath("/draco/");
//   }

//   loadModel() {
//     return new Promise((resolve) => {
//       this.gltfLoader.setDRACOLoader(this.dracoLoader);
//       this.gltfLoader.load("models/Island/human.glb", (gltf) => {
//         console.log(gltf.scene);
//         this.mesh = gltf.scene.children[0];
//         // this.mesh.scale.set(0.002, 0.002, 0.002);
//         this.mesh.geometry.center();
//         // this.deleteMaterial = [...this.mesh.children.values()].findIndex(
//         //   (el) => el.name === "Plane028"
//         // );
//         // this.mesh.children.splice(this.deleteMaterial, 1);

//         // this.mesh.rotation.y = Math.PI;

//         // this.scene.add(this.mesh);

//         console.log(this.mesh);

//         //InstansedUniformsMesh
//         // this.mesh.children.forEach((child, i) => {});
//         this.geometry = new THREE.ConeGeometry(0.001, 0.004, 4);
//         this.material = new THREE.ShaderMaterial({
//           wireframe: true,
//           vertexShader: require("./shaders/island/island.vertex.glsl"),
//           fragmentShader: require("./shaders/island/island.fragment.glsl"),
//           uniforms: {
//             uSize: { value: 0 },
//             uRotation: { value: 0 },
//             uColor: { value: new THREE.Color() },
//             uPointer: { value: new THREE.Vector3() },
//             uHover: { value: this.uniforms.uHover },
//           },
//         });

//         this.instancedMesh = new InstancedUniformsMesh(
//           this.geometry,
//           this.material,
//           // 600
//           this.mesh.geometry.attributes.position.count
//         );

//         this.scene.add(this.instancedMesh);

//         const dummy = new THREE.Object3D();
//         // const positions = new Float32Array(5000 * 3);
//         console.log(this.mesh.geometry.attributes.position.array);
//         const positions = this.mesh.geometry.attributes.position.array;
//         for (let i = 0; i < positions.length; i += 3) {
//           dummy.position.set(
//             positions[i + 0],
//             positions[i + 1],
//             positions[i + 2]
//           );

//           dummy.updateMatrix();

//           this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);

//           this.instancedMesh.setUniformAt(
//             "uSize",
//             i / 3,
//             MathUtils.randFloat(0.3, 3)
//           );

//           this.instancedMesh.setUniformAt(
//             "uRotation",
//             i / 3,
//             MathUtils.randFloat(1, -1)
//           );

//           const colorsIndex = MathUtils.randInt(0, this.colors.length - 1);
//           this.instancedMesh.setUniformAt(
//             "uColor",
//             i / 3,
//             this.colors[colorsIndex]
//           );

//           // this.scene.add(this.instancedMesh);
//         }

//         this.updateAllMaterials();

//         this.gui
//           .add(this.mesh.rotation, "y")
//           .min(-Math.PI)
//           .max(Math.PI)
//           .name("rotationY");

//         resolve();
//       });
//     });
//   }

//   update() {
//     this.camera.lookAt(this.scene.position);
//     this.camera.position.z = this.isMobile ? 20 : 12;
//   }

//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }

//   checkMobile() {
//     this.isMobile = window.innerWidth < 767;
//   }

//   onResize() {
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.checkMobile();
//   }

//   onMousemove(e) {
//     const mouseX = (e.clientX / this.width) * 2 - 1;
//     const mouseY = -((e.clientY / this.height) * 2 - 1);

//     this.mouse.set(mouseX, mouseY);

//     gsap.to(this.camera.position, {
//       x: () => mouseX * 0.15,
//       y: () => mouseY * 0.1,
//       duration: 0.5,
//     });

//     this.raycaster.setFromCamera(this.mouse, this.camera);
//     this.intersects = this.raycaster.intersectObject(this.mesh);

//     if (this.intersects.length === 0) {
//       console.log("mouse leave");
//       if (this.hover) {
//         this.hover = false;
//         this.animateHoverUniform(0);
//       }
//     } else {
//       if (!this.hover) {
//         this.hover = true;
//         this.animateHoverUniform(2);
//       }
//       // console.log(this.intersects[0].point.x);
//       // console.log(this.instancedMesh);

//       gsap.to(this.point, {
//         x: () => this.intersects[0]?.point.x || 0,
//         y: () => this.intersects[0]?.point.y || 0,
//         z: () => this.intersects[0]?.point.z || 0,
//         duration: 0.3,
//         onUpdate: () => {
//           for (let i = 0; i < this.instancedMesh.count; i++) {
//             this.instancedMesh.setUniformAt("uPointer", i, this.point);
//           }
//         },
//       });
//     }
//   }

//   animateHoverUniform(value) {
//     gsap.to(this.uniforms, {
//       uHover: value,
//       duration: 0.3,
//       onUpdate: () => {
//         for (let i = 0; i < this.instancedMesh.count; i++) {
//           this.instancedMesh.setUniformAt("uHover", i, this.uniforms.uHover);
//         }
//       },
//     });
//   }

//   addListeners() {
//     window.addEventListener("resize", this.resize, { passive: true });
//     window.addEventListener("mousemove", this.mousemove, { passive: true });
//   }

//   addGui() {
//     this.gui
//       .add(this.directionalLight.position, "x")
//       .min(-10)
//       .max(20)
//       .step(0.001)
//       .name("lightX");
//     this.gui
//       .add(this.directionalLight.position, "y")
//       .min(-10)
//       .max(20)
//       .step(0.001)
//       .name("lightY");
//     this.gui
//       .add(this.directionalLight.position, "z")
//       .min(-10)
//       .max(20)
//       .step(0.001)
//       .name("lightZ");
//     this.gui
//       .add(this.directionalLight, "intensity")
//       .min(0)
//       .max(20)
//       .step(0.001)
//       .name("lightIntensity");
//   }
// }

// new Sketch(document.querySelector(".webgl")).init();

import "./styles/index.scss";
// import * as THREE from "three";
// import { gsap } from "gsap";
// import * as dat from "lil-gui";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
// import { MathUtils } from "three";

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = document.querySelector(canvas);

//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     this.colors = [
//       new THREE.Color("#567189"),
//       new THREE.Color("#7B8FA1"),
//       new THREE.Color("#CFB997"),
//       new THREE.Color("#FAD6A5"),
//     ];

//     this.uniforms = {
//       uHover: 0,
//     };

//     this.resize = () => this.onResize();
//     this.mousemove = (e) => this.onMouseMove(e);
//   }

//   init() {
//     this.createScene();
//     this.createCamera();
//     this.createRenderer();
//     this.createControls();
//     this.createClock();
//     this.createLight();
//     this.createMesh();
//     this.createRaycaster();
//     this.addListeners();
//     this.createDebugPanel();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();
//     });
//   }

//   createScene() {
//     this.scene = new THREE.Scene();
//   }

//   createCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(1, 1, 0);
//     this.scene.add(this.camera);
//   }

//   createRenderer() {
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas,
//       alpha: true,
//       antialias: true,
//     });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     this.renderer.physicallyCorrectLights = true;
//   }

//   createControls() {
//     this.controls = new OrbitControls(this.camera, this.canvas);
//     this.controls.enableDamping = true;
//   }

//   createClock() {
//     this.clock = new THREE.Clock();
//   }

//   createLight() {
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.position.set(1, 1, 0);
//     this.directionalLight.shadow.mapSize.set(1024, 1024);
//     this.directionalLight.shadow.camera.far = 15;

//     this.scene.add(this.directionalLight);
//   }

//   createMesh() {
//     this.geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
//     this.material = new THREE.MeshStandardMaterial({ wireframe: true });
//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.scene.add(this.mesh);
//     console.log(this.mesh);

//     this.instancedGeometry = new THREE.CircleGeometry(0.02, 30);
//     this.instancedMaterial = new THREE.ShaderMaterial({
//       wireframe: true,
//       vertexShader: require("./shaders/island/island.vertex.glsl"),
//       fragmentShader: require("./shaders/island/island.fragment.glsl"),
//       uniforms: {
//         uColor: { value: new THREE.Color() },
//         uPointer: { value: new THREE.Vector3() },
//         uSize: { value: 0 },
//         uRotation: { value: 0 },
//         uHover: { value: this.uniforms.uHover },
//       },
//     });
//     this.instancedMesh = new InstancedUniformsMesh(
//       this.instancedGeometry,
//       this.instancedMaterial,
//       this.mesh.geometry.attributes.position.count
//     );
//     this.scene.add(this.instancedMesh);

//     const dummy = new THREE.Object3D();

//     const positions = this.mesh.geometry.attributes.position.array;
//     for (let i = 0; i < positions.length; i += 3) {
//       dummy.position.set(positions[i + 0], positions[i + 1], positions[i + 2]);

//       dummy.updateMatrix();

//       this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);

//       this.instancedMesh.setUniformAt(
//         "uSize",
//         i / 3,
//         MathUtils.randFloat(3, 0.3)
//       );
//       this.instancedMesh.setUniformAt(
//         "uRotation",
//         i / 3,
//         MathUtils.randFloat(1, -1)
//       );

//       const colorsIndex = MathUtils.randInt(0, this.colors.length - 1);
//       this.instancedMesh.setUniformAt(
//         "uColor",
//         i / 3,
//         this.colors[colorsIndex]
//       );
//     }
//   }

//   checkMobile() {
//     this.isMobile = window.innerWidth < 767;
//   }

//   update() {
//     this.camera.position.z = this.isMobile ? 3 : 2;
//     this.controls.update();
//   }

//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }

//   createDebugPanel() {}

//   createRaycaster() {
//     this.mouse = new THREE.Vector2();

//     this.raycaster = new THREE.Raycaster();
//     this.point = new THREE.Vector3();
//     this.intersects = [];
//   }

//   animateUniformsHover(value) {
//     gsap.to(this.uniforms, {
//       uHover: value,
//       duration: 0.3,
//       onUpdate: () => {
//         for (let i = 0; i < this.instancedMesh.count; i++) {
//           this.instancedMesh.setUniformAt("uHover", i, this.uniforms.uHover);
//         }
//       },
//     });
//   }

//   onMouseMove(e) {
//     const x = (e.clientX / this.width) * 2 - 1;
//     const y = -((e.clientY / this.height) * 2 - 1);

//     this.mouse.set(x, y);

//     gsap.to(this.camera.position, {
//       x: () => x * 1.4,
//       y: () => y * 0.4,
//       duration: 0.5,
//     });

//     this.raycaster.setFromCamera(this.mouse, this.camera);
//     this.intersects = this.raycaster.intersectObject(this.mesh);
//     // console.log(this.intersects);
//     if (this.intersects.length === 0) {
//       console.log("mouseleave");
//       this.animateUniformsHover(0);
//     } else {
//       console.log("mouseenter");
//       this.animateUniformsHover(2);

//       gsap.to(this.point, {
//         x: () => this.intersects[0]?.point.x || 0,
//         y: () => this.intersects[0]?.point.y || 0,
//         z: () => this.intersects[0]?.point.z || 0,
//         duration: 0.5,
//         onUpdate: () => {
//           for (let i = 0; i < this.instancedMesh.count; i++) {
//             this.instancedMesh.setUniformAt("uPointer", i, this.point);
//           }
//         },
//       });
//     }
//   }

//   onResize() {
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.checkMobile();
//   }

//   addListeners() {
//     window.addEventListener("resize", this.resize, { passive: true });
//     window.addEventListener("mousemove", this.mousemove, { passive: true });
//   }
// }

// new Sketch(".webgl").init();

// import {
//   Scene,
//   WebGLRenderer,
//   PerspectiveCamera,
//   IcosahedronGeometry,
//   // ParametricGeometry,
//   MeshPhysicalMaterial,
//   Mesh,
//   AmbientLight,
//   DirectionalLight,
//   Color,
//   Vector3,
//   Clock,
// } from "three";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

export default class Sketch {
  constructor(container) {
    this.container = document.querySelector(container);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.config = {
      metalness: 0.5,
      roughness: 0,
      color: "#FF8B13",
    };

    this.resize = () => this.onResize();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createHelicoid();
    this.createSpheres();
    this.createLight();
    this.createClock();
    this.addListeners();
    this.createControls();
    this.createDebugPanel();

    this.renderer.setAnimationLoop(() => {
      this.render();
      this.update();
    });

    console.log(this);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 3);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  createLight() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.scene.add(this.directionalLight);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
  }

  getMaterial() {
    const material = new THREE.MeshPhysicalMaterial({
      color: this.config.color,
      metalness: this.config.metalness,
      roughness: this.config.roughness,
      side: 2,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.playhead = { value: 0 };
      shader.fragmentShader =
        `
        uniform float playhead;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <logdepthbuf_fragment>",
        `

        vec3 colorA = vec3(0.5, 0.5, 0.5);
        vec3 colorB = vec3(0.5, 0.5, 0.5);
        vec3 colorC = vec3(2.0, 1.0, 0.0);
        vec3 colorD = vec3(0.5, 0.2, 0.25);

        float diff = dot(vec3(1.0), vNormal);

        vec3 color = colorA + colorB * cos(2.0 * 3.141592 * (colorC * diff + colorD + playhead));
        diffuseColor.rgb = color;
      ` + "#include <logdepthbuf_fragment>"
      );

      material.userData.shader = shader;
    };
    return material;
  }

  createHelicoid() {
    const material = this.getMaterial();

    const helicoidVector = new THREE.Vector3();

    function Helicoid(u, v, helicoidVector) {
      const alpha = Math.PI * 2 * (u - 0.5);
      const theta = Math.PI * 2 * (v - 0.5);
      const dividend = 1 + Math.cosh(alpha) * Math.cosh(theta);
      const t = 1.5;

      const x = (Math.sinh(theta) * Math.cos(t * alpha)) / dividend;
      const z = (Math.sinh(theta) * Math.sin(t * alpha)) / dividend;
      const y = (1.5 * Math.cosh(theta) * Math.sinh(alpha)) / dividend;

      helicoidVector.set(x, y, z);
    }

    const geometry = new ParametricGeometry(Helicoid, 100, 100);

    this.helicoid = new THREE.Mesh(geometry, material);

    this.helicoid.castShadow = this.helicoid.receiveShadow = true;

    this.scene.add(this.helicoid);
  }

  createSpheres() {
    const geometry = new THREE.IcosahedronGeometry(0.25, 5);

    this.ball1 = new THREE.Mesh(geometry, this.getMaterial());
    this.ball2 = new THREE.Mesh(geometry, this.getMaterial());
    // this.ball2.position.x = 1;
    this.ball1.castShadow = this.ball1.receiveShadow = true;
    this.ball2.castShadow = this.ball2.receiveShadow = true;
    this.scene.add(this.ball1, this.ball2);

    this.updateAllMaterials();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.elapsedTime = this.clock.getElapsedTime();

    this.helicoid.rotation.y = this.elapsedTime;

    if (!!this.helicoid.material.userData.shader) {
      this.helicoid.material.userData.shader.uniforms.playhead.value =
        this.elapsedTime * 0.5;
      this.ball1.material.userData.shader.uniforms.playhead.value =
        this.elapsedTime * 0.5;
      this.ball2.material.userData.shader.uniforms.playhead.value =
        this.elapsedTime * 0.5;
    }

    this.theta1 = this.elapsedTime * 0.32 * Math.PI;
    this.theta2 = this.elapsedTime * 0.32 * Math.PI + Math.PI;

    this.ball1.position.x = Math.sin(this.theta1) * 0.6;
    this.ball1.position.z = Math.cos(this.theta1) * 0.6;

    this.ball2.position.x = Math.sin(this.theta2) * 0.6;
    this.ball2.position.z = Math.cos(this.theta2) * 0.6;

    this.controls.update();
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhysicalMaterial
      ) {
        child.castShadow = true;
        child.receiveShadow = true;

        child.material.needsUpdate = true;
      }
    });
  }

  onResize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addListeners() {
    window.addEventListener("resize", this.resize, { passive: true });
  }

  removeListeners() {
    window.removeEventListener("resize", this.resize, { passive: true });
  }

  createDebugPanel() {
    this.gui = new dat.GUI();

    this.gui
      .add(this.directionalLight.position, "x")
      .min(-5)
      .max(20)
      .step(0.001);
    this.gui
      .add(this.directionalLight.position, "y")
      .min(-5)
      .max(20)
      .step(0.001);
    this.gui
      .add(this.directionalLight.position, "z")
      .min(-5)
      .max(20)
      .step(0.001);
    this.gui.add(this.directionalLight, "intensity").min(0).max(10).step(0.001);
    this.gui.add(this.config, "metalness").min(0).max(20).step(0.001);
    this.gui.add(this.config, "roughness").min(0).max(20).step(0.001);
    // this.gui.addColor(this.config, "color").onChange(() => {
    //   this.helicoid.material.color.set(this.config.color);
    //   this.updateAllMaterials();
    // });
  }
}

const app = new Sketch(".webgl");
app.init();
