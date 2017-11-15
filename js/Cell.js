const THREE = require('three');
const Tween = require('./Tween');

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
    if(this.nextState === Cell.DEAD) {
      let scale = Tween.easeOutCirc(this.time, 1, 0.01, 300);
      this.scale.x -= dt / 300;
      this.scale.y -= dt / 300;
      this.scale.z -= dt / 300;
      if(scale === Tween.DONE) {
        this.state = this.nextState;
        this.nextState = null;
        this.visible = false;
        this.time = 0;
      } else {
        this.scale.x = scale;
        this.scale.y = scale;
        this.scale.z = scale;
        this.time += dt;
      }
    } else if(this.nextState === Cell.ALIVE) {
      let scale = Tween.easeOutBack(this.time, 0, 1, 300);
      if(scale === Tween.DONE) {
        this.state = this.nextState;
        this.nextState = null;
        this.time = 0;
      } else {
        this.visible = true;
        this.scale.x = scale;
        this.scale.y = scale;
        this.scale.z = scale;
        this.time += dt;
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
