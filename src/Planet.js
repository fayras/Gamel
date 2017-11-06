const THREE = require('three');

class Planet extends THREE.Mesh {
  constructor(radius, width, height) {
    super(
      new THREE.SphereGeometry(radius, width, height),
      new THREE.MeshPhongMaterial({
      	color: 0x156289,
      	emissive: 0x072534,
      	side: THREE.DoubleSide,
        flatShading: true
      })
    );
    this.radius = radius;
    this.width = width;
    this.height = height;
  }

  getPositions() {
    return this.geometry.faces.filter((item, index) => {
      if(index < this.width || index >= this.geometry.faces.length - this.width) {
        return true;
      }
      if(index % 2 === 0) {
        return true;
      }
      return false;
    }).map(item => {
      return item.normal.clone().multiplyScalar(this.radius + 1);
    });
  }
}

module.exports = Planet;
