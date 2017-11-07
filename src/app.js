const THREE = require('three');
const Controls = require('./Controls');
const Board = require('./Board');
const Planet = require('./Planet');

Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
};

const width = window.innerWidth;
const height = window.innerHeight;

// Erzeugt eine neue Szene. Zu dieser werden Objekte
// hinzugefügt, welche dann gerendert werden sollen.
let scene = new THREE.Scene();
// Eine neue Kamera, mit FOV = 75, und einer Reichweite bis 1000.
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 40;
// Erzeugt eine neue Instanz zum Kontrollieren der Kamera,
// so dass die Szene mit der Maus bewegt werden kann.
controls = new Controls(camera);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

// Erzeugt einen neuen WebGL Renderer, setzt die Größe auf
// die des Fensters und fügt ein Canvas in die Seite ein.
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const boardWidth = 20;
const boardHeight = 20;
const sphereRadius = 20;

let planet = new Planet(sphereRadius, boardWidth, boardHeight);
scene.add(planet);

let light1 = new THREE.AmbientLight(0x404040);
let light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
let light3 = new THREE.PointLight(0xffffff, 1, 0);

light1.castShadow = true;
light2.castShadow = true;
light3.castShadow = true;

light1.position.set(0, 200, 0);
light2.position.set(100, 200, 100);
light3.position.set(- 100, - 200, - 100);

scene.add(light1);
scene.add(light2);
scene.add(light3);

let board = new Board(boardHeight, boardWidth, planet.getPositions());
scene.add(board);

let timePerFrame = 1 / 60.0;
let currentTime = Date.now();

// Funktion, welche die Szene rendert. Wird immer
// wieder aufgerufen, idealerweise mit 60 FPS.
(function render() {
  requestAnimationFrame(render);

  let newTime = Date.now();
  let frameTime = newTime - currentTime;
  currentTime = newTime;

  while(frameTime > 0) {
    let dt = Math.min(frameTime, timePerFrame);
    frameTime -= dt;

    board.update(dt);
    controls.update();
  }
  renderer.render(scene, camera);
})();
