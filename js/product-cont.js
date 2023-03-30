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

  window.addEventListener('load', getWinSet);
  window.addEventListener('resize', getWinSet);
  /* ---------------------------------------- [END] Windows Setting */

  /* ---------------------------------------- [START] 詳細內容 展開更多 */
  function detailToggleBuild() {
    var detailBtnMore = document.querySelector('#pd-detail__button-more');
    var detailArticle = document.querySelector('#pd-detail__article');
    detailBtnMore.addEventListener('click', function () {
      detailArticle.classList.add('is-open');
      detailBtnMore.classList.add('hide');
    });
  }

  window.addEventListener('load', function () {
    // 因為要讓整體可以安裝vue，所有跟DOM讀取有端的function都要延後執行
    setTimeout(function () {
      detailToggleBuild();
    }, 20);
  });
  /* ---------------------------------------- [END] 詳細內容 展開更多 */

  /* ---------------------------------------- [START] pd-cont-fixed active nav */
  var mageSecEls = null;
  var mageAnchorName = '';
  var detectIfScrollStop = true;
  var offsetObj = {
    'app': {
      'default': 92 },

    'web': {
      'default': 100,
      'large': 245,
      'xlarge': 245 } };



  function mageActiveSec(num) {
    var marginTop = num;

    mageSecEls.forEach(function (item) {
      if (mageAnchorName !== item.dataset['mageTarget']) {
        mageAnchorName = item.dataset['mageTarget'];

        var rect = item.getBoundingClientRect();
        var anchorEls = document.querySelectorAll('[data-mage-nav] [href="#' + mageAnchorName + '"]');

        if (Math.floor(rect.top) <= marginTop && Math.floor(rect.bottom) > marginTop) {
          if (detectIfScrollStop) {
            anchorEls.forEach(function (mageItem) {
              mageItem.classList.add('is-active');
            });
            // console.log('is-active');
          }
        } else {
          anchorEls.forEach(function (mageItem) {
            mageItem.classList.remove('is-active');
          });
        }
      }
    });
  }

  function setUpMageFun() {
    if (mageSecEls.length) {
      var shapeType = document.documentElement.classList.contains('app') ? 'app' : 'web';
      var offsetNum = offsetObj[shapeType]['default'];

      if (ww >= 1024) offsetNum = offsetObj[shapeType]['large'];
      if (ww >= 1440) offsetNum = offsetObj[shapeType]['xlarge'];

      // 帶入要 offset 的高度
      mageActiveSec(offsetNum);
    }
  }

  window.addEventListener('load', function () {
    // 因為要讓整體可以安裝vue，所有跟DOM讀取有端的function都要延後執行
    setTimeout(function () {
      mageSecEls = document.querySelectorAll('[data-mage-target]');

      setUpMageFun();
      window.addEventListener('scroll', setUpMageFun);
      window.addEventListener('resize', setUpMageFun);
    }, 20);
  });

  /* ---------------------------------------- [END] pd-cont-fixed active nav */

  /* ---------------------------------------- [START] pd-cont-fixed click active nav */

  $(document).on('click', '[data-fixed] a[href]', function (e) {

    var shapeType = document.documentElement.classList.contains('app') ? 'app' : 'web';
    var anchorId = $(this).attr('href');

    if (anchorId.match(/^#/)) {
      e.preventDefault();

      var offsetTop = $(anchorId).offset().top;

      var offsetNum = offsetObj[shapeType]['default'];
      if (ww >= 1024) offsetNum = offsetObj[shapeType]['large'];
      if (ww >= 1440) offsetNum = offsetObj[shapeType]['xlarge'];

      detectIfScrollStop = false; // reset

      $('html, body').animate({
        scrollTop: Math.floor(offsetTop) - offsetNum },
      550, function () {
        if (!detectIfScrollStop) {
          detectIfScrollStop = true;
          // console.log(detectIfScrollStop);

          setUpMageFun();
        }
      });
    }
  });

  /* ---------------------------------------- [END] pd-cont-fixed click active nav */


})(window, document);