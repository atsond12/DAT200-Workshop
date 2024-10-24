"use strict";
import * as THREE from "three";
import { OrbitControls } from "orbitControls";

const world = {
  scene: null,
  camera: null,
  renderer: null,
};
const deg = Math.PI / 180;
const backgroundColor = "#aaaaaa";

function getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

function renderScene() {
  world.renderer.render(world.scene, world.camera);
  requestAnimationFrame(renderScene);
}

function windowResize() {
  world.camera.aspect = getAspectRatio();
  world.camera.updateProjectionMatrix();
  world.renderer.setSize(window.innerWidth, window.innerHeight);
}

export function createWorld(createObjectsFunction) {
  const groundPlaneSize = 150; 
  const lightColor = "#ffffff";
  const lightIntensity = 1;

  world.scene = new THREE.Scene();
  world.scene.background = new THREE.Color(backgroundColor);
  world.scene.fog = new THREE.Fog(backgroundColor, groundPlaneSize/5, groundPlaneSize/2);
  
  /* Here is a nice place to add lights */
  let light = new THREE.AmbientLight(lightColor, lightIntensity);
  world.scene.add(light);

  light = new THREE.DirectionalLight(lightColor, lightIntensity/2);
  light.position.set(5, 5, 5);
  light.castShadow = true;
  light.bias = -0.001;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.radius = 5;
  world.scene.add(light);

  /* Create a ground plane */
  let geo = new THREE.PlaneGeometry(groundPlaneSize, groundPlaneSize);
  let mat = new THREE.MeshPhongMaterial({ color: "#a6a6a6", depthWrite: true, shininess: 200});
  let mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -90 * deg;
  mesh.receiveShadow = true;
  world.scene.add(mesh);

  /* Create a grid helper */
  let helper = new THREE.GridHelper(groundPlaneSize, groundPlaneSize);
  world.scene.add(helper);

  /* Here is a nice place to add objects */
  if(createObjectsFunction){
    createObjectsFunction(world.scene);
  }

  /* Create a camera */
  world.camera = new THREE.PerspectiveCamera(45, getAspectRatio(), 0.001, groundPlaneSize * 2);
  world.camera.position.set(7, 3, -7);
  world.camera.lookAt(0, 0, 0);

  /* Create a renderer */
  world.renderer = new THREE.WebGLRenderer({ antialias: true });
  world.renderer.outputColorSpace = THREE.SRGBColorSpace;
  world.renderer.setSize(window.innerWidth, window.innerHeight);
  world.renderer.setPixelRatio(window.devicePixelRatio);
  world.renderer.shadowMap.enabled = true;
  document.body.appendChild(world.renderer.domElement);

  /* Create OrbitControls */
  let controls = new OrbitControls(world.camera, world.renderer.domElement);
  controls.update();

  renderScene();
  window.addEventListener("resize", windowResize);
}
