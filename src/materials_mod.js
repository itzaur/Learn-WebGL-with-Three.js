import "../src/styles/index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
      uTime: { value: 0 },
    };

    //Scene
    this.scene = new THREE.Scene();

    //Textures
    this.environmentMap = new THREE.CubeTextureLoader().load([
      "textures/environmentMaps/3/px.jpg",
      "textures/environmentMaps/3/nx.jpg",
      "textures/environmentMaps/3/py.jpg",
      "textures/environmentMaps/3/ny.jpg",
      "textures/environmentMaps/3/pz.jpg",
      "textures/environmentMaps/3/nz.jpg",
    ]);
    this.debugObject.envMapIntensity = 0.4;
    this.environmentMap.outputEncoding = THREE.sRGBEncoding;

    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

    //Lights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(5, 1, 2.25);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.scene.add(this.directionalLight);

    this.directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );
    this.scene.add(this.directionalLightCameraHelper);

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
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

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
        child.castShadow = true;
        child.receiveShadow = true;

        child.material.envMapIntensity = this.debugObject.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }

  addMesh() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.colorTexture = this.textureLoader.load(
      "/models/LeePerrySmith/color.jpg"
    );
    this.normalTexture = this.textureLoader.load(
      "/models/LeePerrySmith/normal.jpg"
    );

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial({
        color: this.parameters.color,
        side: THREE.DoubleSide,
      })
    );
    this.plane.position.set(0, 0, -4);
    this.plane.rotation.y = Math.PI * 0.25;
    this.scene.add(this.plane);

    this.material = new THREE.MeshStandardMaterial({
      map: this.colorTexture,
      normalMap: this.normalTexture,
    });
    this.depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.parameters.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;

            mat2 rotate2d(float _angle)
            {
              return mat2(cos(_angle),-sin(_angle),
                          sin(_angle),cos(_angle));
            }
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
            #include <beginnormal_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;

            mat2 rotateMatrix = rotate2d(angle);

            objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };

    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.parameters.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;

            mat2 rotate2d(float _angle)
            {
              return mat2(cos(_angle),-sin(_angle),
                          sin(_angle),cos(_angle));
            }
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;

            mat2 rotateMatrix = rotate2d(angle);

            transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };

    this.gltfLoader.load("models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
      const mesh = gltf.scene.children[0];
      mesh.scale.set(0.5, 0.5, 0.5);
      mesh.rotation.y = Math.PI * 0.25;
      mesh.material = this.material;
      mesh.customDepthMaterial = this.depthMaterial;

      this.scene.add(mesh);

      this.updateAllMaterials();

      this.gui
        .add(mesh.rotation, "y")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001)
        .name("RotationY");
    });
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();
    this.parameters.uTime.value = this.elapsedTime;

    this.renderer.render(this.scene, this.camera);

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
  }

  addGui() {
    this.gui
      .add(this.directionalLight.position, "x")
      .min(-5)
      .max(10)
      .step(0.001)
      .name("LightX");
    this.gui
      .add(this.directionalLight.position, "y")
      .min(-5)
      .max(10)
      .step(0.001)
      .name("LightY");
    this.gui
      .add(this.directionalLight.position, "z")
      .min(-5)
      .max(10)
      .step(0.001)
      .name("LightZ");
    this.gui
      .add(this.directionalLight, "intensity")
      .min(0)
      .max(10)
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
      .add(this.renderer, "toneMappingExposure")
      .min(0)
      .max(4)
      .step(0.001)
      .onChange(() => {
        this.updateAllMaterials();
      });
  }
}

new Sketch(document.querySelector(".webgl"));

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
//       color: 0x00ff00,
//       uTime: { value: 0 },
//     };

//     //Scene
//     this.scene = new THREE.Scene();

