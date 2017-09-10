'use strict';

// модуль, который работает с формой редактирования изображения
(function () {

  var uploadSselectImage = document.querySelector('#upload-select-image');
  var uploadFormCancel = uploadSselectImage.querySelector('.upload-form-cancel');
  var uploadFile = uploadSselectImage.querySelector('#upload-file');
  var uploadOverlay = uploadSselectImage.querySelector('.upload-overlay');
  var uploadFormDescription = uploadSselectImage.querySelector('.upload-form-description');
  var uploadResizeControls = uploadSselectImage.querySelector('.upload-resize-controls');
  var effectImagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var uploadFormHashtags = uploadOverlay.querySelector('.upload-form-hashtags');
  var uploadEffectLevelPin = uploadOverlay.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelVal = uploadOverlay.querySelector('.upload-effect-level-val');
  var effectLevel = uploadOverlay.querySelector('.upload-effect-level');

  // инициализация масштабирования
  window.initializeScale(document.querySelector('.upload-resize-controls'), function (value) {
    document.querySelector('.upload-resize-controls-value').value = value + '%';
    document.querySelector('.effect-image-preview').style.cssText = 'transform: scale(' + value / 100 + ')';
  });

  // инициализация фильтров
  window.initializeFilters(uploadOverlay.querySelector('.upload-effect-controls'), function (node) {
    effectImagePreview.style.filter = '';
    effectImagePreview.className = 'effect-image-preview';
    effectImagePreview.classList.add(node.id.replace('upload-', ''));
  });

// -------------- Показ/скрытие формы кадрирования --------->
  function onCloseUploadOverlay(evt) {
    if (document.activeElement.classList.contains('upload-form-description')) {
      return;
    }
    if ((evt.keyCode === window.helper.keyCodes.enter && document.activeElement.classList.contains('upload-form-cancel'))
      || (evt.keyCode === window.helper.keyCodes.esc)
      || (evt.type === 'click')){
      uploadSselectImage.querySelector('.upload-image').classList.remove('hidden');
      uploadOverlay.classList.add('hidden');
    }
  }

  uploadFile.addEventListener('change', function () {
    uploadOverlay.classList.remove('hidden');
    uploadFile.classList.add('hidden');
    effectLevel.style.display = 'none';
  });

  document.addEventListener('keydown', onCloseUploadOverlay, false);
  uploadFormCancel.addEventListener('click', onCloseUploadOverlay);
  window.initializeScale(uploadResizeControls, adjustScale);
// <-------------- Показ/скрытие формы кадрирования ---------

// ------ Валидация и отправка формы, применение фильтров к картинке ----->

  uploadFormDescription.addEventListener('invalid', function () {
    if (!uploadFormDescription.validity.valid) {
      if (uploadFormDescription.value.length < 30) {
        uploadFormDescription.setCustomValidity('Комментарий должен содержать не менее 30 символов');
        uploadFormDescription.style.border = '1px solid red';
      } else if (uploadFormDescription.value.length > 100) {
        uploadFormDescription.setCustomValidity('Комментарий должен содержать не более 100 символов');
        uploadFormDescription.style.border = '1px solid red';
      } else if (uploadFormDescription.validity.valueMissing) {
        uploadFormDescription.setCustomValidity('Обязательное поле');
        uploadFormDescription.style.border = '1px solid red';
      }
    } else {
      uploadFormDescription.setCustomValidity('');
      uploadFormDescription.style.border = 'none';
    }
  });

  uploadFormDescription.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Комментарий должен содержать не менее 30 символов');
      uploadFormDescription.style.border = '1px solid red';
    } else {
      target.setCustomValidity('');
      target.style.border = 'none';
    }
  });

// <--------

