'use strict';

(function () {
  window.initializeScale = function (el, fn) {
    el.addEventListener('click', function (evt) {
      var STEP = 25;
      var MIN_SCALE = 25;
      var MAX_SCALE = 100;
      var elm = evt.target;
      var step = elm.classList.contains('upload-resize-controls-button-inc') ? STEP : -STEP;
      var uploadResizeControlsValue = document.querySelector('.upload-resize-controls-value');
      var valueFile = parseInt(uploadResizeControlsValue.value.substring(0, uploadResizeControlsValue.value.length - 1), 10);
      var newSize = valueFile + step;

      if (newSize <= MAX_SCALE && newSize >= MIN_SCALE) {
        fn(newSize);
      }
    }, false);
  };
})();
