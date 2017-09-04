'use strict';

// модуль, который работает с галереей изображений
var gallery = function () {

  var listPictures = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.data.pictures.length; i++) {
    fragment.appendChild(window.picture.render(window.data.pictures[i]));
  }

  listPictures.appendChild(fragment);

  function openGallery(event){
    if (event.type === 'click' || event.keyCode === window.helper.keyCodes.enter) {
      event.preventDefault();
      window.preview.setPhoto(event.target.parentNode);
      window.preview.show();
    }
  }

  function closeGallery(event) {
    if (event.keyCode === window.helper.keyCodes.esc
      || (event.keyCode === window.helper.keyCodes.enter && event.target.classList.contains('gallery-overlay-close'))
      || event.type === 'click') {
      if (!document.querySelector('.gallery-overlay').classList.contains('hidden')) {
        window.preview.hide();
      }
    }
  }

  window.helper.addListeners(document.querySelector('.pictures'), 'click keydown', openGallery);
  document.querySelector('.gallery-overlay-close').addEventListener('click', closeGallery);
  document.addEventListener('keydown', closeGallery);
}();

