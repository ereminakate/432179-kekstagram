'use strict';

// модуль для отрисовки миниатюры изображений
(function () {

  var pictureTemplate = document.querySelector('#picture-template').content;

  window.picture = {
    render: function (pic) {
      var elementPicture = pictureTemplate.cloneNode(true);
      elementPicture.querySelector('.picture-comments').textContent = pic.comments;
      elementPicture.querySelector('.picture-likes').textContent = pic.likes;
      elementPicture.querySelector('img').setAttribute('src', pic.url);

      return elementPicture;
    }
  };
})();
