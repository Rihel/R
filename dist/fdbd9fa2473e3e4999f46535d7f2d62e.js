// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Step = /** @class */ (function () {
    function Step(start, end) {
        this.start = start;
        this.end = end;
    }
    return Step;
}());
exports.Step = Step;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.reqAnimF = function (fn) {
        var req = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                return setTimeout(callback, 1000 / 60);
            };
        return req(fn);
    };
    Util.cancel = function (timerId) {
        var cancelFn = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            clearTimeout;
        cancelFn(timerId);
    };
    Util.createStep = function (start, end) {
        return new Step(start, end);
    };
    Util.Tween = {
        linear: function (currentTime, beginVal, changeVal, duration) {
            return changeVal * currentTime / duration + beginVal;
        }
    };
    return Util;
}());
exports.Util = Util;

},{}],8:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
// interface Tween{
// 	fn(currentTime:number,beginVal:number,changeVal:number,duration:number):number;
// }
var Core = /** @class */ (function () {
    function Core(_a) {
        var _b = _a.duration, duration = _b === void 0 ? 1000 : _b, render = _a.render, value = _a.value, _c = _a.timFn, timFn = _c === void 0 ? 'linear' : _c, onEnd = _a.onEnd;
        this.startTime = 0;
        this.state = 'init';
        this.duration = duration;
        this.values = value;
        this.timFn = timFn;
        this.render = render;
        this.onEnd = onEnd;
    }
    Core.prototype._loop = function () {
        var t = Date.now() - this.startTime;
        var d = this.duration;
        var timeFn = util_1.Util.Tween[this.timFn];
        if (t >= d || this.state === 'end') {
            this.end();
        }
        else {
            this._renderFn(t, d, timeFn);
            util_1.Util.reqAnimF(this._loop.bind(this));
        }
    };
    Core.prototype.end = function () {
        this._renderEndState();
        this.onEnd && this.onEnd();
    };
    Core.prototype._renderEndState = function () {
        var t = Date.now() - this.startTime;
        var d = this.duration;
        var timeFn = util_1.Util.Tween[this.timFn];
        this._renderFn(d, d, timeFn);
        this.state = 'end';
    };
    Core.prototype._renderFn = function (time, duration, timingFn) {
        var values = this.values;
        var doneVal = values.map(function (value) {
            return timingFn(time, value.start, value.end - value.start, duration);
        });
        this.render.apply(this, doneVal);
    };
    Core.prototype._play = function () {
        this.startTime = Date.now();
        this.state = 'play';
        util_1.Util.reqAnimF(this._loop.bind(this));
    };
    Core.prototype.play = function () {
        this._play();
    };
    return Core;
}());
exports.default = Core;

},{"./util":7}],6:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var core_1 = require("./core");
var Animation = /** @class */ (function () {
    function Animation(el, json, duration, callback) {
        this.s = [];
        // const values:Step[]=[];
        this.el = el;
        this.json = json;
        if (typeof duration === 'function') {
            this.callback = duration;
            this.duration = 300;
        }
        else {
            this.callback = callback;
            this.duration = duration;
        }
        this._init();
        this.start();
    }
    Animation.prototype._init = function () {
        var json = this.json;
        var keys = Object.keys(json);
        var _me = this;
        var _loop_1 = function (key) {
            var isOpacity = key === 'opacity';
            var values = [];
            var start = isOpacity ? parseFloat(this_1._getStyle(key)) : parseInt(this_1._getStyle(key));
            var end = json[key];
            values.push(util_1.Util.createStep(start, end));
            this_1.s.push(new core_1.default({
                duration: this_1.duration,
                value: values,
                render: function () {
                    var arg = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        arg[_i] = arguments[_i];
                    }
                    if (isOpacity) {
                        _me.el.style[key] = arg[0];
                    }
                    else {
                        _me.el.style[key] = arg[0] + 'px';
                    }
                },
                onEnd: function () {
                    _me.callback && _me.callback();
                }
            }));
        };
        var this_1 = this;
        for (var key in json) {
            _loop_1(key);
        }
    };
    Animation.prototype.start = function () {
        this.s.forEach(function (c) {
            c.play();
        });
    };
    Animation.prototype._getStyle = function (attr) {
        return getComputedStyle(this.el)[attr];
    };
    return Animation;
}());
exports.default = Animation;

},{"./util":7,"./core":8}],4:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animation_1 = require("./animation");
var R = /** @class */ (function () {
    function R() {
    }
    R.animate = function (el, json, duration, callback) {
        return new animation_1.default(el, json, duration, callback);
    };
    return R;
}());
exports.default = R;

},{"./animation":6}],2:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./lib/index");
index_1.default.animate(document.querySelector('.box'), {
    width: 300,
});

},{"./lib/index":4}],9:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '56518' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[9,2])
//# sourceMappingURL=/dist/fdbd9fa2473e3e4999f46535d7f2d62e.map