//     //Textures
//     this.environmentMap = new THREE.CubeTextureLoader().load([
//       "textures/environmentMaps/1/px.jpg",
//       "textures/environmentMaps/1/nx.jpg",
//       "textures/environmentMaps/1/py.jpg",
//       "textures/environmentMaps/1/ny.jpg",
//       "textures/environmentMaps/1/pz.jpg",
//       "textures/environmentMaps/1/nz.jpg",
//     ]);
//     this.environmentMap.outputEncoding = THREE.sRGBEncoding;
//     this.scene.background = this.environmentMap;
//     this.scene.environment = this.environmentMap;
//     this.debugObject.envMapIntensity = 0.2;

//     //Lights
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.position.set(1, 2, 2);
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
//       antialias: true,
//       alpha: true,
//     });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio));
//     this.renderer.physicallyCorrectLights = true;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.outputEncoding = THREE.sRGBEncoding;
//     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     this.renderer.toneMappingExposure = 1.25;

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
//     this.plane = new THREE.Mesh(
//       new THREE.PlaneGeometry(15, 15, 15),
//       new THREE.MeshStandardMaterial({
//         // color: this.parameters.color,
//         side: THREE.DoubleSide,
//       })
//     );
//     this.plane.position.set(0, 0, -4);
//     this.plane.rotation.y = Math.PI * 0.25;
//     this.plane.receiveShadow = true;
//     this.scene.add(this.plane);

//     this.gltfLoader = new GLTFLoader();
//     this.textureLoader = new THREE.TextureLoader();

//     this.colorTexture = this.textureLoader.load(
//       "models/LeePerrySmith/color.jpg"
//     );
//     this.normalTexture = this.textureLoader.load(
//       "models/LeePerrySmith/normal.jpg"
//     );

//     this.material = new THREE.MeshStandardMaterial({
//       map: this.colorTexture,
//       normalMap: this.normalTexture,
//     });
//     this.depthMaterial = new THREE.MeshDepthMaterial({
//       depthPacking: THREE.RGBADepthPacking,
//     });

//     this.material.onBeforeCompile = (shader) => {
//       console.log(shader);
//       shader.uniforms.uTime = this.parameters.uTime;

//       shader.vertexShader = shader.vertexShader.replace(
//         "#include <common>",
//         `
//             #include <common>

//             uniform float uTime;

//             mat2 get2dRotateMatrix(float _angle)
//             {
//               return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//             }
//         `
//       );

//       shader.vertexShader = shader.vertexShader.replace(
//         "#include <beginnormal_vertex>",
//         `

//             #include <beginnormal_vertex>

//             float angle = (sin(position.y + uTime)) * 0.4;

//             mat2 rotateMatrix = get2dRotateMatrix(angle);

//             objectNormal.xz = rotateMatrix * objectNormal.xz;
//         `
//       );

//       shader.vertexShader = shader.vertexShader.replace(
//         "#include <begin_vertex>",
//         `

//             #include <begin_vertex>

//             transformed.xz = rotateMatrix * transformed.xz;
//         `
//       );
//     };

//     this.depthMaterial.onBeforeCompile = (shader) => {
//       shader.uniforms.uTime = this.parameters.uTime;

//       shader.vertexShader = shader.vertexShader.replace(
//         "#include <common>",
//         `
//             #include <common>

//             uniform float uTime;

//             mat2 get2dRotateMatrix(float _angle)
//             {
//               return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//             }
//         `
//       );

//       shader.vertexShader = shader.vertexShader.replace(
//         "#include <begin_vertex>",
//         `

//             #include <begin_vertex>

//             float angle = (sin(position.y + uTime)) * 0.4;

//             mat2 rotateMatrix = get2dRotateMatrix(angle);

//             transformed.xz = rotateMatrix * transformed.xz;
//         `
//       );
//     };

//     this.gltfLoader.load("/models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
//       const mesh = gltf.scene.children[0];
//       mesh.scale.set(0.4, 0.4, 0.4);
//       mesh.rotation.y = Math.PI * 0.25;
//       mesh.material = this.material;
//       mesh.customDepthMaterial = this.depthMaterial;
//       this.scene.add(mesh);

