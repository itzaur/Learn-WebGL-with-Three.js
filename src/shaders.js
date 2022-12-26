import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import testVertex from "./shaders/test/main.vert.glsl";
import testFragment from "./shaders/test/main.frag.glsl";
import * as dat from "lil-gui";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Debug
    this.gui = new dat.GUI();

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Parameters
    this.color = 0xffffff;

    //Textures
    this.texture = new THREE.TextureLoader().load(
      "/textures/1462705837299158059.jpg"
    );

    //Scene
    this.scene = new THREE.Scene();

    //Camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    //Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    //Time
    this.clock = new THREE.Clock();
    this.startTime = Date.now();
    this.currentTime = this.startTime;
    this.elapsedTime = 0;
    this.deltaTime = 16;

    this.addMesh();
    this.render();

    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  addMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const count = this.geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    this.geometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(randoms, 1)
    );

    this.material = new THREE.ShaderMaterial({
      vertexShader: testVertex,
      fragmentShader: testFragment,
      side: THREE.DoubleSide,
      // wireframe: true,
      // transparent: true,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("peachpuff") },
        uTexture: { value: this.texture },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.y = 2 / 3;
    this.scene.add(this.mesh);

    this.gui
      .add(this.material.uniforms.uFrequency.value, "x")
      .min(1)
      .max(20)
      .step(0.01);
    this.gui
      .add(this.material.uniforms.uFrequency.value, "y")
      .min(1)
      .max(20)
      .step(0.01);
  }

  render() {
    this.time = this.clock.getElapsedTime();
    // const current = Date.now();
    // this.deltaTime = current - this.currentTime;
    // this.currentTime = current;
    // this.elapsedTime = this.currentTime - this.startTime;

    this.material.uniforms.uTime.value = this.time;

    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

new Sketch(document.querySelector(".webgl"));
