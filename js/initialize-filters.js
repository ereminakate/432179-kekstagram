'use strict';

(function () {
  window.initializeFilters = function (el, fn) {
    el.addEventListener('click', function (event) {
      var target = event.target;
      var effectImagePreview = document.querySelector('.effect-image-preview');
      var uploadOverlay = document.querySelector('.upload-overlay');

      if (target.tagName === 'INPUT') {
        fn(target);
        uploadOverlay.querySelector('.upload-effect-level').style.display =
          effectImagePreview.classList.contains('effect-none') ?
            'none' : '';
      }
    }, false);
  };
})();