//       this.updateAllMaterials();

//       this.gui
//         .add(gltf.scene.rotation, "y")
//         .min(-Math.PI)
//         .max(Math.PI)
//         .step(0.001)
//         .name("RotationY");
//     });
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();
//     this.parameters.uTime.value = this.elapsedTime;

//     this.controls.update();

//     this.renderer.render(this.scene, this.camera);

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
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio));
//   }

//   addGui() {
//     this.gui
//       .add(this.directionalLight.position, "x")
//       .min(-5)
//       .max(20)
//       .step(0.001)
//       .name("LightsX");
//     this.gui
//       .add(this.directionalLight.position, "y")
//       .min(-5)
//       .max(20)
//       .step(0.001)
//       .name("LightsY");
//     this.gui
//       .add(this.directionalLight.position, "z")
//       .min(-5)
//       .max(20)
//       .step(0.001)
//       .name("LightsZ");
//     this.gui
//       .add(this.directionalLight, "intensity")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .name("LightIntensity");

//     this.gui
//       .add(this.debugObject, "envMapIntensity")
//       .min(0)
//       .max(5)
//       .step(0.001)
//       .onChange(() => {
//         this.updateAllMaterials();
//       });

//     this.gui
//       .add(this.renderer, "toneMapping", {
//         none: THREE.NoToneMapping,
//         cineon: THREE.CineonToneMapping,
//         linear: THREE.LinearToneMapping,
//         aces: THREE.ACESFilmicToneMapping,
//         reinhard: THREE.ReinhardToneMapping,
//       })
//       .onFinishChange(() => {
//         this.updateAllMaterials();
//       });
//   }
// }

// new Sketch(document.querySelector(".webgl"));

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
//       color: 0xffffff,
//       uTime: { value: 0 },
//     };

//     //Scene
//     this.scene = new THREE.Scene();

//     //Camera
//     this.camera = new THREE.PerspectiveCamera(
//       45,
//       this.width / this.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(2, 2, 2);
//     this.scene.add(this.camera);

//     //Controls
//     this.controls = new OrbitControls(this.camera, this.canvas);
//     this.controls.enableDamping = true;

//     //Lights
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     this.directionalLight.position.set(0.25, 1, 2.25);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.shadow.mapSize.set(1024, 1024);
//     // this.directionalLight.shadow.mapSize.width = 1024;
//     // this.directionalLight.shadow.mapSize.height = 1024;
//     // this.directionalLight.shadow.camera.near = 2;
//     this.directionalLight.shadow.camera.far = 10;
//     // this.directionalLight.shadow.camera.top = 7;
//     // this.directionalLight.shadow.camera.right = 7;
//     // this.directionalLight.shadow.camera.bottom = -7;
//     // this.directionalLight.shadow.camera.left = -7;
//     this.directionalLight.shadow.normalBias = 0.05;
//     this.scene.add(this.directionalLight);

//     this.directionalLightCameraHelper = new THREE.CameraHelper(
//       this.directionalLight.shadow.camera
//     );
//     this.scene.add(this.directionalLightCameraHelper);

//     this.gui
//       .add(this.directionalLight, "intensity")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .name("lightIntensity");
//     this.gui
//       .add(this.directionalLight.position, "x")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightX");
//     this.gui
//       .add(this.directionalLight.position, "y")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightY");
//     this.gui
//       .add(this.directionalLight.position, "z")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightZ");

//     //Textures
//     this.textureLoader = new THREE.TextureLoader();
//     this.cubeTextureLoader = new THREE.CubeTextureLoader();

//     this.colorTexture = this.textureLoader.load(
//       "models/LeePerrySmith/color.jpg"
//     );
//     this.normalTexture = this.textureLoader.load(
//       "models/LeePerrySmith/normal.jpg"
//     );

