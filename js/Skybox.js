const THREE = require('three');

const textureLoader = new THREE.TextureLoader();

class Skybox extends THREE.Mesh {
  constructor(orbitSize = 5000) {
    super(
      new THREE.CubeGeometry(orbitSize, orbitSize, orbitSize)
    );

    let directions  = ['left', 'right', 'top', 'bottom', 'front', 'back'];
    let materialArray = directions.map((dir) => {
      return new THREE.MeshBasicMaterial({
        map: textureLoader.load(`images/skybox-${dir}.jpg`),
        side: THREE.BackSide
      });
    });

    this.material = materialArray;
    this.material.needsUpdate = true;
  }
}

module.exports = Skybox;
