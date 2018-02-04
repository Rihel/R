import R from "./lib/index";

// new R().animate(document.querySelector('.box'), {
//   width: 3000,
//   // opacity:0
//   height: 3000
// }, 5000)

const r = new R(document.querySelector('.box'),300);
// console.log(r);
r.width(123).delay(2000).base({
  width:300
}).go();