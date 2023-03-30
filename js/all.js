(function () {
	'use strict';

	/* ---------------------------------------- [START] Window EventListener */
	function doFn(target, event, func, option) {
	  target = target || window;
	  if (window.addEventListener) {
	    var opt = option || false;
	    target.addEventListener(event, func, opt);
	  } else {
	    target.attachEvent('on' + event, func);
	  }
	}

	function on(target, event, func, option, delay) {
	  target = target || window;

	  if (event === 'load') {
	    // 因為客戶要整體安裝Vue，所以所有使用load的項目延遲生成
	    delay = delay || 20;
	    var funcDelay = function funcDelay() {
	      var _this = this;
	      setTimeout(function () {
	        func.call(_this);
	      }, delay);
	    };
	    doFn(target, event, funcDelay, option);
	  } else if (event === 'load:origin') {
	    // load 原生，不延遲方式生成
	    event = event.replace(/:origin/, '');
	    doFn(target, event, func, option);
	  } else {
	    doFn(target, event, func, option);
	  }
	}
	/* ---------------------------------------- [END] Window EventListener */

	/* ---------------------------------------- [START] 簡單的節流函數 */
	// https://www.cnblogs.com/coco1s/p/5499469.html
	function throttle(func, wait, mustRun) {
	  var timeout;
	  var startTime = new Date();

	  return function () {
	    var context = this;
	    var args = arguments;
	    var curTime = new Date();

	    if (timeout !== undefined) {
	      clearTimeout(timeout);
	    }
	    // 如果達到了規定的觸發時間間隔，觸發 handler
	    if (curTime - startTime >= mustRun) {
	      func.apply(context, args);
	      startTime = curTime;
	      // 沒達到觸發間隔，重新設定定時器
	    } else {
	      timeout = setTimeout(func, wait);
	    }
	  };
	}
	/* ---------------------------------------- [END] isInViewport */

	/* ---------------------------------------- [START] 從 String 取得 HTML Element */
	// https://stackoverflow.com/a/494348/11240898
	function createElementFromHTML(htmlString) {
	  var div = document.createElement('div');
	  div.innerHTML = htmlString.trim();

	  // Change this to div.childNodes to support multiple top-level nodes
	  return div.firstChild;
	}
	/* ---------------------------------------- [END] 取得正確的資源位置 */

	// -----------------------------------
	(function ($, window, document) {

	  // -----------------------------------
	  // Setting
	  // -----------------------------------
	  // 判斷browser Begin
	  var ua = navigator.userAgent;
	  var browser = {
	    isChrome: /chrome/i.test(ua),
	    isFirefox: /firefox/i.test(ua),
	    isSafari: /safari/i.test(ua),

	    // https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
	    isIE: /msie/i.test(ua) || /trident/i.test(ua),
	    isEdge: /edge/i.test(ua) };

	  // 修正數值browser
	  if (browser.isChrome) browser.isSafari = false;
	  if (browser.isEdge) {
	    browser.isChrome = false;
	    browser.isSafari = false;
	  }


	  // Object-fit Start--------------------------------------------------
	  // 取得 & 替換 
	  var lazyClass = 'lazy'; // 配合Lazy load => 如果是Lazy load 圖片不動作
	  var objectFitForIE_getBg = function objectFitForIE_getBg(thisItemJS) {

	    var src = thisItemJS.dataset.src || thisItemJS.src;
	    var item = $(thisItemJS);

	    // If element has lazy load class
	    if (item.hasClass(lazyClass)) src = "";

	    // 計算最大公因數/最小公倍數
	    // Reference https://www.liveism.com/math-live/arithmetic/live-online-gcd-lcm-calculator.php
	    function fgcd(x, y) {
	      return y == 0 ? x : fgcd(y, x % y);
	    }
	    function countMath(A, B) {
	      var GCD; // greatest common divisor 最大公因數 
	      var LCM; // least common multiple 最小公倍數 
	      if (A == "" || B == "" || A == "0" || B == "0" || isNaN(A) || isNaN(B)) ; else {
	        GCD = fgcd(parseInt(A), parseInt(B));
	      }
	      if (GCD != "0")
	      LCM = A * B / GCD;else

	      LCM = "無意義";
	      var result = [GCD, LCM];
	      return result;
	    }

	    // 取得空PNG
	    function getBase64Png(width, height) {
	      width = width == 0 ? 1 : width;
	      height = height == 0 ? 1 : height;

	      var resultGCD = countMath(width, height)[0];

	      // Create transparent image
	      var canvas = document.createElement("canvas");

	      // set desired size of transparent image
	      canvas.width = width / resultGCD;
	      canvas.height = height / resultGCD;

	      // extract as new image (data-uri)
	      var url = canvas.toDataURL(); // 預設會轉成 image/png
	      return url;
	    }

	    // console.log(item.css('-o-object-fit')) // IE 無法找到object-fit
	    if (!item.hasClass('ie-hack')) {

	      // Get image width & height
	      var itemW = thisItemJS.naturalWidth;
	      var itemH = thisItemJS.naturalHeight;

	      // 用svg產生空的比例
	      // var imgEmpty = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'+ itemW +'" height="'+ itemH +'"><path fill="none" d="M0 0h'+ itemW +'v'+ itemH +'H0z"/></svg>'
	      var imgEmpty = getBase64Png(itemW, itemH);

	      // 替換成背景圖片
	      item.attr('src', imgEmpty);
	      item.css({
	        'background-repeat': 'no-repeat',
	        'background-position': '50% 50%',
	        'background-image': 'url(' + src + ')'
	        // 'background-size': 'cover',
	      });
	      item.addClass('ie-hack');
	    }
	  };
	  var objectFitForIE = function objectFitForIE(currentItem) {
	    if (browser.isIE) {
	      if (currentItem == undefined) {
	        $('.object-fit > img').each(function () {
	          objectFitForIE_getBg(this);
	        });
	        $('.object-fit-contain > img').each(function () {
	          objectFitForIE_getBg(this);
	        });
	      } else {
	        objectFitForIE_getBg(currentItem);
	      }
	    }
	  };
	  objectFitForIE();

	})(jQuery, window, document);

	// -----------------------------------
	(function (window, document) {

	  // -----------------------------------
	  // Setting
	  // -----------------------------------
	  // 判斷browser Begin
	  var ua = navigator.userAgent;
	  var browser = {
	    isChrome: /chrome/i.test(ua),
	    isFirefox: /firefox/i.test(ua),
	    isSafari: /safari/i.test(ua),

	    // https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
	    isIE: /msie/i.test(ua) || /trident/i.test(ua),
	    isEdge: /edge/i.test(ua) };

	  // 修正數值browser
	  if (browser.isChrome) browser.isSafari = false;
	  if (browser.isEdge) {
	    browser.isChrome = false;
	    browser.isSafari = false;
	  }

	  // -----------------------------------
	  // Lazy load Start
	  // -----------------------------------
	  window.lazy = {};

	  var lazyLoad_throttle = throttle(lazyLoad, 500, 1000); // 節流作用

	  registerListener('load', setLazy);
	  registerListener('scroll', lazyLoad_throttle);
	  registerListener('resize', lazyLoad);

	  // 綁定Scroll
	  function scrollLazy() {
	    var lazyScrollWarapper = document.querySelectorAll('[data-lazy-scroll]');
	    for (var k = 0; k < lazyScrollWarapper.length; k++) {
	      registerListener('scroll', lazyLoad_throttle, lazyScrollWarapper[k]);
	    }
	  }
	  registerListener('load', scrollLazy);
	  window.lazy.scrollBind = scrollLazy;


	  var lazy = [];
	  var lazyClass = 'lazy';
	  var lazyAttr = 'data-src';
	  var lazyAttrBg = 'data-background'; // 配合Swiper
	  var lazyCssOnly = 'lazy-css'; // 只增加 CSS 不增加圖片
	  var lazyloadedClass = 'loaded';
	  var lazyloadedClass_wrapper = 'loaded-content';
	  var pageReady = false;

	  var objectFitClass = 'object-fit';
	  var objectFitClassContain = 'object-fit-contain';

	  var viewmoreButton;

	  var registerScroll = true; // 確認是否關閉 => 可再開啟

	  function setLazy() {
	    lazy = document.getElementsByClassName(lazyClass);
	    pageReady = true;
	    if (lazy.length > 0 && !registerScroll) {
	      registerScroll = true;
	      registerListener('scroll', lazyLoad_throttle);
	    }
	    lazyLoad();

	    // View More button
	    viewmoreButton = document.querySelector('[data-loadmore]');
	    if (viewmoreButton != null) {
	      viewmoreButton.onclick = function () {
	        lazyLoad();
	      };
	    }
	  }
	  // Add Window property
	  window.lazy.set = setLazy;

	  function lazyLoad() {
	    if (!pageReady) return false;

	    for (var i = 0; i < lazy.length; i++) {
	      if (isInViewport(lazy[i])) {
	        var currentLazyEl = lazy[i];

	        if (currentLazyEl.classList.contains(lazyCssOnly)) {
	          // Add Class Only
	          currentLazyEl.classList.add(lazyloadedClass);
	          currentLazyEl.parentElement.classList.add(lazyloadedClass_wrapper);
	        } else {
	          var lazyImg = currentLazyEl.getAttribute(lazyAttr);
	          var lazyBg = currentLazyEl.getAttribute(lazyAttrBg); // 配合Swiper
	          var imgSrc = lazyImg || lazyBg;
	          var isBg = currentLazyEl.tagName.toUpperCase() !== 'IMG';
	          if (imgSrc !== null && imgSrc !== undefined) {

	            if (browser.isIE && (currentLazyEl.parentElement.classList.contains(objectFitClass) || currentLazyEl.parentElement.classList.contains(objectFitClassContain))) {
	              // Is IE & Is Object-fit
	              currentLazyEl.style.backgroundImage = "url(" + imgSrc + ")";
	            } else {
	              if (isBg) {
	                currentLazyEl.style.backgroundImage = "url(" + imgSrc + ")";
	              } else if (lazyImg) {
	                currentLazyEl.src = imgSrc;
	              }
	            }

	            // remove the attribute
	            currentLazyEl.removeAttribute(lazyAttr);
	            currentLazyEl.removeAttribute(lazyAttrBg);

	            // Loaded
	            if (isBg) {
	              currentLazyEl.classList.add(lazyloadedClass);
	              currentLazyEl.parentElement.classList.add(lazyloadedClass_wrapper);
	            } else if (lazyImg) {
	              currentLazyEl.onload = function () {
	                var _this = this;
	                var _thisParent = _this.parentElement;
	                _this.classList.add(lazyloadedClass);
	                _thisParent.classList.add(lazyloadedClass_wrapper);

	                // Loader Img (with Swiper)
	                var _thisLoader = _thisParent.querySelector('.swiper-lazy-preloader');
	                _thisLoader && _thisLoader.remove();
	              };

	              // Fixed IE
	              if (currentLazyEl.complete) {
	                currentLazyEl.classList.add(lazyloadedClass);
	                currentLazyEl.parentElement.classList.add(lazyloadedClass_wrapper);
	              }
	            }
	          }
	        }
	      }
	    }

	    cleanLazy();

	    // If load all of the item, stop Listener
	    if (lazy.length === 0) {
	      registerScroll = false;
	      removeListener('scroll', lazyLoad_throttle);
	      removeListener('resize', lazyLoad);
	    }
	  }

	  // Add Window property
	  window.lazy.load = lazyLoad;

	  function isInViewport(el) {
	    var rect = el.getBoundingClientRect();

	    return (
	      rect.width > 0 &&
	      rect.height > 0 &&

	      rect.bottom >= 0 &&
	      rect.right >= 0 &&

	      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
	      rect.left <= (window.innerWidth || document.documentElement.clientWidth));

	  }

	  function cleanLazy() {
	    lazy = Array.prototype.filter.call(lazy, function (l) {
	      return !l.classList.contains(lazyloadedClass);
	    });
	  }

	  function registerListener(event, func, target) {
	    var tg = target != undefined ? target : window;
	    if (window.addEventListener) {
	      tg.addEventListener(event, func, false);
	    } else {
	      tg.attachEvent('on' + event, func);
	    }
	  }

	  function removeListener(event, func, target) {
	    var tg = target != undefined ? target : window;
	    if (window.addEventListener) {
	      tg.removeEventListener(event, func, false);
	    } else {
	      tg.detachEvent('on' + event, func);
	    }
	  }

	  // https://www.cnblogs.com/coco1s/p/5499469.html
	  // 簡單的節流函數
	  function throttle(func, wait, mustRun) {
	    var timeout,
	    startTime = new Date();

	    return function () {
	      var context = this,
	      args = arguments,
	      curTime = new Date();

	      if (timeout != undefined) {
	        if (window.requestTimeout != undefined) {
	          clearRequestTimeout(timeout);
	        } else {
	          clearTimeout(timeout);
	        }
	      }      // 如果達到了規定的觸發時間間隔，觸發 handler
	      if (curTime - startTime >= mustRun) {
	        func.apply(context, args);
	        startTime = curTime;
	        // 沒達到觸發間隔，重新設定定時器
	      } else {
	        if (window.requestTimeout != undefined) {
	          timeout = requestTimeout(func, wait);
	        } else {
	          timeout = setTimeout(func, wait);
	        }
	      }
	    };
	  }
	})(window, document);

	/* 是否支援Webp */
	(function (window, document) {

	  var buildWebpDetect = function buildWebpDetect() {
	    var imgWebP = new Image();
	    imgWebP.onload = function () {
	      !!(imgWebP.height > 0 && imgWebP.width > 0);
	      // does support
	      document.documentElement.classList.add('webp');
	    };
	    imgWebP.onerror = function () {
	      // does not support
	      document.documentElement.classList.add('no-webp');
	    };
	    imgWebP.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
	  };

	  window.addEventListener('load', buildWebpDetect);


	})(window, document);

	function ownKeys(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);

	    if (enumerableOnly) {
	      symbols = symbols.filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	      });
	    }

	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var es6Promise = createCommonjsModule(function (module, exports) {
	  /*!
	   * @overview es6-promise - a tiny implementation of Promises/A+.
	   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	   * @license   Licensed under MIT license
	   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	   * @version   v4.2.8+1e68dce6
	   */
	  (function (global, factory) {
	    module.exports = factory() ;
	  })(commonjsGlobal, function () {

	    function objectOrFunction(x) {
	      var type = typeof x;
	      return x !== null && (type === 'object' || type === 'function');
	    }

	    function isFunction(x) {
	      return typeof x === 'function';
	    }

	    var _isArray = void 0;

	    if (Array.isArray) {
	      _isArray = Array.isArray;
	    } else {
	      _isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    }

	    var isArray = _isArray;
	    var len = 0;
	    var vertxNext = void 0;
	    var customSchedulerFn = void 0;

	    var asap = function asap(callback, arg) {
	      queue[len] = callback;
	      queue[len + 1] = arg;
	      len += 2;

	      if (len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (customSchedulerFn) {
	          customSchedulerFn(flush);
	        } else {
	          scheduleFlush();
	        }
	      }
	    };

	    function setScheduler(scheduleFn) {
	      customSchedulerFn = scheduleFn;
	    }

	    function setAsap(asapFn) {
	      asap = asapFn;
	    }

	    var browserWindow = typeof window !== 'undefined' ? window : undefined;
	    var browserGlobal = browserWindow || {};
	    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'; // test for web worker but not in IE10

	    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined'; // node

	    function useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function () {
	        return process.nextTick(flush);
	      };
	    } // vertx


	    function useVertxTimer() {
	      if (typeof vertxNext !== 'undefined') {
	        return function () {
	          vertxNext(flush);
	        };
	      }

	      return useSetTimeout();
	    }

	    function useMutationObserver() {
	      var iterations = 0;
	      var observer = new BrowserMutationObserver(flush);
	      var node = document.createTextNode('');
	      observer.observe(node, {
	        characterData: true
	      });
	      return function () {
	        node.data = iterations = ++iterations % 2;
	      };
	    } // web worker


	    function useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = flush;
	      return function () {
	        return channel.port2.postMessage(0);
	      };
	    }

	    function useSetTimeout() {
	      // Store setTimeout reference so es6-promise will be unaffected by
	      // other code modifying setTimeout (like sinon.useFakeTimers())
	      var globalSetTimeout = setTimeout;
	      return function () {
	        return globalSetTimeout(flush, 1);
	      };
	    }

	    var queue = new Array(1000);

	    function flush() {
	      for (var i = 0; i < len; i += 2) {
	        var callback = queue[i];
	        var arg = queue[i + 1];
	        callback(arg);
	        queue[i] = undefined;
	        queue[i + 1] = undefined;
	      }

	      len = 0;
	    }

	    function attemptVertx() {
	      try {
	        var vertx = Function('return this')().require('vertx');

	        vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return useVertxTimer();
	      } catch (e) {
	        return useSetTimeout();
	      }
	    }

	    var scheduleFlush = void 0; // Decide what async method to use to triggering processing of queued callbacks:

	    if (isNode) {
	      scheduleFlush = useNextTick();
	    } else if (BrowserMutationObserver) {
	      scheduleFlush = useMutationObserver();
	    } else if (isWorker) {
	      scheduleFlush = useMessageChannel();
	    } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
	      scheduleFlush = attemptVertx();
	    } else {
	      scheduleFlush = useSetTimeout();
	    }

	    function then(onFulfillment, onRejection) {
	      var parent = this;
	      var child = new this.constructor(noop);

	      if (child[PROMISE_ID] === undefined) {
	        makePromise(child);
	      }

	      var _state = parent._state;

	      if (_state) {
	        var callback = arguments[_state - 1];
	        asap(function () {
	          return invokeCallback(_state, child, callback, parent._result);
	        });
	      } else {
	        subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    }
	    /**
	      `Promise.resolve` returns a promise that will become resolved with the
	      passed `value`. It is shorthand for the following:
	    
	      ```javascript
	      let promise = new Promise(function(resolve, reject){
	        resolve(1);
	      });
	    
	      promise.then(function(value){
	        // value === 1
	      });
	      ```
	    
	      Instead of writing the above, your code now simply becomes the following:
	    
	      ```javascript
	      let promise = Promise.resolve(1);
	    
	      promise.then(function(value){
	        // value === 1
	      });
	      ```
	    
	      @method resolve
	      @static
	      @param {Any} value value that the returned promise will be resolved with
	      Useful for tooling.
	      @return {Promise} a promise that will become fulfilled with the given
	      `value`
	    */


	    function resolve$1(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(noop);
	      resolve(promise, object);
	      return promise;
	    }

	    var PROMISE_ID = Math.random().toString(36).substring(2);

	    function noop() {}

	    var PENDING = void 0;
	    var FULFILLED = 1;
	    var REJECTED = 2;

	    function selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then$$1.call(value, fulfillmentHandler, rejectionHandler);
	      } catch (e) {
	        return e;
	      }
	    }

	    function handleForeignThenable(promise, thenable, then$$1) {
	      asap(function (promise) {
	        var sealed = false;
	        var error = tryThen(then$$1, thenable, function (value) {
	          if (sealed) {
	            return;
	          }

	          sealed = true;

	          if (thenable !== value) {
	            resolve(promise, value);
	          } else {
	            fulfill(promise, value);
	          }
	        }, function (reason) {
	          if (sealed) {
	            return;
	          }

	          sealed = true;
	          reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          reject(promise, error);
	        }
	      }, promise);
	    }

	    function handleOwnThenable(promise, thenable) {
	      if (thenable._state === FULFILLED) {
	        fulfill(promise, thenable._result);
	      } else if (thenable._state === REJECTED) {
	        reject(promise, thenable._result);
	      } else {
	        subscribe(thenable, undefined, function (value) {
	          return resolve(promise, value);
	        }, function (reason) {
	          return reject(promise, reason);
	        });
	      }
	    }

	    function handleMaybeThenable(promise, maybeThenable, then$$1) {
	      if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	        handleOwnThenable(promise, maybeThenable);
	      } else {
	        if (then$$1 === undefined) {
	          fulfill(promise, maybeThenable);
	        } else if (isFunction(then$$1)) {
	          handleForeignThenable(promise, maybeThenable, then$$1);
	        } else {
	          fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function resolve(promise, value) {
	      if (promise === value) {
	        reject(promise, selfFulfillment());
	      } else if (objectOrFunction(value)) {
	        var then$$1 = void 0;

	        try {
	          then$$1 = value.then;
	        } catch (error) {
	          reject(promise, error);
	          return;
	        }

	        handleMaybeThenable(promise, value, then$$1);
	      } else {
	        fulfill(promise, value);
	      }
	    }

	    function publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      publish(promise);
	    }

	    function fulfill(promise, value) {
	      if (promise._state !== PENDING) {
	        return;
	      }

	      promise._result = value;
	      promise._state = FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        asap(publish, promise);
	      }
	    }

	    function reject(promise, reason) {
	      if (promise._state !== PENDING) {
	        return;
	      }

	      promise._state = REJECTED;
	      promise._result = reason;
	      asap(publishRejection, promise);
	    }

	    function subscribe(parent, child, onFulfillment, onRejection) {
	      var _subscribers = parent._subscribers;
	      var length = _subscribers.length;
	      parent._onerror = null;
	      _subscribers[length] = child;
	      _subscribers[length + FULFILLED] = onFulfillment;
	      _subscribers[length + REJECTED] = onRejection;

	      if (length === 0 && parent._state) {
	        asap(publish, parent);
	      }
	    }

	    function publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) {
	        return;
	      }

	      var child = void 0,
	          callback = void 0,
	          detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = isFunction(callback),
	          value = void 0,
	          error = void 0,
	          succeeded = true;

	      if (hasCallback) {
	        try {
	          value = callback(detail);
	        } catch (e) {
	          succeeded = false;
	          error = e;
	        }

	        if (promise === value) {
	          reject(promise, cannotReturnOwn());
	          return;
	        }
	      } else {
	        value = detail;
	      }

	      if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
	        resolve(promise, value);
	      } else if (succeeded === false) {
	        reject(promise, error);
	      } else if (settled === FULFILLED) {
	        fulfill(promise, value);
	      } else if (settled === REJECTED) {
	        reject(promise, value);
	      }
	    }

	    function initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value) {
	          resolve(promise, value);
	        }, function rejectPromise(reason) {
	          reject(promise, reason);
	        });
	      } catch (e) {
	        reject(promise, e);
	      }
	    }

	    var id = 0;

	    function nextId() {
	      return id++;
	    }

	    function makePromise(promise) {
	      promise[PROMISE_ID] = id++;
	      promise._state = undefined;
	      promise._result = undefined;
	      promise._subscribers = [];
	    }

	    function validationError() {
	      return new Error('Array Methods must be provided an Array');
	    }

	    var Enumerator = function () {
	      function Enumerator(Constructor, input) {
	        this._instanceConstructor = Constructor;
	        this.promise = new Constructor(noop);

	        if (!this.promise[PROMISE_ID]) {
	          makePromise(this.promise);
	        }

	        if (isArray(input)) {
	          this.length = input.length;
	          this._remaining = input.length;
	          this._result = new Array(this.length);

	          if (this.length === 0) {
	            fulfill(this.promise, this._result);
	          } else {
	            this.length = this.length || 0;

	            this._enumerate(input);

	            if (this._remaining === 0) {
	              fulfill(this.promise, this._result);
	            }
	          }
	        } else {
	          reject(this.promise, validationError());
	        }
	      }

	      Enumerator.prototype._enumerate = function _enumerate(input) {
	        for (var i = 0; this._state === PENDING && i < input.length; i++) {
	          this._eachEntry(input[i], i);
	        }
	      };

	      Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
	        var c = this._instanceConstructor;
	        var resolve$$1 = c.resolve;

	        if (resolve$$1 === resolve$1) {
	          var _then = void 0;

	          var error = void 0;
	          var didError = false;

	          try {
	            _then = entry.then;
	          } catch (e) {
	            didError = true;
	            error = e;
	          }

	          if (_then === then && entry._state !== PENDING) {
	            this._settledAt(entry._state, i, entry._result);
	          } else if (typeof _then !== 'function') {
	            this._remaining--;
	            this._result[i] = entry;
	          } else if (c === Promise$1) {
	            var promise = new c(noop);

	            if (didError) {
	              reject(promise, error);
	            } else {
	              handleMaybeThenable(promise, entry, _then);
	            }

	            this._willSettleAt(promise, i);
	          } else {
	            this._willSettleAt(new c(function (resolve$$1) {
	              return resolve$$1(entry);
	            }), i);
	          }
	        } else {
	          this._willSettleAt(resolve$$1(entry), i);
	        }
	      };

	      Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
	        var promise = this.promise;

	        if (promise._state === PENDING) {
	          this._remaining--;

	          if (state === REJECTED) {
	            reject(promise, value);
	          } else {
	            this._result[i] = value;
	          }
	        }

	        if (this._remaining === 0) {
	          fulfill(promise, this._result);
	        }
	      };

	      Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
	        var enumerator = this;
	        subscribe(promise, undefined, function (value) {
	          return enumerator._settledAt(FULFILLED, i, value);
	        }, function (reason) {
	          return enumerator._settledAt(REJECTED, i, reason);
	        });
	      };

	      return Enumerator;
	    }();
	    /**
	      `Promise.all` accepts an array of promises, and returns a new promise which
	      is fulfilled with an array of fulfillment values for the passed promises, or
	      rejected with the reason of the first passed promise to be rejected. It casts all
	      elements of the passed iterable to promises as it runs this algorithm.
	    
	      Example:
	    
	      ```javascript
	      let promise1 = resolve(1);
	      let promise2 = resolve(2);
	      let promise3 = resolve(3);
	      let promises = [ promise1, promise2, promise3 ];
	    
	      Promise.all(promises).then(function(array){
	        // The array here would be [ 1, 2, 3 ];
	      });
	      ```
	    
	      If any of the `promises` given to `all` are rejected, the first promise
	      that is rejected will be given as an argument to the returned promises's
	      rejection handler. For example:
	    
	      Example:
	    
	      ```javascript
	      let promise1 = resolve(1);
	      let promise2 = reject(new Error("2"));
	      let promise3 = reject(new Error("3"));
	      let promises = [ promise1, promise2, promise3 ];
	    
	      Promise.all(promises).then(function(array){
	        // Code here never runs because there are rejected promises!
	      }, function(error) {
	        // error.message === "2"
	      });
	      ```
	    
	      @method all
	      @static
	      @param {Array} entries array of promises
	      @param {String} label optional string for labeling the promise.
	      Useful for tooling.
	      @return {Promise} promise that is fulfilled when all `promises` have been
	      fulfilled, or rejected if any of them become rejected.
	      @static
	    */


	    function all(entries) {
	      return new Enumerator(this, entries).promise;
	    }
	    /**
	      `Promise.race` returns a new promise which is settled in the same way as the
	      first passed promise to settle.
	    
	      Example:
	    
	      ```javascript
	      let promise1 = new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve('promise 1');
	        }, 200);
	      });
	    
	      let promise2 = new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve('promise 2');
	        }, 100);
	      });
	    
	      Promise.race([promise1, promise2]).then(function(result){
	        // result === 'promise 2' because it was resolved before promise1
	        // was resolved.
	      });
	      ```
	    
	      `Promise.race` is deterministic in that only the state of the first
	      settled promise matters. For example, even if other promises given to the
	      `promises` array argument are resolved, but the first settled promise has
	      become rejected before the other promises became fulfilled, the returned
	      promise will become rejected:
	    
	      ```javascript
	      let promise1 = new Promise(function(resolve, reject){
	        setTimeout(function(){
	          resolve('promise 1');
	        }, 200);
	      });
	    
	      let promise2 = new Promise(function(resolve, reject){
	        setTimeout(function(){
	          reject(new Error('promise 2'));
	        }, 100);
	      });
	    
	      Promise.race([promise1, promise2]).then(function(result){
	        // Code here never runs
	      }, function(reason){
	        // reason.message === 'promise 2' because promise 2 became rejected before
	        // promise 1 became fulfilled
	      });
	      ```
	    
	      An example real-world use case is implementing timeouts:
	    
	      ```javascript
	      Promise.race([ajax('foo.json'), timeout(5000)])
	      ```
	    
	      @method race
	      @static
	      @param {Array} promises array of promises to observe
	      Useful for tooling.
	      @return {Promise} a promise which settles in the same way as the first passed
	      promise to settle.
	    */


	    function race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (!isArray(entries)) {
	        return new Constructor(function (_, reject) {
	          return reject(new TypeError('You must pass an array to race.'));
	        });
	      } else {
	        return new Constructor(function (resolve, reject) {
	          var length = entries.length;

	          for (var i = 0; i < length; i++) {
	            Constructor.resolve(entries[i]).then(resolve, reject);
	          }
	        });
	      }
	    }
	    /**
	      `Promise.reject` returns a promise rejected with the passed `reason`.
	      It is shorthand for the following:
	    
	      ```javascript
	      let promise = new Promise(function(resolve, reject){
	        reject(new Error('WHOOPS'));
	      });
	    
	      promise.then(function(value){
	        // Code here doesn't run because the promise is rejected!
	      }, function(reason){
	        // reason.message === 'WHOOPS'
	      });
	      ```
	    
	      Instead of writing the above, your code now simply becomes the following:
	    
	      ```javascript
	      let promise = Promise.reject(new Error('WHOOPS'));
	    
	      promise.then(function(value){
	        // Code here doesn't run because the promise is rejected!
	      }, function(reason){
	        // reason.message === 'WHOOPS'
	      });
	      ```
	    
	      @method reject
	      @static
	      @param {Any} reason value that the returned promise will be rejected with.
	      Useful for tooling.
	      @return {Promise} a promise rejected with the given `reason`.
	    */


	    function reject$1(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(noop);
	      reject(promise, reason);
	      return promise;
	    }

	    function needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.
	    
	      Terminology
	      -----------
	    
	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.
	    
	      A promise can be in one of three states: pending, fulfilled, or rejected.
	    
	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.
	    
	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.
	    
	    
	      Basic Usage:
	      ------------
	    
	      ```js
	      let promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);
	    
	        // on failure
	        reject(reason);
	      });
	    
	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	    
	      Advanced Usage:
	      ---------------
	    
	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.
	    
	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          let xhr = new XMLHttpRequest();
	    
	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();
	    
	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }
	    
	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	    
	      Unlike callbacks, promises are great composable primitives.
	    
	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON
	    
	        return values;
	      });
	      ```
	    
	      @class Promise
	      @param {Function} resolver
	      Useful for tooling.
	      @constructor
	    */


	    var Promise$1 = function () {
	      function Promise(resolver) {
	        this[PROMISE_ID] = nextId();
	        this._result = this._state = undefined;
	        this._subscribers = [];

	        if (noop !== resolver) {
	          typeof resolver !== 'function' && needsResolver();
	          this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	        }
	      }
	      /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	       ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	       Chaining
	      --------
	       The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	       ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	       findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	       ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	       Assimilation
	      ------------
	       Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	       ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	       If the assimliated promise rejects, then the downstream promise will also reject.
	       ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	       Simple Example
	      --------------
	       Synchronous Example
	       ```javascript
	      let result;
	       try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	       Errback Example
	       ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	       Promise Example;
	       ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	       Advanced Example
	      --------------
	       Synchronous Example
	       ```javascript
	      let author, books;
	       try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	       Errback Example
	       ```js
	       function foundBooks(books) {
	       }
	       function failure(reason) {
	       }
	       findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	       Promise Example;
	       ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	       @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	      */

	      /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	      ```js
	      function findAuthor(){
	      throw new Error('couldn't find that author');
	      }
	      // synchronous
	      try {
	      findAuthor();
	      } catch(reason) {
	      // something went wrong
	      }
	      // async with promises
	      findAuthor().catch(function(reason){
	      // something went wrong
	      });
	      ```
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	      */


	      Promise.prototype.catch = function _catch(onRejection) {
	        return this.then(null, onRejection);
	      };
	      /**
	        `finally` will be invoked regardless of the promise's fate just as native
	        try/catch/finally behaves
	      
	        Synchronous example:
	      
	        ```js
	        findAuthor() {
	          if (Math.random() > 0.5) {
	            throw new Error();
	          }
	          return new Author();
	        }
	      
	        try {
	          return findAuthor(); // succeed or fail
	        } catch(error) {
	          return findOtherAuther();
	        } finally {
	          // always runs
	          // doesn't affect the return value
	        }
	        ```
	      
	        Asynchronous example:
	      
	        ```js
	        findAuthor().catch(function(reason){
	          return findOtherAuther();
	        }).finally(function(){
	          // author was either found, or not
	        });
	        ```
	      
	        @method finally
	        @param {Function} callback
	        @return {Promise}
	      */


	      Promise.prototype.finally = function _finally(callback) {
	        var promise = this;
	        var constructor = promise.constructor;

	        if (isFunction(callback)) {
	          return promise.then(function (value) {
	            return constructor.resolve(callback()).then(function () {
	              return value;
	            });
	          }, function (reason) {
	            return constructor.resolve(callback()).then(function () {
	              throw reason;
	            });
	          });
	        }

	        return promise.then(callback, callback);
	      };

	      return Promise;
	    }();

	    Promise$1.prototype.then = then;
	    Promise$1.all = all;
	    Promise$1.race = race;
	    Promise$1.resolve = resolve$1;
	    Promise$1.reject = reject$1;
	    Promise$1._setScheduler = setScheduler;
	    Promise$1._setAsap = setAsap;
	    Promise$1._asap = asap;
	    /*global self*/

	    function polyfill() {
	      var local = void 0;

	      if (typeof commonjsGlobal !== 'undefined') {
	        local = commonjsGlobal;
	      } else if (typeof self !== 'undefined') {
	        local = self;
	      } else {
	        try {
	          local = Function('return this')();
	        } catch (e) {
	          throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	      }

	      var P = local.Promise;

	      if (P) {
	        var promiseToString = null;

	        try {
	          promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {// silently ignored
	        }

	        if (promiseToString === '[object Promise]' && !P.cast) {
	          return;
	        }
	      }

	      local.Promise = Promise$1;
	    } // Strange compat..


	    Promise$1.polyfill = polyfill;
	    Promise$1.Promise = Promise$1;
	    return Promise$1;
	  });
	});

	var Promise$1 = es6Promise.Promise;

	(function (window) {
	  var html = '\
		<div class="reveal reveal-msg" data-reveal="">\
			<h3 class="reveal-msg__title text-center">標題</h3>\
			<p class="reveal-msg__desc text-center"><small>敘述</small></p>\
			<div class="button-box grid-x">\
			</div>\
		</div>\
	';

	  var btnConfirm = '<button class="btn btn-confirm" type="button" data-close="">確認</button>'; // 綠色按鈕
	  // const btnWarning = '<button class="btn alert" type="button" data-close="">確認</button>'; // 紅色按鈕
	  var btnCancel = '<button class="btn hollow btn-cancel" data-close="" aria-label="關閉彈窗" type="button">取消</button>';var

	  PopupModule = /*#__PURE__*/function () {
	    function PopupModule(type) {_classCallCheck(this, PopupModule);
	      // Prevent run in Node env
	      if (typeof window === 'undefined') {
	        return false;
	      }

	      // [START] Init Popup
	      // 設定 Default 變數
	      var defaultOpt = {
	        title: '標題',
	        text: null,
	        confirmButtonText: null, // 確認、右邊按鈕文字
	        cancelButtonText: null, // 取消、左邊按鈕文字
	        clickClose: true // 點擊Popup外圍是否會關閉彈窗
	      };

	      // 處理帶入的變數
	      var argsOpt = {};
	      if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 1) {
	        argsOpt = {
	          title: arguments.length <= 1 ? undefined : arguments[1],
	          text: arguments.length <= 2 ? undefined : arguments[2] };

	      } else if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string') {
	        argsOpt = {
	          title: arguments.length <= 1 ? undefined : arguments[1] };

	      } else {
	        argsOpt = arguments.length <= 1 ? undefined : arguments[1];
	      }

	      var opt = _objectSpread2(_objectSpread2({},
	      defaultOpt),
	      argsOpt);


	      // Promise 變數
	      this._result = null;
	      this._resolve = null;
	      this._reject = null;

	      return this._init(type, opt);
	    }_createClass(PopupModule, [{ key: "_init", value:

	      function _init(type, opt) {
	        // 定義DOM內容
	        var el = createElementFromHTML(html);
	        var $el = $(el);

	        // 標題
	        el.querySelector('.reveal-msg__title').innerHTML = opt.title;

	        // 內容
	        var descEl = el.querySelector('.reveal-msg__desc');
	        if (opt.text) {
	          descEl.innerHTML = opt.text;
	        } else {
	          descEl.remove();
	        }

	        // 按鈕
	        var btnBox = el.querySelector('.button-box');
	        var btnCancelEl = createElementFromHTML(btnCancel);
	        var btnConfirmEl = createElementFromHTML(btnConfirm);
	        switch (type) {
	          case 'confirm':
	            // 只兩個按鈕，左取消，右確認（綠色）
	            btnBox.appendChild(btnCancelEl);
	            btnBox.appendChild(btnConfirmEl);
	            break;
	          case 'warning':
	            // 只兩個按鈕，左取消，右確認（紅色）
	            btnBox.appendChild(btnCancelEl);
	            btnBox.appendChild(btnConfirmEl);
	            btnConfirmEl.classList.add('alert');
	            break;
	          case 'error':
	            // 只兩個按鈕，左取消，右確認（紅色）
	            btnBox.appendChild(btnConfirmEl);
	            btnConfirmEl.classList.add('alert');
	            btnConfirmEl.classList.add('w-full');
	            break;
	          default:
	            // 只有一按鈕「確認」
	            btnBox.appendChild(btnConfirmEl);
	            btnConfirmEl.classList.add('w-full');
	            break;}


	        var btnCancelElCurrent = btnBox.querySelector('.btn-confirm');
	        var btnConfirmElCurrent = btnBox.querySelector('.btn-cancel');

	        // 按鈕 - 確認
	        if (opt.confirmButtonText && btnCancelElCurrent) {
	          btnCancelElCurrent.innerHTML = opt.confirmButtonText;
	        }

	        // 按鈕 - 取消
	        if (opt.cancelButtonText && btnConfirmElCurrent) {
	          btnConfirmElCurrent.innerHTML = opt.cancelButtonText;
	        }

	        // ================================

	        var domCache = {
	          el: el,
	          $el: $el,
	          confirmButton: btnCancelElCurrent,
	          cancelButton: btnConfirmElCurrent };


	        // ================================

	        // 生成 Popup (Foundation)
	        var popupOpt = {
	          closeOnClick: opt.clickClose,
	          closeOnEsc: opt.clickClose };


	        new Foundation.Reveal($el, popupOpt);

	        // 定義關閉事件 => 刪除 DOM
	        $el.on('closed.zf.reveal', function () {
	          var $this = $(this);
	          setTimeout(function () {
	            $this.parent().remove();
	          }, 100);
	        });

	        // 開啟 Popup
	        $el.foundation('open');
	        // [END] Init Popup

	        // ================================

	        // [START] Promise
	        return this._result = this._promise(domCache);
	        // [END] Promise
	      }

	      // Promise 思路參考(Angular)：
	      // https://www.grapecity.com/blogs/implementing-modal-dialog-functions-promise-based-dialog-results-angular
	    }, { key: "_promise", value: function _promise(domCache) {var _this = this;
	        return new Promise$1(function (resolve, reject) {
	          _this._resolve = resolve;
	          _this._reject = reject;

	          var result = {
	            ok: false, // 是否選擇確認
	            cancel: false // 是否選擇取消
	          };

	          if (domCache.confirmButton) {
	            domCache.confirmButton.addEventListener('click', function () {
	              result.ok = true;
	              resolve(result);
	            });
	          }

	          if (domCache.cancelButton) {
	            domCache.cancelButton.addEventListener('click', function () {
	              result.cancel = true;
	              resolve(result);
	            });
	          }

	          domCache.$el.on('closed.zf.reveal', function () {
	            resolve(result);
	          });
	        });
	      } }]);return PopupModule;}();


	  function popup(type) {
	    var popupEl;
	    if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 1) {
	      popupEl = new PopupModule(type, arguments.length <= 1 ? undefined : arguments[1]);
	    } else {
	      popupEl = new PopupModule(type, arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]);
	    }

	    return popupEl;
	  }

	  window.popup = popup;

	})(window);

	// Popup Test
	// popup('alert', {
	//     title: '此帳號目前不可使用此功能<br>請洽客服',
	//     confirmButtonText: '返回背包'
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊返回背包')
	//     }
	// });


	// popup('confirm', {
	//     title: '刊登成功',
	//     confirmButtonText: '查看我的商品',
	//     cancelButtonText: '回到背包',
	//     clickClose: false
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 查看我的商品')
	//     } else if (result.cancel) {
	//         console.log('點擊 回到背包')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('confirm', {
	//    title: '是否將此帳戶設為<br>預設收款帳戶？',
	//    confirmButtonText: '設為預設'
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 設為預設')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('warning', {
	//    title: '是否移除此帳戶？',
	//    confirmButtonText: '移除'
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 移除')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('warning', {
	//    title: '確定取消刊登？',
	//    confirmButtonText: '取消刊登',
	//    cancelButtonText: '我再想想'
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 取消刊登')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('confirm', {
	//    title: '提領收益前，請先設定收款帳戶',
	//    confirmButtonText: '前往設定',
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 前往設定')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('confirm', {
	//    title: '提領收益前，請先完成實名制認證',
	//    confirmButtonText: '前往認證',
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 前往認證')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('warning', {
	//    title: '是否移除所有紀錄？',
	//    confirmButtonText: '移除',
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 移除')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('confirm', {
	//    title: '轉出費用確認',
	//    text: '您轉出到區塊鏈的費用折合約NTD$28',
	//    confirmButtonText: '付款',
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 付款')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	// popup('confirm', {
	//    title: '需要開啟 MetaMask 登入區塊鏈錢包',
	//    confirmButtonText: '開啟應用程式',
	// }).then( function(result) {
	//     console.log(result)
	//     if (result.ok) {
	//         console.log('點擊 開啟應用程式')
	//     } else {
	//         console.log('Any Other')
	//     }
	// });

	/*global EaseScroll, lazyload*/
	// import { EPSILON } from 'core-js/core/number';

	/* ---------------------------------------- [START] IE Global Setting */
	// 舊IE提醒
	var userAgent = window.navigator.userAgent;
	if (
	userAgent.indexOf('MSIE 7.0') > 0 ||
	userAgent.indexOf('MSIE 8.0') > 0 ||
	userAgent.indexOf('MSIE 9.0') > 0 ||
	userAgent.indexOf('MSIE 10.0') > 0
	// !!userAgent.match(/Trident.*rv\:11\./) // IE11
	) {
	  location.href = 'browser.html';
	}

	/* 防止IE沒有 JS element.remove() */
	/* Create Element.remove() function if not exist */
	if (!('remove' in Element.prototype)) {
	  Element.prototype.remove = function () {
	    if (this.parentNode) {
	      this.parentNode.removeChild(this);
	    }
	  };
	}

	/* 防止IE沒有 forEach */
	if (typeof NodeList.prototype.forEach !== 'function') {
	  NodeList.prototype.forEach = Array.prototype.forEach;
	}

	/* 防止IE沒有 object 沒有 find */
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	if (!Array.prototype.find) {
	  Object.defineProperty(Array.prototype, 'find', {
	    value: function value(predicate) {
	      // 1. Let O be ? ToObject(this value).
	      if (this == null) {
	        throw new TypeError('"this" is null or not defined');
	      }

	      var o = Object(this);

	      // 2. Let len be ? ToLength(? Get(O, "length")).
	      var len = o.length >>> 0;

	      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate must be a function');
	      }

	      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
	      var thisArg = arguments[1];

	      // 5. Let k be 0.
	      var k = 0;

	      // 6. Repeat, while k < len
	      while (k < len) {
	        // a. Let Pk be ! ToString(k).
	        // b. Let kValue be ? Get(O, Pk).
	        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
	        // d. If testResult is true, return kValue.
	        var kValue = o[k];
	        if (predicate.call(thisArg, kValue, k, o)) {
	          return kValue;
	        }
	        // e. Increase k by 1.
	        k++;
	      }

	      // 7. Return undefined.
	      return undefined;
	    } });

	}
	/* ---------------------------------------- [END] IE Global Setting */

	(function (window, document) {
	  /* ---------------------------------------- [START] Windows Setting */
	  var html = document.documentElement;
	  var ww = window.innerWidth;
	  var wh = window.innerHeight;
	  var ws = 0;
	  function getScrollTop() {var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	    return (target.pageYOffset || html.scrollTop) - (html.clientTop || 0);
	  }
	  function getWinSet() {
	    ww = window.innerWidth;
	    wh = window.innerHeight;
	    ws = getScrollTop();
	  }
	  on(window, 'load:origin', getWinSet);
	  on(window, 'resize', throttle(getWinSet, 50, 100));
	  /* ---------------------------------------- [END] Windows Setting */

	  /* ---------------------------------------- [START] 取得裝置判斷 */
	  // 取得裝置判斷
	  var isMobile = false;

	  var deviceDetect = function deviceDetect() {

	    // IsMobile
	    // 防止測試時一直用開發者工具Resize出現Bug
	    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	    if (isMobile) html.classList.add('is-mobile');else
	    html.classList.remove('is-mobile');

	    // IsTablet
	    if (navigator.userAgent.match(/Android/i)) {
	      if (!navigator.userAgent.match(/Mobile/i)) ;
	    } else if (navigator.userAgent.match(/BlackBerry|iPad|Opera Mini|IEMobile/i)) ;
	  };

	  deviceDetect();
	  on(window, 'resize', throttle(deviceDetect, 50, 100));
	  /* ---------------------------------------- [END] 取得裝置判斷 */

	  /* ---------------------------------------- [START] 判斷browser */
	  var ua = navigator.userAgent;
	  var browser = {
	    isChrome: /chrome/i.test(ua),
	    isFirefox: /firefox/i.test(ua),
	    isSafari: /safari/i.test(ua),
	    isIE: /msie/i.test(ua) || /trident/i.test(ua),
	    isEdge: /edge/i.test(ua) };


	  // 修正數值browser
	  if (browser.isChrome) browser.isSafari = false;
	  if (browser.isEdge) {
	    browser.isChrome = false;
	    browser.isSafari = false;
	  }

	  var browserIs;
	  for (var key in browser) {
	    if (browser[key]) {
	      browserIs = key.split('is')[1];
	      // 增加Class
	      document.documentElement.classList.add(browserIs.toLowerCase());
	      document.documentElement.browser = browserIs;
	      break;
	    }
	  }
	  browser.is = browserIs;

	  // ----------------------------
	  // 判斷 裝置
	  // iOS
	  var isiOS = ua.toLowerCase().match(/(iphone|ipod|ipad)/);
	  isiOS && html.classList.add('ios');
	  // ----------------------------
	  // 判斷系統 Windows or Mac
	  if (navigator.platform.indexOf('Win') > -1) {
	    document.documentElement.classList.add('win');
	  } else if (navigator.platform.indexOf('Mac') > -1) {
	    document.documentElement.classList.add('mac');
	  }
	  /* ---------------------------------------- [END] 判斷browser */

	  /* ----------------------------------- [START] Loader 移除 */
	  var loader = null;
	  var loaderRemove = function loaderRemove() {
	    loader = document.querySelector('#loader');
	    window.loader = loader; // 加到 window 上
	  };
	  on(window, 'load:origin', loaderRemove);

	  /* 頁面可呼叫的 function -------- */
	  /* 開啟 Loading */
	  window.pageLoading = function () {
	    document.body.appendChild(loader);
	    setTimeout(function () {
	      loader.classList.remove('is-loaded');
	    }, 100);
	  };

	  /* 關閉 Loading */
	  window.pageLoaded = function () {
	    loader.classList.add('is-loaded');
	    setTimeout(function () {
	      loader.remove();
	    }, 2000);
	  };
	  /* ----------------------------------- [END] Loader 移除 */

	  /* ---------------------------------------- [START] Fetch Svg Inline */
	  function buildSvgFetchInline() {
	    var svgImgs = document.querySelectorAll('.svg');
	    [].forEach.call(svgImgs, function (svg) {
	      fetchSvgInline(svg);
	    });
	  }
	  on(window, 'load', buildSvgFetchInline);
	  /* ---------------------------------------- [END] Fetch Svg Inline */

	  /* ---------------------------------------- [START] Toast:Notyf */
	  // Ref: https://github.com/caroso1222/notyf
	  function buildToast() {
	    var notyf = new Notyf({
	      // duration: 1000000,
	      ripple: false,
	      position: {
	        x: 'center',
	        y: 'center' } });


	    window.notyf = notyf;
	  }
	  on(window, 'load:origin', buildToast);
	  /* ---------------------------------------- [END] Toast:Notyf */

	  /* ----------------------------------- [START] Foundation */
	  /* Init Foundation  */
	  // Popup(Reveal) - Open
	  function fdReveal() {
	    $(document).on('open.zf.reveal', '[data-reveal]', function () {
	      // 調整內容為垂直置中
	      var $self = $(this);
	      var top = (wh - $self.innerHeight()) / 2;
	      if (top < 0) top = 0;
	      $self.css('top', top);

	      // 移除Focus狀態
	      $self.blur();
	    });
	  }

	  function fdDropdown() {
	    var dropdownActive = null; // 紀錄目前開啟的 Dropdown
	    var dropdownAnchor = null;
	    // =========== Document Event

	    var anchorClick = function anchorClick() {
	      dropdownClose();
	    };

	    // =========== Panel Event

	    function dropdownClose() {
	      dropdownActive && $(dropdownActive).foundation('close');
	      dropdownAnchor && dropdownAnchor.off('click', anchorClick);

	      dropdownActive = null;
	      dropdownAnchor = null;
	    }

	    // =========== Event

	    $(document).on('show.zf.dropdown', function (e) {
	      dropdownActive = e.target;

	      // 點擊子內容 <a>, <button> 關閉面板
	      // .dropdown-panel 要增加屬性 data-close-on-inside-click="true"
	      if ($(dropdownActive).attr('data-close-on-inside-click') === 'true') {
	        dropdownAnchor = $(dropdownActive).find('a, button');

	        setTimeout(function () {
	          dropdownAnchor.on('click', anchorClick);
	        }, 100);
	      }
	    });

	    $(document).on('hide.zf.dropdown', function (e) {
	      dropdownClose();
	    });
	  }

	  function fdDropdownMenu() {
	    $(document).on('click', '.dropdown-menu a, .dropdown-menu button', function () {
	      var $this = $(this);
	      setTimeout(function () {
	        $this.parents('.dropdown-menu').foundation('close');
	      }, 100);
	    });
	  }

	  function fdTab() {
	    $(document).on('change.zf.tabs', '[data-tabs]', function () {
	      window.lazy.load(); // Load Content Image
	    });
	  }

	  // 使用原生load
	  // 因為 Foundation 的呼叫方式可以不延遲生成
	  on(window, 'load:origin', function () {
	    // Start
	    $(document).foundation();

	    fdReveal(); // Popup - Open
	    fdDropdown(); // Dropdown
	    fdDropdownMenu(); // Dropdown + 手刻Menu(非Foundation component "Dropdown Menu")
	    fdTab(); // Tab
	  });
	  /* ----------------------------------- [END] Foundation */

	  /* ----------------------------------- [START] 選單下滑更改樣式 */
	  // const doc = document.documentElement;
	  var header = null;
	  var headerClassScroll = 'is-collapse';
	  var headerClassScrollDown = 'is-scroll-down';
	  var headerClassScrollUp = 'is-scroll-up';

	  var windowScrollTopCache = getScrollTop();
	  var windowScrollStatus = null;

	  /**
	   * 更改向上滑動與向下滑動狀態
	   * @param {string} dir 滑動方向，輸入['down'|'up']
	   */
	  function scrollStatusChange(dir) {
	    if (windowScrollStatus === dir) {
	      return false;
	    } else {
	      if (dir === 'down') {
	        scrollStatusDown(header);
	        scrollStatusDown(html);
	      } else {
	        scrollStatusUp(header);
	        scrollStatusUp(html);
	      }
	      windowScrollStatus = dir;
	    }
	  }

	  function scrollStatusDown(el) {
	    el.classList.add(headerClassScrollDown);
	    el.classList.remove(headerClassScrollUp);
	  }

	  function scrollStatusUp(el) {
	    el.classList.remove(headerClassScrollDown);
	    el.classList.add(headerClassScrollUp);
	  }

	  /* 滑動主要Function */
	  function headerScrollHandler() {
	    ws = getScrollTop();

	    // 確認上滑與下滑狀態
	    if (ws > windowScrollTopCache) {
	      scrollStatusChange('down');
	    } else if (ws !== windowScrollTopCache) {
	      scrollStatusChange('up');
	    }
	    windowScrollTopCache = ws;

	    // 下滑超過一定高度出現樣式：更改選單樣式、GoTop隱藏出現
	    if (ws > 0) {
	      header.classList.add(headerClassScroll);
	      html.classList.add(headerClassScroll);
	    } else {
	      header.classList.remove(headerClassScroll);
	      html.classList.remove(headerClassScroll);
	    }
	  }
	  on(window, 'load', function () {
	    // 因為全站安裝Vue，所以所有讀取物件的項目都要延遲運作
	    header = document.querySelector('#header');
	    headerScrollHandler();
	    on(window, 'scroll', headerScrollHandler);
	  });
	  /* ----------------------------------- [END] 選單下滑更改樣式 */

	  /* ---------------------------------------- [START] Placeholder Change on Small (Mobile) */
	  // const placeholderChangeEls = document.querySelectorAll('[data-placeholder-large]');
	  // function placeholderChangeBuild() {
	  // 	[].forEach.call(placeholderChangeEls, (item) => {
	  // 		// [START] 讀取屬性 =========================
	  // 		const bp = item.getAttribute('data-placeholder-bp'); // 要於多少更換large

	  // 		const setting = {
	  // 			normal: item.getAttribute('placeholder'),
	  // 			large: item.getAttribute('data-placeholder-large'),
	  // 			bp: bp || '1024'
	  // 		}

	  // 		item.placeholderSetting = setting; // 至於物件上

	  // 		// 刪除屬性
	  // 		item.removeAttribute('data-placeholder-large');
	  // 		bp && item.removeAttribute('data-placeholder-bp');
	  // 		// [END] 讀取屬性 =========================

	  // 		// [START] Change =========================
	  // 		// 更換長提示
	  // 		const placeholderChangeLarge = function() {
	  // 			if (item.placeholderSetting) {
	  // 				item.placeholder = item.placeholderSetting.large;
	  // 			}
	  // 		}

	  // 		// 更換短提示
	  // 		const placeholderChangeSmall = function() {
	  // 			if (item.placeholderSetting) {
	  // 				item.placeholder = item.placeholderSetting.normal;
	  // 			}
	  // 		}
	  // 		// [END] Change =========================

	  // 		// [START] Breakpoint =========================
	  // 		const breakpoint = window.matchMedia(`(min-width: ${setting.bp}px)`); // This point up use long text
	  // 		const breakpointChecker = function() {
	  // 			if (breakpoint.matches) {
	  // 				// Large
	  // 				placeholderChangeLarge();
	  // 			} else {
	  // 				// Small
	  // 				placeholderChangeSmall();
	  // 			}
	  // 		}
	  // 		// [END] Breakpoint =========================

	  // 		// [START] Start =========================
	  // 		breakpointChecker();
	  // 		breakpoint.addListener(breakpointChecker);
	  // 		// [END] Start =========================
	  // 	});
	  // }
	  // on(window, 'load', function () {
	  // 	if (placeholderChangeEls.length) {
	  // 		placeholderChangeBuild();
	  // 	}
	  // });
	  /* ---------------------------------------- [END] Placeholder Change on Small (Mobile) */

	  /* ---------------------------------------- [START] Search Panel */
	  function searchPanelBuild() {
	    var searchGroup = document.querySelectorAll('.js-search-group'); // Group Search

	    var isOpen = 'is-open';
	    var isFocus = 'is-focus';
	    var isSearching = 'is-searching';

	    // Search Group Component
	    [].forEach.call(searchGroup, function (item) {
	      var input = item.querySelector('.hd-search__input'); // 輸入框
	      var btnSubmit = item.querySelector('.hd-search__btn-submit'); // 送出
	      var btnReset = item.querySelector('.hd-search__btn-reset'); // 重設

	      var searchElClassAdd = function searchElClassAdd(className) {
	        // header.classList.add(className);
	        item.classList.add(className);
	      };

	      var searchElClassRemove = function searchElClassRemove(className) {
	        // header.classList.remove(className);
	        item.classList.remove(className);
	      };

	      var searchCheckValue = function searchCheckValue(el) {
	        var target = el.tagName ? el : el.currentTarget;
	        if (target.value.trim().length > 0) {
	          searchElClassAdd(isSearching);
	          btnSubmit.disabled = false;
	        } else {
	          searchElClassRemove(isSearching);
	          btnSubmit.disabled = true;
	        }
	      };

	      // 輸入框 =========
	      on(input, 'focus', function () {
	        searchElClassAdd(isFocus);
	      });

	      on(input, 'focusout', function () {
	        searchElClassRemove(isFocus);
	      });

	      on(input, 'input', searchCheckValue);
	      on(input, 'change', function () {var _this = this;
	        setTimeout(function () {
	          searchCheckValue(_this);
	        }, 20);
	      });

	      // 重設 =========
	      on(btnReset, 'click', function () {
	        setTimeout(function () {
	          searchCheckValue(input);
	        }, 10);
	      });
	    });

	    // ==========================================
	    // Hd Search
	    var hdSearch = document.querySelector('#hd-search');
	    var hdBtnOpen = document.querySelectorAll('.js-search-open');
	    var hdBtnClose = hdSearch.querySelectorAll('[data-close]');
	    var hdInput = hdSearch.querySelector('.hd-search__input');

	    var hdSearchClassAdd = function hdSearchClassAdd(className) {
	      hdSearch.classList.add(className);
	    };

	    var hdSearchClassRemove = function hdSearchClassRemove(className) {
	      hdSearch.classList.remove(className);
	    };

	    var hdSearchPanelOpen = function hdSearchPanelOpen() {
	      hdSearchClassAdd(isOpen);
	    };

	    var hdSearchPanelClose = function hdSearchPanelClose() {
	      hdSearchClassRemove(isOpen);
	    };

	    [].forEach.call(hdBtnOpen, function (el) {
	      on(el, 'click', hdSearchPanelOpen);
	    });

	    [].forEach.call(hdBtnClose, function (el) {
	      on(el, 'click', hdSearchPanelClose);
	    });

	    on(hdInput, 'focus', function () {
	      hdSearchPanelOpen();
	    });
	  }
	  on(window, 'load', searchPanelBuild);
	  /* ---------------------------------------- [END] Search Panel */

	  /* ---------------------------------------- [START] Fixed Menu */
	  var fixedIsInit = false;
	  var fixedEls = null;
	  var fixedClassFixed = 'is-fixed'; // Fixed 樣式
	  var fixedClassFixedBottom = 'is-fixed-bottom'; // 是否「到達底部」class
	  var fixedClassHideShadow = 'hide-shadow'; // Header Hide Shadow

	  function fixedScroll() {

	    if (fixedEls.length) {
	      [].forEach.call(fixedEls, function (item) {
	        if (checkFixedBreakpoint(item)) {
	          var wrapper = item.dataset['fixedTarget'] !== undefined ? document.querySelector(item.dataset['fixedTarget']) : item.parentElement.dataset['fixedContainer'] !== undefined ? item.parentElement : null;
	          var marginTop = isMobile ? 56 : item.dataset['marginTop'] ? parseInt(item.dataset['marginTop']) : 0;

	          var rectObj = wrapper.getBoundingClientRect();
	          var rect = item.dataset['fixedDir'] === "bottom" ? rectObj.bottom : rectObj.top;

	          // 是否隱藏 header Shadow，預設是
	          var hideShadow = item.dataset['hideShadow'] === 'false' ? false : true;

	          if (rect <= marginTop) {
	            item.classList.add(fixedClassFixed);
	            hideShadow && header.classList.add(fixedClassHideShadow);
	          } else {
	            item.classList.remove(fixedClassFixed);
	            hideShadow && header.classList.remove(fixedClassHideShadow);
	          }

	          // =====

	          // 是否監測「到達底部」
	          var detectBottom = item.dataset['detectBottom'] === 'true';

	          // 是否「到達底部」
	          if (detectBottom) {
	            if (rectObj.bottom <= item.clientHeight + marginTop) {
	              item.classList.add(fixedClassFixedBottom);
	            } else {
	              item.classList.remove(fixedClassFixedBottom);
	            }
	          }
	        }
	      });
	    }
	  }

	  // 檢查是否要觸發
	  function checkFixedBreakpoint(param) {
	    var fixedOn = param.dataset['fixedOn'] !== undefined ? param.dataset['fixedOn'] : null;
	    var fixedDown = param.dataset['fixedDown'] !== undefined ? param.dataset['fixedDown'] : null;
	    var result = false;

	    var obj = {
	      'small': 0,
	      'medium': 640,
	      'large': 1024,
	      'xlarge': 1200,
	      'xxlarge': 1440 };


	    if (fixedOn && fixedOn.length) {
	      result = ww >= obj[fixedOn] ? true : false;
	    } else {
	      result = ww < obj[fixedDown] ? true : false;
	    }

	    if (!fixedOn && !fixedDown) {
	      result = true;
	    }

	    return result;
	  }

	  function fixedInit() {
	    if (fixedEls.length) {
	      [].forEach.call(fixedEls, function (item) {
	        // 是否監測「寬度」
	        var detectWidth = item.dataset['detectWidth'] === 'true';

	        // 計算給予寬度
	        if (detectWidth) {
	          if (checkFixedBreakpoint(item)) {
	            item.style.width = ''; // 清除原本的
	            item.style.position = 'static'; // 改回一般的position => 才不會讀取到錯誤的寬
	            item.style.width = item.clientWidth + 'px';
	            item.style.position = ''; // 清除
	          } else {
	            item.style.width = ''; // 清除原本的
	          }
	        }
	      });

	      // Event Listener
	      if (!fixedIsInit) {
	        fixedIsInit = true;
	        on(window, 'scroll', fixedScroll);
	        on(window, 'resize', fixedInit);
	      }

	      // Event Start
	      fixedScroll();
	    }
	  }

	  on(window, 'load', function () {
	    fixedEls = document.querySelectorAll('[data-fixed]');
	    fixedInit();
	  });

	  /* ---------------------------------------- [END] Fixed Menu */

	  /* ----------------------------------- [START] Anchor Disabled */
	  function anchorDisabledBuild() {
	    // 為了避免DOM延後生成，改用jQ呼叫
	    $(document).on('click', 'a[disabled]', function (e) {
	      e.preventDefault();
	    });
	  }
	  on(window, 'load', anchorDisabledBuild);
	  /* ----------------------------------- [END] Anchor Disabled */

	  /* ----------------------------------- [START] 加入書籤 */
	  function favBuild() {
	    // const favEls = document.querySelectorAll('.js-fav');
	    // [].forEach.call(favEls, (item) => {
	    // 	item.addEventListener('click', function() {
	    // 		this.blur();
	    // 		this.classList.toggle('is-active');
	    // 	});
	    // });

	    // 為了避免DOM延後生成，改用jQ呼叫
	    $(document).on('click', '.js-fav', function () {
	      this.blur();
	      this.classList.toggle('is-active');
	    });
	  }
	  on(window, 'load', favBuild);
	  /* ----------------------------------- [END] 加入書籤 */

	  /* ----------------------------------- [START] 載入更多 */
	  function loadMoreBuild() {
	    // const favEls = document.querySelectorAll('.js-load-more');
	    // [].forEach.call(favEls, (item) => {
	    // 	item.addEventListener('click', function() {
	    // 		this.blur();
	    // 		this.classList.toggle('is-loading');
	    // 	});
	    // });

	    // 為了避免DOM延後生成，改用jQ呼叫
	    $(document).on('click', '.js-load-more', function () {
	      this.blur();
	      this.classList.toggle('is-loading');
	    });
	  }
	  on(window, 'load', loadMoreBuild);
	  /* ----------------------------------- [END] 載入更多 */

	  /* ----------------------------------- [START] Go To Top */
	  function clickScrollTop() {
	    $(document).on('click', '.js-gotop', function () {
	      $('html, body').animate({
	        scrollTop: 0 },
	      550);
	    });
	  }

	  on(window, 'load', clickScrollTop);
	  /* ----------------------------------- [END] Go To Top */

	  /* ----------------------------------- [START] 滾動區塊底部漸層 */
	  function checkIfScrollIfHide() {
	    var scrollEls = document.querySelectorAll('[data-scroll-cont]');

	    if (scrollEls.length) {
	      [].forEach.call(scrollEls, function (item) {
	        item.addEventListener('scroll', function () {checkFun(item);});
	      });
	    }
	  }

	  function checkFun(item) {
	    if (item.scrollHeight >= item.offsetHeight) {// 有滾動軸時
	      if (item.offsetHeight + item.scrollTop >= item.scrollHeight) {
	        item.classList.add('is-end');
	      } else {
	        item.classList.remove('is-end');
	      }
	    } else {
	      item.classList.add('is-end');
	    }
	  }

	  // 打開 popup 後判斷是否有滾軸
	  $(document).on('open.zf.reveal', '[data-reveal]', function () {
	    var scrollEls = document.querySelectorAll('[data-scroll-cont]');
	    if (scrollEls.length) {
	      [].forEach.call(scrollEls, function (item) {checkFun(item);});
	    }
	  });

	  on(window, 'load', checkIfScrollIfHide);
	  /* ----------------------------------- [END] 滾動區塊底部漸層 */

	  /* ----------------------------------- [START] Textarea */
	  // Change Textarea Height
	  // https://stackoverflow.com/a/5665555
	  var autoSize = function autoSize(elem) {
	    elem.style.height = 'auto';

	    var newHeight = elem.scrollHeight <= elem.autoSize.minHeight ?
	    elem.autoSize.minHeight :
	    elem.scrollHeight >= elem.autoSize.maxHeight ?
	    elem.autoSize.maxHeight :
	    elem.scrollHeight + elem.autoSize.borderY;

	    elem.style.height = newHeight.toString() + 'px';
	  };

	  var textareaFn = function textareaFn(el) {
	    if (!el.autoSize) {
	      var $el = $(el);

	      var set = {
	        el: el,
	        $el: $el,
	        oneLine: parseInt($el.css('line-height')),
	        paddingY: parseInt($el.css('padding-top')) + parseInt($el.css('padding-bottom')),
	        borderY: parseInt($el.css('border-top')) + parseInt($el.css('border-bottom')),
	        minLine: 1,
	        maxLine: 3 };


	      el.setAttribute('rows', set.minLine);

	      set.minHeight = set.minLine * set.oneLine + set.paddingY + set.borderY;
	      set.maxHeight = set.maxLine * set.oneLine + set.paddingY + set.borderY;

	      var inputHandler = function inputHandler() {
	        autoSize(this);
	      };

	      var init = function init() {
	        $el.on('input change', inputHandler);
	      };

	      var destroy = function destroy() {
	        $el.off('input change', inputHandler);
	      };

	      var handler = {
	        resize: function resize() {
	          autoSize(el);
	        },
	        destroy: destroy };


	      set.handler = handler;

	      el.autoSize = set;

	      init();
	    }

	    return el.autoSize.handler;
	  };

	  function buildTextarea() {

	    window.textareaFn = textareaFn;

	    $('textarea').each(function (i, el) {
	      textareaFn(el);
	    });

	    // textareaFn(el) // 初始化
	    // textareaFn(el).resize() // 重新計算高度
	    // textareaFn(el).destroy() // 破壞監聽事件（input, change）
	  }

	  on(window, 'load', buildTextarea);
	  /* ----------------------------------- [END] Textarea */

	  /* ----------------------------------- [START] 數量加減 */
	  /* 規則
	   * 
	   * 有 disabled 狀態：小於等於最小值的減號，大於等於最大值的加號
	   * 最小值是 1，最大值可開放設定
	   * 輸入小於最小值，跳回最小值
	   * 輸入大於最小值，跳回最大值
	   * 無法以長按變更數量加減
	   * 
	   */
	  function countBuild() {
	    var countBoxEls = document.querySelectorAll('.js-count-box');
	    [].forEach.call(countBoxEls, function (el) {
	      var input = el.querySelector('input');
	      var btnMinus = el.querySelectorAll('button')[0];
	      var btnPlus = el.querySelectorAll('button')[1];

	      var minAttr = input.getAttribute('min');
	      var maxAttr = input.getAttribute('max');

	      var min = minAttr ? parseInt(minAttr) : 1;
	      var max = maxAttr ? parseInt(maxAttr) : 999999;

	      var status = {
	        min: false,
	        max: false };


	      // ---------------------- min

	      // let isMin = false;
	      var isMinOldValue = null;

	      Object.defineProperty(status, 'min', {
	        oldValue: false,
	        configurable: false,
	        get: function get() {
	          return parseInt(input.value) <= min;
	        },
	        set: function set(value) {
	          if (isMinOldValue !== value) {
	            isMinOldValue = value;
	            minHandler(value);
	          }
	        } });


	      var minHandler = function minHandler(value) {
	        if (value) {
	          // 是 min
	          btnMinus.disabled = true;
	        } else {
	          btnMinus.disabled = false;
	        }
	      };

	      // ---------------------- max

	      // let isMax = false;
	      var isMaxOldValue = null;

	      Object.defineProperty(status, 'max', {
	        configurable: false,
	        get: function get() {
	          return parseInt(input.value) >= max;
	        },
	        set: function set(value) {
	          if (isMaxOldValue !== value) {
	            isMaxOldValue = value;
	            maxHandler(value);
	          }
	        } });


	      var maxHandler = function maxHandler(value) {
	        if (value) {
	          // 是 min
	          btnPlus.disabled = true;
	        } else {
	          btnPlus.disabled = false;
	        }
	      };

	      var countChange = function countChange(type) {
	        var value = type === '+' ?
	        parseInt(input.value) + 1 :
	        parseInt(input.value) - 1;

	        input.value = countDetect(value);
	        input.dispatchEvent(new Event('change'));
	      };

	      // 檢測數字是否有超過範圍
	      var countDetect = function countDetect(num) {
	        if (num <= min) {
	          status.min = true;
	          status.max = false;
	          return min;
	        } else if (num >= max) {
	          status.min = false;
	          status.max = true;
	          return max;
	        } else {
	          status.min = false;
	          status.max = false;
	          return num;
	        }
	      };

	      var inputChange = function inputChange() {
	        this.value = countDetect(this.value);
	      };

	      // 避免填入的文字
	      // https://stackoverflow.com/a/39292894/11240898
	      var invalidChars = [
	      "-",
	      "+",
	      "e",
	      "."];


	      var inputKey = function inputKey(e) {
	        e.which;
	        if (invalidChars.includes(e.key)) {
	          e.preventDefault();
	        }
	      };

	      btnMinus.addEventListener('click', function () {
	        countChange('-');
	      });

	      btnPlus.addEventListener('click', function () {
	        countChange('+');
	      });

	      input.addEventListener('input', function () {
	        if (!isMobile) {
	          inputChange();
	        }
	      });
	      input.addEventListener('change', inputChange);
	      input.addEventListener('keydown', inputKey);

	      var init = function init() {
	        if (status.min) {
	          minHandler(true);
	        } else if (status.max) {
	          maxHandler(true);
	        }
	      };
	      init();
	    });
	  }

	  on(window, 'load', countBuild);
	  /* ----------------------------------- [END] 數量加減 */
	})(window, document);

})();
