const THREE = require('three');
const dat = require('./dat.gui/dat.gui.js');
const Controls = require('./Controls');
const EffectComposer = require('./EffectComposer');
const RenderPass = require('./RenderPass');
const BloomPass = require('./BloomPass');
const Statistics = require('./Statistics');
const Planet = require('./Planet');
const Skybox = require('./Skybox');

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
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 6000);
camera.position.z = 40;
// Erzeugt eine neue Instanz zum Kontrollieren der Kamera,
// so dass die Szene mit der Maus bewegt werden kann.
let controls = new Controls(camera, renderer.domElement);
controls.rotateSpeed = 0.1;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.maxDistance = 1500;

const boardWidth = 20;
const boardHeight = 20;
const sphereRadius = 20;

let sky = new Skybox(5000);
scene.add(sky);

let planet = new Planet(sphereRadius, boardWidth, boardHeight);
scene.add(planet);

let light1 = new THREE.AmbientLight(0x222035);
let light2 = new THREE.HemisphereLight(0x80626e, 0x15162a, 0.5);
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
  exposure: 1.0,
  bloom: {
    enable: true,
  },
};

let gui = new dat.GUI({ resizable: false });
gui.add(statistics, 'fps').name('FPS').listen();
gui.add(planet, 'pause').name('Pause');
gui.add(planet, 'reset').name('Neu verteilen');
let lightSettings = gui.addFolder('Licht und Schatten');
lightSettings.add(light1, 'visible').name('Umgebungslicht');
lightSettings.add(light2, 'visible').name('Hemisphärenlicht');
lightSettings.add(light3, 'visible').name('Punktlichtquelle');
lightSettings.add(settings, 'exposure').name('Belichtung').min(0.5).max(1.5).onFinishChange((value) => {
  renderer.toneMappingExposure = value;
});
lightSettings.add(settings, 'shadowQuality').name('Schattenqualität').min(0).max(4).step(1).onFinishChange((value) => {
  if(value === 0) {
    light3.castShadow = false;
    return;
  }

  let size = Math.pow(2, value + 8);
  light3.castShadow = true;
  light3.shadow.mapSize.width = size;
  light3.shadow.mapSize.height = size;
  light3.shadow.map.dispose();
  light3.shadow.map = null;
});
let bloomSettings = gui.addFolder('Bloom')
bloomSettings.add(settings.bloom, 'enable').name('Aktiviert');
bloomSettings.add(bloomPass, 'threshold').name('Schwelle').min(0.1).max(1.0);
bloomSettings.add(bloomPass, 'strength').name('Stärke').min(0.0).max(3.0);
bloomSettings.add(bloomPass, 'radius').name('Radius').min(0.0).max(1.0);

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
  }
  if(settings.bloom.enable) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }

  controls.update();
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
