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
import * as THREE from "three";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
import * as dat from "lil-gui";
import { gsap } from "gsap";
import { MathUtils } from "three";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Debug
    this.gui = new dat.GUI();

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Colors
    this.colors = [
      new THREE.Color("#FFD4B2"),
      new THREE.Color("#FFF6BD"),
      new THREE.Color("#CEEDC7"),
      new THREE.Color("#86C8BC"),
    ];

    this.hover = false;
    this.uniforms = {
      uHover: 0,
    };
    this.config = {
      scale: 4,
    };

    this.resize = () => this.onResize();
    this.mousemove = (e) => this.onMousemove(e);
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createRaycaster();
    this.addGui();

    this.addMesh().then(() => {
      document.documentElement.classList.add("model-loaded");
    });

    this.renderer.setAnimationLoop(() => {
      this.addListeners();

      this.update();
      this.render();
    });
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
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addMesh() {
    return new Promise((resolve) => {
      this.geometry = new THREE.TorusGeometry(3, 0.8, 40, 100);
      this.material = new THREE.MeshStandardMaterial();
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      console.log(this.mesh);
      // this.scene.add(this.mesh);

      //Create InstancedMesh
      this.instancedMeshGeometry = new THREE.SphereGeometry(0.002, 5, 5, 5, 5);

      this.instancedMeshMaterial = new THREE.ShaderMaterial({
        wireframe: true,
        vertexShader: require("./shaders/island/island.vertex.glsl"),
        fragmentShader: require("./shaders/island/island.fragment.glsl"),
        uniforms: {
          uSize: { value: 0 },
          uRotation: { value: 0 },
          uColor: { value: new THREE.Color() },
          uPointer: { value: new THREE.Vector3() },
          uHover: { value: this.uniforms.uHover },
        },
      });

      this.instancedMesh = new InstancedUniformsMesh(
        this.instancedMeshGeometry,
        this.instancedMeshMaterial,
        this.mesh.geometry.attributes.position.count
      );

      this.scene.add(this.instancedMesh);

      const dummy = new THREE.Object3D();

      const positions = this.mesh.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        dummy.position.set(
          positions[i + 0],
          positions[i + 1],
          positions[i + 2]
        );

        dummy.updateMatrix();

        this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);

        this.instancedMesh.setUniformAt(
          "uSize",
          i / 3,
          MathUtils.randFloat(0.3, 3)
        );

        this.instancedMesh.setUniformAt(
          "uRotation",
          i / 3,
          MathUtils.randFloat(-1, 1)
        );

        const colorsIndex = MathUtils.randInt(0, this.colors.length - 1);
        this.instancedMesh.setUniformAt(
          "uColor",
          i / 3,
          this.colors[colorsIndex]
        );
      }

      resolve();
    });
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 767;
  }

  update() {
    this.camera.lookAt(0, 0, 0);
    this.camera.position.z = this.isMobile ? 12 : 6;
  }

  createRaycaster() {
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.raycaster = new THREE.Raycaster();
    this.intersects = [];
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.checkMobile();
  }

  onMousemove(e) {
    const x = (e.clientX / this.width) * 2 - 1;
    const y = -((e.clientY / this.height) * 2 - 1);

    this.mouse.set(x, y);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObject(this.mesh);

    gsap.to(this.camera.position, {
      x: () => x * 3,
      y: () => y * 1.5,

      duration: 0.5,
    });

    if (this.intersects.length === 0) {
      //Mouseleave
      console.log("mouseleave");
      if (this.hover) {
        this.hover = false;
        this.animateHoverUniforms(0);
      }
    } else {
      console.log("mouseenter");
      if (!this.hover) {
        this.hover = true;
        this.animateHoverUniforms(this.config.scale);
      }

      gsap.to(this.point, {
        x: () => this.intersects[0]?.point.x || 0,
        y: () => this.intersects[0]?.point.y || 0,
        z: () => this.intersects[0]?.point.z || 0,
        duration: 0.3,
        overwrite: true,
        onUpdate: () => {
          for (let i = 0; i < this.instancedMesh.count; i++) {
            this.instancedMesh.setUniformAt("uPointer", i, this.point);
          }
        },
      });
    }
  }

  animateHoverUniforms(value) {
    gsap.to(this.uniforms, {
      uHover: value,
      duration: 0.3,
      onUpdate: () => {
        for (let i = 0; i < this.instancedMesh.count; i++) {
          this.instancedMesh.setUniformAt("uHover", i, this.uniforms.uHover);
        }
      },
    });
  }

  addListeners() {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("mousemove", this.mousemove, { passive: true });
  }

  addGui() {
    this.gui.add(this.config, "scale").min(1).max(10).step(0.01).name("scale");
  }
}

new Sketch(document.querySelector(".webgl")).init();
