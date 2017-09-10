'use strict';

// модуль для отрисовки увеличенного изображения
(function () {

  var galleryOverlay = document.querySelector('.gallery-overlay');

  function setPhoto(elm) {
    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', elm.querySelector('img').getAttribute('src'));
    galleryOverlay.querySelector('.likes-count').textContent = elm.querySelector('.picture-likes').textContent;
    galleryOverlay.querySelector('.comments-count').textContent = elm.querySelector('.picture-comments').textContent;
  }

  function show() {
    galleryOverlay.classList.remove('hidden');
  }

  function hide() {
    galleryOverlay.classList.add('hidden');
  }

  window.preview = {
    setPhoto: setPhoto,
    show: show,
    hide: hide
  };
})();
