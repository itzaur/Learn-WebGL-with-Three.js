import './styles/index.scss';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'lil-gui';
import vertexShader from './shaders/test2.0/vertexShader.glsl';
import fragmentShader from './shaders/test2.0/fragmentShader.glsl';

export default class Experience {
  constructor(container) {
    this.container = document.querySelector(container);

    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Parameters
    this.parameters = {
      color: 0xffffff,
    };

    this.gui = new dat.GUI();

    this.resize = () => this.onResize();
    this.dblclick = () => this.onDblclick();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.addTextureLoader();
    this.createRenderer();
    this.createMesh();
    this.createControls();
    this.createClock();
    this.addListeners();
    this.addGUI();

    this.renderer.setAnimationLoop(() => {
      this.render();
      this.update();
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
    this.camera.position.set(0, 0, 1);
  }

  addTextureLoader() {
    this.textureLoader = new THREE.TextureLoader();
    this.texture = this.textureLoader.load('/textures/minecraft.png');
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 50, 50);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: 2,
      wireframe: true,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.parameters.color) },
        uTexture: { value: this.texture },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -0.25;

    this.scene.add(this.mesh);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
  }

  addListeners() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('dblclick', this.dblclick);
  }

  onResize() {
    // Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onDblclick() {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.container.webkitRequestFullscreen) {
        this.container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  addGUI() {
    this.gui.add(this.material, 'wireframe');
    this.gui
      .add(this.material.uniforms.uFrequency.value, 'x')
      .min(0)
      .max(20)
      .step(0.01)
      .name('uFrequencyX');
    this.gui
      .add(this.material.uniforms.uFrequency.value, 'y')
      .min(0)
      .max(20)
      .step(0.01)
      .name('uFrequencyY');

    this.gui.addColor(this.material.uniforms.uColor, 'value').onChange(() => {
      this.material.uniforms.uColor.value.set(
        this.material.uniforms.uColor.value
      );
    });
  }
}

const experience = new Experience('.webgl');
experience.init();

// import fragmentShader from './shaders/test2.0/fragmentShader.glsl';
// import vertexShader from './shaders/test2.0/vertexShader.glsl';

// export default class Experience {
//   constructor(container) {
//     this.container = document.querySelector(container);

//     // Sizes
//     this.options = {
//       width: window.innerWidth,
//       height: window.innerHeight,

//       fov: 75,
//       near: 0.1,
//       far: 100,
//       color: 0xffffff,
//       spin: () => {
//         gsap.to(this.mesh.rotation, {
//           y: this.mesh.rotation.y + Math.PI * 2,
//           duration: 1,
//         });
//       },
//     };
//     this.options.aspect = this.options.width / this.options.height;

//     this.mouse = new THREE.Vector2();

//     this.gui = new dat.GUI();

//     this.resize = () => this.onResize();
//     this.dblclick = () => this.onDblclick();
//     this.mouseMove = (e) => this.onMouseMove(e);
//   }

//   init() {
//     this.createScene();
//     this.createCamera();
//     this.createRenderer();
//     this.createTextureLoader();
//     this.createControls();
//     this.createMesh();
//     this.createLight();
//     this.createClock();
//     this.addGUI();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();

//       this.addListeners();
//     });
//   }

//   createScene() {
//     this.scene = new THREE.Scene();
//   }

//   createCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       this.options.fov,
//       this.options.aspect,
//       this.options.near,
//       this.options.far
//     );

//     this.camera.position.set(0, 0, 2);
//   }

//   createLight() {
//     this.directionalLight = new THREE.DirectionalLight(this.options.color, 0.8);
//     this.directionalLight.position.set(1, 1, -0.5);
//     this.scene.add(this.directionalLight);
//   }

//   createTextureLoader() {
//     this.textureLoader = new THREE.TextureLoader();
//     this.flagTexture = this.textureLoader.load(
//       '/textures/environmentMaps/0/nx.jpg'
//     );
//   }

//   createClock() {
//     this.clock = new THREE.Clock();
//   }

//   createRenderer() {
//     this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });

//     this.container.appendChild(this.renderer.domElement);

//     this.renderer.setSize(this.options.width, this.options.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }

//   createControls() {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//     // this.controls.enabled = false;
//   }

