'use strict';

// модуль для отрисовки увеличенного изображения
(function () {

  var galleryOverlay = document.querySelector('.gallery-overlay');

  window.preview = {
    setPhotoToOverlay: function (element) {
      galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', element.querySelector('img').getAttribute('src'));
      galleryOverlay.querySelector('.likes-count').textContent = element.querySelector('.picture-likes').textContent;
      galleryOverlay.querySelector('.comments-count').textContent = element.querySelector('.picture-comments').textContent;
    }
  };
})();
