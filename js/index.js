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

	function off(target, event, func, option) {
	  target = target || window;
	  if (window.addEventListener) {
	    var opt = option || false;
	    target.addEventListener(event, func, opt);
	  } else {
	    target.attachEvent('on' + event, func);
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
	/* ---------------------------------------- [END] 簡單的節流函數 */

	/* ---------------------------------------- [START] isInViewport */
	function isInViewport(el) {
	  var rect = el.getBoundingClientRect();

	  var isVisible = el.offsetHeight !== 0;

	  return (
	    isVisible &&
	    rect.bottom >= 0 &&
	    rect.right >= 0 &&
	    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
	    rect.left <= (window.innerWidth || document.documentElement.clientWidth));

	}
	/* ---------------------------------------- [END] 取得正確的資源位置 */

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

	(function (window, document) {
	  document.getElementById('header').classList.add('transparent'); // Header 改為透明設定
	  document.documentElement.classList.add('page-index'); // Header 改為透明設定

	  // Use UAParser.js
	  // https://github.com/faisalman/ua-parser-js
	  var parser = null;
	  var isSafari = false;
	  var isMobile = false;
	  on(window, 'load:origin', function () {
	    parser = new UAParser();
	    isMobile = parser.getDevice().model ? true : false;
	    isSafari = parser.getBrowser().name === 'Safari';
	  });

	  /* ---------------------------------------- [START] 整頁 Scroll 監測 (Before) */
	  var pageScrollCheckList = []; // 紀錄物件
	  var pageScrollAdd = function pageScrollAdd(selector, buildFunction) {
	    var el = document.querySelector(selector);
	    if (el === null) {
	      return false;
	    }
	    pageScrollCheckList.push({
	      build: false,
	      el: el,
	      fun: buildFunction });


	    // Start Add Element
	    var i = pageScrollCheckList.length - 1;
	    if (isInViewport(pageScrollCheckList[i].el)) {
	      pageScrollCheckList[i].fun();
	      pageScrollCheckList[i].build = true;
	      pageScrollClean();
	    }
	  };
	  var pageScrollClean = function pageScrollClean() {
	    pageScrollCheckList = Array.prototype.filter.call(pageScrollCheckList, function (item) {
	      return item.build === false;
	    });
	  };
	  /* ---------------------------------------- [END] 整頁 Scroll 監測 (Before) */

	  /* ---------------------------------------- [START] Swiper Tool */
	  on(window, 'load:origin', function () {
	    var components = [
	    EffectCreative,
	    EffectCircleRotate];

	    Swiper.use(components);
	  });
	  /* ---------------------------------------- [END] Swiper Tool */

	  /* ---------------------------------------- [START] Banner Swiper (Key Circle) */
	  var indexBannerCarousel = '#index-key-circle-carousel';
	  var bannerBuilded = false;

	  function bannerBuild() {
	    if (bannerBuilded) {
	      return false;
	    }
	    bannerBuilded = true;

	    var swiperTarget = indexBannerCarousel;
	    // const swiperTargetEl = document.querySelector(swiperTarget);
	    // const swiperEl = swiperTargetEl.parentElement;
	    var swiper = null;

	    var autoplayDelay = 5000; // 自動輪播

	    var bgEl = document.querySelector('.index-key-vision__deco');

	    var titleEl = document.querySelector('.index-key-circle__title');
	    var descEl = document.querySelector('.index-key-circle__desc');
	    var changeTextBox = function changeTextBox(title, desc) {
	      titleEl.innerHTML = title;
	      descEl.innerHTML = desc;
	    };

	    var smallBuild = function smallBuild() {
	      swiper = new Swiper(swiperTarget, {
	        slidesPerView: 'auto',
	        loop: true,
	        loopedSlides: 2,
	        autoplay: {
	          delay: autoplayDelay },

	        lazy: {
	          loadPrevNext: true,
	          loadPrevNextAmount: 3 },

	        preloadImages: false,
	        slideToClickedSlide: true,
	        centeredSlides: true,

	        effect: 'creative',
	        creativeEffect: {
	          // 圓形大小（由左至右）：50 87 127 61
	          // 127 Active
	          progressMultiplier: 1,
	          prev: {
	            // Active 左邊項目圓形：
	            // Scale: 87 / 127(Active) = 0.685
	            translate: ['-110%', '-20%', 0],
	            scale: 0.65 },

	          next: {
	            // Active 右邊項目圓形：
	            // scale: 61 / 127(Active) = 0.480
	            translate: ['88%', '-40%', 0],
	            scale: 0.48 },

	          deep: true, // 是否層遞影響
	          rate: 0.65 // 以幾倍的方式遞增/遞減
	        },
	        on: {
	          slideChange: function slideChange() {
	            var sw = this;
	            var currentSlide = sw.slides[sw.activeIndex];
	            var bg = currentSlide.dataset['deco'] || null;
	            var title = currentSlide.dataset['title'] || '';
	            var desc = currentSlide.dataset['desc'] || '';

	            if (bg) {
	              bgEl.style.backgroundImage = "url(".concat(bg, ")");
	            } else {
	              bgEl.style.backgroundImage = '';
	            }

	            changeTextBox(title, desc);
	          } } });


	    };

	    var largeSwiperBuild = function largeSwiperBuild() {
	      var bodyWidthHalf = (document.body || document.querySelector('body')).clientWidth / 2;
	      var indexBanner = document.querySelector('.index-key-circle');

	      var area = null;

	      var mouseleave = function mouseleave() {
	        indexBanner.dataset.area = '';
	        area = null;
	      };

	      var mousemove = function mousemove(e) {
	        if (e.pageX < bodyWidthHalf) {
	          area = 'left';
	          indexBanner.dataset.area = 'left';
	        } else {
	          area = 'right';
	          indexBanner.dataset.area = 'right';
	        }
	      };

	      var clickHandler = function clickHandler(e) {
	        if (!$(e.target).parents('.index-key-circle__item').length) {
	          if (area === 'left') {
	            // Prev
	            // console.log('[Prev]', 'data-area', indexBanner.dataset.area, 'area', area);
	            swiper.slidePrev();
	          } else {
	            // Next
	            // console.log('[Next]', 'data-area', indexBanner.dataset.area, 'area', area);
	            swiper.slideNext();
	          }
	        }
	      };

	      var resizeHandler = function resizeHandler() {
	        bodyWidthHalf = (document.body || document.querySelector('body')).clientWidth / 2;
	      };

	      var eventOn = function eventOn() {
	        if (!isMobile) {
	          window.addEventListener('resize', resizeHandler);
	          indexBanner.addEventListener('mouseleave', mouseleave);
	          indexBanner.addEventListener('mousemove', mousemove);
	          indexBanner.classList.add('mouse-init');
	        }
	        indexBanner.addEventListener('click', clickHandler);
	      };

	      var eventOff = function eventOff() {
	        window.removeEventListener('resize', resizeHandler);
	        indexBanner.removeEventListener('mouseleave', mouseleave);
	        indexBanner.removeEventListener('mousemove', mousemove);
	        indexBanner.removeEventListener('click', clickHandler);
	        indexBanner.classList.remove('mouse-init');
	      };

	      swiper = new Swiper(swiperTarget, {
	        slidesPerView: 'auto',
	        loop: true,
	        loopedSlides: 4,
	        centeredSlides: true, // if use `loop` + `slidesPerView:'auto'`, must use this API, or it will has bug
	        slideToClickedSlide: true,
	        simulateTouch: false, // 關閉滑鼠拖曳
	        autoplay: {
	          delay: autoplayDelay,
	          disableOnInteraction: false },

	        lazy: {
	          loadPrevNext: true,
	          loadPrevNextAmount: 5 },

	        effect: 'circle-rotate',
	        circleRotateEffect: {
	          start: 305,
	          per: 15,
	          next: {
	            angle: [-60, -76, -87, -110],
	            scale: [0.75, 0.5, 0.33, 0] },

	          prev: {
	            angle: [40],
	            scale: [0] } },


	        breakpoint: {
	          1600: {
	            circleRotateEffect: {
	              start: 305,
	              per: 15,
	              next: {
	                angle: [-57, -73, -84, -110],
	                // angle: [-55, -70, -80, -105],
	                scale: [0.75, 0.5, 0.33, 0] },

	              prev: {
	                angle: [40],
	                scale: [0] } } } },




	        on: {
	          init: function init() {
	            eventOn();

	            // Safari 在 transform 300ms 的時候會閃爍，會很消耗效能，但只能出此下策
	            if (isSafari) {
	              this.$el[0].classList.add('fixed-will-change');
	            }
	          },
	          beforeDestroy: function beforeDestroy() {
	            eventOff();
	          },
	          slideChange: function slideChange() {
	            var currentSlide = this.slides[this.activeIndex];
	            var title = currentSlide.dataset['title'] || '';
	            var desc = currentSlide.dataset['desc'] || '';
	            changeTextBox(title, desc);
	          },
	          slideChangeTransitionStart: function slideChangeTransitionStart() {
	            var slides = this.slides;

	            // Safari 在 transform 300ms 的時候會閃爍，會很消耗效能，但只能出此下策
	            for (var i = 0; i < slides.length; i++) {
	              var $slideEl = slides.eq(i);
	              $slideEl.css('will-change', 'transform');
	            }
	          },
	          slideChangeTransitionEnd: function slideChangeTransitionEnd() {var _this = this;
	            setTimeout(function () {
	              var slides = _this.slides;

	              for (var i = 0; i < slides.length; i++) {
	                var $slideEl = slides.eq(i);
	                $slideEl.css('will-change', '');
	              }
	            }, 100);
	          } } });


	    };

	    var breakpoint = window.matchMedia('(min-width: 1024px)');
	    var breakpointChecker = function breakpointChecker() {
	      if (swiper !== null) {
	        swiper.destroy(true, true);
	        swiper = null;
	      }

	      if (breakpoint.matches) {
	        // Large
	        largeSwiperBuild();
	      } else {
	        // Small + Medium
	        smallBuild();
	      }
	    };

	    // Start
	    breakpointChecker();
	    breakpoint.addListener(breakpointChecker);
	  }
	  // on( window, 'load', function () {
	  // 	pageScrollAdd(indexBannerCarousel, bannerBuild);
	  // });

	  // 配合套版，給予可呼叫之function
	  window.indexKeyCircleBuild = function () {
	    console.log('indexKeyCircleBuild');
	    pageScrollAdd(indexBannerCarousel, bannerBuild);
	  };
	  /* ---------------------------------------- [END] Banner Swiper (Key Circle) */

	  /* ---------------------------------------- [START] Alert Marquee */
	  // Alert Marquee （跑馬燈）
	  var marqueeBuilded = false;
	  function marqueeBuild() {
	    if (marqueeBuilded) {
	      return false;
	    }
	    marqueeBuilded = true;
	    console.log('indexMarqueeBuild');

	    $('.marquee').marquee({
	      speed: 20,
	      gap: 0,
	      delayBeforeStart: 0,
	      duplicated: true,
	      startVisible: true });

	  }
	  // on( window, 'load', marqueeBuild);

	  // 配合套版，給予可呼叫之function
	  window.indexMarqueeBuild = marqueeBuild;
	  /* ---------------------------------------- [END] Alert Marquee */


	  /* ---------------------------------------- [START] Activity Swiper (Banner) */
	  var indexActivityCarousel = '#index-banner-carousel';

	  var activityBuilded = false;
	  function activityBuild() {
	    if (activityBuilded) {
	      return false;
	    }
	    activityBuilded = true;

	    var swiperTarget = indexActivityCarousel;
	    var swiperEl = document.querySelector(swiperTarget).parentElement;
	    var swiperNextEl = swiperEl.querySelector('.swiper-button-next');
	    var swiperPrevEl = swiperEl.querySelector('.swiper-button-prev');
	    var swiperPageEl = swiperEl.querySelector('.swiper-pagination');

	    var swiper = null;

	    var buildSwiperMobile = function buildSwiperMobile() {
	      swiper = new Swiper(swiperTarget, {
	        spaceBetween: 11,
	        centeredSlides: true,
	        slidesPerView: 'auto',
	        loop: true,
	        preloadImages: false,
	        lazy: {
	          loadPrevNext: true },

	        pagination: {
	          el: swiperPageEl,
	          clickable: true,
	          dynamicBullets: true,
	          dynamicMainBullets: 3 },

	        navigation: {
	          nextEl: swiperNextEl,
	          prevEl: swiperPrevEl },

	        breakpoints: {
	          640: {
	            spaceBetween: 26 } } });



	    };

	    var buildSwiperLarge = function buildSwiperLarge() {
	      swiper = new Swiper(swiperTarget, {
	        spaceBetween: 26,
	        grabCursor: true,
	        slidesPerView: 2,
	        slidesPerGroup: 2,
	        loop: true,
	        preloadImages: false,
	        lazy: {
	          loadPrevNext: true },

	        pagination: {
	          el: swiperPageEl,
	          clickable: true,
	          dynamicBullets: true,
	          dynamicMainBullets: 3 },

	        navigation: {
	          nextEl: swiperNextEl,
	          prevEl: swiperPrevEl },

	        breakpoints: {
	          1200: {
	            slidesPerView: 3,
	            slidesPerGroup: 3 } } });



	    };

	    var breakpoint = window.matchMedia('(min-width: 1024px)');
	    var breakpointChecker = function breakpointChecker() {

	      if (swiper !== null) {
	        swiper.destroy(true, true);
	        swiper = null;
	      }

	      if (breakpoint.matches) {
	        // Large
	        buildSwiperLarge();
	      } else {
	        // Small + Medium
	        buildSwiperMobile();
	      }
	    };

	    breakpointChecker();
	    breakpoint.addListener(breakpointChecker);
	  }
	  // on( window, 'load', function () {
	  // 	if (document.querySelector(indexActivityCarousel) !== null) {
	  // 		pageScrollAdd(indexActivityCarousel, activityBuild);
	  // 	}
	  // });

	  // 配合套版，給予可呼叫之function
	  window.indexBannerBuild = function () {
	    console.log('indexBannerBuild');
	    if (document.querySelector(indexActivityCarousel) !== null) {
	      pageScrollAdd(indexActivityCarousel, activityBuild);
	    }
	  };
	  /* ---------------------------------------- [END] Activity Swiper (Banner) */

	  /* ---------------------------------------- [START] Store Swiper */
	  var indexStoreCarousel = '#index-store-carousel';

	  var storeBuilded = false;
	  function storeBuild() {
	    if (storeBuilded) {
	      return false;
	    }
	    storeBuilded = true;

	    var swiper = null;
	    var swiperTarget = indexStoreCarousel;
	    var swiperEl = document.querySelector(swiperTarget).parentElement;

	    var swiperBuild = function swiperBuild() {
	      var swiperNextEl = swiperEl.querySelector('.swiper-button-next');
	      var swiperPrevEl = swiperEl.querySelector('.swiper-button-prev');

	      swiper = new Swiper(swiperTarget, {
	        slidesPerView: 'auto',
	        slidesPerGroup: 6,
	        preloadImages: false,
	        lazy: {
	          loadPrevNext: true,
	          loadPrevNextAmount: 8 },

	        navigation: {
	          nextEl: swiperNextEl,
	          prevEl: swiperPrevEl },

	        breakpoints: {
	          // when window width is >= 1320px
	          1320: {
	            slidesPerGroup: 7 } } });



	    };

	    var swiperDestroy = function swiperDestroy() {
	      if (swiper !== null) {
	        swiper.destroy(true, true);
	        swiper = null;
	      }
	    };

	    var breakpoint = window.matchMedia('(min-width: 1024px)');
	    var breakpointChecker = function breakpointChecker() {
	      if (breakpoint.matches) {
	        // Large+
	        swiperBuild();
	      } else {
	        // Small + Medium
	        swiperDestroy();
	      }
	    };

	    // Start
	    breakpointChecker();
	    breakpoint.addListener(breakpointChecker);
	  }
	  // on( window, 'load', function () {
	  // 	if (document.querySelector(indexStoreCarousel) !== null) {
	  // 		pageScrollAdd(indexStoreCarousel, storeBuild);
	  // 	}
	  // });

	  // 配合套版，給予可呼叫之function
	  window.indexStoreBuild = function () {
	    console.log('indexStoreBuild');
	    if (document.querySelector(indexStoreCarousel) !== null) {
	      pageScrollAdd(indexStoreCarousel, storeBuild);
	    }
	  };
	  /* ---------------------------------------- [END] Store Swiper */

	  /* ---------------------------------------- [START] 整頁 Scroll 監測 (After) */
	  var pageScrollThrottle = null;
	  var pageScrollHandler = function pageScrollHandler() {
	    if (pageScrollCheckList.length === 0) {
	      return false;
	    }

	    for (var i = 0; i < pageScrollCheckList.length; i++) {
	      if (isInViewport(pageScrollCheckList[i].el)) {
	        pageScrollCheckList[i].fun();
	        pageScrollCheckList[i].build = true;
	      }
	    }
	    pageScrollClean();
	    if (pageScrollCheckList.length === 0) {
	      off(window, 'scroll', pageScrollThrottle);
	    }
	  };

	  on(window, 'load', function () {
	    pageScrollThrottle = throttle(pageScrollHandler, 50, 1000); // 節流作用
	    on(window, 'scroll', pageScrollThrottle);
	    pageScrollHandler();
	  });
	  /* ---------------------------------------- [END] 整頁 Scroll 監測 (After) */

	})(window, document);

})();