//   createMesh() {
//     this.geometry = new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
//     const count = this.geometry.attributes.position.count;
//     const randoms = new Float32Array(count);

//     for (let i = 0; i < count; i++) {
//       randoms[i] = Math.random();
//     }

//     this.geometry.setAttribute(
//       'aRandom',
//       new THREE.BufferAttribute(randoms, 1)
//     );

//     this.material = new THREE.ShaderMaterial({
//       vertexShader,
//       fragmentShader,
//       vertexColors: true,
//       depthWrite: false,
//       // wireframe: true,
//       // side: 2,
//       transparent: true,
//       uniforms: {
//         uFrequency: { value: new THREE.Vector2(10, 5) },
//         uTime: { value: 0 },
//         uColor: { value: new THREE.Color('orange') },
//         uTexture: { value: this.flagTexture },
//       },
//     });

//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.scene.add(this.mesh);

//     console.log(this.flagTexture);
//   }

//   update() {
//     this.elapsedTime = this.clock.getElapsedTime();

//     this.material.uniforms.uTime.value = this.elapsedTime;

//     // this.mesh.position.x = Math.sin(this.elapsedTime);
//     // this.mesh.position.y = Math.cos(this.elapsedTime);

//     this.camera.lookAt(this.mesh.position);
//     this.controls.update();
//   }

//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }

//   onResize() {
//     this.options.width = window.innerWidth;
//     this.options.height = window.innerHeight;

//     this.camera.aspect = this.options.width / this.options.height;
//     this.camera.updateProjectionMatrix();

//     this.controls.update();

//     this.renderer.setSize(this.options.width, this.options.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }

//   onMouseMove(e) {
//     const x = e.clientX / this.options.width - 0.5;
//     const y = -(e.clientY / this.options.height - 0.5);

//     this.mouse.set(x, y);

//     // gsap.to(this.camera.position, {
//     //   x: () => x * 0.15,
//     //   y: () => y * 0.1,
//     //   duration: 0.5,
//     // });

//     // this.camera.position.y = y;
//     // this.camera.position.x = Math.sin(this.mouse.x * Math.PI * 2) * 2;
//     // this.camera.position.z = Math.cos(this.mouse.x * Math.PI * 2) * 2;
//     // this.camera.position.y = Math.cos(this.mouse.x * Math.PI * 2) * 2;
//     // console.log(this.mouse.x);
//   }

//   onDblclick() {
//     const fullscreenElement =
//       document.fullscreenElement || document.webkitFullscreenElement;

//     if (!fullscreenElement) {
//       if (this.container.requestFullscreen) {
//         this.container.requestFullscreen();
//         console.log(this.renderer);
//         this.renderer.autoClear = false;
//       } else if (this.container.webkitRequestFullscreen) {
//         this.container.webkitRequestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//         console.log(this.renderer);
//       } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//       }
//     }
//   }

//   addListeners() {
//     window.addEventListener('resize', this.resize);
//     window.addEventListener('dblclick', this.dblclick);
//     window.addEventListener('mousemove', this.mouseMove);
//   }

//   addGUI() {
//     this.gui
//       .add(this.mesh.position, 'x')
//       .min(-1)
//       .max(1)
//       .step(0.01)
//       .name('positionX');
//     this.gui.add(this.directionalLight.position, 'x').min(-1).max(1);
//     this.gui.add(this.material, 'wireframe');
//     this.gui.add(this.mesh, 'visible');
//     this.gui.addColor(this.options, 'color').onChange(() => {
//       this.renderer.setClearColor(this.options.color);
//     });
//     this.gui.addColor(this.material.uniforms.uColor, 'value').onChange(() => {
//       this.material.uniforms.uColor.value.set(
//         this.material.uniforms.uColor.value
//       );
//     });
//     this.gui.add(this.options, 'spin');
//     this.gui
//       .add(this.material.uniforms.uFrequency.value, 'x')
//       .min(0)
//       .max(20)
//       .step(0.01)
//       .name('uFrequencyX');
//     this.gui
//       .add(this.material.uniforms.uFrequency.value, 'y')
//       .min(0)
//       .max(20)
//       .step(0.01)
//       .name('uFrequencyY');
//   }
// }

// const experience = new Experience('.webgl');
// experience.init();
