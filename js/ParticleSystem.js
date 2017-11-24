const three = require('three');

class ParticleSystem extends three.Object3D {
  constructor() {
    this.time = 0;
    this.particles = [];
  }

  static get PARTICLE_COUNT() {
    return 100000;
  }

}

module.exports = ParticleSystem;
