(function () {
  'use strict';

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

  /* ---------------------------------------- [START] Window EventListener */
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

})();
