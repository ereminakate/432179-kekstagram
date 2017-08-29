'use strict';

var pictureTemplate = document.querySelector('#picture-template').content;
var listPictures = document.querySelector('.pictures');
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
var uploadSselectImage = document.querySelector('#upload-select-image');
var uploadFile = uploadSselectImage.querySelector('#upload-file');
var uploadOverlay = uploadSselectImage.querySelector('.upload-overlay');
var uploadFormCancel = uploadSselectImage.querySelector('.upload-form-cancel');
var uploadFormDescription = uploadSselectImage.querySelector('.upload-form-description');
var uploadResizeControlsValue = uploadSselectImage.querySelector('.upload-resize-controls-value');
var uploadResizeControlsButtons = uploadSselectImage.querySelectorAll('.upload-resize-controls-button');
var effectImagePreview = uploadOverlay.querySelector('.effect-image-preview');
var uploadFormHashtags = uploadOverlay.querySelector('.upload-form-hashtags');

var STEP_DEC = -25;
var STEP_INC = 25;
var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_COUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS_MIN = 1;
var COMMENTS_MAX = 2;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var pictures = createDescriptionPictures();

// Функция создания массива, состоящего из 25 сгенерированных JS объектов, которые будут описывать фотографии, размещенные другими пользователями
function createDescriptionPictures() {
  var arrDescriptionPictures = [];
  for (var i = 0; i < PHOTO_COUNT; i++) {
    arrDescriptionPictures[i] = {
      url: './photos/' + (i + 1) + '.jpg',
      likes: randomInteger(LIKES_MIN, LIKES_MAX),
      comments: randomComments()
    };
  }
  return arrDescriptionPictures;
}

// Функция выбора случайных чисел
function randomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function randomComments() {
  var numberComments = randomInteger(COMMENTS_MIN, COMMENTS_MAX);
  var comments = [];
  for (var i = 0; i < numberComments; i++) {
    comments.push(USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)]);
  }
  return comments + ' ' + numberComments;
}

// Функция заполнения данными фотографий
function renderPictures(pic) {
  var elementPicture = pictureTemplate.cloneNode(true);
  elementPicture.querySelector('.picture-comments').textContent = pic.comments;
  elementPicture.querySelector('.picture-likes').textContent = pic.likes;
  elementPicture.querySelector('img').setAttribute('src', pic.url);

  return elementPicture;
}

// Вставка фотографии с данными в оверлей
function setPhotoToOverlay(element) {
  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', element.querySelector('img').getAttribute('src'));
  galleryOverlay.querySelector('.likes-count').textContent = element.querySelector('.picture-likes').textContent;
  galleryOverlay.querySelector('.comments-count').textContent = element.querySelector('.picture-comments').textContent;
}

var fragment = document.createDocumentFragment();

for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPictures(pictures[i]));
}

listPictures.appendChild(fragment);

function onClosePicture(event) {
  if (event.keyCode === ESC_KEYCODE
    || (event.keyCode === ENTER_KEYCODE && event.target.classList.contains('gallery-overlay-close'))
    || event.type === 'click') {
    if (!galleryOverlay.classList.contains('hidden')){
      galleryOverlay.classList.add('hidden');
    }
  }
}

galleryOverlayClose.addEventListener('click', onClosePicture, false);
document.addEventListener('keydown', onClosePicture, false);

// Функция добавления обработчиков открытия картинки при клике
var arrPictures = listPictures.querySelectorAll('.picture');

for (var index = 0; index < arrPictures.length; index++) {

  var item = arrPictures[index];

  item.addEventListener('click', function (event) {
    event.preventDefault();
    setPhotoToOverlay(event.target.parentNode);
    galleryOverlay.classList.remove('hidden');
  });

  item.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      event.preventDefault();
      setPhotoToOverlay(event.target);
      galleryOverlay.classList.remove('hidden');
    }
  });
}

document.querySelector('.upload-overlay').classList.add('hidden');

// -------------- Показ/скрытие формы кадрирования --------->

// Изменение значения поля загрузки фотографии
function onUploadFile() {
  uploadSselectImage.querySelector('.upload-image').classList.add('hidden');
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadOverlayEscPress);
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
      uploadFormDescription.style.borderColor = 'red';
    } else if (uploadFormDescription.value.length > 100) {
      uploadFormDescription.setCustomValidity('Комментарий должен содержать не более 100 символов');
      uploadFormDescription.style.borderColor = 'red';
    } else if (uploadFormDescription.validity.valueMissing) {
      uploadFormDescription.setCustomValidity('Обязательное поле');
      uploadFormDescription.style.borderColor = 'red';
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
    uploadFormDescription.style.borderColor = 'red';
  } else {
    target.setCustomValidity('');
    target.style.border = 'none';
  }
});

// Функция изменения значения масштаба картинки при нажатии на "+" или "-"
function onResizeButton(stepResize) {
  var valueFile = uploadResizeControlsValue.value.substring(0, uploadResizeControlsValue.value.length - 1);
  valueFile = Number(valueFile) + stepResize;

  if ((valueFile >= 25) && (valueFile <= 100)) {
    uploadResizeControlsValue.value = valueFile + '%';
  }

  var transformValue = uploadResizeControlsValue.value.substring(0, uploadResizeControlsValue.value.length - 1) / 100;
  effectImagePreview.style.cssText = 'transform: scale(' + transformValue + ')';
}

// События нажатия кнопок уменьшения или увеличения масштаба картинки ---->
for (var i = 0; i < uploadResizeControlsButtons.length; i++) {
  uploadResizeControlsButtons[i].addEventListener('click', function () {
    if (document.activeElement.classList.contains('upload-resize-controls-button-dec')) {
      onResizeButton(STEP_DEC);
    } else {
      onResizeButton(STEP_INC);
    }
  });
}
// <--------

// ---- Применение фильтров ---->
function onChangeFilterEffects(evt) {
  effectImagePreview.className = 'effect-image-preview';
  var target = evt.target;

  if (target.tagName !== 'INPUT') {
    return;
  }
  var newFilterClass = target.id.replace('upload-', '');
  effectImagePreview.classList.add(newFilterClass);
}

uploadOverlay.querySelector('.upload-effect-controls').addEventListener('click', onChangeFilterEffects);
// <---- Применение фильтров ----

// --------- Проверка написания хэштэгов ------>
function onValidHashtags() {
  var target = event.target;
  var arrayHashtags = target.value.split(' ');
  if (arrayHashtags.length > 5) {
    target.setCustomValidity('В строке указано больше 5 хэштэгов');
    target.style.borderColor = 'red';
  } else {
    for (var index = 0; index < arrayHashtags.length; index++) {
      arrayHashtags.sort();
      if (arrayHashtags[index].length > 20) {
        target.setCustomValidity('Хэштэг не может содержать более 20 символов');
        target.style.borderColor = 'red';
        break;
      } else if (arrayHashtags[index].charAt(0) !== '#') {
        target.setCustomValidity('Хэштэг должен начинаться с символа "#"');
        target.style.borderColor = 'red';
        break;
      } else if ((index !== arrayHashtags.length - 1) && (arrayHashtags[index + 1] === arrayHashtags[index])) {
        target.setCustomValidity('В строке указаны повторяющиеся хэштэги');
        target.style.borderColor = 'red';
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
//
// <----- Валидация и отправка формы, применение фильтров к картинке --------
//
// <------ Обработчики событий ------------------------------
// **********************************************************