//     this.environmentTexture = this.cubeTextureLoader.load([
//       "textures/environmentMaps/0/px.jpg",
//       "textures/environmentMaps/0/nx.jpg",
//       "textures/environmentMaps/0/py.jpg",
//       "textures/environmentMaps/0/ny.jpg",
//       "textures/environmentMaps/0/pz.jpg",
//       "textures/environmentMaps/0/nz.jpg",
//     ]);
//     this.environmentTexture.outputEncoding = THREE.sRGBEncoding;
//     this.scene.background = this.environmentTexture;
//     this.scene.environment = this.environmentTexture;

//     this.debugObject.envMapIntensity = 1 / 2;
//     this.gui
//       .add(this.debugObject, "envMapIntensity")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .name("envMapIntensity")
//       .onChange(() => {
//         this.updateAllMaterials();
//       });

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
//     this.renderer.physicallyCorrectLights = true;
//     this.renderer.outputEncoding = THREE.sRGBEncoding;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     this.renderer.toneMappingExposure = 3;

//     this.gui
//       .add(this.renderer, "toneMapping", {
//         none: THREE.NoToneMapping,
//         linear: THREE.LinearToneMapping,
//         cineon: THREE.CineonToneMapping,
//         reinhard: THREE.ReinhardToneMapping,
//         aces: THREE.ACESFilmicToneMapping,
//       })
//       .onFinishChange(() => {
//         this.renderer.toneMapping = +this.renderer.toneMapping;
//         this.updateAllMaterials();
//       });
//     this.gui
//       .add(this.renderer, "toneMappingExposure")
//       .min(0)
//       .max(10)
//       .step(0.001);

//     this.addMesh();
//     this.addObject();
//     this.render();
//     window.addEventListener("resize", () => {
//       this.resize();
//     });
//   }

//   updateAllMaterials() {
//     this.scene.traverse((child) => {
//       if (
//         child instanceof THREE.Mesh &&
//         child.material instanceof THREE.MeshStandardMaterial
//       ) {
//         // child.material.envMap = this.environmentTexture;
//         child.material.envMapIntensity = this.debugObject.envMapIntensity;
//         child.material.needsUpdate = true;

//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//   }

//   addMesh() {
//     this.geometry = new THREE.PlaneGeometry(15, 15, 15);

//     this.material = new THREE.MeshStandardMaterial({
//       color: this.parameters.color,
//       side: THREE.DoubleSide,

//       envMap: this.environmentTexture,
//       transparent: true,
//     });

//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.mesh.rotation.x = Math.PI;
//     this.mesh.position.z = -2;
//     this.mesh.position.y = -5;
//     this.mesh.receiveShadow = true;

//     this.scene.add(this.mesh);
//   }

//   addObject() {
//     this.depthMaterial = new THREE.MeshDepthMaterial({
//       depthPacking: THREE.RGBADepthPacking,
//     });

//     this.loader = new GLTFLoader();

//     this.loader.load("models/LeePerrySmith/LeePerrySmith.glb", (glb) => {
//       this.scene.add(glb.scene);
//       glb.scene.scale.set(0.25, 0.25, 0.25);

//       const objectMesh = glb.scene.children[0];
//       objectMesh.customDepthMaterial = this.depthMaterial;
//       objectMesh.material.map = this.colorTexture;
//       objectMesh.material.normalMap = this.normalTexture;

//       objectMesh.material.onBeforeCompile = (shader) => {
//         shader.uniforms.uTime = this.parameters.uTime;

//         shader.vertexShader = shader.vertexShader.replace(
//           "#include <common>",
//           `
//                   #include <common>

//                   uniform float uTime;

//                   mat2 get2dRotateMatrix(float _angle)
//                   {
//                       return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//                   }
//             `
//         );

//         shader.vertexShader = shader.vertexShader.replace(
//           "#include <beginnormal_vertex>",
//           `
//                 #include <beginnormal_vertex>

//                 float angle = (sin(position.y + uTime)) * 0.4;
//                 mat2 rotateMatrix = get2dRotateMatrix(angle);

//                 objectNormal.xz = rotateMatrix * objectNormal.xz;
//             `
//         );

