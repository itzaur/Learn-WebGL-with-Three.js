import "./styles/index.scss";
import Experience from "./Experience/Experience.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

const experience = new Experience(document.querySelector("canvas.webgl"));

//Canvas
