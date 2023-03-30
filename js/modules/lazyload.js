(function () {
	'use strict';

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

})();