//         shader.vertexShader = shader.vertexShader.replace(
//           "#include <begin_vertex>",
//           `
//                 #include <begin_vertex>

//                 transformed.xz *= rotateMatrix;
//           `
//         );
//       };

//       this.depthMaterial.onBeforeCompile = (shader) => {
//         shader.uniforms.uTime = this.parameters.uTime;

//         shader.vertexShader = shader.vertexShader.replace(
//           "#include <common>",
//           `
//                   #include <common>

//                   uniform float uTime;

//                   mat2 get2dRotateMatrix(float _angle)
//                   {
//                       return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//                   }
//             `
//         );

//         shader.vertexShader = shader.vertexShader.replace(
//           "#include <begin_vertex>",
//           `
//                 #include <begin_vertex>

//                 float angle = (position.y + uTime) * 0.7;
//                 mat2 rotateMatrix = get2dRotateMatrix(angle);
//                 transformed.xz *= rotateMatrix;

//           `
//         );
//       };

//       this.gui
//         .add(glb.scene.rotation, "y")
//         .min(-Math.PI)
//         .max(Math.PI)
//         .step(0.001)
//         .name("rotationY");

//       this.updateAllMaterials();
//     });
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();
//     this.parameters.uTime.value = this.elapsedTime;

//     this.renderer.render(this.scene, this.camera);

//     this.controls.update();

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

//     //Debug
//     this.gui = new dat.GUI();
//     this.debugObject = {};
//     this.debugObject.envMapIntensity = 1;

//     //Parameters
//     this.parameters = {
//       color: 0xffffff,
//       uTime: { value: 0 },
//     };

//     //Scene
//     this.scene = new THREE.Scene();

//     //Textures
//     this.textureLoader = new THREE.TextureLoader();
//     this.cubeTextureLoader = new THREE.CubeTextureLoader();

//     this.environmentMap = this.cubeTextureLoader.load([
//       "textures/environmentMaps/2/px.jpg",
//       "textures/environmentMaps/2/nx.jpg",
//       "textures/environmentMaps/2/py.jpg",
//       "textures/environmentMaps/2/ny.jpg",
//       "textures/environmentMaps/2/pz.jpg",
//       "textures/environmentMaps/2/nz.jpg",
//     ]);
//     this.scene.background = this.environmentMap;
//     this.scene.environment = this.environmentMap;
//     this.scene.outputEncoding = THREE.sRGBEncoding;

//     //Lights
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.position.set(0.25, 1, 2.25);
//     this.directionalLight.shadow.mapSize.set(1024, 1024);
//     this.directionalLight.shadow.camera.far = 8;
//     this.directionalLight.shadow.normalBias = 0.05;
//     this.directionalLight.intensity = 8;
//     this.scene.add(this.directionalLight);

//     this.directionalLightHelper = new THREE.DirectionalLightHelper(
//       this.directionalLight
//     );
//     // this.scene.add(this.directionalLightHelper);

//     this.directionalLightCameraHelper = new THREE.CameraHelper(
//       this.directionalLight.shadow.camera
//     );
//     // this.scene.add(this.directionalLightCameraHelper);

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
//     this.renderer.toneMappingExposure = 0.5;

//     this.addMesh();
//     this.render();
//     this.addGui();
//   }

//   updateAllMaterials() {
//     this.scene.traverse((child) => {
//       if (
//         child instanceof THREE.Mesh &&
//         child.material instanceof THREE.MeshStandardMaterial
//       ) {
//         child.material.needsUpdate = true;
//         child.material.envMapIntensity = this.debugObject.envMapIntensity;

//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//   }

//   addMesh() {
//     this.planeGeometry = new THREE.PlaneGeometry(15, 15, 15);

//     this.material = new THREE.MeshStandardMaterial({
//       side: THREE.DoubleSide,
//       color: this.parameters.color,
//     });

