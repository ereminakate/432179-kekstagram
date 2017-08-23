'use strict';

var pictureTemplate = document.querySelector('#picture-template').content;

var listPictures = document.querySelector('.pictures');


var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var pictures = createPictures();

// Функция создания массива, состоящего из 25 сгенерированных JS объектов, которые будут описывать фотографии, размещенные другими пользователями
function createPictures() {
  var arrPictures = [];
  for (var i = 0; i < 25; i++) {
    arrPictures[i] = {
      url: './photos/' + (i + 1) + '.jpg',
      likes: randomInteger(15, 200),
      comments: randomComments()
    };
  }
  return arrPictures;
}

// Функция выбора случайных чисел
function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

// Функция выбора случайного комментария
function randomComments() {
  var numberComments = randomInteger(1, 2);
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

var galleryOverlay = document.querySelector('.gallery-overlay');
galleryOverlay.classList.remove('hidden');

galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', pictures[0].url);
galleryOverlay.querySelector('.likes-count').textContent = pictures[0].likes;
galleryOverlay.querySelector('.comments-count').textContent = pictures[0].comments;
