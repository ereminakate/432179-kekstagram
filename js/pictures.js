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