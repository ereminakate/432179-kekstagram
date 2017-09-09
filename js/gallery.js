'use strict';

// модуль, который работает с галереей изображений
var gallery = function () {

  var listPictures = document.querySelector('.pictures');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var filters = document.querySelector('.filters');
  var filterPictures = document.querySelector('.filters');

  var arrPictures = [];
  var arrRecommendPictures = [];

  var successHandler = function (data) {
    arrRecommendPictures = data.slice();
    arrPictures = data;
    renderPictures(arrPictures);
    filters.classList.remove('hidden');
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

  function renderPictures(pics) {
    listPictures.innerHTML = '';
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pics.length; i++) {
      fragment.appendChild(window.picture.render(pics[i]));
    }

    listPictures.appendChild(fragment);
  }

  // Фильтр картинок
  var sortPictures = function (el) {
    if (el.id === 'filter-popular') {
      return arrPictures.sort(function (left, right) {
        return right.likes - left.likes;
      });
    } else if (el.id === 'filter-discussed') {
      return arrPictures.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });
    } else if (el.id === 'filter-discussed') {
      return arrPictures.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });
    } else if (el.id === 'filter-random') {
      return randomArray(arrRecommendPictures.slice());
    } else {
      return arrRecommendPictures;
    }
  };

  function randomArray(arr) {
    arr.sort(function () {
      return Math.random() > 0.5;
    });
    return arr;
  }

  filterPictures.addEventListener('click', function () {
    if (document.activeElement.tagName === 'INPUT') {
      window.helper.debounce(renderPictures(sortPictures(document.activeElement)), 500);
    }
  }, false);

  // Загрузка картинок с сервера
  window.backend.load(successHandler, errorHandler);

  // Открытие/закрытие картинки
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

  window.helper.addListeners(document.querySelector('.pictures'), 'click keydown', openGallery);
  document.querySelector('.gallery-overlay-close').addEventListener('click', closeGallery);
  document.addEventListener('keydown', closeGallery);

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), function () {
      uploadOverlay.classList.add('hidden');
      resetValuesForm();
    }, errorHandler);
    evt.preventDefault();
  }, false);
}();
