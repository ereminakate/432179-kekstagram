'use strict';

// модуль, который работает с галереей изображений
(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  var listPictures = document.querySelector('.pictures');

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.data.pictures.length; i++) {
    fragment.appendChild(window.picture.renderPictures(window.data.pictures[i]));
  }

  listPictures.appendChild(fragment);

  // Функция добавления обработчиков открытия картинки при клике
  var arrPictures = listPictures.querySelectorAll('.picture');

  for (var index = 0; index < arrPictures.length; index++) {

    var item = arrPictures[index];

    item.addEventListener('click', function (event) {
      event.preventDefault();
      window.preview.setPhotoToOverlay(event.target.parentNode);
      galleryOverlay.classList.remove('hidden');
    });

    item.addEventListener('keydown', function (event) {
      if (event.keyCode === ENTER_KEYCODE) {
        event.preventDefault();
        window.preview.setPhotoToOverlay(event.target);
        galleryOverlay.classList.remove('hidden');
      }
    });
  }

  document.querySelector('.upload-overlay').classList.add('hidden');

  // Функция добавления обработчиков закрытия картинки при клике
  function onClosePicture(event) {
    if (event.keyCode === ESC_KEYCODE
      || (event.keyCode === ENTER_KEYCODE && event.target.classList.contains('gallery-overlay-close'))
      || event.type === 'click') {
      if (!galleryOverlay.classList.contains('hidden')) {
        galleryOverlay.classList.add('hidden');
      }
    }
  }

  galleryOverlayClose.addEventListener('click', onClosePicture, false);
  document.addEventListener('keydown', onClosePicture, false);
})();
