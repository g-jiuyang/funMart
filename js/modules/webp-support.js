(function () {
	'use strict';

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

})();
