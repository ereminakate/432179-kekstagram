'use strict';

// модуль, который работает с галереей изображений
(function () {

  var listPictures = document.querySelector('.pictures');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var filterPictures = document.querySelector('.filters');
  var previewImage = uploadOverlay.querySelector('.effect-image-preview');
  var form = document.querySelector('.upload-form');

  var arrPictures = [];
  var arrRecommendPictures = [];

  function onSuccessResult(data) {
    arrRecommendPictures = data.slice();
    arrPictures = data;
    renderPictures(arrPictures);
    filterPictures.classList.remove('hidden');
  }

  function onErrorResult(errorMessage) {
    var node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.zIndex = '100';
    node.style.left = 0;
    node.style.right = 0;
    node.style.textAlign = 'center';
    node.style.backgroundColor = 'white';
    node.style.color = 'red';
    node.style.fontWeight = 'bold';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  function renderPictures(pics) {
    listPictures.innerHTML = '';
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pics.length; i++) {
      fragment.appendChild(window.picture.render(pics[i]));
    }

    listPictures.appendChild(fragment);
  }

  // Фильтр картинок
  function sortPictures(el) {
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
      return randomizeArray(arrRecommendPictures.slice());
    } else {
      return arrRecommendPictures;
    }
  }

  function randomizeArray(arrs) {
    arrs.sort(function () {
      return Math.random() > 0.5;
    });
    return arrs;
  }

  function applyFilter() {
    renderPictures(sortPictures(document.activeElement));
  }

  filterPictures.addEventListener('click', function () {
    if (document.activeElement.tagName === 'INPUT') {
      window.helper.debounce(applyFilter, 500);
    }
  }, false);

  // Загрузка картинок с сервера
  window.backend.load(onSuccessResult, onErrorResult);

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

  window.helper.addListeners(document.querySelector('.pictures'), 'click keydown', openGallery);
  document.querySelector('.gallery-overlay-close').addEventListener('click', closeGallery);
  document.addEventListener('keydown', closeGallery);

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), function () {
      uploadOverlay.classList.add('hidden');
      form.reset();
      previewImage.className = 'effect-image-preview';
    }, onErrorResult);
  }, false);
})();
