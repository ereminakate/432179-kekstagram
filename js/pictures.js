'use strict';

var pictureTemplate = document.querySelector('#picture-template').content;
var listPictures = document.querySelector('.pictures');
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

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
  var arrPictures = [];
  for (var i = 0; i < PHOTO_COUNT; i++) {
    arrPictures[i] = {
      url: './photos/' + (i + 1) + '.jpg',
      likes: randomInteger(LIKES_MIN, LIKES_MAX),
      comments: randomComments()
    };
  }
  return arrPictures;
}

// Функция выбора случайных чисел
function randomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Функция выбора случайного комментария
/* function randomComments() {
  var numberComments = randomInteger(COMMENTS_MIN, COMMENTS_MAX);
  var comment = '';
  if (numberComments === 1) {
    comment += USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)];
  } else {
    comment += USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)] + ' ' + USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)];
  }
  return comment;
}*/

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
  var elementImg = element.querySelector('img').getAttribute('src');
  var elementLikes = element.querySelector('.picture-likes').textContent;
  var elementComments = element.querySelector('.picture-comments').textContent;

  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', elementImg);
  galleryOverlay.querySelector('.likes-count').textContent = elementLikes;
  galleryOverlay.querySelector('.comments-count').textContent = elementComments;
}

var fragment = document.createDocumentFragment();

for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPictures(pictures[i]));
}

listPictures.appendChild(fragment);

// ---------> Обработчики событий
// Открытие галереи
function galleryOpen() {
  galleryOverlay.classList.remove('hidden');
  listPictures.removeEventListener('click', onPictureClick);
  galleryOverlayClose.addEventListener('click', onCloseCrossClick);
  galleryOverlayClose.addEventListener('keydown', onCloseCrossEnterPress);
  document.addEventListener('keydown', onGalleryEscPress);
}

// Закрытие галерии
function galleryClose() {
  galleryOverlay.classList.add('hidden');
  listPictures.addEventListener('click', onPictureClick);
  galleryOverlayClose.removeEventListener('click', onCloseCrossClick);
  galleryOverlayClose.removeEventListener('keydown', onCloseCrossEnterPress);
  document.removeEventListener('keydown', onGalleryEscPress);
}

// Клик на фотографии
function onPictureClick(event) {
  event.preventDefault();
  var clickTarget = event.target;

  while (clickTarget !== listPictures) {
    if (clickTarget.classList.contains('picture')) {
      setPhotoToOverlay(clickTarget);
      galleryOpen();
      break;
    }
    clickTarget = clickTarget.parentElement;
  }
}

// Клик на крестике галереи
function onCloseCrossClick(event) {
  galleryClose();
}

// Нажатие Enter на крестике галереи
function onCloseCrossEnterPress(event) {
  if (event.keyCode === ENTER_KEYCODE) {
    galleryClose();
  }
}
// Нажатие на ESC при открытой галерее
function onGalleryEscPress(event) {
  if (event.keyCode === ESC_KEYCODE) {
    galleryClose();
  }
}
// <------ Обработчики событий

listPictures.addEventListener('click', onPictureClick);
document.querySelector('.upload-overlay').classList.add('hidden');