//     this.planeMesh = new THREE.Mesh(this.planeGeometry, this.material);
//     this.planeMesh.position.set(0, 0, -2);
//     this.planeMesh.receiveShadow = true;
//     this.scene.add(this.planeMesh);

//     this.depthMaterial = new THREE.MeshDepthMaterial({
//       depthPacking: THREE.RGBADepthPacking,
//     });

//     this.gltfLoader = new GLTFLoader();
//     this.gltfLoader.load(
//       "models/FlightHelmet/glTF/FlightHelmet.gltf",
//       (gltf) => {
//         this.scene.add(gltf.scene);
//         gltf.scene.scale.set(2.5, 2.5, 2.5);

//         const mesh = gltf.scene.children;

//         mesh.forEach((element) => {
//           element.customDepthMaterial = this.depthMaterial;

//           element.material.onBeforeCompile = (shader) => {
//             shader.uniforms.uTime = this.parameters.uTime;

//             shader.vertexShader = shader.vertexShader.replace(
//               "#include <common>",
//               `

//               #include <common>

//               uniform float uTime;

//               mat2 get2dRotateMatrix(float _angle)
//               {
//                 return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//               }
//               `
//             );

//             shader.vertexShader = shader.vertexShader.replace(
//               "#include <beginnormal_vertex>",
//               `

//               #include <beginnormal_vertex>

//               float angle = (sin(position.y + uTime)) * 0.9;

//               mat2 rotateMatrix = get2dRotateMatrix(angle);

//               objectNormal.xz = rotateMatrix * objectNormal.xz;

//               `
//             );

//             shader.vertexShader = shader.vertexShader.replace(
//               "#include <begin_vertex>",
//               `
//                 #include <begin_vertex>

//                 transformed.xz *= rotateMatrix;
//               `
//             );
//           };

//           this.depthMaterial.onBeforeCompile = (shader) => {
//             shader.uniforms.uTime = this.parameters.uTime;

//             shader.vertexShader = shader.vertexShader.replace(
//               "#include <common>",
//               `

//               #include <common>

//               uniform float uTime;

//               mat2 get2dRotateMatrix(float _angle)
//               {
//                 return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
//               }
//               `
//             );

//             shader.vertexShader = shader.vertexShader.replace(
//               "#include <begin_vertex>",
//               `
//                 #include <begin_vertex>

//                 float angle = (sin(position.y + uTime)) * 0.9;

//                 mat2 rotateMatrix = get2dRotateMatrix(angle);

//                 transformed.xz *= rotateMatrix;
//               `
//             );
//           };
//         });

//         this.gui
//           .add(gltf.scene.rotation, "y")
//           .min(-Math.PI)
//           .max(Math.PI)
//           .step(0.001)
//           .name("rotationY");

//         this.updateAllMaterials();
//       }
//     );
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();
//     this.parameters.uTime.value = this.elapsedTime;

//     this.controls.update();

//     this.renderer.render(this.scene, this.camera);

//     window.requestAnimationFrame(this.render.bind(this));
//   }

//   addGui() {
//     this.gui
//       .add(this.debugObject, "envMapIntensity")
//       .min(0)
//       .max(10)
//       .step(0.001)
//       .name("envMapIntensity")
//       .onChange(() => {
//         this.updateAllMaterials();
//       });
//     this.gui
//       .add(this.directionalLight.position, "x")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightX");
//     this.gui
//       .add(this.directionalLight.position, "y")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightY");
//     this.gui
//       .add(this.directionalLight.position, "z")
//       .min(-5)
//       .max(5)
//       .step(0.001)
//       .name("lightZ");
//     this.gui
//       .add(this.directionalLight, "intensity")
//       .min(0)
//       .max(15)
//       .step(0.001)
//       .name("intensity");

//     this.gui
//       .add(this.renderer, "toneMapping", {
//         none: THREE.NoToneMapping,
//         cineon: THREE.CineonToneMapping,
//         linear: THREE.LinearToneMapping,
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
//       .step(0.001);
//   }
// }

// new Sketch(document.querySelector(".webgl"));
