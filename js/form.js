'use strict';

// модуль, который работает с формой редактирования изображения
(function () {

  var STEP = 25;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var uploadSselectImage = document.querySelector('#upload-select-image');
  var uploadFormCancel = uploadSselectImage.querySelector('.upload-form-cancel');
  var uploadFile = uploadSselectImage.querySelector('#upload-file');
  var uploadOverlay = uploadSselectImage.querySelector('.upload-overlay');
  var uploadFormDescription = uploadSselectImage.querySelector('.upload-form-description');
  var uploadResizeControlsValue = uploadSselectImage.querySelector('.upload-resize-controls-value');
  var uploadResizeControls = uploadSselectImage.querySelector('.upload-resize-controls');
  var effectImagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var uploadFormHashtags = uploadOverlay.querySelector('.upload-form-hashtags');
  var uploadEffectLevelPin = uploadOverlay.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelVal = uploadOverlay.querySelector('.upload-effect-level-val');

// -------------- Показ/скрытие формы кадрирования --------->
  function onUploadFile() {
    uploadSselectImage.querySelector('.upload-image').classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadOverlay.querySelector('.upload-effect-level').style.display = 'none';
  }

  function onUploadOverlayEscPress(evt) {
    if (document.activeElement.classList.contains('upload-form-description')) {
      return;
    }
    if (evt.keyCode === ESC_KEYCODE) {
      onCloseUploadOverlay();
    }
  }

  function onCloseUploadOverlay() {
    uploadSselectImage.querySelector('.upload-image').classList.remove('hidden');
    uploadOverlay.classList.add('hidden');
  }

  uploadFile.addEventListener('change', onUploadFile);
  uploadFormCancel.addEventListener('click', onCloseUploadOverlay);
  uploadFormCancel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onCloseUploadOverlay();
    }
  });
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

// Изменение значения масштаба картинки при нажатии на "+" или "-"
  window.initializeScale(uploadResizeControls, adjustScale);

  function adjustScale(event) {
    var scale = function () {
      if (event.target.tagName === 'BUTTON') {
        var step = event.target.classList.contains('upload-resize-controls-button-inc') ? STEP : -STEP;
        var valueFile = parseInt(uploadResizeControlsValue.value.substring(0, uploadResizeControlsValue.value.length - 1), 10);
        var newSize = valueFile + step;
      }
      return newSize;
    };

    var newscale = scale();
    if (newscale <= 100 && newscale >= 25) {
      uploadResizeControlsValue.value = newscale + '%';
      effectImagePreview.style.cssText = 'transform: scale(' + newscale / 100 + ')';
    }
  }
// <--------

// ---- Применение фильтров ---->
  window.initializeScale(uploadOverlay.querySelector('.upload-effect-controls'), onChangeFilterEffects);

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
    } else {
      return;
    }
  }
// <---- Применение фильтров ----

// --------- Проверка написания хэштэгов ------>
  function onValidHashtags() {

    var target = event.target;
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

    var MIN_COORD = 8;
    var MAX_COORD = 446;
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
