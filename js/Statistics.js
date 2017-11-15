class Statistics {
  constructor() {
    this.time = 0;
    this.frames = 0;
    this.fps = 0;
  }

  update(elapsedTime) {
    this.time += elapsedTime;
    this.frames += 1;

    if(this.time >= 1000) {
      this.fps = this.frames;
      this.time -= 1000;
      this.frames = 0;
    }
  }
}

module.exports = Statistics;
