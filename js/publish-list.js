(function (window, document) {
  /* ---------------------------------------- [START] Pd Category */
  var wrapAttr = '[data-category]';
  var btnAttr = '[data-category-btn]';

  $(document).on('click', btnAttr, function () {
    var $parent = $(this).parent('.page-category__item');

    $parent.siblings().removeClass('is-active');
    $parent.addClass('is-active');

    // Category switch
    var tabId = $('.tabs-title.is-active').find('a').attr('href');
    loadImg($(this), $(tabId).find(pdListImg));
  });
  /* ---------------------------------------- [END] Pd Category */

  /* ---------------------------------------- [START] Pd Tab 切換時觸發 lazyload */
  var pdListImg = '.pd-list__cont .pd-card__img-box';
  var $target = null;

  $(window).on('load', function () {
    // 因為整體安裝Vue，所以物件延遲讀取
    setTimeout(function () {
      $target = $('.page-nav__item.tabs-title:not(.is-active)');

      // console.log('$target', $target)

      // Tab switch
      $target.on('click', function () {
        var tabId = $(this).find('a').attr('href');
        loadImg($(this), $(tabId).find(pdListImg));
      });
    }, 20);
  });


  // Category switch: 寫在 Pd Category 內

  function loadImg($this, $target) {
    var imgItem = $target.find('img');

    for (var i = 0; i < imgItem.length; i++) {
      var $currentItem = imgItem.eq(i);

      if ($currentItem.data('src') !== undefined) {
        var imgSrc = $currentItem.data('src');
        $currentItem.attr('src', imgSrc);
        $currentItem.removeAttr('data-src');
        $currentItem.addClass('loaded');
        $currentItem.parent().addClass('loaded-content');
      }
    }

    removeEvent($this);
  }

  function removeEvent($target) {
    $target.off('click', loadImg);
  }
  /* ---------------------------------------- [END] Pd Tab 切換時觸發 lazyload */

})(window, document);