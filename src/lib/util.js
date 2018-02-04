export class Step {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
export class Util {
  static reqAnimF(fn) {
    const req = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
      return setTimeout(callback, 1000 / 60)
    }
    return req(fn);
  }
  static cancel(timerId) {
    const cancelFn = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;
    cancelFn(timerId);
  }
  static createStep(start, end) {
    return new Step(start, end);
  }
  static Tween = {
    linear(currentTime, beginVal, changeVal, duration) {
      return changeVal * currentTime / duration + beginVal;
    }
  }
  
}