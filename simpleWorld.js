"use strict";
import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

export const world = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
  renderer: new THREE.WebGLRenderer({ antialias: true }),
};

const worldSize = 100;

function addAmbientLight() {
  const light = new THREE.AmbientLight("#FFFFFF", 1.4);
  world.scene.add(light);
}

function addGround() {
  const geo = new THREE.PlaneGeometry(worldSize, worldSize);
  const mat = new THREE.MeshPhongMaterial({ color: "#A6A6A6", side: THREE.DoubleSide, depthWrite: true, shininess: 100 });
  mat.transparent = true;
  mat.opacity = 0.5;
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = (90 * Math.PI) / 180;
  plane.receiveShadow = true;
  world.scene.add(plane);
  const grid = new THREE.GridHelper(worldSize, worldSize / 5);
  world.scene.add(grid);
  const axesHelper = new THREE.AxesHelper(50);
  world.scene.add(axesHelper);
}

function render() {
  requestAnimationFrame(render);
  world.renderer.render(world.scene, world.camera);
}

function windowResize() {
  world.camera.aspect = window.innerWidth / window.innerHeight;
  world.camera.updateProjectionMatrix();
  world.renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", windowResize, false);
world.renderer.shadowMap.enabled = true;
world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
world.renderer.physicallyCorrectLights = false;
world.renderer.toneMapping = THREE.ACESFilmicToneMapping;
world.renderer.toneMappingExposure = 1.8;
world.renderer.setSize(window.innerWidth, window.innerHeight);

world.camera.position.set(15, 15, 15);
world.camera.lookAt(0, 0, 0);

const controls = new OrbitControls(world.camera, world.renderer.domElement);
controls.update();

addAmbientLight();
addGround();
render();
