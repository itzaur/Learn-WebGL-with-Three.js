// import * as THREE from "three";
// import Experience from "../Experience";

// export default class Environment {
//   constructor() {
//     this.experience = new Experience();
//     this.scene = this.experience.scene;
//     this.resources = this.experience.resources;

//     this.setSunLight();
//     this.setEnvironmentMap();
//   }

//   setSunLight() {
//     this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
//     this.sunLight.shadow.mapSize.set(1024, 1024);
//     this.sunLight.position.set(3.5, 2, -1.25);
//     this.sunLight.shadow.camera.far = 15;
//     this.sunLight.castShadow = true;

//     this.scene.add(this.sunLight);
//   }

//   setEnvironmentMap() {
//     this.environmentMap = {};
//     this.environmentMap.intensity = 0.4;
//     this.environmentMap.texture = this.resources.items.environmentMapTexture;
//     this.environmentMap.texture.encoding = THREE.sRGBEncoding;
//     this.scene.environment = this.environmentMap.texture;
//   }
// }
import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.setSunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.setSunLight.position.set(3, 5, -2.5);
    this.setSunLight.castShadow = true;
    this.setSunLight.shadow.mapSize.set(1024, 1024);
    this.setSunLight.shadow.camera.far = 15;
    this.setSunLight.shadow.normalBias = 0.05;

    this.scene.add(this.setSunLight);

    //Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.setSunLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("sunLightX");
      this.debugFolder
        .add(this.setSunLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("sunLightY");
      this.debugFolder
        .add(this.setSunLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("sunLightZ");
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateAllMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;

          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    this.environmentMap.updateAllMaterials();

    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .onChange(this.environmentMap.updateAllMaterials);
    }
  }
}
