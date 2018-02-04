import {Step, Util} from "./util";
import Core from "./core";

export default class Animation {
  s = [];
  constructor(el, json, duration, callback) {
    // const values:Step[]=[];
    this.el = el;
    this.json = json;
    if (typeof duration === 'function') {
      this.callback = duration;
      this.duration = 300;
    } else {
      this.callback = callback;
      this.duration = duration;
    }
    this._init();
    this.start();
  }
  _init() {
    const json = this.json;
    const keys = Object.keys(json);
    const _me = this;
    for (const key in json) {
      const isOpacity = key === 'opacity';
      const values = [];
      let start = isOpacity
        ? parseFloat(this._getStyle(key))
        : parseInt(this._getStyle(key));
      let end = json[key];
      values.push(Util.createStep(start, end));
      this
        .s
        .push(new Core({
          duration: this.duration,
          value: values,
          render(...arg) {
            if (isOpacity) {
              _me.el.style[key] = arg[0];
            } else {
              _me.el.style[key] = arg[0] + 'px';
            }
          },
          onEnd() {
            _me.callback && _me.callback();
          }
        }))
    }

  }
  start() {
    this
      .s
      .forEach(c => {
        c.play();
      })
  }
  _getStyle(attr) {
    return getComputedStyle(this.el)[attr];
  }
}