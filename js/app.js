const THREE = require('three');
const dat = require('./dat.gui/dat.gui.js');
const Controls = require('./Controls');
const EffectComposer = require('./EffectComposer');
const RenderPass = require('./RenderPass');
const BloomPass = require('./BloomPass');
const Statistics = require('./Statistics');
const Planet = require('./Planet');

const width = window.innerWidth;
const height = window.innerHeight;

// Erzeugt einen neuen WebGL Renderer, setzt die Größe auf
// die des Fensters und fügt ein Canvas in die Seite ein.
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Erzeugt eine neue Szene. Zu dieser werden Objekte
// hinzugefügt, welche dann gerendert werden sollen.
let scene = new THREE.Scene();
// Eine neue Kamera, mit FOV = 75, und einer Reichweite bis 1000.
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 40;
// Erzeugt eine neue Instanz zum Kontrollieren der Kamera,
// so dass die Szene mit der Maus bewegt werden kann.
let controls = new Controls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

const boardWidth = 20;
const boardHeight = 20;
const sphereRadius = 20;

let planet = new Planet(sphereRadius, boardWidth, boardHeight);
scene.add(planet);

let light1 = new THREE.AmbientLight(0x404040);
let light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
let light3 = new THREE.PointLight(0xffffff, 0.75, 0);

light3.castShadow = true;

light1.position.set(0, 200, 0);
light2.position.set(100, 200, 100);
light3.position.set(100, 200, 100);

scene.add(light1);
scene.add(light2);
scene.add(light3);

let renderScene = new RenderPass(scene, camera);
// effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
// effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);
let bloomPass = new BloomPass(new THREE.Vector2(512, 512), 0.9, 0.4, 0.85); //1.0, 9, 0.5, 512);
bloomPass.renderToScreen = true;

let composer = new EffectComposer(renderer);
composer.setSize(width, height);
composer.addPass(renderScene);
composer.addPass(bloomPass);

let statistics = new Statistics();

let settings = {
  shadowQuality: 1,
  bloom: {
    enable: true,
  },
};

let gui = new dat.GUI({ width: 300, resizable: false });
gui.add(statistics, 'fps').name('FPS').listen();
gui.add(planet, 'pause').name('Pause');
gui.add(planet, 'reset').name('Neu verteilen');
let lightSettings = gui.addFolder('Lichtquellen');
lightSettings.add(light1, 'visible').name('Umgebungslicht');
lightSettings.add(light2, 'visible').name('Hemisphärenlicht');
lightSettings.add(light3, 'visible').name('Punktlichtquelle');
gui.add(settings, 'shadowQuality').name('Schattenqualität').min(1).max(4).step(1).onFinishChange((value) => {
  let size = Math.pow(2, value + 8);
  light3.shadow.mapSize.width = size;
  light3.shadow.mapSize.height = size;
  light3.shadow.map.dispose();
  light3.shadow.map = null;
});
gui.addFolder('Bloom')
  .add(settings.bloom, 'enable').name('Aktiviert');

let timePerFrame = 1 / 60.0;
let currentTime = Date.now();

// Funktion, welche die Szene rendert. Wird immer
// wieder aufgerufen, idealerweise mit 60 FPS.
(function render() {
  requestAnimationFrame(render);

  let newTime = Date.now();
  let frameTime = newTime - currentTime;
  currentTime = newTime;

  statistics.update(frameTime);
  while(frameTime > 0) {
    let dt = Math.min(frameTime, timePerFrame);
    frameTime -= dt;

    planet.update(dt);
    controls.update();
  }
  if(settings.bloom.enable) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
})();

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let dragging = false;

renderer.domElement.addEventListener("mousedown", () => { dragging = false; }, false);
renderer.domElement.addEventListener("mousemove", () => { dragging = true; }, false);
renderer.domElement.addEventListener("mouseup", (event) => {
  if(dragging === false) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObject(planet.sphere);

    if (intersects.length > 0) {
      planet.onClick(intersects[0].face);
    }
  }
}, false);
