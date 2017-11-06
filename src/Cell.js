const THREE = require('three');

class Cell extends THREE.Mesh {
  constructor(pos , state = Cell.ALIVE) {
    super(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    this.position.x = pos.x;
    this.position.y = pos.y;
    this.position.z = pos.z;
    this.state = state;
    this.visible = state;
    this.nextState = state;
  }

  isAlive() {
    return this.state === Cell.ALIVE;
  }

  kill() {
    this.nextState = Cell.DEAD;
    this.visible = false;
  }

  revive() {
    this.nextState = Cell.ALIVE;
    this.visible = true;
  }

  update() {
    this.state = this.nextState;
  }

  static get ALIVE() {
    return true;
  }

  static get DEAD() {
    return false;
  }
}

module.exports = Cell;