// ---- Применение фильтров ---->
  window.initializeFilters(uploadOverlay.querySelector('.upload-effect-controls'), onChangeFilterEffects);

  function onChangeFilterEffects(evt) {
    var target = evt.target;

    if (target.tagName === 'INPUT') {
      effectImagePreview.style.filter = '';
      effectImagePreview.className = 'effect-image-preview';
      effectImagePreview.classList.add(target.id.replace('upload-', ''));
      if (effectImagePreview.classList.contains('effect-none')) {
        uploadOverlay.querySelector('.upload-effect-level').style.display = 'none';
      } else {
        uploadOverlay.querySelector('.upload-effect-level').style.display = '';
      }
    }
  }
// <---- Применение фильтров ----

// --------- Проверка написания хэштэгов ------>
  function onValidHashtags(evt) {

    var target = evt.target;
    var arrayHashtags = target.value.split(' ');
    if (arrayHashtags.length > 5) {
      target.setCustomValidity('В строке указано больше 5 хэштэгов');
      target.style.border = 'red solid 1px';
    } else {
      for (var index = 0; index < arrayHashtags.length; index++) {
        arrayHashtags.sort();
        if (arrayHashtags[index].length > 20) {
          target.setCustomValidity('Хэштэг не может содержать более 20 символов');
          target.style.border = 'red solid 1px';
          break;
        } else if (arrayHashtags[index].charAt(0) !== '#') {
          target.setCustomValidity('Хэштэг должен начинаться с символа "#"');
          target.style.border = 'red solid 1px';
          break;
        } else if (arrayHashtags[index].lastIndexOf('#') > 0) {
          target.setCustomValidity('Хэштэги должны разделяться пробелом');
          target.style.border = 'red solid 1px';
          break;
        } else if ((index !== arrayHashtags.length - 1) && (arrayHashtags[index + 1] === arrayHashtags[index])) {
          target.setCustomValidity('В строке указаны повторяющиеся хэштэги');
          target.style.border = 'red solid 1px';
          break;
        } else {
          target.setCustomValidity('');
          target.style.border = 'none';
        }
      }
    }
  }

  uploadFormHashtags.addEventListener('change', onValidHashtags);
// --------- Проверка написания хэштэгов <------
// <----- Валидация и отправка формы, применение фильтров к картинке --------

  // Реализация движения ползунка фильтров ------>

  uploadEffectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var MIN_COORD = uploadEffectLevelPin.offsetWidth / 2;
    var MAX_COORD = uploadEffectLevelPin.parentNode.offsetWidth;
    var sliderCoord;

    var startCoordsX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;

      if (uploadEffectLevelPin.offsetLeft - shiftX <= MIN_COORD) {
        sliderCoord = MIN_COORD;
      } else if (uploadEffectLevelPin.offsetLeft - shiftX >= MAX_COORD) {
        sliderCoord = MAX_COORD;
      } else {
        sliderCoord = uploadEffectLevelPin.offsetLeft - shiftX;
      }

      uploadEffectLevelPin.style.left = sliderCoord + 'px';
      var valPercent = Math.floor(sliderCoord / (MAX_COORD / 100));
      uploadEffectLevelVal.style.width = valPercent > 100 ? 100 + '%' : valPercent + '%';

      onMousedownChangeFilter(valPercent);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Функция реализует изменение фильтра на картинку в заданном значении ползунка

  function onMousedownChangeFilter(value) {
    if (effectImagePreview.classList.contains('effect-chrome')) {
      effectImagePreview.style.filter = 'grayscale(' + (value / 100) + ')';
    } else if (effectImagePreview.classList.contains('effect-sepia')) {
      effectImagePreview.style.filter = 'sepia(' + value / 100 + ')';
    } else if (effectImagePreview.classList.contains('effect-marvin')) {
      effectImagePreview.style.filter = 'invert(' + value + '%)';
    } else if (effectImagePreview.classList.contains('effect-phobos')) {
      effectImagePreview.style.filter = 'blur(' + (3 / (100 / value)) + 'px)';
    } else if (effectImagePreview.classList.contains('effect-heat')) {
      effectImagePreview.style.filter = 'brightness(' + (3 / (100 / value)) + ')';
    }
  }
// Реализация движения ползунка фильтров <------
})();
