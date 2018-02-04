import {Util, Step} from "./util";

// interface Tween{
// 	fn(currentTime:number,beginVal:number,changeVal:number,duration:number):numbe
// r; }

export default class Core {
  constructor({
    duration = 1000,
    render,
    value,
    timFn = 'linear',
    onEnd
  }) {
    this.duration = duration;
    this.values = value;
    this.timFn = timFn;
    this.render = render;
    this.onEnd = onEnd;
    this.render = render;
  }
  _loop() {
    const t = Date.now() - this.startTime;
    const d = this.duration;
    const timeFn = Util.Tween[this.timFn];

    if (t >= d || this.state === 'end') {
      this.end();
    } else {
      this._renderFn(t, d, timeFn);
      Util.reqAnimF(this._loop.bind(this));
    }

  }

  end() {
    this._renderEndState();
    this.onEnd && this.onEnd();
  }

  _renderEndState() {
    const t = Date.now() - this.startTime;
    const d = this.duration;
    const timeFn = Util.Tween[this.timFn];
    this._renderFn(d, d, timeFn);
    this.state = 'end';
  }

  _renderFn(time, duration, timingFn) {

    const values = this.values;
    const doneVal = values.map(value => {
      return timingFn(time, value.start, value.end - value.start, duration);
    })

    this.render(...doneVal);

  }
  _play() {
    this.startTime = Date.now();
    this.state = 'play';
    Util.reqAnimF(this._loop.bind(this));
  }
  play() {
    this._play();
  }
}