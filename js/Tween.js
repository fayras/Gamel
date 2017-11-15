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

  static easeOutExpo(t, b, _c, d) {
    if(t > d) {
      return Tween.DONE;
    }

    var c = _c - b;
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  }

  static easeOutCirc(t, b, _c, d) {
    if(t > d) {
      return Tween.DONE;
    }

    var c = _c - b;
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  }

  static get DONE() {
    return 'tweening_done';
  }
}

module.exports = Tween;
