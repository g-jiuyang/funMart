(function () {
	'use strict';

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

})();
