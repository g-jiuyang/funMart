var all = (function (exports) {
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
	/* ---------------------------------------- [END] isInViewport */

	/* ---------------------------------------- [START] 從 String 取得 HTML Element */
	// https://stackoverflow.com/a/494348/11240898
	function createElementFromHTML(htmlString) {
	  var div = document.createElement('div');
	  div.innerHTML = htmlString.trim();

	  // Change this to div.childNodes to support multiple top-level nodes
	  return div.firstChild;
	}
	/* ---------------------------------------- [END] 從 String 取得 HTML Element */

	/* ---------------------------------------- [START] Disable/Enable Scroll */
	function docDisableScroll() {
	  var html = document.documentElement;
	  var top = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
	  window.scrollTopCache = top;
	  html.style.cssText += "position: fixed; width: 100%; overflow-y: hidden; top:-".concat(top, "px");
	}
	function docEnableScroll() {
	  var html = document.documentElement;
	  html.style.cssText = '';
	  window.scrollTo(0, window.scrollTopCache);
	  window.scrollTopCache = 0;
	}
	/* ---------------------------------------- [END] Disable/Enable Scroll */

	/* ---------------------------------------- [START] 取得正確的資源位置 */
	// https://stackoverflow.com/a/26023176/11240898
	/**
	 * Current Script Path | 取得正確的資源位置
	 *
	 * Get the dir path to the currently executing script file
	 * which is always the last one in the scripts array with
	 * an [src] attr
	 */
	function currentScriptPath() {
	  var scripts = document.querySelectorAll('script[src]');
	  var currentScript = scripts[scripts.length - 1].src;
	  var currentScriptChunks = currentScript.split('/');
	  var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];

	  return currentScript.replace(currentScriptFile, '').split('js/')[0];
	}
	/* ---------------------------------------- [END] 取得正確的資源位置 */

	exports.createElementFromHTML = createElementFromHTML;
	exports.currentScriptPath = currentScriptPath;
	exports.docDisableScroll = docDisableScroll;
	exports.docEnableScroll = docEnableScroll;
	exports.isInViewport = isInViewport;
	exports.off = off;
	exports.on = on;
	exports.throttle = throttle;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
