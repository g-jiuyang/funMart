var all = (function (exports) {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var Utils = {
    deleteProps: function deleteProps(obj) {
      var object = obj;
      Object.keys(object).forEach(function (key) {
        try {
          object[key] = null;
        } catch (e) {
          // no getter for object
        }
        try {
          delete object[key];
        } catch (e) {
          // something got wrong
        }
      });
    },
    nextTick: function nextTick(callback, delay) {
      if (delay === void 0) delay = 0;

      return setTimeout(callback, delay);
    },
    now: function now() {
      return Date.now();
    },
    getTranslate: function getTranslate(el, axis) {
      if (axis === void 0) axis = 'x';

      var matrix;
      var curTransform;
      var transformMatrix;

      var curStyle = win.getComputedStyle(el, null);

      if (win.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map(function (a) {return a.replace(',', '.');}).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) {curTransform = transformMatrix.m41;}
        // Crazy IE10 Matrix
        else if (matrix.length === 16) {curTransform = parseFloat(matrix[12]);}
        // Normal Browsers
        else {curTransform = parseFloat(matrix[4]);}
      }
      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) {curTransform = transformMatrix.m42;}
        // Crazy IE10 Matrix
        else if (matrix.length === 16) {curTransform = parseFloat(matrix[13]);}
        // Normal Browsers
        else {curTransform = parseFloat(matrix[5]);}
      }
      return curTransform || 0;
    },
    parseUrlQuery: function parseUrlQuery(url) {
      var query = {};
      var urlToParse = url || win.location.href;
      var i;
      var params;
      var param;
      var length;
      if (typeof urlToParse === 'string' && urlToParse.length) {
        urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
        params = urlToParse.split('&').filter(function (paramsPart) {return paramsPart !== '';});
        length = params.length;

        for (i = 0; i < length; i += 1) {
          param = params[i].replace(/#\S+/g, '').split('=');
          query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
        }
      }
      return query;
    },
    isObject: function isObject(o) {
      return _typeof(o) === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend: function extend() {
      var args = [],len$1 = arguments.length;
      while (len$1--) {args[len$1] = arguments[len$1];}

      var to = Object(args[0]);
      for (var i = 1; i < args.length; i += 1) {
        var nextSource = args[i];
        if (nextSource !== undefined && nextSource !== null) {
          var keysArray = Object.keys(Object(nextSource));
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    } };


  function effectTarget(effectParams, $slideEl) {
    if (effectParams.transformEl) {
      return $slideEl.find(effectParams.transformEl).css({
        'backface-visibility': 'hidden',
        '-webkit-backface-visibility': 'hidden' });

    }

    return $slideEl;
  }

  function effectVirtualTransitionEnd(_ref)




  {var swiper = _ref.swiper,duration = _ref.duration,transformEl = _ref.transformEl,allSlides = _ref.allSlides;
    var
    slides =


    swiper.slides,activeIndex = swiper.activeIndex,$wrapperEl = swiper.$wrapperEl;

    if (swiper.params.virtualTranslate && duration !== 0) {
      var eventTriggered = false;
      var $transitionEndTarget;

      if (allSlides) {
        $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
      } else {
        $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
      }

      $transitionEndTarget.transitionEnd(function () {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        var triggerEvents = ['webkitTransitionEnd', 'transitionend'];

        for (var i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }

  /* Circle Rotation Effect - Swiper.js Effect v1.0.0
   * Copyright © 2022 Reginna(https://github.com/reginna-chao)
   * MIT License
   */

  // Fixed IE11
  if (!Math.trunc) {
    Math.trunc = function (v) {
      return v < 0 ? Math.ceil(v) : Math.floor(v);
    };
  }

  var circleRotate = {
    setTranslate: function setTranslate() {
      var swiper = this;
      var slides = swiper.slides,$wrapperEl = swiper.$wrapperEl;
      var params = swiper.params.circleRotateEffect;

      // Global variable
      var wrapperElWidth = $wrapperEl[0].clientWidth;
      var radius = wrapperElWidth / 2;

      for (var i = 0; i < slides.length; i++) {
        var $slideEl = slides.eq(i);
        var slideProgress = $slideEl[0].progress;

        var slideElWidth = $slideEl[0].clientWidth;

        var offset = $slideEl[0].swiperSlideOffset;
        var angle = void 0;
        var scale = void 0;

        var dataParams = {};
        var data = {};

        if (slideProgress < 0) {
          dataParams = params.next;
        } else if (slideProgress > 0) {
          dataParams = params.prev;
        }

        if (slideProgress !== 0) {
          data.angle = [0].concat(dataParams.angle);
          data.scale = [1].concat(dataParams.scale);
        }

        // Set Angle
        var progressAngle = slideProgress === 0 ? 0 : Math.max(Math.min(slideProgress, data.angle.length - 1), (data.angle.length - 1) * -1);
        var progressAngleIndx = Math.abs(Math.trunc(progressAngle));
        angle = slideProgress === 0 ?
        params.start :
        progressAngleIndx === data.angle.length - 1 ?
        params.start + data.angle[progressAngleIndx] :
        params.start + data.angle[progressAngleIndx] + (data.angle[progressAngleIndx + 1] - data.angle[progressAngleIndx]) * Math.abs(progressAngle % 1);

        // Set Scale
        var progressScale = slideProgress === 0 ? 0 : Math.max(Math.min(slideProgress, data.scale.length - 1), (data.scale.length - 1) * -1);
        var progressScaleIndex = Math.abs(Math.trunc(progressScale));
        scale = slideProgress === 0 ?
        1 :
        progressScaleIndex === data.scale.length - 1 ?
        data.scale[progressScaleIndex] :
        data.scale[progressScaleIndex] + (data.scale[progressScaleIndex + 1] - data.scale[progressScaleIndex]) * Math.abs(progressScale % 1);

        // Set Position (Translate)
        var theta = angle * (Math.PI / 180);
        var x = Math.round(radius * Math.cos(theta));
        var y = Math.round(radius * Math.sin(theta));
        // const translateY = (radius - y) / slideElHeight * 100 - 50; // %
        // const translateX = (radius - x) / slideElWidth * 100 - 50 - (offset / slideElWidth * 100); // %
        var translateY = radius - y - slideElWidth / 2; // px
        var translateX = radius - x - slideElWidth / 2 - offset; // px

        var $targetEl = effectTarget(params, $slideEl);
        // $targetEl.transform(`translate3d(${translateX}%,${translateY}%,0) scale(${scale})`);
        $targetEl.transform("translate3d(".concat(Math.round(translateX), "px,").concat(Math.round(translateY), "px,0) scale(").concat(scale, ")"));
      }
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      var transformEl = swiper.params.circleRotateEffect.transformEl;
      var $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
      $transitionElements.transition(duration);
      effectVirtualTransitionEnd({
        swiper: swiper,
        duration: duration,
        transformEl: transformEl,
        allSlides: true });

    } };


  var EffectCircleRotate = {
    name: 'circle-rotate',
    params: {
      circleRotateEffect: {
        transformEl: null,
        rotateWrapper: false, // rotate wrapper
        start: 0, // start angle
        per: 30, // per angle (if use `rotateWrapper`)
        // angel: each prev/next item angel [next1, next2, next3] / [prev1, prev2, prev3]
        // scale: each prev/next item scale [next1, next2, next3] / [prev1, prev2, prev3]
        prev: {
          angle: [30, 60, 90],
          scale: [1, 1, 1] },

        next: {
          angle: [-30, -60, -90],
          scale: [1, 1, 1] } } },



    create: function create() {
      var swiper = this;
      Utils.extend(swiper, {
        circleRotateEffect: {
          setTranslate: circleRotate.setTranslate.bind(swiper),
          setTransition: circleRotate.setTransition.bind(swiper) } });


    },
    on: {
      beforeInit: function beforeInit() {
        var swiper = this;
        if (swiper.params.effect !== 'circle-rotate') {
          return;
        }
        swiper.classNames.push(swiper.params.containerModifierClass + 'circle-rotate');
        var overwriteParams = {
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode };

        Utils.extend(swiper.params, overwriteParams);
        Utils.extend(swiper.originalParams, overwriteParams);
      },
      setTranslate: function setTranslate() {
        var swiper = this;
        if (swiper.params.effect !== 'circle-rotate') {
          return;
        }
        swiper.circleRotateEffect.setTranslate();
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        if (swiper.params.effect !== 'circle-rotate') {
          return;
        }
        swiper.circleRotateEffect.setTransition(duration);
      } } };

  exports.EffectCircleRotate = EffectCircleRotate;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
