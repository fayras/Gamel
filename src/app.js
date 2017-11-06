const THREE = require('three');
const Controls = require('./Controls');
const Board = require('./Board');

Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};

const width = window.innerWidth;
const height = window.innerHeight;

// Erzeugt eine neue Szene. Zu dieser werden Objekte
// hinzugefügt, welche dann gerendert werden sollen.
var scene = new THREE.Scene();
// Eine neue Kamera, mit FOV = 75, und einer Reichweite bis 1000.
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
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
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const boardWidth = 5;
const boardHeight = 5;
const sphereRadius = 20;
var geometry = new THREE.SphereGeometry(sphereRadius, boardWidth, boardHeight);
var material = new THREE.MeshPhongMaterial({
	color: 0x156289,
	emissive: 0x072534,
	side: THREE.DoubleSide,
  flatShading: true
});
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

let positions = [];
positions.push(geometry.faces[0].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[1].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[2].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[3].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[4].normal.multiplyScalar(sphereRadius + 1));
for(let i = 5; i < 35; i += 2) {
  positions.push(geometry.faces[i].normal.multiplyScalar(sphereRadius + 1));
}
positions.push(geometry.faces[35].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[36].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[37].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[38].normal.multiplyScalar(sphereRadius + 1));
positions.push(geometry.faces[39].normal.multiplyScalar(sphereRadius + 1));

let board = new Board(boardHeight, boardWidth, positions);
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
  }
  renderer.render(scene, camera);
  controls.update();
})();
