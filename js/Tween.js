class Tween {
  static easeOutBack(t, b, _c, d, s) {
    if(t > d) {
      return Tween.DONE;
    }

    var c = _c - b;
    if (s === void 0) {
      s = 1.70158;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  }

  static get DONE() {
    return 'tweening_done';
  }
}

module.exports = Tween;
