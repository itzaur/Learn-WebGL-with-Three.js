// import "../src/styles/index.scss";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
// import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
// import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// export default class Sketch {
//   constructor(canvas) {
//     this.canvas = canvas;

//     //Debug
//     this.gui = new dat.GUI();
//     this.debugObject = {};

//     //Sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Parameters
//     this.parameters = {
//       color: 0x0000ff,
//       uTime: { value: 0 },
//     };

//     //Scene
//     this.scene = new THREE.Scene();

//     //Textures
//     this.environmentMap = new THREE.CubeTextureLoader().load([
//       "textures/environmentMaps/3/px.jpg",
//       "textures/environmentMaps/3/nx.jpg",
//       "textures/environmentMaps/3/py.jpg",
//       "textures/environmentMaps/3/ny.jpg",
//       "textures/environmentMaps/3/pz.jpg",
//       "textures/environmentMaps/3/nz.jpg",
//     ]);
//     this.debugObject.envMapIntensity = 0.4;
//     this.environmentMap.outputEncoding = THREE.sRGBEncoding;

//     this.scene.background = this.environmentMap;
//     this.scene.environment = this.environmentMap;

//     //Lights
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//     this.directionalLight.position.set(5, 1, 2.25);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.shadow.mapSize.set(1024, 1024);
//     this.directionalLight.shadow.camera.far = 15;
//     this.directionalLight.shadow.normalBias = 0.05;
//     this.scene.add(this.directionalLight);

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
//     this.renderer.physicallyCorrectLights = true;
//     this.renderer.outputEncoding = THREE.sRGBEncoding;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     this.renderer.toneMappingExposure = 1.4;

//     //Post-processing

//     //RenderTarget
//     this.renderTarget = new THREE.WebGLRenderTarget(800, 600);

//     //EffectComposer
//     this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
//     this.effectComposer.setSize(this.width, this.height);
//     this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.renderPass = new RenderPass(this.scene, this.camera);
//     this.effectComposer.addPass(this.renderPass);

//     //DotScreenPass
//     this.dotScreenPass = new DotScreenPass();
//     this.dotScreenPass.enabled = false;
//     this.effectComposer.addPass(this.dotScreenPass);

//     //GlitchPass
//     this.glitchPass = new GlitchPass();
//     this.glitchPass.goWild = false;
//     this.glitchPass.enabled = false;
//     this.effectComposer.addPass(this.glitchPass);

//     //ShaderPass
//     this.rgbShiftPass = new ShaderPass(RGBShiftShader);
//     this.rgbShiftPass.enabled = false;
//     this.effectComposer.addPass(this.rgbShiftPass);

//     this.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
//     this.effectComposer.addPass(this.gammaCorrectionShader);

//     //UnrealBloomPass
//     this.unrealBloomPass = new UnrealBloomPass();
//     this.unrealBloomPass.radius = 1;
//     this.unrealBloomPass.strength = 0.3;
//     this.unrealBloomPass.threshold = 0.6;
//     this.effectComposer.addPass(this.unrealBloomPass);

//     //Create Pass
//     this.tintShader = {
//       uniforms: {
//         tDiffuse: { value: null },
//         uTint: { value: null },
//       },
//       vertexShader: `
//         varying vec2 vUv;

//         void main() {
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

//             vUv = uv;
//         }
//       `,
//       fragmentShader: `
//         uniform sampler2D tDiffuse;
//         uniform vec3 uTint;

//         varying vec2 vUv;

//         void main() {
//             vec4 color = texture2D(tDiffuse, vUv);
//             color.rgb += uTint;
//             gl_FragColor = color;
//         }
//       `,
//     };
//     this.tintPass = new ShaderPass(this.tintShader);
//     this.tintPass.material.uniforms.uTint.value = new THREE.Vector3(1, 0.5, 0);
//     this.effectComposer.addPass(this.tintPass);

//     //Displacement Pass
//     this.displacementShader = {
//       uniforms: {
//         tDiffuse: { value: null },
//         uTint: { value: null },
//       },
//       vertexShader: `
//           varying vec2 vUv;

//           void main() {
//               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

//               vUv = uv;
//           }
//         `,
//       fragmentShader: `
//           uniform sampler2D tDiffuse;
//           uniform float uTime;

//           varying vec2 vUv;

//           void main() {
//               vec2 newUv = vec2(vUv.x, vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1);
//               vec4 color = texture2D(tDiffuse, newUv);

//               gl_FragColor = color;
//           }
//         `,
//     };
//     this.displacementPass = new ShaderPass(this.displacementShader);
//     this.displacementPass.material.uniforms.uTime = this.parameters.uTime;
//     this.effectComposer.addPass(this.displacementPass);

//     //Functions
//     this.addMesh();
//     this.render();
//     window.addEventListener("resize", () => {
//       this.resize();
//     });
//     this.addGui();
//   }

//   updateAllMaterials() {
//     this.scene.traverse((child) => {
//       if (
//         child instanceof THREE.Mesh &&
//         child.material instanceof THREE.MeshStandardMaterial
//       ) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         child.material.envMapIntensity = this.debugObject.envMapIntensity;
//         child.material.needsUpdate = true;
//       }
//     });
//   }

