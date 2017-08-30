'use strict';

// модуль, который создает данные
(function () {

  var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var PHOTO_COUNT = 25;
  var LIKES_MIN = 15;
  var LIKES_MAX = 200;
  var COMMENTS_MIN = 1;
  var COMMENTS_MAX = 2;

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

  window.data = {
    pictures: createDescriptionPictures()
  };
})();
