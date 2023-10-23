/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(d, f, n) {
  d != Array.prototype && d != Object.prototype && (d[f] = n.value);
};
$jscomp.getGlobal = function(d) {
  return "undefined" != typeof window && window === d ? d : "undefined" != typeof global && null != global ? global : d;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(d, f, n, w) {
  if (f) {
    n = $jscomp.global;
    d = d.split(".");
    for (w = 0; w < d.length - 1; w++) {
      var g = d[w];
      g in n || (n[g] = {});
      n = n[g];
    }
    d = d[d.length - 1];
    w = n[d];
    f = f(w);
    f != w && null != f && $jscomp.defineProperty(n, d, {
      configurable: true,
      writable: true,
      value: f
    });
  }
};
$jscomp.polyfill("Math.imul", function(d) {
  return d ? d : function(f, d2) {
    f = Number(f);
    d2 = Number(d2);
    var n = f & 65535, g = d2 & 65535;
    return n * g + ((f >>> 16 & 65535) * g + n * (d2 >>> 16 & 65535) << 16 >>> 0) | 0;
  };
}, "es6", "es3");
$jscomp.polyfill("Math.clz32", function(d) {
  return d ? d : function(f) {
    f = Number(f) >>> 0;
    if (0 === f)
      return 32;
    var d2 = 0;
    0 === (f & 4294901760) && (f <<= 16, d2 += 16);
    0 === (f & 4278190080) && (f <<= 8, d2 += 8);
    0 === (f & 4026531840) && (f <<= 4, d2 += 4);
    0 === (f & 3221225472) && (f <<= 2, d2 += 2);
    0 === (f & 2147483648) && d2++;
    return d2;
  };
}, "es6", "es3");
$jscomp.polyfill("Math.trunc", function(d) {
  return d ? d : function(d2) {
    d2 = Number(d2);
    if (isNaN(d2) || Infinity === d2 || -Infinity === d2 || 0 === d2)
      return d2;
    var f = Math.floor(Math.abs(d2));
    return 0 > d2 ? -f : f;
  };
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(d) {
  return $jscomp.SYMBOL_PREFIX + (d || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var d = $jscomp.global.Symbol.iterator;
  d || (d = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[d] && $jscomp.defineProperty(Array.prototype, d, {
    configurable: true,
    writable: true,
    value: function() {
      return $jscomp.arrayIterator(this);
    }
  });
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(d) {
  var f = 0;
  return $jscomp.iteratorPrototype(function() {
    return f < d.length ? {
      done: false,
      value: d[f++]
    } : {
      done: true
    };
  });
};
$jscomp.iteratorPrototype = function(d) {
  $jscomp.initSymbolIterator();
  d = {
    next: d
  };
  d[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return d;
};
$jscomp.makeIterator = function(d) {
  $jscomp.initSymbolIterator();
  var f = d[Symbol.iterator];
  return f ? f.call(d) : $jscomp.arrayIterator(d);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill("Promise", function(d) {
  function f() {
    this.batch_ = null;
  }
  function n(d2) {
    return d2 instanceof g ? d2 : new g(function(f2, D) {
      f2(d2);
    });
  }
  if (d && !$jscomp.FORCE_POLYFILL_PROMISE)
    return d;
  f.prototype.asyncExecute = function(d2) {
    null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());
    this.batch_.push(d2);
    return this;
  };
  f.prototype.asyncExecuteBatch_ = function() {
    var d2 = this;
    this.asyncExecuteFunction(function() {
      d2.executeBatch_();
    });
  };
  var w = $jscomp.global.setTimeout;
  f.prototype.asyncExecuteFunction = function(d2) {
    w(
      d2,
      0
    );
  };
  f.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length; ) {
      var d2 = this.batch_;
      this.batch_ = [];
      for (var f2 = 0; f2 < d2.length; ++f2) {
        var g2 = d2[f2];
        delete d2[f2];
        try {
          g2();
        } catch (la) {
          this.asyncThrow_(la);
        }
      }
    }
    this.batch_ = null;
  };
  f.prototype.asyncThrow_ = function(d2) {
    this.asyncExecuteFunction(function() {
      throw d2;
    });
  };
  var g = function(d2) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    var f2 = this.createResolveAndReject_();
    try {
      d2(f2.resolve, f2.reject);
    } catch (u) {
      f2.reject(u);
    }
  };
  g.prototype.createResolveAndReject_ = function() {
    function d2(d3) {
      return function(D) {
        g2 || (g2 = true, d3.call(f2, D));
      };
    }
    var f2 = this, g2 = false;
    return {
      resolve: d2(this.resolveTo_),
      reject: d2(this.reject_)
    };
  };
  g.prototype.resolveTo_ = function(d2) {
    if (d2 === this)
      this.reject_(new TypeError("A Promise cannot resolve to itself"));
    else if (d2 instanceof g)
      this.settleSameAsPromise_(d2);
    else {
      a:
        switch (typeof d2) {
          case "object":
            var f2 = null != d2;
            break a;
          case "function":
            f2 = true;
            break a;
          default:
            f2 = false;
        }
      f2 ? this.resolveToNonPromiseObj_(d2) : this.fulfill_(d2);
    }
  };
  g.prototype.resolveToNonPromiseObj_ = function(d2) {
    var f2 = void 0;
    try {
      f2 = d2.then;
    } catch (u) {
      this.reject_(u);
      return;
    }
    "function" == typeof f2 ? this.settleSameAsThenable_(f2, d2) : this.fulfill_(d2);
  };
  g.prototype.reject_ = function(d2) {
    this.settle_(2, d2);
  };
  g.prototype.fulfill_ = function(d2) {
    this.settle_(1, d2);
  };
  g.prototype.settle_ = function(d2, f2) {
    if (0 != this.state_)
      throw Error("Cannot settle(" + d2 + ", " + f2 | "): Promise already settled in state" + this.state_);
    this.state_ = d2;
    this.result_ = f2;
    this.executeOnSettledCallbacks_();
  };
  g.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var d2 = this.onSettledCallbacks_, f2 = 0; f2 < d2.length; ++f2)
        d2[f2].call(), d2[f2] = null;
      this.onSettledCallbacks_ = null;
    }
  };
  var ma = new f();
  g.prototype.settleSameAsPromise_ = function(d2) {
    var f2 = this.createResolveAndReject_();
    d2.callWhenSettled_(f2.resolve, f2.reject);
  };
  g.prototype.settleSameAsThenable_ = function(d2, f2) {
    var g2 = this.createResolveAndReject_();
    try {
      d2.call(f2, g2.resolve, g2.reject);
    } catch (la) {
      g2.reject(la);
    }
  };
  g.prototype.then = function(d2, f2) {
    function u(d3, f3) {
      return "function" == typeof d3 ? function(f4) {
        try {
          n2(d3(f4));
        } catch (ea) {
          D(ea);
        }
      } : f3;
    }
    var n2, D, w2 = new g(function(d3, f3) {
      n2 = d3;
      D = f3;
    });
    this.callWhenSettled_(u(d2, n2), u(f2, D));
    return w2;
  };
  g.prototype.catch = function(d2) {
    return this.then(void 0, d2);
  };
  g.prototype.callWhenSettled_ = function(d2, f2) {
    function g2() {
      switch (n2.state_) {
        case 1:
          d2(n2.result_);
          break;
        case 2:
          f2(n2.result_);
          break;
        default:
          throw Error("Unexpected state: " + n2.state_);
      }
    }
    var n2 = this;
    null == this.onSettledCallbacks_ ? ma.asyncExecute(g2) : this.onSettledCallbacks_.push(function() {
      ma.asyncExecute(g2);
    });
  };
  g.resolve = n;
  g.reject = function(d2) {
    return new g(function(f2, g2) {
      g2(d2);
    });
  };
  g.race = function(d2) {
    return new g(function(f2, g2) {
      for (var u = $jscomp.makeIterator(d2), w2 = u.next(); !w2.done; w2 = u.next())
        n(w2.value).callWhenSettled_(f2, g2);
    });
  };
  g.all = function(d2) {
    var f2 = $jscomp.makeIterator(d2), u = f2.next();
    return u.done ? n([]) : new g(function(d3, g2) {
      function w2(f3) {
        return function(g3) {
          D[f3] = g3;
          Q--;
          0 == Q && d3(D);
        };
      }
      var D = [], Q = 0;
      do
        D.push(void 0), Q++, n(u.value).callWhenSettled_(w2(D.length - 1), g2), u = f2.next();
      while (!u.done);
    });
  };
  return g;
}, "es6", "es3");
var DracoDecoderModule = function(d) {
  function f(a2, b) {
    a2 || W("Assertion failed: " + b);
  }
  function n(e, b) {
    if (0 === b || !e)
      return "";
    for (var c = 0, l, d2 = 0; ; ) {
      l = T[e + d2 >> 0];
      c |= l;
      if (0 == l && !b)
        break;
      d2++;
      if (b && d2 == b)
        break;
    }
    b || (b = d2);
    l = "";
    if (128 > c) {
      for (; 0 < b; )
        c = String.fromCharCode.apply(String, T.subarray(e, e + Math.min(b, 1024))), l = l ? l + c : c, e += 1024, b -= 1024;
      return l;
    }
    return a.UTF8ToString(e);
  }
  function w(a2) {
    return a2.replace(/__Z[\w\d_]+/g, function(a3) {
      return a3 === a3 ? a3 : a3 + " [" + a3 + "]";
    });
  }
  function g() {
    a: {
      var e = Error();
      if (!e.stack) {
        try {
          throw Error(0);
        } catch (b) {
          e = b;
        }
        if (!e.stack) {
          e = "(no stack trace available)";
          break a;
        }
      }
      e = e.stack.toString();
    }
    a.extraStackTrace && (e += "\n" + a.extraStackTrace());
    return w(e);
  }
  function ma(a2, b) {
    0 < a2 % b && (a2 += b - a2 % b);
    return a2;
  }
  function D() {
    a.HEAP8 = fa = new Int8Array(F);
    a.HEAP16 = za = new Int16Array(F);
    a.HEAP32 = x = new Int32Array(F);
    a.HEAPU8 = T = new Uint8Array(F);
    a.HEAPU16 = Oa = new Uint16Array(F);
    a.HEAPU32 = Pa = new Uint32Array(F);
    a.HEAPF32 = Qa = new Float32Array(F);
    a.HEAPF64 = Ra = new Float64Array(F);
  }
  function Ma() {
    var e = a.usingWasm ? Aa : Sa, b = 2147483648 - e;
    if (x[ba >> 2] > b)
      return false;
    var c = y;
    for (y = Math.max(y, ib); y < x[ba >> 2]; )
      y = 536870912 >= y ? ma(2 * y, e) : Math.min(ma((3 * y + 2147483648) / 4, e), b);
    e = a.reallocBuffer(y);
    if (!e || e.byteLength != y)
      return y = c, false;
    a.buffer = F = e;
    D();
    return true;
  }
  function u(e) {
    for (; 0 < e.length; ) {
      var b = e.shift();
      if ("function" == typeof b)
        b();
      else {
        var c = b.func;
        "number" === typeof c ? void 0 === b.arg ? a.dynCall_v(c) : a.dynCall_vi(c, b.arg) : c(void 0 === b.arg ? null : b.arg);
      }
    }
  }
  function la(e) {
    ha++;
    a.monitorRunDependencies && a.monitorRunDependencies(ha);
  }
  function Na(e) {
    ha--;
    a.monitorRunDependencies && a.monitorRunDependencies(ha);
    0 == ha && (null !== Ba && (clearInterval(Ba), Ba = null), sa && (e = sa, sa = null, e()));
  }
  function na() {
    return !!na.uncaught_exception;
  }
  function qa() {
    var e = A.last;
    if (!e)
      return (m.setTempRet0(0), 0) | 0;
    var b = A.infos[e], c = b.type;
    if (!c)
      return (m.setTempRet0(0), e) | 0;
    var l = Array.prototype.slice.call(arguments);
    a.___cxa_is_pointer_type(c);
    qa.buffer || (qa.buffer = Ta(4));
    x[qa.buffer >> 2] = e;
    e = qa.buffer;
    for (var d2 = 0; d2 < l.length; d2++)
      if (l[d2] && a.___cxa_can_catch(l[d2], c, e))
        return e = x[e >> 2], b.adjusted = e, (m.setTempRet0(l[d2]), e) | 0;
    e = x[e >> 2];
    return (m.setTempRet0(c), e) | 0;
  }
  function Q(e, b) {
    v.varargs = b;
    try {
      var c = v.get(), l = v.get(), d2 = v.get();
      e = 0;
      Q.buffer || (Q.buffers = [
        null,
        [],
        []
      ], Q.printChar = function(b2, c2) {
        var e2 = Q.buffers[b2];
        f(e2);
        if (0 === c2 || 10 === c2) {
          b2 = 1 === b2 ? a.print : a.printErr;
          a: {
            for (var l2 = c2 = 0; e2[l2]; )
              ++l2;
            if (16 < l2 - c2 && e2.subarray && Ua)
              c2 = Ua.decode(e2.subarray(c2, l2));
            else
              for (l2 = ""; ; ) {
                var d3 = e2[c2++];
                if (!d3) {
                  c2 = l2;
                  break a;
                }
                if (d3 & 128) {
                  var g3 = e2[c2++] & 63;
                  if (192 == (d3 & 224))
                    l2 += String.fromCharCode((d3 & 31) << 6 | g3);
                  else {
                    var h3 = e2[c2++] & 63;
                    if (224 == (d3 & 240))
                      d3 = (d3 & 15) << 12 | g3 << 6 | h3;
                    else {
                      var E = e2[c2++] & 63;
                      if (240 == (d3 & 248))
                        d3 = (d3 & 7) << 18 | g3 << 12 | h3 << 6 | E;
                      else {
                        var k3 = e2[c2++] & 63;
                        if (248 == (d3 & 252))
                          d3 = (d3 & 3) << 24 | g3 << 18 | h3 << 12 | E << 6 | k3;
                        else {
                          var ta = e2[c2++] & 63;
                          d3 = (d3 & 1) << 30 | g3 << 24 | h3 << 18 | E << 12 | k3 << 6 | ta;
                        }
                      }
                    }
                    65536 > d3 ? l2 += String.fromCharCode(d3) : (d3 -= 65536, l2 += String.fromCharCode(55296 | d3 >> 10, 56320 | d3 & 1023));
                  }
                } else
                  l2 += String.fromCharCode(d3);
              }
          }
          b2(c2);
          e2.length = 0;
        } else
          e2.push(c2);
      });
      for (b = 0; b < d2; b++) {
        for (var h2 = x[l + 8 * b >> 2], g2 = x[l + (8 * b + 4) >> 2], k2 = 0; k2 < g2; k2++)
          Q.printChar(c, T[h2 + k2]);
        e += g2;
      }
      return e;
    } catch (Ca) {
      return "undefined" !== typeof FS && Ca instanceof FS.ErrnoError || W(Ca), -Ca.errno;
    }
  }
  function ra(e, b) {
    ra.seen || (ra.seen = {});
    e in ra.seen || (a.dynCall_v(b), ra.seen[e] = 1);
  }
  function ea(a2) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + a2 + ")";
    this.status = a2;
  }
  function Da(e) {
    function b() {
      if (!a.calledRun && (a.calledRun = true, !ua)) {
        Va || (Va = true, u(Wa));
        u(Xa);
        if (a.onRuntimeInitialized)
          a.onRuntimeInitialized();
        if (a.postRun)
          for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; )
            Ya.unshift(a.postRun.shift());
        u(Ya);
      }
    }
    null === Za && (Za = Date.now());
    if (!(0 < ha)) {
      if (a.preRun)
        for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; )
          $a.unshift(a.preRun.shift());
      u($a);
      0 < ha || a.calledRun || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          a.setStatus("");
        }, 1);
        b();
      }, 1)) : b());
    }
  }
  function W(e) {
    if (a.onAbort)
      a.onAbort(e);
    void 0 !== e ? (a.print(e), a.printErr(e), e = JSON.stringify(e)) : e = "";
    ua = true;
    var b = "abort(" + e + ") at " + g() + "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
    ab && ab.forEach(function(a2) {
      b = a2(b, e);
    });
    throw b;
  }
  function p() {
  }
  function t(a2) {
    return (a2 || p).__cache__;
  }
  function X(a2, b) {
    var c = t(b), e = c[a2];
    if (e)
      return e;
    e = Object.create((b || p).prototype);
    e.ptr = a2;
    return c[a2] = e;
  }
  function Y(a2) {
    if ("string" === typeof a2) {
      for (var b = 0, c = 0; c < a2.length; ++c) {
        var e = a2.charCodeAt(c);
        55296 <= e && 57343 >= e && (e = 65536 + ((e & 1023) << 10) | a2.charCodeAt(++c) & 1023);
        127 >= e ? ++b : b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : 2097151 >= e ? b + 4 : 67108863 >= e ? b + 5 : b + 6;
      }
      b = Array(b + 1);
      c = 0;
      e = b.length;
      if (0 < e) {
        e = c + e - 1;
        for (var d2 = 0; d2 < a2.length; ++d2) {
          var f2 = a2.charCodeAt(d2);
          55296 <= f2 && 57343 >= f2 && (f2 = 65536 + ((f2 & 1023) << 10) | a2.charCodeAt(++d2) & 1023);
          if (127 >= f2) {
            if (c >= e)
              break;
            b[c++] = f2;
          } else {
            if (2047 >= f2) {
              if (c + 1 >= e)
                break;
              b[c++] = 192 | f2 >> 6;
            } else {
              if (65535 >= f2) {
                if (c + 2 >= e)
                  break;
                b[c++] = 224 | f2 >> 12;
              } else {
                if (2097151 >= f2) {
                  if (c + 3 >= e)
                    break;
                  b[c++] = 240 | f2 >> 18;
                } else {
                  if (67108863 >= f2) {
                    if (c + 4 >= e)
                      break;
                    b[c++] = 248 | f2 >> 24;
                  } else {
                    if (c + 5 >= e)
                      break;
                    b[c++] = 252 | f2 >> 30;
                    b[c++] = 128 | f2 >> 24 & 63;
                  }
                  b[c++] = 128 | f2 >> 18 & 63;
                }
                b[c++] = 128 | f2 >> 12 & 63;
              }
              b[c++] = 128 | f2 >> 6 & 63;
            }
            b[c++] = 128 | f2 & 63;
          }
        }
        b[c] = 0;
      }
      a2 = k.alloc(b, fa);
      k.copy(b, fa, a2);
    }
    return a2;
  }
  function B() {
    throw "cannot construct a Status, no constructor in IDL";
  }
  function G() {
    this.ptr = lb();
    t(G)[this.ptr] = this;
  }
  function H() {
    this.ptr = mb();
    t(H)[this.ptr] = this;
  }
  function I() {
    this.ptr = nb();
    t(I)[this.ptr] = this;
  }
  function J() {
    this.ptr = ob();
    t(J)[this.ptr] = this;
  }
  function K() {
    this.ptr = pb();
    t(K)[this.ptr] = this;
  }
  function q() {
    this.ptr = qb();
    t(q)[this.ptr] = this;
  }
  function P() {
    this.ptr = rb();
    t(P)[this.ptr] = this;
  }
  function z() {
    this.ptr = sb();
    t(z)[this.ptr] = this;
  }
  function L() {
    this.ptr = tb();
    t(L)[this.ptr] = this;
  }
  function r() {
    this.ptr = ub();
    t(r)[this.ptr] = this;
  }
  function M() {
    this.ptr = vb();
    t(M)[this.ptr] = this;
  }
  function N() {
    this.ptr = wb();
    t(N)[this.ptr] = this;
  }
  function Z() {
    this.ptr = xb();
    t(Z)[this.ptr] = this;
  }
  function R() {
    this.ptr = yb();
    t(R)[this.ptr] = this;
  }
  function h() {
    this.ptr = zb();
    t(h)[this.ptr] = this;
  }
  function C() {
    this.ptr = Ab();
    t(C)[this.ptr] = this;
  }
  function ca() {
    throw "cannot construct a VoidPtr, no constructor in IDL";
  }
  function O() {
    this.ptr = Bb();
    t(O)[this.ptr] = this;
  }
  function S() {
    this.ptr = Cb();
    t(S)[this.ptr] = this;
  }
  var a = d = d || {}, bb = false, cb = false;
  a.onRuntimeInitialized = function() {
    bb = true;
    if (cb && "function" === typeof a.onModuleLoaded)
      a.onModuleLoaded(a);
  };
  a.onModuleParsed = function() {
    cb = true;
    if (bb && "function" === typeof a.onModuleLoaded)
      a.onModuleLoaded(a);
  };
  a.isVersionSupported = function(a2) {
    if ("string" !== typeof a2)
      return false;
    a2 = a2.split(".");
    return 2 > a2.length || 3 < a2.length ? false : 1 == a2[0] && 0 <= a2[1] && 3 >= a2[1] ? true : 0 != a2[0] || 10 < a2[1] ? false : true;
  };
  a || (a = ("undefined" !== typeof d ? d : null) || {});
  var va = {}, da;
  for (da in a)
    a.hasOwnProperty(da) && (va[da] = a[da]);
  var oa = false, ka = false, pa = false, wa = false;
  if (a.ENVIRONMENT)
    if ("WEB" === a.ENVIRONMENT)
      oa = true;
    else if ("WORKER" === a.ENVIRONMENT)
      ka = true;
    else if ("NODE" === a.ENVIRONMENT)
      pa = true;
    else if ("SHELL" === a.ENVIRONMENT)
      wa = true;
    else
      throw Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
  else
    oa = "object" === typeof window, ka = "function" === typeof importScripts, pa = "object" === typeof process && "function" === typeof require && !oa && !ka, wa = !oa && !pa && !ka;
  if (pa) {
    a.print || (a.print = console.log);
    a.printErr || (a.printErr = console.warn);
    var Ea, Fa;
    a.read = function(a2, b) {
      Ea || (Ea = require("fs"));
      Fa || (Fa = require("path"));
      a2 = Fa.normalize(a2);
      a2 = Ea.readFileSync(a2);
      return b ? a2 : a2.toString();
    };
    a.readBinary = function(e) {
      e = a.read(e, true);
      e.buffer || (e = new Uint8Array(e));
      f(e.buffer);
      return e;
    };
    a.thisProgram || (a.thisProgram = 1 < process.argv.length ? process.argv[1].replace(/\\/g, "/") : "unknown-program");
    a.arguments = process.argv.slice(2);
    process.on("uncaughtException", function(a2) {
      if (!(a2 instanceof ea))
        throw a2;
    });
    a.inspect = function() {
      return "[Emscripten Module object]";
    };
  } else if (wa)
    a.print || (a.print = print), "undefined" != typeof printErr && (a.printErr = printErr), a.read = "undefined" != typeof read ? function(a2) {
      return read(a2);
    } : function() {
      throw "no read() available";
    }, a.readBinary = function(a2) {
      if ("function" === typeof readbuffer)
        return new Uint8Array(readbuffer(a2));
      a2 = read(a2, "binary");
      f("object" === typeof a2);
      return a2;
    }, "undefined" != typeof scriptArgs ? a.arguments = scriptArgs : "undefined" != typeof arguments && (a.arguments = arguments), "function" === typeof quit && (a.quit = function(a2, b) {
      quit(a2);
    });
  else if (oa || ka)
    a.read = function(a2) {
      var b = new XMLHttpRequest();
      b.open("GET", a2, false);
      b.send(null);
      return b.responseText;
    }, ka && (a.readBinary = function(a2) {
      var b = new XMLHttpRequest();
      b.open("GET", a2, false);
      b.responseType = "arraybuffer";
      b.send(null);
      return new Uint8Array(b.response);
    }), a.readAsync = function(a2, b, c) {
      var e = new XMLHttpRequest();
      e.open("GET", a2, true);
      e.responseType = "arraybuffer";
      e.onload = function() {
        200 == e.status || 0 == e.status && e.response ? b(e.response) : c();
      };
      e.onerror = c;
      e.send(null);
    }, "undefined" != typeof arguments && (a.arguments = arguments), "undefined" !== typeof console ? (a.print || (a.print = function(a2) {
      console.log(a2);
    }), a.printErr || (a.printErr = function(a2) {
      console.warn(a2);
    })) : a.print || (a.print = function(a2) {
    }), "undefined" === typeof a.setWindowTitle && (a.setWindowTitle = function(a2) {
      document.title = a2;
    });
  else
    throw Error("Unknown runtime environment. Where are we?");
  a.print || (a.print = function() {
  });
  a.printErr || (a.printErr = a.print);
  a.arguments || (a.arguments = []);
  a.thisProgram || (a.thisProgram = "./this.program");
  a.quit || (a.quit = function(a2, b) {
    throw b;
  });
  a.print = a.print;
  a.printErr = a.printErr;
  a.preRun = [];
  a.postRun = [];
  for (da in va)
    va.hasOwnProperty(da) && (a[da] = va[da]);
  va = void 0;
  var m = {
    setTempRet0: function(a2) {
      return tempRet0 = a2;
    },
    getTempRet0: function() {
      return tempRet0;
    },
    stackSave: function() {
      return U;
    },
    stackRestore: function(a2) {
      U = a2;
    },
    getNativeTypeSize: function(a2) {
      switch (a2) {
        case "i1":
        case "i8":
          return 1;
        case "i16":
          return 2;
        case "i32":
          return 4;
        case "i64":
          return 8;
        case "float":
          return 4;
        case "double":
          return 8;
        default:
          return "*" === a2[a2.length - 1] ? m.QUANTUM_SIZE : "i" === a2[0] ? (a2 = parseInt(a2.substr(1)), f(0 === a2 % 8), a2 / 8) : 0;
      }
    },
    getNativeFieldSize: function(a2) {
      return Math.max(m.getNativeTypeSize(a2), m.QUANTUM_SIZE);
    },
    STACK_ALIGN: 16,
    prepVararg: function(a2, b) {
      "double" === b || "i64" === b ? a2 & 7 && (f(4 === (a2 & 7)), a2 += 4) : f(0 === (a2 & 3));
      return a2;
    },
    getAlignSize: function(a2, b, c) {
      return c || "i64" != a2 && "double" != a2 ? a2 ? Math.min(b || (a2 ? m.getNativeFieldSize(a2) : 0), m.QUANTUM_SIZE) : Math.min(b, 8) : 8;
    },
    dynCall: function(e, b, c) {
      return c && c.length ? a["dynCall_" + e].apply(null, [b].concat(c)) : a["dynCall_" + e].call(null, b);
    },
    functionPointers: [],
    addFunction: function(a2) {
      for (var b = 0; b < m.functionPointers.length; b++)
        if (!m.functionPointers[b])
          return m.functionPointers[b] = a2, 2 * (1 + b);
      throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
    },
    removeFunction: function(a2) {
      m.functionPointers[(a2 - 2) / 2] = null;
    },
    warnOnce: function(e) {
      m.warnOnce.shown || (m.warnOnce.shown = {});
      m.warnOnce.shown[e] || (m.warnOnce.shown[e] = 1, a.printErr(e));
    },
    funcWrappers: {},
    getFuncWrapper: function(a2, b) {
      if (a2) {
        f(b);
        m.funcWrappers[b] || (m.funcWrappers[b] = {});
        var c = m.funcWrappers[b];
        c[a2] || (c[a2] = 1 === b.length ? function() {
          return m.dynCall(b, a2);
        } : 2 === b.length ? function(c2) {
          return m.dynCall(b, a2, [c2]);
        } : function() {
          return m.dynCall(b, a2, Array.prototype.slice.call(arguments));
        });
        return c[a2];
      }
    },
    getCompilerSetting: function(a2) {
      throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
    },
    stackAlloc: function(a2) {
      var b = U;
      U = U + a2 | 0;
      U = U + 15 & -16;
      return b;
    },
    staticAlloc: function(a2) {
      var b = aa;
      aa = aa + a2 | 0;
      aa = aa + 15 & -16;
      return b;
    },
    dynamicAlloc: function(a2) {
      var b = x[ba >> 2];
      a2 = (b + a2 + 15 | 0) & -16;
      x[ba >> 2] = a2;
      return a2 >= y && !Ma() ? (x[ba >> 2] = b, 0) : b;
    },
    alignMemory: function(a2, b) {
      return Math.ceil(a2 / (b ? b : 16)) * (b ? b : 16);
    },
    makeBigInt: function(a2, b, c) {
      return c ? +(a2 >>> 0) + 4294967296 * +(b >>> 0) : +(a2 >>> 0) + 4294967296 * +(b | 0);
    },
    GLOBAL_BASE: 1024,
    QUANTUM_SIZE: 4,
    __dummy__: 0
  }, ua = 0, Ua = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
  "undefined" !== typeof TextDecoder && new TextDecoder("utf-16le");
  var Aa = 65536, Sa = 16777216, ib = 16777216, fa, T, za, Oa, x, Pa, Qa, Ra, aa, Ga, U, xa, Ha, ba;
  var Ia = aa = Ga = U = xa = Ha = ba = 0;
  a.reallocBuffer || (a.reallocBuffer = function(a2) {
    try {
      if (ArrayBuffer.transfer)
        var b = ArrayBuffer.transfer(F, a2);
      else {
        var c = fa;
        b = new ArrayBuffer(a2);
        new Int8Array(b).set(c);
      }
    } catch (l) {
      return false;
    }
    return Db(b) ? b : false;
  });
  try {
    var Ja = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
    Ja(new ArrayBuffer(4));
  } catch (e) {
    Ja = function(a2) {
      return a2.byteLength;
    };
  }
  var Ka = a.TOTAL_STACK || 5242880, y = a.TOTAL_MEMORY || 16777216;
  y < Ka && a.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + y + "! (TOTAL_STACK=" + Ka + ")");
  if (a.buffer)
    var F = a.buffer;
  else
    "object" === typeof WebAssembly && "function" === typeof WebAssembly.Memory ? (a.wasmMemory = new WebAssembly.Memory({
      initial: y / Aa
    }), F = a.wasmMemory.buffer) : F = new ArrayBuffer(y);
  D();
  x[0] = 1668509029;
  za[1] = 25459;
  if (115 !== T[2] || 99 !== T[3])
    throw "Runtime error: expected the system to be little-endian!";
  a.HEAP = void 0;
  a.buffer = F;
  a.HEAP8 = fa;
  a.HEAP16 = za;
  a.HEAP32 = x;
  a.HEAPU8 = T;
  a.HEAPU16 = Oa;
  a.HEAPU32 = Pa;
  a.HEAPF32 = Qa;
  a.HEAPF64 = Ra;
  var $a = [], Wa = [], Xa = [], db = [], Ya = [], Va = false;
  f(Math.imul && Math.fround && Math.clz32 && Math.trunc, "this is a legacy browser, build with LEGACY_VM_SUPPORT");
  var ha = 0, Ba = null, sa = null;
  a.preloadedImages = {};
  a.preloadedAudios = {};
  var V = null;
  (function() {
    function e() {
      try {
        if (a.wasmBinary)
          return new Uint8Array(a.wasmBinary);
        if (a.readBinary)
          return a.readBinary(d2);
        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
      } catch (jb) {
        W(jb);
      }
    }
    function b() {
      return a.wasmBinary || !oa && !ka || "function" !== typeof fetch ? new Promise(function(a2, b2) {
        a2(e());
      }) : fetch(d2, {
        credentials: "same-origin"
      }).then(function(a2) {
        if (!a2.ok)
          throw "failed to load wasm binary file at '" + d2 + "'";
        return a2.arrayBuffer();
      }).catch(function() {
        return e();
      });
    }
    function c(c2, e2, l) {
      function f3(b2, c3) {
        h2 = b2.exports;
        if (h2.memory) {
          b2 = h2.memory;
          c3 = a.buffer;
          b2.byteLength < c3.byteLength && a.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
          c3 = new Int8Array(c3);
          var e3 = new Int8Array(b2);
          V || c3.set(e3.subarray(a.STATIC_BASE, a.STATIC_BASE + a.STATIC_BUMP), a.STATIC_BASE);
          e3.set(c3);
          a.buffer = F = b2;
          D();
        }
        a.asm = h2;
        a.usingWasm = true;
        Na("wasm-instantiate");
      }
      function E(a2) {
        f3(a2.instance, a2.module);
      }
      function k3(c3) {
        b().then(function(a2) {
          return WebAssembly.instantiate(a2, g2);
        }).then(c3).catch(function(b2) {
          a.printErr("failed to asynchronously prepare wasm: " + b2);
          W(b2);
        });
      }
      if ("object" !== typeof WebAssembly)
        return a.printErr("no native wasm support detected"), false;
      if (!(a.wasmMemory instanceof WebAssembly.Memory))
        return a.printErr("no native wasm Memory in use"), false;
      e2.memory = a.wasmMemory;
      g2.global = {
        NaN: NaN,
        Infinity: Infinity
      };
      g2["global.Math"] = c2.Math;
      g2.env = e2;
      la("wasm-instantiate");
      if (a.instantiateWasm)
        try {
          return a.instantiateWasm(g2, f3);
        } catch (kb) {
          return a.printErr("Module.instantiateWasm callback failed with error: " + kb), false;
        }
      a.wasmBinary || "function" !== typeof WebAssembly.instantiateStreaming || 0 === d2.indexOf("data:") || "function" !== typeof fetch ? k3(E) : WebAssembly.instantiateStreaming(
        fetch(d2, {
          credentials: "same-origin"
        }),
        g2
      ).then(E).catch(function(b2) {
        a.printErr("wasm streaming compile failed: " + b2);
        a.printErr("falling back to ArrayBuffer instantiation");
        k3(E);
      });
      return {};
    }
    var d2 = "draco_decoder.wasm", f2 = "draco_decoder.temp.asm.js";
    "function" === typeof a.locateFile && (a.locateFile("draco_decoder.wast"), d2 = a.locateFile(d2), f2 = a.locateFile(f2));
    var g2 = {
      global: null,
      env: null,
      asm2wasm: {
        "f64-rem": function(a2, b2) {
          return a2 % b2;
        },
        "debugger": function() {
          debugger;
        }
      },
      parent: a
    }, h2 = null;
    a.asmPreload = a.asm;
    var k2 = a.reallocBuffer;
    a.reallocBuffer = function(b2) {
      if ("asmjs" === m2)
        var c2 = k2(b2);
      else
        a: {
          b2 = ma(b2, a.usingWasm ? Aa : Sa);
          var e2 = a.buffer.byteLength;
          if (a.usingWasm)
            try {
              c2 = -1 !== a.wasmMemory.grow((b2 - e2) / 65536) ? a.buffer = a.wasmMemory.buffer : null;
              break a;
            } catch (Jd) {
              c2 = null;
              break a;
            }
          c2 = void 0;
        }
      return c2;
    };
    var m2 = "";
    a.asm = function(b2, e2, d3) {
      if (!e2.table) {
        var l = a.wasmTableSize;
        void 0 === l && (l = 1024);
        var f3 = a.wasmMaxTableSize;
        e2.table = "object" === typeof WebAssembly && "function" === typeof WebAssembly.Table ? void 0 !== f3 ? new WebAssembly.Table({
          initial: l,
          maximum: f3,
          element: "anyfunc"
        }) : new WebAssembly.Table({
          initial: l,
          element: "anyfunc"
        }) : Array(l);
        a.wasmTable = e2.table;
      }
      e2.memoryBase || (e2.memoryBase = a.STATIC_BASE);
      e2.tableBase || (e2.tableBase = 0);
      (b2 = c(b2, e2, d3)) || W("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
      return b2;
    };
  })();
  Ia = m.GLOBAL_BASE;
  aa = Ia + 19104;
  Wa.push();
  V = null;
  a.STATIC_BASE = Ia;
  a.STATIC_BUMP = 19104;
  var Eb = aa;
  aa += 16;
  var A = {
    last: 0,
    caught: [],
    infos: {},
    deAdjust: function(a2) {
      if (!a2 || A.infos[a2])
        return a2;
      for (var b in A.infos)
        if (A.infos[b].adjusted === a2)
          return b;
      return a2;
    },
    addRef: function(a2) {
      a2 && A.infos[a2].refcount++;
    },
    decRef: function(e) {
      if (e) {
        var b = A.infos[e];
        f(0 < b.refcount);
        b.refcount--;
        0 !== b.refcount || b.rethrown || (b.destructor && a.dynCall_vi(b.destructor, e), delete A.infos[e], ___cxa_free_exception(e));
      }
    },
    clearRef: function(a2) {
      a2 && (A.infos[a2].refcount = 0);
    }
  }, v = {
    varargs: 0,
    get: function(a2) {
      v.varargs += 4;
      return x[v.varargs - 4 >> 2];
    },
    getStr: function() {
      return n(v.get());
    },
    get64: function() {
      var a2 = v.get(), b = v.get();
      0 <= a2 ? f(0 === b) : f(-1 === b);
      return a2;
    },
    getZero: function() {
      f(0 === v.get());
    }
  }, ya = {}, La = 1;
  db.push(function() {
    var e = a._fflush;
    e && e(0);
    if (e = Q.printChar) {
      var b = Q.buffers;
      b[1].length && e(1, 10);
      b[2].length && e(2, 10);
    }
  });
  ba = m.staticAlloc(4);
  Ga = U = m.alignMemory(aa);
  xa = Ga + Ka;
  Ha = m.alignMemory(xa);
  x[ba >> 2] = Ha;
  a.wasmTableSize = 492;
  a.wasmMaxTableSize = 492;
  a.asmGlobalArg = {
    Math,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    NaN: NaN,
    Infinity: Infinity,
    byteLength: Ja
  };
  a.asmLibraryArg = {
    abort: W,
    assert: f,
    enlargeMemory: Ma,
    getTotalMemory: function() {
      return y;
    },
    abortOnCannotGrowMemory: function() {
      W("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + y + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
    },
    invoke_ii: function(e, b) {
      try {
        return a.dynCall_ii(e, b);
      } catch (c) {
        if ("number" !== typeof c && "longjmp" !== c)
          throw c;
        a.setThrew(1, 0);
      }
    },
    invoke_iii: function(e, b, c) {
      try {
        return a.dynCall_iii(e, b, c);
      } catch (l) {
        if ("number" !== typeof l && "longjmp" !== l)
          throw l;
        a.setThrew(1, 0);
      }
    },
    invoke_iiii: function(e, b, c, d2) {
      try {
        return a.dynCall_iiii(e, b, c, d2);
      } catch (E) {
        if ("number" !== typeof E && "longjmp" !== E)
          throw E;
        a.setThrew(1, 0);
      }
    },
    invoke_iiiiiii: function(e, b, c, d2, f2, g2, h2) {
      try {
        return a.dynCall_iiiiiii(e, b, c, d2, f2, g2, h2);
      } catch (ja) {
        if ("number" !== typeof ja && "longjmp" !== ja)
          throw ja;
        a.setThrew(1, 0);
      }
    },
    invoke_v: function(e) {
      try {
        a.dynCall_v(e);
      } catch (b) {
        if ("number" !== typeof b && "longjmp" !== b)
          throw b;
        a.setThrew(1, 0);
      }
    },
    invoke_vi: function(e, b) {
      try {
        a.dynCall_vi(e, b);
      } catch (c) {
        if ("number" !== typeof c && "longjmp" !== c)
          throw c;
        a.setThrew(1, 0);
      }
    },
    invoke_vii: function(e, b, c) {
      try {
        a.dynCall_vii(e, b, c);
      } catch (l) {
        if ("number" !== typeof l && "longjmp" !== l)
          throw l;
        a.setThrew(1, 0);
      }
    },
    invoke_viii: function(e, b, c, d2) {
      try {
        a.dynCall_viii(e, b, c, d2);
      } catch (E) {
        if ("number" !== typeof E && "longjmp" !== E)
          throw E;
        a.setThrew(1, 0);
      }
    },
    invoke_viiii: function(e, b, c, d2, f2) {
      try {
        a.dynCall_viiii(e, b, c, d2, f2);
      } catch (ta) {
        if ("number" !== typeof ta && "longjmp" !== ta)
          throw ta;
        a.setThrew(1, 0);
      }
    },
    invoke_viiiii: function(e, b, c, d2, f2, g2) {
      try {
        a.dynCall_viiiii(e, b, c, d2, f2, g2);
      } catch (ia) {
        if ("number" !== typeof ia && "longjmp" !== ia)
          throw ia;
        a.setThrew(1, 0);
      }
    },
    invoke_viiiiii: function(e, b, c, d2, f2, g2, h2) {
      try {
        a.dynCall_viiiiii(e, b, c, d2, f2, g2, h2);
      } catch (ja) {
        if ("number" !== typeof ja && "longjmp" !== ja)
          throw ja;
        a.setThrew(1, 0);
      }
    },
    __ZSt18uncaught_exceptionv: na,
    ___cxa_allocate_exception: function(a2) {
      return Ta(a2);
    },
    ___cxa_begin_catch: function(a2) {
      var b = A.infos[a2];
      b && !b.caught && (b.caught = true, na.uncaught_exception--);
      b && (b.rethrown = false);
      A.caught.push(a2);
      A.addRef(A.deAdjust(a2));
      return a2;
    },
    ___cxa_find_matching_catch: qa,
    ___cxa_pure_virtual: function() {
      ua = true;
      throw "Pure virtual function called!";
    },
    ___cxa_throw: function(a2, b, c) {
      A.infos[a2] = {
        ptr: a2,
        adjusted: a2,
        type: b,
        destructor: c,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      A.last = a2;
      "uncaught_exception" in na ? na.uncaught_exception++ : na.uncaught_exception = 1;
      throw a2 + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    },
    ___gxx_personality_v0: function() {
    },
    ___resumeException: function(a2) {
      A.last || (A.last = a2);
      throw a2 + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    },
    ___setErrNo: function(e) {
      a.___errno_location && (x[a.___errno_location() >> 2] = e);
      return e;
    },
    ___syscall140: function(a2, b) {
      v.varargs = b;
      try {
        var c = v.getStreamFromFD();
        v.get();
        var e = v.get(), d2 = v.get(), f2 = v.get();
        FS.llseek(c, e, f2);
        x[d2 >> 2] = c.position;
        c.getdents && 0 === e && 0 === f2 && (c.getdents = null);
        return 0;
      } catch (ia) {
        return "undefined" !== typeof FS && ia instanceof FS.ErrnoError || W(ia), -ia.errno;
      }
    },
    ___syscall146: Q,
    ___syscall54: function(a2, b) {
      v.varargs = b;
      return 0;
    },
    ___syscall6: function(a2, b) {
      v.varargs = b;
      try {
        var c = v.getStreamFromFD();
        FS.close(c);
        return 0;
      } catch (l) {
        return "undefined" !== typeof FS && l instanceof FS.ErrnoError || W(l), -l.errno;
      }
    },
    _abort: function() {
      a.abort();
    },
    _emscripten_memcpy_big: function(a2, b, c) {
      T.set(T.subarray(b, b + c), a2);
      return a2;
    },
    _pthread_getspecific: function(a2) {
      return ya[a2] || 0;
    },
    _pthread_key_create: function(a2, b) {
      if (0 == a2)
        return 22;
      x[a2 >> 2] = La;
      ya[La] = 0;
      La++;
      return 0;
    },
    _pthread_once: ra,
    _pthread_setspecific: function(a2, b) {
      if (!(a2 in ya))
        return 22;
      ya[a2] = b;
      return 0;
    },
    DYNAMICTOP_PTR: ba,
    tempDoublePtr: Eb,
    ABORT: ua,
    STACKTOP: U,
    STACK_MAX: xa
  };
  var eb = a.asm(a.asmGlobalArg, a.asmLibraryArg, F);
  a.asm = eb;
  a.___cxa_can_catch = function() {
    return a.asm.___cxa_can_catch.apply(
      null,
      arguments
    );
  };
  a.___cxa_is_pointer_type = function() {
    return a.asm.___cxa_is_pointer_type.apply(null, arguments);
  };
  var pb = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
    return a.asm._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0.apply(null, arguments);
  }, Fb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
    return a.asm._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1.apply(null, arguments);
  }, Gb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
    return a.asm._emscripten_bind_AttributeOctahedronTransform___destroy___0.apply(null, arguments);
  }, Hb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
    return a.asm._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0.apply(null, arguments);
  }, sb = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0.apply(
      null,
      arguments
    );
  }, Ib = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1.apply(null, arguments);
  }, Jb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform___destroy___0.apply(null, arguments);
  }, Kb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform_min_value_1.apply(
      null,
      arguments
    );
  }, Lb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0.apply(null, arguments);
  }, Mb = a._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
    return a.asm._emscripten_bind_AttributeQuantizationTransform_range_0.apply(null, arguments);
  }, rb = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
    return a.asm._emscripten_bind_AttributeTransformData_AttributeTransformData_0.apply(
      null,
      arguments
    );
  }, Nb = a._emscripten_bind_AttributeTransformData___destroy___0 = function() {
    return a.asm._emscripten_bind_AttributeTransformData___destroy___0.apply(null, arguments);
  }, Ob = a._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
    return a.asm._emscripten_bind_AttributeTransformData_transform_type_0.apply(null, arguments);
  }, yb = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
    return a.asm._emscripten_bind_DecoderBuffer_DecoderBuffer_0.apply(null, arguments);
  }, Pb = a._emscripten_bind_DecoderBuffer_Init_2 = function() {
    return a.asm._emscripten_bind_DecoderBuffer_Init_2.apply(null, arguments);
  }, Qb = a._emscripten_bind_DecoderBuffer___destroy___0 = function() {
    return a.asm._emscripten_bind_DecoderBuffer___destroy___0.apply(null, arguments);
  }, Rb = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
    return a.asm._emscripten_bind_Decoder_DecodeBufferToMesh_2.apply(null, arguments);
  }, Sb = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
    return a.asm._emscripten_bind_Decoder_DecodeBufferToPointCloud_2.apply(
      null,
      arguments
    );
  }, zb = a._emscripten_bind_Decoder_Decoder_0 = function() {
    return a.asm._emscripten_bind_Decoder_Decoder_0.apply(null, arguments);
  }, Tb = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeByUniqueId_2.apply(null, arguments);
  }, Ub = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3.apply(null, arguments);
  }, Vb = a._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeFloat_3.apply(null, arguments);
  }, Wb = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3.apply(null, arguments);
  }, Xb = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeIdByName_2.apply(null, arguments);
  }, Yb = a._emscripten_bind_Decoder_GetAttributeId_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeId_2.apply(
      null,
      arguments
    );
  }, Zb = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3.apply(null, arguments);
  }, $b = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3.apply(null, arguments);
  }, ac = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3.apply(null, arguments);
  }, bc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3.apply(null, arguments);
  }, cc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeMetadata_2.apply(null, arguments);
  }, dc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3.apply(null, arguments);
  }, ec = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3.apply(null, arguments);
  }, fc = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3.apply(null, arguments);
  }, gc = a._emscripten_bind_Decoder_GetAttribute_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetAttribute_2.apply(null, arguments);
  }, hc = a._emscripten_bind_Decoder_GetEncodedGeometryType_1 = function() {
    return a.asm._emscripten_bind_Decoder_GetEncodedGeometryType_1.apply(
      null,
      arguments
    );
  }, ic = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
    return a.asm._emscripten_bind_Decoder_GetFaceFromMesh_3.apply(null, arguments);
  }, jc = a._emscripten_bind_Decoder_GetMetadata_1 = function() {
    return a.asm._emscripten_bind_Decoder_GetMetadata_1.apply(null, arguments);
  }, kc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
    return a.asm._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2.apply(null, arguments);
  }, lc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
    return a.asm._emscripten_bind_Decoder_SkipAttributeTransform_1.apply(
      null,
      arguments
    );
  }, mc = a._emscripten_bind_Decoder___destroy___0 = function() {
    return a.asm._emscripten_bind_Decoder___destroy___0.apply(null, arguments);
  }, wb = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
    return a.asm._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0.apply(null, arguments);
  }, nc = a._emscripten_bind_DracoFloat32Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoFloat32Array_GetValue_1.apply(null, arguments);
  }, oc = a._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoFloat32Array___destroy___0.apply(null, arguments);
  }, pc = a._emscripten_bind_DracoFloat32Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoFloat32Array_size_0.apply(null, arguments);
  }, vb = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
    return a.asm._emscripten_bind_DracoInt16Array_DracoInt16Array_0.apply(null, arguments);
  }, qc = a._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoInt16Array_GetValue_1.apply(
      null,
      arguments
    );
  }, rc = a._emscripten_bind_DracoInt16Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoInt16Array___destroy___0.apply(null, arguments);
  }, sc = a._emscripten_bind_DracoInt16Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoInt16Array_size_0.apply(null, arguments);
  }, Bb = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
    return a.asm._emscripten_bind_DracoInt32Array_DracoInt32Array_0.apply(null, arguments);
  }, tc = a._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoInt32Array_GetValue_1.apply(
      null,
      arguments
    );
  }, uc = a._emscripten_bind_DracoInt32Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoInt32Array___destroy___0.apply(null, arguments);
  }, vc = a._emscripten_bind_DracoInt32Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoInt32Array_size_0.apply(null, arguments);
  }, tb = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
    return a.asm._emscripten_bind_DracoInt8Array_DracoInt8Array_0.apply(null, arguments);
  }, wc = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoInt8Array_GetValue_1.apply(
      null,
      arguments
    );
  }, xc = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoInt8Array___destroy___0.apply(null, arguments);
  }, yc = a._emscripten_bind_DracoInt8Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoInt8Array_size_0.apply(null, arguments);
  }, lb = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
    return a.asm._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0.apply(null, arguments);
  }, zc = a._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoUInt16Array_GetValue_1.apply(
      null,
      arguments
    );
  }, Ac = a._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoUInt16Array___destroy___0.apply(null, arguments);
  }, Bc = a._emscripten_bind_DracoUInt16Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoUInt16Array_size_0.apply(null, arguments);
  }, ob = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
    return a.asm._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0.apply(null, arguments);
  }, Cc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoUInt32Array_GetValue_1.apply(null, arguments);
  }, Dc = a._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoUInt32Array___destroy___0.apply(null, arguments);
  }, Ec = a._emscripten_bind_DracoUInt32Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoUInt32Array_size_0.apply(null, arguments);
  }, nb = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
    return a.asm._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0.apply(
      null,
      arguments
    );
  }, Fc = a._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
    return a.asm._emscripten_bind_DracoUInt8Array_GetValue_1.apply(null, arguments);
  }, Gc = a._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
    return a.asm._emscripten_bind_DracoUInt8Array___destroy___0.apply(null, arguments);
  }, Hc = a._emscripten_bind_DracoUInt8Array_size_0 = function() {
    return a.asm._emscripten_bind_DracoUInt8Array_size_0.apply(null, arguments);
  }, xb = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
    return a.asm._emscripten_bind_GeometryAttribute_GeometryAttribute_0.apply(
      null,
      arguments
    );
  }, Ic = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
    return a.asm._emscripten_bind_GeometryAttribute___destroy___0.apply(null, arguments);
  }, Ab = a._emscripten_bind_Mesh_Mesh_0 = function() {
    return a.asm._emscripten_bind_Mesh_Mesh_0.apply(null, arguments);
  }, Jc = a._emscripten_bind_Mesh___destroy___0 = function() {
    return a.asm._emscripten_bind_Mesh___destroy___0.apply(null, arguments);
  }, Kc = a._emscripten_bind_Mesh_num_attributes_0 = function() {
    return a.asm._emscripten_bind_Mesh_num_attributes_0.apply(
      null,
      arguments
    );
  }, Lc = a._emscripten_bind_Mesh_num_faces_0 = function() {
    return a.asm._emscripten_bind_Mesh_num_faces_0.apply(null, arguments);
  }, Mc = a._emscripten_bind_Mesh_num_points_0 = function() {
    return a.asm._emscripten_bind_Mesh_num_points_0.apply(null, arguments);
  }, Nc = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_GetDoubleEntry_2.apply(null, arguments);
  }, Oc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_GetEntryName_2.apply(
      null,
      arguments
    );
  }, Pc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_GetIntEntry_2.apply(null, arguments);
  }, Qc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_GetStringEntry_2.apply(null, arguments);
  }, Rc = a._emscripten_bind_MetadataQuerier_HasDoubleEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_HasDoubleEntry_2.apply(null, arguments);
  }, Sc = a._emscripten_bind_MetadataQuerier_HasEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_HasEntry_2.apply(null, arguments);
  }, Tc = a._emscripten_bind_MetadataQuerier_HasIntEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_HasIntEntry_2.apply(null, arguments);
  }, Uc = a._emscripten_bind_MetadataQuerier_HasStringEntry_2 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_HasStringEntry_2.apply(null, arguments);
  }, ub = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_MetadataQuerier_0.apply(
      null,
      arguments
    );
  }, Vc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
    return a.asm._emscripten_bind_MetadataQuerier_NumEntries_1.apply(null, arguments);
  }, Wc = a._emscripten_bind_MetadataQuerier___destroy___0 = function() {
    return a.asm._emscripten_bind_MetadataQuerier___destroy___0.apply(null, arguments);
  }, Cb = a._emscripten_bind_Metadata_Metadata_0 = function() {
    return a.asm._emscripten_bind_Metadata_Metadata_0.apply(null, arguments);
  }, Xc = a._emscripten_bind_Metadata___destroy___0 = function() {
    return a.asm._emscripten_bind_Metadata___destroy___0.apply(
      null,
      arguments
    );
  }, Yc = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_GetAttributeTransformData_0.apply(null, arguments);
  }, qb = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_PointAttribute_0.apply(null, arguments);
  }, Zc = a._emscripten_bind_PointAttribute___destroy___0 = function() {
    return a.asm._emscripten_bind_PointAttribute___destroy___0.apply(null, arguments);
  }, $c = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_attribute_type_0.apply(null, arguments);
  }, ad = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_byte_offset_0.apply(null, arguments);
  }, bd = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_byte_stride_0.apply(null, arguments);
  }, cd = a._emscripten_bind_PointAttribute_data_type_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_data_type_0.apply(
      null,
      arguments
    );
  }, dd = a._emscripten_bind_PointAttribute_normalized_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_normalized_0.apply(null, arguments);
  }, ed = a._emscripten_bind_PointAttribute_num_components_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_num_components_0.apply(null, arguments);
  }, fd = a._emscripten_bind_PointAttribute_size_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_size_0.apply(null, arguments);
  }, gd = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
    return a.asm._emscripten_bind_PointAttribute_unique_id_0.apply(
      null,
      arguments
    );
  }, mb = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
    return a.asm._emscripten_bind_PointCloud_PointCloud_0.apply(null, arguments);
  }, hd = a._emscripten_bind_PointCloud___destroy___0 = function() {
    return a.asm._emscripten_bind_PointCloud___destroy___0.apply(null, arguments);
  }, id = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
    return a.asm._emscripten_bind_PointCloud_num_attributes_0.apply(null, arguments);
  }, jd = a._emscripten_bind_PointCloud_num_points_0 = function() {
    return a.asm._emscripten_bind_PointCloud_num_points_0.apply(
      null,
      arguments
    );
  }, kd = a._emscripten_bind_Status___destroy___0 = function() {
    return a.asm._emscripten_bind_Status___destroy___0.apply(null, arguments);
  }, ld = a._emscripten_bind_Status_code_0 = function() {
    return a.asm._emscripten_bind_Status_code_0.apply(null, arguments);
  }, md = a._emscripten_bind_Status_error_msg_0 = function() {
    return a.asm._emscripten_bind_Status_error_msg_0.apply(null, arguments);
  }, nd = a._emscripten_bind_Status_ok_0 = function() {
    return a.asm._emscripten_bind_Status_ok_0.apply(null, arguments);
  }, od = a._emscripten_bind_VoidPtr___destroy___0 = function() {
    return a.asm._emscripten_bind_VoidPtr___destroy___0.apply(null, arguments);
  }, pd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
    return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM.apply(null, arguments);
  }, qd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
    return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM.apply(null, arguments);
  }, rd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function() {
    return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM.apply(null, arguments);
  }, sd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
    return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM.apply(null, arguments);
  }, td = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
    return a.asm._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE.apply(
      null,
      arguments
    );
  }, ud = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
    return a.asm._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD.apply(null, arguments);
  }, vd = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
    return a.asm._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH.apply(null, arguments);
  }, wd = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_COLOR.apply(null, arguments);
  }, xd = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_GENERIC.apply(null, arguments);
  }, yd = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_INVALID.apply(null, arguments);
  }, zd = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_NORMAL.apply(null, arguments);
  }, Ad = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_POSITION.apply(null, arguments);
  }, Bd = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
    return a.asm._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD.apply(null, arguments);
  }, Cd = a._emscripten_enum_draco_StatusCode_ERROR = function() {
    return a.asm._emscripten_enum_draco_StatusCode_ERROR.apply(null, arguments);
  }, Dd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
    return a.asm._emscripten_enum_draco_StatusCode_INVALID_PARAMETER.apply(
      null,
      arguments
    );
  }, Ed = a._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
    return a.asm._emscripten_enum_draco_StatusCode_IO_ERROR.apply(null, arguments);
  }, Fd = a._emscripten_enum_draco_StatusCode_OK = function() {
    return a.asm._emscripten_enum_draco_StatusCode_OK.apply(null, arguments);
  }, Gd = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
    return a.asm._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION.apply(null, arguments);
  }, Hd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
    return a.asm._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION.apply(
      null,
      arguments
    );
  };
  a._emscripten_get_global_libc = function() {
    return a.asm._emscripten_get_global_libc.apply(null, arguments);
  };
  var Db = a._emscripten_replace_memory = function() {
    return a.asm._emscripten_replace_memory.apply(null, arguments);
  };
  a._free = function() {
    return a.asm._free.apply(null, arguments);
  };
  a._llvm_bswap_i32 = function() {
    return a.asm._llvm_bswap_i32.apply(null, arguments);
  };
  var Ta = a._malloc = function() {
    return a.asm._malloc.apply(null, arguments);
  };
  a._memcpy = function() {
    return a.asm._memcpy.apply(null, arguments);
  };
  a._memmove = function() {
    return a.asm._memmove.apply(null, arguments);
  };
  a._memset = function() {
    return a.asm._memset.apply(null, arguments);
  };
  a._sbrk = function() {
    return a.asm._sbrk.apply(null, arguments);
  };
  a.establishStackSpace = function() {
    return a.asm.establishStackSpace.apply(null, arguments);
  };
  a.getTempRet0 = function() {
    return a.asm.getTempRet0.apply(null, arguments);
  };
  a.runPostSets = function() {
    return a.asm.runPostSets.apply(null, arguments);
  };
  a.setTempRet0 = function() {
    return a.asm.setTempRet0.apply(null, arguments);
  };
  a.setThrew = function() {
    return a.asm.setThrew.apply(null, arguments);
  };
  a.stackAlloc = function() {
    return a.asm.stackAlloc.apply(null, arguments);
  };
  a.stackRestore = function() {
    return a.asm.stackRestore.apply(null, arguments);
  };
  a.stackSave = function() {
    return a.asm.stackSave.apply(null, arguments);
  };
  a.dynCall_ii = function() {
    return a.asm.dynCall_ii.apply(null, arguments);
  };
  a.dynCall_iii = function() {
    return a.asm.dynCall_iii.apply(null, arguments);
  };
  a.dynCall_iiii = function() {
    return a.asm.dynCall_iiii.apply(null, arguments);
  };
  a.dynCall_iiiiiii = function() {
    return a.asm.dynCall_iiiiiii.apply(null, arguments);
  };
  a.dynCall_v = function() {
    return a.asm.dynCall_v.apply(null, arguments);
  };
  a.dynCall_vi = function() {
    return a.asm.dynCall_vi.apply(null, arguments);
  };
  a.dynCall_vii = function() {
    return a.asm.dynCall_vii.apply(null, arguments);
  };
  a.dynCall_viii = function() {
    return a.asm.dynCall_viii.apply(null, arguments);
  };
  a.dynCall_viiii = function() {
    return a.asm.dynCall_viiii.apply(null, arguments);
  };
  a.dynCall_viiiii = function() {
    return a.asm.dynCall_viiiii.apply(
      null,
      arguments
    );
  };
  a.dynCall_viiiiii = function() {
    return a.asm.dynCall_viiiiii.apply(null, arguments);
  };
  m.stackAlloc = a.stackAlloc;
  m.stackSave = a.stackSave;
  m.stackRestore = a.stackRestore;
  m.establishStackSpace = a.establishStackSpace;
  m.setTempRet0 = a.setTempRet0;
  m.getTempRet0 = a.getTempRet0;
  a.asm = eb;
  if (V)
    if ("function" === typeof a.locateFile ? V = a.locateFile(V) : a.memoryInitializerPrefixURL && (V = a.memoryInitializerPrefixURL + V), pa || wa) {
      var Id = a.readBinary(V);
      T.set(Id, m.GLOBAL_BASE);
    } else {
      var gb = function() {
        a.readAsync(
          V,
          fb,
          function() {
            throw "could not load memory initializer " + V;
          }
        );
      };
      la("memory initializer");
      var fb = function(d2) {
        d2.byteLength && (d2 = new Uint8Array(d2));
        T.set(d2, m.GLOBAL_BASE);
        a.memoryInitializerRequest && delete a.memoryInitializerRequest.response;
        Na("memory initializer");
      };
      if (a.memoryInitializerRequest) {
        var hb = function() {
          var d2 = a.memoryInitializerRequest, b = d2.response;
          200 !== d2.status && 0 !== d2.status ? (console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: " + d2.status + ", retrying " + V), gb()) : fb(b);
        };
        a.memoryInitializerRequest.response ? setTimeout(hb, 0) : a.memoryInitializerRequest.addEventListener("load", hb);
      } else
        gb();
    }
  a.then = function(d2) {
    if (a.calledRun)
      d2(a);
    else {
      var b = a.onRuntimeInitialized;
      a.onRuntimeInitialized = function() {
        b && b();
        d2(a);
      };
    }
    return a;
  };
  ea.prototype = Error();
  ea.prototype.constructor = ea;
  var Za = null;
  sa = function b() {
    a.calledRun || Da();
    a.calledRun || (sa = b);
  };
  a.run = Da;
  a.exit = function(b, c) {
    if (!c || !a.noExitRuntime) {
      if (!a.noExitRuntime && (ua = true, U = void 0, u(db), a.onExit))
        a.onExit(b);
      pa && process.exit(b);
      a.quit(b, new ea(b));
    }
  };
  var ab = [];
  a.abort = W;
  if (a.preInit)
    for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; )
      a.preInit.pop()();
  Da();
  p.prototype = Object.create(p.prototype);
  p.prototype.constructor = p;
  p.prototype.__class__ = p;
  p.__cache__ = {};
  a.WrapperObject = p;
  a.getCache = t;
  a.wrapPointer = X;
  a.castObject = function(a2, c) {
    return X(a2.ptr, c);
  };
  a.NULL = X(0);
  a.destroy = function(a2) {
    if (!a2.__destroy__)
      throw "Error: Cannot destroy object. (Did you create it yourself?)";
    a2.__destroy__();
    delete t(a2.__class__)[a2.ptr];
  };
  a.compare = function(a2, c) {
    return a2.ptr === c.ptr;
  };
  a.getPointer = function(a2) {
    return a2.ptr;
  };
  a.getClass = function(a2) {
    return a2.__class__;
  };
  var k = {
    buffer: 0,
    size: 0,
    pos: 0,
    temps: [],
    needed: 0,
    prepare: function() {
      if (k.needed) {
        for (var b = 0; b < k.temps.length; b++)
          a._free(k.temps[b]);
        k.temps.length = 0;
        a._free(k.buffer);
        k.buffer = 0;
        k.size += k.needed;
        k.needed = 0;
      }
      k.buffer || (k.size += 128, k.buffer = a._malloc(k.size), f(k.buffer));
      k.pos = 0;
    },
    alloc: function(b, c) {
      f(k.buffer);
      b = b.length * c.BYTES_PER_ELEMENT;
      b = b + 7 & -8;
      k.pos + b >= k.size ? (f(0 < b), k.needed += b, c = a._malloc(b), k.temps.push(c)) : (c = k.buffer + k.pos, k.pos += b);
      return c;
    },
    copy: function(a2, c, d2) {
      switch (c.BYTES_PER_ELEMENT) {
        case 2:
          d2 >>= 1;
          break;
        case 4:
          d2 >>= 2;
          break;
        case 8:
          d2 >>= 3;
      }
      for (var b = 0; b < a2.length; b++)
        c[d2 + b] = a2[b];
    }
  };
  B.prototype = Object.create(p.prototype);
  B.prototype.constructor = B;
  B.prototype.__class__ = B;
  B.__cache__ = {};
  a.Status = B;
  B.prototype.code = B.prototype.code = function() {
    return ld(this.ptr);
  };
  B.prototype.ok = B.prototype.ok = function() {
    return !!nd(this.ptr);
  };
  B.prototype.error_msg = B.prototype.error_msg = function() {
    return n(md(this.ptr));
  };
  B.prototype.__destroy__ = B.prototype.__destroy__ = function() {
    kd(this.ptr);
  };
  G.prototype = Object.create(p.prototype);
  G.prototype.constructor = G;
  G.prototype.__class__ = G;
  G.__cache__ = {};
  a.DracoUInt16Array = G;
  G.prototype.GetValue = G.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return zc(b, a2);
  };
  G.prototype.size = G.prototype.size = function() {
    return Bc(this.ptr);
  };
  G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
    Ac(this.ptr);
  };
  H.prototype = Object.create(p.prototype);
  H.prototype.constructor = H;
  H.prototype.__class__ = H;
  H.__cache__ = {};
  a.PointCloud = H;
  H.prototype.num_attributes = H.prototype.num_attributes = function() {
    return id(this.ptr);
  };
  H.prototype.num_points = H.prototype.num_points = function() {
    return jd(this.ptr);
  };
  H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
    hd(this.ptr);
  };
  I.prototype = Object.create(p.prototype);
  I.prototype.constructor = I;
  I.prototype.__class__ = I;
  I.__cache__ = {};
  a.DracoUInt8Array = I;
  I.prototype.GetValue = I.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return Fc(b, a2);
  };
  I.prototype.size = I.prototype.size = function() {
    return Hc(this.ptr);
  };
  I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
    Gc(this.ptr);
  };
  J.prototype = Object.create(p.prototype);
  J.prototype.constructor = J;
  J.prototype.__class__ = J;
  J.__cache__ = {};
  a.DracoUInt32Array = J;
  J.prototype.GetValue = J.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return Cc(b, a2);
  };
  J.prototype.size = J.prototype.size = function() {
    return Ec(this.ptr);
  };
  J.prototype.__destroy__ = J.prototype.__destroy__ = function() {
    Dc(this.ptr);
  };
  K.prototype = Object.create(p.prototype);
  K.prototype.constructor = K;
  K.prototype.__class__ = K;
  K.__cache__ = {};
  a.AttributeOctahedronTransform = K;
  K.prototype.InitFromAttribute = K.prototype.InitFromAttribute = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return !!Fb(b, a2);
  };
  K.prototype.quantization_bits = K.prototype.quantization_bits = function() {
    return Hb(this.ptr);
  };
  K.prototype.__destroy__ = K.prototype.__destroy__ = function() {
    Gb(this.ptr);
  };
  q.prototype = Object.create(p.prototype);
  q.prototype.constructor = q;
  q.prototype.__class__ = q;
  q.__cache__ = {};
  a.PointAttribute = q;
  q.prototype.size = q.prototype.size = function() {
    return fd(this.ptr);
  };
  q.prototype.GetAttributeTransformData = q.prototype.GetAttributeTransformData = function() {
    return X(Yc(this.ptr), P);
  };
  q.prototype.attribute_type = q.prototype.attribute_type = function() {
    return $c(this.ptr);
  };
  q.prototype.data_type = q.prototype.data_type = function() {
    return cd(this.ptr);
  };
  q.prototype.num_components = q.prototype.num_components = function() {
    return ed(this.ptr);
  };
  q.prototype.normalized = q.prototype.normalized = function() {
    return !!dd(this.ptr);
  };
  q.prototype.byte_stride = q.prototype.byte_stride = function() {
    return bd(this.ptr);
  };
  q.prototype.byte_offset = q.prototype.byte_offset = function() {
    return ad(this.ptr);
  };
  q.prototype.unique_id = q.prototype.unique_id = function() {
    return gd(this.ptr);
  };
  q.prototype.__destroy__ = q.prototype.__destroy__ = function() {
    Zc(this.ptr);
  };
  P.prototype = Object.create(p.prototype);
  P.prototype.constructor = P;
  P.prototype.__class__ = P;
  P.__cache__ = {};
  a.AttributeTransformData = P;
  P.prototype.transform_type = P.prototype.transform_type = function() {
    return Ob(this.ptr);
  };
  P.prototype.__destroy__ = P.prototype.__destroy__ = function() {
    Nb(this.ptr);
  };
  z.prototype = Object.create(p.prototype);
  z.prototype.constructor = z;
  z.prototype.__class__ = z;
  z.__cache__ = {};
  a.AttributeQuantizationTransform = z;
  z.prototype.InitFromAttribute = z.prototype.InitFromAttribute = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return !!Ib(b, a2);
  };
  z.prototype.quantization_bits = z.prototype.quantization_bits = function() {
    return Lb(this.ptr);
  };
  z.prototype.min_value = z.prototype.min_value = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return Kb(b, a2);
  };
  z.prototype.range = z.prototype.range = function() {
    return Mb(this.ptr);
  };
  z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
    Jb(this.ptr);
  };
  L.prototype = Object.create(p.prototype);
  L.prototype.constructor = L;
  L.prototype.__class__ = L;
  L.__cache__ = {};
  a.DracoInt8Array = L;
  L.prototype.GetValue = L.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return wc(b, a2);
  };
  L.prototype.size = L.prototype.size = function() {
    return yc(this.ptr);
  };
  L.prototype.__destroy__ = L.prototype.__destroy__ = function() {
    xc(this.ptr);
  };
  r.prototype = Object.create(p.prototype);
  r.prototype.constructor = r;
  r.prototype.__class__ = r;
  r.__cache__ = {};
  a.MetadataQuerier = r;
  r.prototype.HasEntry = r.prototype.HasEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return !!Sc(
      b,
      a2,
      c
    );
  };
  r.prototype.HasIntEntry = r.prototype.HasIntEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return !!Tc(b, a2, c);
  };
  r.prototype.GetIntEntry = r.prototype.GetIntEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return Pc(b, a2, c);
  };
  r.prototype.HasDoubleEntry = r.prototype.HasDoubleEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return !!Rc(b, a2, c);
  };
  r.prototype.GetDoubleEntry = r.prototype.GetDoubleEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return Nc(b, a2, c);
  };
  r.prototype.HasStringEntry = r.prototype.HasStringEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return !!Uc(b, a2, c);
  };
  r.prototype.GetStringEntry = r.prototype.GetStringEntry = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return n(Qc(b, a2, c));
  };
  r.prototype.NumEntries = r.prototype.NumEntries = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return Vc(b, a2);
  };
  r.prototype.GetEntryName = r.prototype.GetEntryName = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return n(Oc(b, a2, c));
  };
  r.prototype.__destroy__ = r.prototype.__destroy__ = function() {
    Wc(this.ptr);
  };
  M.prototype = Object.create(p.prototype);
  M.prototype.constructor = M;
  M.prototype.__class__ = M;
  M.__cache__ = {};
  a.DracoInt16Array = M;
  M.prototype.GetValue = M.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return qc(b, a2);
  };
  M.prototype.size = M.prototype.size = function() {
    return sc(this.ptr);
  };
  M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
    rc(this.ptr);
  };
  N.prototype = Object.create(p.prototype);
  N.prototype.constructor = N;
  N.prototype.__class__ = N;
  N.__cache__ = {};
  a.DracoFloat32Array = N;
  N.prototype.GetValue = N.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return nc(b, a2);
  };
  N.prototype.size = N.prototype.size = function() {
    return pc(this.ptr);
  };
  N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
    oc(this.ptr);
  };
  Z.prototype = Object.create(p.prototype);
  Z.prototype.constructor = Z;
  Z.prototype.__class__ = Z;
  Z.__cache__ = {};
  a.GeometryAttribute = Z;
  Z.prototype.__destroy__ = Z.prototype.__destroy__ = function() {
    Ic(this.ptr);
  };
  R.prototype = Object.create(p.prototype);
  R.prototype.constructor = R;
  R.prototype.__class__ = R;
  R.__cache__ = {};
  a.DecoderBuffer = R;
  R.prototype.Init = R.prototype.Init = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    if ("object" == typeof a2 && "object" === typeof a2) {
      var d2 = k.alloc(a2, fa);
      k.copy(a2, fa, d2);
      a2 = d2;
    }
    c && "object" === typeof c && (c = c.ptr);
    Pb(b, a2, c);
  };
  R.prototype.__destroy__ = R.prototype.__destroy__ = function() {
    Qb(this.ptr);
  };
  h.prototype = Object.create(p.prototype);
  h.prototype.constructor = h;
  h.prototype.__class__ = h;
  h.__cache__ = {};
  a.Decoder = h;
  h.prototype.GetEncodedGeometryType = h.prototype.GetEncodedGeometryType = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return hc(b, a2);
  };
  h.prototype.DecodeBufferToPointCloud = h.prototype.DecodeBufferToPointCloud = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return X(Sb(b, a2, c), B);
  };
  h.prototype.DecodeBufferToMesh = h.prototype.DecodeBufferToMesh = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return X(Rb(b, a2, c), B);
  };
  h.prototype.GetAttributeId = h.prototype.GetAttributeId = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return Yb(b, a2, c);
  };
  h.prototype.GetAttributeIdByName = h.prototype.GetAttributeIdByName = function(a2, c) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    return Xb(b, a2, c);
  };
  h.prototype.GetAttributeIdByMetadataEntry = h.prototype.GetAttributeIdByMetadataEntry = function(a2, c, d2) {
    var b = this.ptr;
    k.prepare();
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c = c && "object" === typeof c ? c.ptr : Y(c);
    d2 = d2 && "object" === typeof d2 ? d2.ptr : Y(d2);
    return Wb(b, a2, c, d2);
  };
  h.prototype.GetAttribute = h.prototype.GetAttribute = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return X(gc(b, a2, c), q);
  };
  h.prototype.GetAttributeByUniqueId = h.prototype.GetAttributeByUniqueId = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return X(Tb(b, a2, c), q);
  };
  h.prototype.GetMetadata = h.prototype.GetMetadata = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return X(jc(
      b,
      a2
    ), S);
  };
  h.prototype.GetAttributeMetadata = h.prototype.GetAttributeMetadata = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return X(cc(b, a2, c), S);
  };
  h.prototype.GetFaceFromMesh = h.prototype.GetFaceFromMesh = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!ic(b, a2, c, d2);
  };
  h.prototype.GetTriangleStripsFromMesh = h.prototype.GetTriangleStripsFromMesh = function(a2, c) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    return kc(b, a2, c);
  };
  h.prototype.GetAttributeFloat = h.prototype.GetAttributeFloat = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!Vb(b, a2, c, d2);
  };
  h.prototype.GetAttributeFloatForAllPoints = h.prototype.GetAttributeFloatForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!Ub(b, a2, c, d2);
  };
  h.prototype.GetAttributeIntForAllPoints = h.prototype.GetAttributeIntForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!bc(b, a2, c, d2);
  };
  h.prototype.GetAttributeInt8ForAllPoints = h.prototype.GetAttributeInt8ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!ac(b, a2, c, d2);
  };
  h.prototype.GetAttributeUInt8ForAllPoints = h.prototype.GetAttributeUInt8ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!fc(b, a2, c, d2);
  };
  h.prototype.GetAttributeInt16ForAllPoints = h.prototype.GetAttributeInt16ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!Zb(b, a2, c, d2);
  };
  h.prototype.GetAttributeUInt16ForAllPoints = h.prototype.GetAttributeUInt16ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!dc(b, a2, c, d2);
  };
  h.prototype.GetAttributeInt32ForAllPoints = h.prototype.GetAttributeInt32ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!$b(b, a2, c, d2);
  };
  h.prototype.GetAttributeUInt32ForAllPoints = h.prototype.GetAttributeUInt32ForAllPoints = function(a2, c, d2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    c && "object" === typeof c && (c = c.ptr);
    d2 && "object" === typeof d2 && (d2 = d2.ptr);
    return !!ec(b, a2, c, d2);
  };
  h.prototype.SkipAttributeTransform = h.prototype.SkipAttributeTransform = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    lc(b, a2);
  };
  h.prototype.__destroy__ = h.prototype.__destroy__ = function() {
    mc(this.ptr);
  };
  C.prototype = Object.create(p.prototype);
  C.prototype.constructor = C;
  C.prototype.__class__ = C;
  C.__cache__ = {};
  a.Mesh = C;
  C.prototype.num_faces = C.prototype.num_faces = function() {
    return Lc(this.ptr);
  };
  C.prototype.num_attributes = C.prototype.num_attributes = function() {
    return Kc(this.ptr);
  };
  C.prototype.num_points = C.prototype.num_points = function() {
    return Mc(this.ptr);
  };
  C.prototype.__destroy__ = C.prototype.__destroy__ = function() {
    Jc(this.ptr);
  };
  ca.prototype = Object.create(p.prototype);
  ca.prototype.constructor = ca;
  ca.prototype.__class__ = ca;
  ca.__cache__ = {};
  a.VoidPtr = ca;
  ca.prototype.__destroy__ = ca.prototype.__destroy__ = function() {
    od(this.ptr);
  };
  O.prototype = Object.create(p.prototype);
  O.prototype.constructor = O;
  O.prototype.__class__ = O;
  O.__cache__ = {};
  a.DracoInt32Array = O;
  O.prototype.GetValue = O.prototype.GetValue = function(a2) {
    var b = this.ptr;
    a2 && "object" === typeof a2 && (a2 = a2.ptr);
    return tc(b, a2);
  };
  O.prototype.size = O.prototype.size = function() {
    return vc(this.ptr);
  };
  O.prototype.__destroy__ = O.prototype.__destroy__ = function() {
    uc(this.ptr);
  };
  S.prototype = Object.create(p.prototype);
  S.prototype.constructor = S;
  S.prototype.__class__ = S;
  S.__cache__ = {};
  a.Metadata = S;
  S.prototype.__destroy__ = S.prototype.__destroy__ = function() {
    Xc(this.ptr);
  };
  (function() {
    function b() {
      a.OK = Fd();
      a.ERROR = Cd();
      a.IO_ERROR = Ed();
      a.INVALID_PARAMETER = Dd();
      a.UNSUPPORTED_VERSION = Hd();
      a.UNKNOWN_VERSION = Gd();
      a.INVALID_GEOMETRY_TYPE = td();
      a.POINT_CLOUD = ud();
      a.TRIANGULAR_MESH = vd();
      a.ATTRIBUTE_INVALID_TRANSFORM = pd();
      a.ATTRIBUTE_NO_TRANSFORM = qd();
      a.ATTRIBUTE_QUANTIZATION_TRANSFORM = sd();
      a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = rd();
      a.INVALID = yd();
      a.POSITION = Ad();
      a.NORMAL = zd();
      a.COLOR = wd();
      a.TEX_COORD = Bd();
      a.GENERIC = xd();
    }
    a.calledRun ? b() : Xa.unshift(b);
  })();
  if ("function" === typeof a.onModuleParsed)
    a.onModuleParsed();
  return d;
};
"object" === typeof module && module.exports && (module.exports = DracoDecoderModule);
