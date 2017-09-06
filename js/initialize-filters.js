'use strict';

var initializeFilters = function (el, fn) {
  el.addEventListener('click', fn, false);
};
