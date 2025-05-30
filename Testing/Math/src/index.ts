import "./core.css";
import App from "App";
import { GUI } from "dat.gui";
import { Color, PerspectiveCamera, Scene, WebGLRenderer,Plane } from "three";
import { TestNodes, TestRegister } from "Tests/TestRegister";
import "./Tests/RegisterAllTest";
document.body.append(App());

const gui = new GUI();
const canvas = document.getElementById("main-canvas")!;

const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new Color(0x1c1c1c));

// Camera setup
const mainCamera = new PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
mainCamera.position.z = 5;


function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
}
window.addEventListener("resize", onWindowResize, false);

const scene = new Scene();

const run = () => {
  renderer.render(scene, mainCamera);

  requestAnimationFrame(run);
};

run();

const testIds: string[] = [...TestRegister.tests.keys()];
const testsFolder = gui.addFolder("Tests");
const testNodes = new TestNodes(gui, scene, renderer, mainCamera);
const firstTest = "Axes";
const test = {
  _current: firstTest,
  get current() {
    return this._current;
  },
  set current(current: string) {
    this._current = current;
    TestRegister.run(current, testNodes);
  },
};
testsFolder.add(test, "current", testIds);
testsFolder.open();
TestRegister.run(firstTest, testNodes);
