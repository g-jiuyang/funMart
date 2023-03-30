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
	/* ---------------------------------------- [END] 取得正確的資源位置 */

	// Need to figure out some way to test if this is needed.
	// https://stackoverflow.com/q/64017560/11240898
	if (
	Element.prototype.setPointerCapture === undefined ||
	Element.prototype.hasPointerCapture === undefined ||
	Element.prototype.releasePointerCapture === undefined)
	{
	  console.log('polyfill-pointer-capture');

	  var _Element$prototype =



	  Element.prototype,set = _Element$prototype.setPointerCapture;_Element$prototype.hasPointerCapture;var release = _Element$prototype.releasePointerCapture;

	  var targets = {};
	  var captures = {};

	  console.log('setPointerCapture', Element.prototype.setPointerCapture === undefined);
	  if (Element.prototype.setPointerCapture === undefined) {
	    Element.prototype.setPointerCapture = function setPointerCapture(pointerId) {
	      if (pointerId in captures) {
	        if (document.contains(this)) {
	          captures[pointerId] = this;
	          return set.call(targets[pointerId], pointerId);
	        } else {
	          throw new TypeError("Element not in valid location");
	        }
	      } else {
	        return set.call(this, pointerId);
	      }
	    };
	  }

	  console.log('hasPointerCapture', Element.prototype.hasPointerCapture === undefined);
	  if (Element.prototype.hasPointerCapture === undefined) {
	    Element.prototype.hasPointerCapture = function hasPointerCapture(pointerId) {
	      if (pointerId in captures) {
	        return captures[pointerId] == this;
	      } else {
	        // return has.call(this, pointerId)
	        return false;
	      }
	    };
	  }

	  console.log('releasePointerCapture', Element.prototype.releasePointerCapture === undefined);
	  if (Element.prototype.releasePointerCapture) {
	    Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId) {
	      if (pointerId in captures) {
	        if (this.hasPointerCapture(pointerId)) {
	          captures[pointerId] = null;
	          return release.call(targets[pointerId], pointerId);
	        }
	      } else {
	        return release.call(this, pointerId);
	      }
	    };
	  }

	  var registerPointer = function registerPointer(event) {
	    if (event.pointerType == "touch" || event.pointerType == "pen") {
	      targets[event.pointerId] = event.target;
	      captures[event.pointerId] = null;
	    }
	  };

	  var redirectPointer = function redirectPointer(event) {
	    if (captures[event.pointerId] != null && captures[event.pointerId] != event.target) {
	      // Stop the original event
	      event.preventDefault();
	      event.stopPropagation();

	      // Redispatch a new, cloned event
	      captures[event.pointerId].dispatchEvent(new PointerEvent(event.type, event));
	    }
	  };

	  var redirectAndUnregisterPointer = function redirectAndUnregisterPointer(event) {
	    redirectPointer(event);
	    delete targets[event.pointerId];
	    delete captures[event.pointerId];
	  };

	  addEventListener("pointerdown", registerPointer, { capture: true, passive: true });
	  addEventListener("pointermove", redirectPointer, { capture: true, passive: false });
	  addEventListener("pointerup", redirectAndUnregisterPointer, { capture: true, passive: false });
	  addEventListener("pointercancel", redirectAndUnregisterPointer, { capture: true, passive: false });
	}

	(function (window, document) {
	  // Use UAParser.js
	  // https://github.com/faisalman/ua-parser-js
	  var parser = null;
	  on(window, 'load', function () {
	    parser = new UAParser();
	    parser.getDevice().model ? true : false;
	  });

	  /* ---------------------------------------- [START] Banner - 3D */
	  // To Do List
	  // * Android 5 Warning
	  // * Not Support
	  // * Touch 提示
	  // * Error 提示
	  var viewer = null;
	  var viewerEl = null;
	  var btnFullScreen = null;

	  // 使用 babylon.js 的 Viewer
	  function build3DViewer() {
	    // 3D檔案路徑
	    var modal = viewerEl.dataset['model']; // 商品3D檔
	    var cover = viewerEl.dataset['cover']; // 商品圖

	    console.log(cover);

	    // 依照 Ratio 調整大小 (setHardwareScalingLevel)
	    // 1 => 1
	    // 2 => 0.5
	    // 最多做到 2x 大小，避免裝置負擔太重
	    var hardwareScalingLevel = Math.max(.5, 1 / (window.devicePixelRatio || 2));

	    viewer = new BabylonViewer.DefaultViewer(viewerEl, {
	      // scene: {
	      // 	mainColor: {
	      // 		r: ,
	      // 		g: 0.8,
	      // 		b: 0.6
	      // 	}
	      // },
	      engine: {
	        antialiasing: false },

	      model: {
	        url: modal,
	        // url: "images/3d/fox/fox.glb",
	        animation: {
	          autoStart: true } },


	      templates: {
	        loadingScreen: {
	          params: {
	            backgroundColor: "linear-gradient(to bottom,#a6f4f2,#d0fbee 69%,#eaf8f4 99%)",
	            loadingImage: "images/babylon-loading.png",
	            staticLoadingImage: "images/babylon-static.svg",
	            cover: cover },

	          // 原始DOM參考: https://github.com/BabylonJS/Babylon.js/blob/master/Viewer/assets/templates/default/loadingScreen.html
	          html: "\n\t\t\t\t\t<style>loading-screen{position:absolute;left:0;z-index:100;opacity:1;overflow: hidden;pointer-events:none;display:flex;justify-content:center;align-items:center;-webkit-transition:opacity 1s ease;-moz-transition:opacity 1s ease;transition:opacity 1s ease;}img.loading-image{-webkit-animation:spin .75s linear infinite;animation:spin .75s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.modal-loading-demo{position:absolute;width:100%;height:100%;}.modal-loading-demo__inside{position:absolute;width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:center center;filter:blur(5px);}</style>\n\t\t\t\t\t<div class=\"modal-loading-demo\" style=\"position:absolute;\">\n\t\t\t\t\t\t<div class=\"modal-loading-demo__inside\" style=\"position:absolute;background-image:url({{cover}});-webkit-transform:scale(1.1);transform:scale(1.1);\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<img class=\"loading-image\" style=\"position:absolute\" src=\"{{loadingImage}}\">\n\t\t\t\t\t<img class=\"static-loading-image\" style=\"position:absolute\" src=\"{{staticLoadingImage}}\">\n\t\t\t\t\t" },








	        viewer: {
	          params: {
	            enableDragAndDrop: true } },


	        // 移除 Nav Bar
	        navBar: {
	          html: "<div><div/>" } },


	      camera: {
	        behaviors: {
	          autoRotate: {
	            type: 0 } } }



	      // error: {
	      // 	html: "<div>.........</div>"
	      // }
	    });

	    // viewer.onEngineInitObservable.add(function (engine) {
	    // 	console.log('Engine initialized');
	    // });

	    // viewer.onSceneInitObservable.add(function (scene) {
	    // 	console.log('Scene initialized');
	    // });

	    viewer.onModelLoadedObservable.add(function (meshes) {
	      // 依照Ratio調整大小
	      if (hardwareScalingLevel !== 1) {
	        viewer.engine.setHardwareScalingLevel(hardwareScalingLevel);
	      }

	      // 顯示全螢幕按鈕
	      // 排除iOS，因為 iOS 沒有 Fullscreen API
	      if (!parser.getOS().name.match(/iOS/)) {
	        btnFullScreen.classList.remove('hide');
	      }
	    });
	  }

	  function build3DFullScreen() {
	    var elem = viewerEl;
	    var btn = btnFullScreen;

	    on(btn, 'click', function () {
	      if (elem.requestFullscreen) {
	        elem.requestFullscreen();
	      } else if (elem.msRequestFullscreen) {
	        elem.msRequestFullscreen();
	      } else if (elem.mozRequestFullScreen) {
	        elem.mozRequestFullScreen();
	      } else if (elem.webkitRequestFullscreen) {
	        elem.webkitRequestFullscreen();
	      } else if (document.webkitEnterFullscreen) {
	        elem.webkitEnterFullscreen();
	        // } else {
	        // 	elem.classList.add('is-fullscreen')
	      }
	    });
	  }

	  // 配合套版，給予可呼叫之function
	  function build3D() {
	    if (window.BABYLON) {
	      viewerEl = document.getElementById('babylon-viewer');
	      btnFullScreen = document.querySelector('.js-fullscreen');

	      build3DViewer();
	      build3DFullScreen();
	    }
	  }

	  window.build3D = build3D;

	  // on(window, 'load', function() {
	  // 	if (window.BABYLON) {
	  // 		viewerEl = document.getElementById('babylon-viewer');
	  // 		btnFullScreen = document.querySelector('.js-fullscreen');

	  // 		build3DViewer();
	  // 		build3DFullScreen();
	  // 	}
	  // });
	  /* ---------------------------------------- [END] Banner - 3D */
	})(window, document);

})();
