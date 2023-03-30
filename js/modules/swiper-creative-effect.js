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

  var getTranslateValue = function getTranslateValue(value) {
    if (typeof value === 'string') return value;
    return "".concat(value, "px");
  };

  var Creative = {
    setTranslate: function setTranslate() {
      var swiper = this;
      var slides = swiper.slides,$wrapperEl = swiper.$wrapperEl,slidesSizesGrid = swiper.slidesSizesGrid;
      var params = swiper.params.creativeEffect;
      var multiplier = params.progressMultiplier;
      var isCenteredSlides = swiper.params.centeredSlides;

      if (isCenteredSlides) {
        var margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
        $wrapperEl.transform("translateX(calc(50% - ".concat(margin, "px))"));
      }var _loop = function _loop(

      i) {
        var $slideEl = slides.eq(i);
        var slideProgress = $slideEl[0].progress;

        // [START] Add Other Code
        var progressPlusMinus = Math.min(
        Math.max($slideEl[0].progress, -params.limitProgress),
        params.limitProgress);

        var slideProgressRound = Math.round(slideProgress);
        var slideProgressAbs = Math.abs(slideProgress);

        var sum = 1;
        if (params.deep && Math.abs(slideProgressRound) > 1) {
          for (var j = 1; j < slideProgressAbs; j++) {
            if (slideProgressAbs - j >= 1) {
              sum += 1 * Math.pow(params.rate, j);
            } else {
              sum = sum + (slideProgressAbs - j) * Math.pow(params.rate, j);
            }
          }
        }

        var progress = !params.deep ?
        progressPlusMinus :
        Math.abs(slideProgressRound) <= 1 ?
        slideProgress :
        sum * progressPlusMinus;

        // [END] Add Other Code

        // ↓ Origin
        // const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
        var originalProgress = progress;

        if (!isCenteredSlides) {
          originalProgress = Math.min(
          Math.max($slideEl[0].originalProgress, -params.limitProgress),
          params.limitProgress);

        }

        var offset = $slideEl[0].swiperSlideOffset;
        var t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
        var r = [0, 0, 0];
        var custom = false;

        if (!swiper.isHorizontal()) {
          t[1] = t[0];
          t[0] = 0;
        }

        var data = {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          scale: 1,
          opacity: 1 };


        if (progress < 0) {
          data = params.next;
          custom = true;
        } else if (progress > 0) {
          data = params.prev;
          custom = true;
        } // set translate

        t.forEach(function (value, index) {
          t[index] = "calc(".concat(value, "px + (").concat(getTranslateValue(data.translate[index]), " * ").concat(Math.abs(
          progress * multiplier), "))");

        }); // set rotates

        r.forEach(function (value, index) {
          r[index] = data.rotate[index] * Math.abs(progress * multiplier);
        });
        $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
        var translateString = t.join(', ');
        var rotateString = "rotateX(".concat(r[0], "deg) rotateY(").concat(r[1], "deg) rotateZ(").concat(r[2], "deg)");
        var scaleString =
        originalProgress < 0 ? "scale(".concat(
        1 + (1 - data.scale) * originalProgress * multiplier, ")") : "scale(".concat(
        1 - (1 - data.scale) * originalProgress * multiplier, ")");
        var opacityString =
        data.opacity === null ?
        null :
        originalProgress < 0 ?
        1 + (1 - data.opacity) * originalProgress * multiplier :
        1 - (1 - data.opacity) * originalProgress * multiplier;
        var transform = "translate3d(".concat(translateString, ") ").concat(rotateString, " ").concat(scaleString); // Set shadows

        if (custom && data.shadow || !custom) {
          var $shadowEl = $slideEl.children('.swiper-slide-shadow');

          if ($shadowEl.length === 0 && data.shadow) {
            $shadowEl = createShadow(params, $slideEl);
          }

          if ($shadowEl.length) {
            var shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
            $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
          }
        }

        var $targetEl = effectTarget(params, $slideEl);
        $targetEl.transform(transform).css({
          opacity: opacityString });


        if (data.origin) {
          $targetEl.css('transform-origin', data.origin);
        }};for (var i = 0; i < slides.length; i += 1) {_loop(i);
      }
    },
    setTransition: function setTransition(duration) {
      var swiper = this;
      var transformEl = swiper.params.creativeEffect.transformEl;
      var $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
      $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
      effectVirtualTransitionEnd({
        swiper: swiper,
        duration: duration,
        transformEl: transformEl,
        allSlides: true });

    } };


  var EffectCreative = {
    name: 'creative',
    params: {
      creativeEffect: {
        transformEl: null,
        limitProgress: 1,
        shadowPerProgress: false,
        progressMultiplier: 1,
        perspective: true,
        prev: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1 },

        next: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1 },

        deep: false, // 是否層遞影響
        rate: 0.5 // 以幾倍的方式遞增/遞減
      } },

    create: function create() {
      var swiper = this;
      Utils.extend(swiper, {
        creativeEffect: {
          setTranslate: Creative.setTranslate.bind(swiper),
          setTransition: Creative.setTransition.bind(swiper) } });


    },
    on: {
      beforeInit: function beforeInit() {
        var swiper = this;
        if (swiper.params.effect !== 'creative') {
          return;
        }
        swiper.classNames.push(swiper.params.containerModifierClass + 'creative');
        var overwriteParams = {
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode };

        Utils.extend(swiper.params, overwriteParams);
        Utils.extend(swiper.originalParams, overwriteParams);
      },
      setTranslate: function setTranslate() {
        var swiper = this;
        if (swiper.params.effect !== 'creative') {
          return;
        }
        swiper.creativeEffect.setTranslate();
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        if (swiper.params.effect !== 'creative') {
          return;
        }
        swiper.creativeEffect.setTransition(duration);
      } } };

  exports.EffectCreative = EffectCreative;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
