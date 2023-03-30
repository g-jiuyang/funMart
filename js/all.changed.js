(function () {
	'use strict';

	/* ---------------------------------------- [START] Window EventListener */
	function on(target, event, func, option) {
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
	  var lazyLoad_throttle = throttle(lazyLoad, 500, 1000); // 節流作用

	  registerListener('load', setLazy);
	  registerListener('scroll', lazyLoad_throttle);
	  registerListener('resize', lazyLoad);

	  // 綁定Scroll
	  var lazyScrollWarapper = document.querySelectorAll('[data-lazy-scroll]');
	  for (var k = 0; k < lazyScrollWarapper.length; k++) {
	    registerListener('scroll', lazyLoad_throttle, lazyScrollWarapper[k]);
	  }


	  var lazy = [];
	  var lazyClass = 'lazy';
	  var lazyAttr = 'data-src';
	  var lazyAttrBg = 'data-background';
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
	  // 設定於Body property上
	  document.querySelector('body').setLazy = setLazy;

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
	          var lazyBg = currentLazyEl.getAttribute(lazyAttrBg);
	          var isBg = currentLazyEl.tagName.toUpperCase() !== 'IMG';
	          if (lazyImg || lazyBg) {
	            var imgSrc = lazyImg || lazyBg;
	            if (imgSrc != null) {
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
	  window.imglazyload = lazyLoad;

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

	/*global EaseScroll, lazyload*/

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
	  on(window, 'load', getWinSet);
	  on(window, 'resize', throttle(getWinSet, 50, 100));
	  /* ---------------------------------------- [END] Windows Setting */

	  /* ---------------------------------------- [START] isInViewport */
	  window.isInViewport = function (el) {
	    var rect = el.getBoundingClientRect();

	    var isVisible = el.offsetHeight !== 0;

	    return (
	      isVisible &&
	      rect.bottom >= 0 &&
	      rect.right >= 0 &&
	      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
	      rect.left <= (window.innerWidth || document.documentElement.clientWidth));

	  };
	  /* ---------------------------------------- [END] isInViewport */

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
	  /* ---------------------------------------- [END] 判斷browser */

	  /* ----------------------------------- [START] Loader 移除 */
	  var loaderRemove = function loaderRemove() {
	    var loader = document.querySelector('#loader');
	    window.loader = loader; // 加到 window 上

	    pageLoaded();
	  };
	  on(window, 'load', loaderRemove);

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

	  /* ---------------------------------------- [START] Ease scroll */
	  // var buildEaseScroll = function () {
	  // 	if (window.EaseScroll === undefined) return false;
	  // 	const es = new EaseScroll({
	  // 		frameRate: 60,
	  // 		animationTime: 1000,
	  // 		stepSize: 100,
	  // 		pulseAlgorithm: 1,
	  // 		pulseScale: 6,
	  // 		pulseNormalize: 1,
	  // 		accelerationDelta: 20,
	  // 		accelerationMax: 1,
	  // 		keyboardSupport: true,
	  // 		arrowScroll: 30,
	  // 		touchpadSupport: true,
	  // 		fixedBackground: true,
	  // 		// disabledClass: 'modal-open',

	  // 		/* Browser Setting Control */
	  // 		browser: {
	  // 			Chrome: true,
	  // 			FireFox: false,
	  // 			Safari: true,
	  // 			IE: true,
	  // 			Edge: true,
	  // 		},
	  // 	});
	  // };
	  // on(window, 'load', buildEaseScroll);
	  /* ---------------------------------------- [END] Ease scroll */

	  /* ---------------------------------------- [START] Fetch Svg Inline */
	  function buildSvgFetchInline() {
	    var svgImgs = document.querySelectorAll('.svg');
	    [].forEach.call(svgImgs, function (svg) {
	      fetchSvgInline(svg);
	    });
	  }
	  on(window, 'load', buildSvgFetchInline);
	  /* ---------------------------------------- [END] Fetch Svg Inline */

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

	  on(window, 'load', function () {
	    // Start
	    $(document).foundation();

	    fdReveal(); // Popup - Open
	    fdDropdown(); // Dropdown
	  });
	  /* ----------------------------------- [END] Foundation */

	  /* ----------------------------------- [START] 選單下滑更改樣式 */
	  // const doc = document.documentElement;

	  var header = document.querySelector('#header');
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
            var x2 = $("#header").get(0);
            if (dir === 'down') {
			
			scrollStatusDown(x2);
            // scrollStatusDown(header);
	        scrollStatusDown(html);
	      } else {

            scrollStatusUp(x2);
            //scrollStatusUp(header);
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

        var x2 = $("#header").get(0);

	    // 下滑超過一定高度出現樣式：更改選單樣式、GoTop隱藏出現
	    if (ws > 0) {

          x2.classList.add(headerClassScroll);

          //header.classList.add(headerClassScroll);
	      html.classList.add(headerClassScroll);
	    } else {

          x2.classList.remove(headerClassScroll);

          //header.classList.remove(headerClassScroll);
	      html.classList.remove(headerClassScroll);
	    }
	  }
	  on(window, 'load', headerScrollHandler);
	  on(window, 'scroll', headerScrollHandler);
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
	      // header.classList.add(className);
	      hdSearch.classList.add(className);
	    };

	    var hdSearchClassRemove = function hdSearchClassRemove(className) {
	      // header.classList.remove(className);
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
	  var fixedEls = document.querySelectorAll('[data-fixed]');

	  function fixedInit() {
	    if (fixedEls.length) {
	      [].forEach.call(fixedEls, function (item) {
	        if (checkFixedBreakpoint(item)) {
	          var wrapper = item.dataset['fixedTarget'] !== undefined ? document.querySelector(item.dataset['fixedTarget']) : item.parentElement.dataset['fixedContainer'] !== undefined ? item.parentElement : null;
	          var marginTop = isMobile ? 56 : item.dataset['marginTop'] ? parseInt(item.dataset['marginTop']) : 0;

	          var rectObj = wrapper.getBoundingClientRect();
	          var rect = item.dataset['fixedDir'] == "bottom" ? rectObj.bottom : rectObj.top;

	          if (rect <= marginTop) {
	            item.classList.add('is-fixed');
	            header.classList.add('hide-shadow');
	          } else {
	            item.classList.remove('is-fixed');
	            header.classList.remove('hide-shadow');
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

	  window.addEventListener('scroll', fixedInit);
	  window.addEventListener('resize', fixedInit);
	  window.addEventListener('load ', fixedInit);

	  /* ---------------------------------------- [END] Fixed Menu */

	  /* ----------------------------------- [START] 加入書籤 */
	  function favBuild() {
	    var favEls = document.querySelectorAll('.js-fav');
	    [].forEach.call(favEls, function (item) {
	      item.addEventListener('click', function () {
	        this.blur();
	        this.classList.toggle('is-active');
	      });
	    });
	  }
	  on(window, 'load', favBuild);
	  /* ----------------------------------- [END] 加入書籤 */

	  /* ----------------------------------- [START] 載入更多 */
	  function loadMoreBuild() {
	    var favEls = document.querySelectorAll('.js-load-more');
	    [].forEach.call(favEls, function (item) {
	      item.addEventListener('click', function () {
	        this.blur();
	        this.classList.toggle('is-loading');
	      });
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
	})(window, document);

})();
