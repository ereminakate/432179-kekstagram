'use strict';

// модуль, который работает с галереей изображений
var gallery = function () {

  var listPictures = document.querySelector('.pictures');
  var uploadOverlay = document.querySelector('.upload-overlay');

  var successHandler = function (pictures) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(window.picture.render(pictures[i]));
    }

    listPictures.appendChild(fragment);
  };
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.zIndex = '100';
    node.style.margin = '0 auto';
    node.style.textAlign = 'center';
    node.style.backgroundColor = 'white';
    node.style.color = 'red';
    node.style.fontWeight = 'bold';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(successHandler, errorHandler);


  function openGallery(evt) {
    if (evt.type === 'click' || evt.keyCode === window.helper.keyCodes.enter) {
      evt.preventDefault();
      window.preview.setPhoto(evt.target.parentNode);
      window.preview.show();
    }
  }

  function closeGallery(evt) {
    if (evt.keyCode === window.helper.keyCodes.esc
      || (evt.keyCode === window.helper.keyCodes.enter && evt.target.classList.contains('gallery-overlay-close'))
      || evt.type === 'click') {
      if (!document.querySelector('.gallery-overlay').classList.contains('hidden')) {
        window.preview.hide();
      }
    }
  }
  var form = document.querySelector('.upload-form');
  function resetValuesForm() {
    form.reset();
  }

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), function () {
      uploadOverlay.classList.add('hidden');
      resetValuesForm();
    }, errorHandler);
    evt.preventDefault();
  }, false);

  window.helper.addListeners(document.querySelector('.pictures'), 'click keydown', openGallery);
  document.querySelector('.gallery-overlay-close').addEventListener('click', closeGallery);
  document.addEventListener('keydown', closeGallery);
}();