//   addMesh() {
//     this.gltfLoader = new GLTFLoader();
//     this.textureLoader = new THREE.TextureLoader();

//     this.colorTexture = this.textureLoader.load(
//       "/models/DamagedHelmet/glTF/Default_albedo.jpg"
//     );
//     this.normalTexture = this.textureLoader.load(
//       "/models/DamagedHelmet/glTF/Default_normal.jpg"
//     );
//     this.ambientOcclusionTexture = this.textureLoader.load(
//       "/models/DamagedHelmet/glTF/Default_AO.jpg"
//     );

//     this.material = new THREE.MeshStandardMaterial({
//       map: this.colorTexture,
//       normalMap: this.normalTexture,
//       aoMap: this.ambientOcclusionTexture,
//     });
//     this.depthMaterial = new THREE.MeshDepthMaterial({
//       depthPacking: THREE.RGBADepthPacking,
//     });

//     this.gltfLoader.load(
//       "models/DamagedHelmet/glTF/DamagedHelmet.gltf",
//       (gltf) => {
//         const mesh = gltf.scene.children[0];
//         // mesh.scale.set(0.5, 0.5, 0.5);
//         mesh.rotation.x = Math.PI * 0.5;
//         // mesh.material = this.material;
//         // mesh.customDepthMaterial = this.depthMaterial;

//         this.scene.add(mesh);

//         this.updateAllMaterials();

//         this.gui
//           .add(mesh.rotation, "y")
//           .min(-Math.PI)
//           .max(Math.PI)
//           .step(0.001)
//           .name("RotationY");
//       }
//     );
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();
//     this.parameters.uTime.value = this.elapsedTime;

//     // this.renderer.render(this.scene, this.camera);
//     this.effectComposer.render();

//     this.controls.update();

//     window.requestAnimationFrame(this.render.bind(this));
//   }

//   resize() {
//     //Update sizes
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;

//     //Update camera
//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     //Update renderer
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     //Update EffectComposer
//     this.effectComposer.setSize(this.width, this.height);
//     this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }

//   addGui() {
//     this.gui
//       .add(this.directionalLight.position, "x")
//       .min(-5)
//       .max(10)
//       .step(0.001)
//       .name("LightX");
//     this.gui
//       .add(this.directionalLight.position, "y")
//       .min(-5)
//       .max(10)
//       .step(0.001)
//       .name("LightY");
//     this.gui
//       .add(this.directionalLight.position, "z")
//       .min(-5)
//       .max(10)
//       .step(0.001)
//       .name("LightZ");
//     this.gui
//       .add(this.directionalLight, "intensity")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .name("LightIntensity");

//     this.gui
//       .add(this.debugObject, "envMapIntensity")
//       .min(0)
//       .max(4)
//       .step(0.001)
//       .onChange(() => {
//         this.updateAllMaterials();
//       });

//     this.gui
//       .add(this.renderer, "toneMapping", {
//         none: THREE.NoToneMapping,
//         linear: THREE.LinearToneMapping,
//         cineon: THREE.CineonToneMapping,
//         reinhard: THREE.ReinhardToneMapping,
//         aces: THREE.ACESFilmicToneMapping,
//       })
//       .onFinishChange(() => {
//         this.updateAllMaterials();
//       });
//     this.gui
//       .add(this.renderer, "toneMappingExposure")
//       .min(0)
//       .max(4)
//       .step(0.001)
//       .onChange(() => {
//         this.updateAllMaterials();
//       });

//     this.gui.add(this.unrealBloomPass, "enabled");
//     this.gui
//       .add(this.unrealBloomPass, "radius")
//       .min(0)
//       .max(5)
//       .step(0.001)
//       .name("unrealBloomPassRadius");
//     this.gui
//       .add(this.unrealBloomPass, "strength")
//       .min(0)
//       .max(5)
//       .step(0.001)
//       .name("unrealBloomPassStrength");
//     this.gui
//       .add(this.unrealBloomPass, "threshold")
//       .min(0)
//       .max(1)
//       .step(0.001)
//       .name("unrealBloomPassThreshold");

//     this.gui
//       .add(this.tintPass.material.uniforms.uTint.value, "x")
//       .min(-1)
//       .max(1)
//       .step(0.01)
//       .name("uTintX");
//     this.gui
//       .add(this.tintPass.material.uniforms.uTint.value, "y")
//       .min(-1)
//       .max(1)
//       .step(0.01)
//       .name("uTintY");
//     this.gui
//       .add(this.tintPass.material.uniforms.uTint.value, "z")
//       .min(-1)
//       .max(1)
//       .step(0.01)
//       .name("uTintZ");
//   }
// }

// new Sketch(document.querySelector(".webgl"));

