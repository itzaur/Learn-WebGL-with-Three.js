// import * as THREE from "three";
// import Experience from "../Experience";
// import Environment from "./Environment";

// export default class World {
//   constructor() {
//     this.experience = new Experience();
//     this.scene = this.experience.scene;
//     this.resources = this.experience.resources;
//     // console.log(this.resources);

//     const testMesh = new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({})
//     );
//     this.scene.add(testMesh);

//     //Resources loading event
//     this.resources.on("ready", () => {
//       this.environment = new Environment();
//     });
//   }
// }

import * as THREE from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // );

    // const floor = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10, 10),
    //   new THREE.MeshStandardMaterial({})
    // );

    // this.scene.add(testMesh, floor);

    this.resources.on("ready", () => {
      this.floor = new Floor();
      this.fox = new Fox();
      console.log(this.fox);
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
