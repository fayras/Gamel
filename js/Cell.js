const THREE = require('three');

class Cell extends THREE.Mesh {
  constructor(pos , state = Cell.ALIVE) {
    super(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x000000 }));
    this.castShadow = true;
    this.receiveShadow = true;
    this.position.x = pos.x;
    this.position.y = pos.y;
    this.position.z = pos.z;
    this.state = Cell.DEAD;
    this.nextState = state;
    this.visible = false;
    this.time = 0;
    this.scale.x = 0.01;
    this.scale.y = 0.01;
    this.scale.z = 0.01;
  }

  isAlive() {
    return this.state === Cell.ALIVE;
  }

  kill() {
    this.nextState = Cell.DEAD;
    // this.visible = false;
  }

  revive() {
    this.nextState = Cell.ALIVE;
    // this.visible = true;
  }

  toggle() {
    if(this.isAlive()) {
      this.kill();
    } else {
      this.revive();
    }
    return this.nextState === Cell.ALIVE;
  }

  update(dt) {
    // this.state = this.nextState;
    if(this.isAlive() && this.nextState === Cell.DEAD) {
      this.scale.x -= dt / 300;
      this.scale.y -= dt / 300;
      this.scale.z -= dt / 300;
      if(this.scale.x < 0.1) {
        this.state = this.nextState;
        this.scale.x = 0.01;
        this.scale.y = 0.01;
        this.scale.z = 0.01;
        this.visible = false;
      }
    } else if(!this.isAlive() && this.nextState === Cell.ALIVE) {
      this.visible = true;
      this.scale.x += dt / 300;
      this.scale.y += dt / 300;
      this.scale.z += dt / 300;
      if(this.scale.x > 0.9) {
        this.state = this.nextState;
        this.scale.x = 1;
        this.scale.y = 1;
        this.scale.z = 1;
      }
    }
  }

  static get ALIVE() {
    return true;
  }

  static get DEAD() {
    return false;
  }
}

module.exports = Cell;
