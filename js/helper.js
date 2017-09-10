'use strict';

(function () {

  window.helper = {
    keyCodes: {
      enter: 13,
      esc: 27
    },
    addListeners: function (el, evts, fn) {
      evts.split(' ').map(function (evt) {
        el.addEventListener(evt, fn, false);
      });
    },

    debounce: function (fun, time) {
      if (window.lastTimeout) {
        clearTimeout(window.lastTimeout);
      }
      window.lastTimeout = setTimeout(fun, time);
    }
  };
})();
