import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
import { MathUtils } from "three";
import { gsap } from "gsap";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;
    this.geometry = null;
    this.material = null;
    this.instancedMesh = null;
    this.brain = null;

    //Debug
    this.gui = new dat.GUI();
    this.debugObject = {};

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.hover = false;

    this.uniforms = {
      uHover: 0,
    };

    //Config
    this.config = {
      size: 0.004,
    };

    //Colors
    this.colors = [
      new THREE.Color(0x963cbd),
      new THREE.Color(0xff6f61),
      new THREE.Color(0xc5299b),
      new THREE.Color(0xfeae51),
    ];
    // console.log(this.colors);
    this.debugObject.color1 = this.colors[0];
    this.debugObject.color2 = this.colors[1];
    this.debugObject.color3 = this.colors[2];
    this.debugObject.color4 = this.colors[3];

    this.resize = () => this.onResize();
    this.mousemove = (e) => this.onMousemove(e);
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createOrbitControls();
    this.createRenderer();
    this.createRaycaster();
    this.createLoader();
    this.checkMobile();

    this.loadModel().then(() => {
      this.addListeners();

      this.renderer.setAnimationLoop(() => {
        this.update();
        this.render();
        this.controls.update();
      });

      // console.log(this);
      this.addGui();
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
    this.camera.position.set(0, 0, 1.2);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
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
  }

  destroy() {
    this.renderer.dispose();
    this.removeListeners();
  }

  update() {
    this.camera.lookAt(0, 0, 0);
    this.camera.position.z = this.isMobile ? 2.3 : 1.2;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  createLoader() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = () => {
      document.documentElement.classList.add("model-loaded");
    };
    // this.loadingManager.onStart = () => {
    //   console.log("onStart");
    // };
    // this.loadingManager.onProgress = () => {
    //   console.log("onProgress");
    // };
    // this.loadingManager.onError = () => {
    //   console.log("onError");
    // };

    this.gltfLoader = new GLTFLoader(this.loadingManager);
  }

  loadModel() {
    return new Promise((resolve) => {
      this.gltfLoader.load("models/Brain/brain.glb", (gltf) => {
        if (this.instancedMesh !== null) {
          this.geometry.dispose();
          this.material.dispose();
          this.scene.remove(this.instancedMesh);
        }

        console.log(gltf.scene);
        console.log(this.instancedMesh);

        this.brain = gltf.scene.children[0];

        // this.brain.rotation.z = -Math.PI;
        // this.brain.scale.set(2, 2, 2);
        // this.brain.scale.set(0.1, 0.1, 0.1);

        // console.log(this.brain);

        this.geometry = new THREE.BoxGeometry(
          this.config.size,
          this.config.size,
          this.config.size,
          1,
          1,
          1
        );

        this.material = new THREE.ShaderMaterial({
          vertexShader: require("./shaders/brain/brain.vertex.glsl"),
          fragmentShader: require("./shaders/brain/brain.fragment.glsl"),
          wireframe: true,
          uniforms: {
            uPointer: { value: new THREE.Vector3() },
            uColor: { value: new THREE.Color() },
            uRotation: { value: 0 },
            uSize: { value: 0 },
            uHover: { value: this.uniforms.uHover },
          },
        });

        this.instancedMesh = new InstancedUniformsMesh(
          this.geometry,
          this.material,
          this.brain.geometry.attributes.position.count
        );

        this.scene.add(this.instancedMesh);

        const dummy = new THREE.Object3D();

        const positions = this.brain.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          dummy.position.set(
            positions[i + 0],
            positions[i + 1],
            positions[i + 2]
          );

          dummy.updateMatrix();

          this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);

          this.instancedMesh.setUniformAt(
            "uRotation",
            i / 3,
            MathUtils.randFloat(-1, 1)
          );

          this.instancedMesh.setUniformAt(
            "uSize",
            i / 3,
            MathUtils.randFloat(0.3, 3)
          );

          const colorIndex = MathUtils.randInt(0, this.colors.length - 1);
          this.instancedMesh.setUniformAt(
            "uColor",
            i / 3,
            this.colors[colorIndex]
          );
        }

        this.gui.addColor(this.debugObject, "color1").onChange(() => {
          // this.instancedMesh._baseMaterial.uniforms.uColor.value.set(
          //   this.debugObject.color2
          // );
          this.material.uniforms.uColor.value.set(this.debugObject.color2);
          console.log(this.material.uniforms.uColor);
        });
        resolve();
      });
    });
  }

  checkMobile() {
    this.isMobile = this.width < 767;
  }

  onResize() {
    //Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    //Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Check mobile
    this.checkMobile();
  }

  createRaycaster() {
    this.mouse = new THREE.Vector2();

    this.raycaster = new THREE.Raycaster();
    this.point = new THREE.Vector3();
    this.intersects = [];
  }

  onMousemove(e) {
    const x = (e.clientX / this.width) * 2 - 1;
    const y = -((e.clientY / this.height) * 2 - 1);

    this.mouse.set(x, y);

    gsap.to(this.camera.position, {
      x: () => x * 0.15,
      y: () => y * 0.1,
      duration: 0.5,
    });

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObject(this.brain);

    if (this.intersects.length === 0) {
      if (this.hover) {
        this.hover = false;
        this.animateHoverUniform(0);
      }
    } else {
      if (!this.hover) {
        this.hover = true;
        this.animateHoverUniform(1);
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

  animateHoverUniform(value) {
    gsap.to(this.uniforms, {
      uHover: value,
      duration: 0.25,
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

  removeListeners() {
    window.removeEventListener("resize", this.resize, { passive: true });
    window.removeEventListener("mousemove", this.mousemove, { passive: true });
  }

  addGui() {
    // this.gui
    //   .add(this.config, "size")
    //   .min(0.001)
    //   .max(0.01)
    //   .step(0.0001)
    //   .name("boxSize");

    // this.gui.addColor(this.debugObject, "color1").onChange(() => {
    //   this.instancedMesh._baseMaterial.uniforms.uColor.value.set(
    //     this.debugObject.color1
    //   );
    //   console.log(this.instancedMesh._baseMaterial.uniforms.uColor);
    // });
    this.gui.addColor(this.debugObject, "color2").onChange(() => {
      this.instancedMesh._baseMaterial.uniforms.uColor = this.colors[1];
    });
    this.gui.addColor(this.debugObject, "color3").onChange(() => {
      this.instancedMesh._baseMaterial.uniforms.uColor = this.colors[2];
    });
    this.gui.addColor(this.debugObject, "color4").onChange(() => {
      this.instancedMesh._baseMaterial.uniforms.uColor = this.colors[3];
    });
  }
}

new Sketch(document.querySelector(".webgl")).init();
