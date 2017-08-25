'use strict';

var pictureTemplate = document.querySelector('#picture-template').content;

var listPictures = document.querySelector('.pictures');

var galleryOverlay = document.querySelector('.gallery-overlay');

var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_COUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS_MIN = 1;
var COMMENTS_MAX = 2;

var pictures = createPictures();

// Функция создания массива, состоящего из 25 сгенерированных JS объектов, которые будут описывать фотографии, размещенные другими пользователями
function createPictures() {
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
function randomComments() {
  var numberComments = randomInteger(COMMENTS_MIN, COMMENTS_MAX);
  var comment = '';
  if (numberComments === 1) {
    comment += USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)];
  } else {
    comment += USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)] + ' ' + USER_COMMENTS[randomInteger(0, USER_COMMENTS.length - 1)];
  }
  return comment;
}

// Функция заполнения данными фотографий
function renderPictures(pic) {
  var elementPicture = pictureTemplate.cloneNode(true);
  elementPicture.querySelector('.picture-comments').textContent = pic.comments;
  elementPicture.querySelector('.picture-likes').textContent = pic.likes;
  elementPicture.querySelector('img').setAttribute('src', pic.url);

  return elementPicture;
}

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPictures(pictures[i]));
}

listPictures.appendChild(fragment);

document.querySelector('.upload-overlay').classList.add('hidden');

listPictures.addEventListener('click', function (evt) {
  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', pictures[0].url);
  galleryOverlay.querySelector('.likes-count').textContent = pictures[0].likes;
  galleryOverlay.querySelector('.comments-count').textContent = pictures[0].comments;
  galleryOverlay.classList.remove('hidden');
  evt.target.stopPropagation();
}, true);