import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass";
import { BasicShader } from "three/examples/jsm/shaders/BasicShader";

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;

    //Debug
    this.gui = new dat.GUI();
    this.debugObject = {};

    //Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Parameters
    this.parameters = {
      color: 0x0000ff,
    };

    //Scene
    this.scene = new THREE.Scene();

    //Textures
    this.environmentMap = new THREE.CubeTextureLoader().load([
      "textures/environmentMaps/0/px.jpg",
      "textures/environmentMaps/0/nx.jpg",
      "textures/environmentMaps/0/py.jpg",
      "textures/environmentMaps/0/ny.jpg",
      "textures/environmentMaps/0/pz.jpg",
      "textures/environmentMaps/0/nz.jpg",
    ]);
    this.debugObject.envMapIntensity = 1;
    this.environmentMap.outputEncoding = THREE.sRGBEncoding;

    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

    //Lights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(1, 2, 2);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;

    this.scene.add(this.directionalLight);

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
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;

    //EffectComposer
    this.renderTarget = new THREE.WebGLRenderTarget();
    this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
    this.effectComposer.setSize(this.width, this.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderPass = new RenderPass(this.scene, this.camera);

    this.effectComposer.addPass(this.renderPass);

    //DotScreenPass
    this.dotScreenPass = new DotScreenPass();
    this.dotScreenPass.enabled = false;
    this.effectComposer.addPass(this.dotScreenPass);

    this.glitchPass = new GlitchPass();
    this.glitchPass.enabled = false;
    this.effectComposer.addPass(this.glitchPass);
    // this.shaderPass = new ShaderPass(DotScreenPass);

    //Create pass
    this.tintShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTint: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          color.rgb += uTint;
          gl_FragColor = color;
        }
      `,
    };
    this.tintPass = new ShaderPass(this.tintShader);
    this.tintPass.material.uniforms.uTint.value = new THREE.Vector3(
      0.5,
      0.5,
      0
    );
    this.effectComposer.addPass(this.tintPass);

    //DisplacementShader
    this.displacementShader = {
      uniforms: {
        tDiffuse: { value: null },
        uNormalMap: { value: null },
      },
      vertexShader: `
      varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv;
      }`,
      fragmentShader: `
      uniform sampler2D uNormalMap;
      uniform sampler2D tDiffuse;

      varying vec2 vUv;

      void main() {
        vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        vec2 newUv = vUv + normalColor.xy * 0.1;
        vec4 color = texture2D(tDiffuse, newUv);

        vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
        float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
        color.rgb += lightness * 2.0;

        gl_FragColor = color;
      }`,
    };
    this.displacementPass = new ShaderPass(this.displacementShader);
    this.displacementPass.material.uniforms.uNormalMap.value =
      new THREE.TextureLoader().load("/textures/interfaceNormalMap.png");
    this.effectComposer.addPass(this.displacementPass);

    this.addMesh();
    this.render();
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.addGui();
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity = this.debugObject.envMapIntensity;
        child.material.needsUpdate = true;

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  addMesh() {
    this.gltfLoader = new GLTFLoader();

    this.gltfLoader.load(
      "models/DamagedHelmet/glTF/DamagedHelmet.gltf",
      (gltf) => {
        const mesh = gltf.scene.children[0];
        this.scene.add(mesh);

        this.gui
          .add(mesh.rotation, "z")
          .min(-Math.PI)
          .max(Math.PI)
          .step(0.001)
          .name("RotationZ");

        this.updateAllMaterials();
      }
    );
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();

    // this.renderer.render(this.scene, this.camera);
    this.effectComposer.render();

    this.controls.update();

    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    //Update sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    //Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Update EffectComposer
    this.effectComposer.setSize(this.width, this.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addGui() {
    this.gui
      .add(this.directionalLight.position, "x")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("LightX");
    this.gui
      .add(this.directionalLight.position, "y")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("LightY");
    this.gui
      .add(this.directionalLight.position, "z")
      .min(-5)
      .max(5)
      .step(0.001)
      .name("LightZ");
    this.gui
      .add(this.directionalLight, "intensity")
      .min(0)
      .max(5)
      .step(0.001)
      .name("LightIntensity");

    this.gui
      .add(this.debugObject, "envMapIntensity")
      .min(0)
      .max(4)
      .step(0.001)
      .onChange(() => {
        this.updateAllMaterials();
      });

    this.gui
      .add(this.renderer, "toneMapping", {
        none: THREE.NoToneMapping,
        linear: THREE.LinearToneMapping,
        cineon: THREE.CineonToneMapping,
        reinhard: THREE.ReinhardToneMapping,
        aces: THREE.ACESFilmicToneMapping,
      })
      .onFinishChange(() => {
        this.updateAllMaterials();
      });

    this.gui
      .add(this.tintPass.material.uniforms.uTint.value, "x")
      .min(-1)
      .max(1)
      .step(0.001)
      .name("red");
    this.gui
      .add(this.tintPass.material.uniforms.uTint.value, "y")
      .min(-1)
      .max(1)
      .step(0.001)
      .name("green");
    this.gui
      .add(this.tintPass.material.uniforms.uTint.value, "z")
      .min(-1)
      .max(1)
      .step(0.001)
      .name("blue");
  }
}

new Sketch(document.querySelector(".webgl"));
