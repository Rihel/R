import Animation from "./animation";
console.log(getComputedStyle(document.body))
export default class R {
  ans = [];
  el = null;
  constructor(el, duration = 500) {
    this.el = el;
    this.duration = duration;
  }

  width(val,time) {
    this.dequeue({
      width: val
    }, time);
    return this;
  }
  fadeTo(val, time) {
    this.dequeue({
      opacity: val
    }, time);
    return this;
  }
  dequeue(json, t) {
    const duration = t || this.duration;
    this
      .ans
      .push(() => {
        this.animate(json, duration)
      })
  }
  delay(num) {
    this
      .ans
      .push(num)
    return this;
  }
  base(json,t){
    this.dequeue(json,t);
    return this
  }
  animate(json, duration) {
    return new Promise((resolve, reject) => {
      this.base(this.el, json, duration, () => {
        resolve();
      })
    })
  }
  sleep(time=500){
    return new Promise((resolve, reject) => {
      setTimeout(function(){resolve()},time);
    })
    
  }
  async go() {
    for (let i = 0; i < this.ans.length; i++) {
      const a = this.ans[i];
      if(typeof a === 'number'){
        await sleep(a);
        continue;
      }
        await a();
      
    }
  }
  base(el, json, duration, callback) {
    return new Animation(el, json, duration, callback);
  }

}