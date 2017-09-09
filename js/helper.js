'use strict';

var helper = function () {

  return {
    keyCodes: {
      enter: 13,
      esc: 27
    },
    addListeners: function (el, evts, fn) {
      evts.split(' ').map(function(evt) {
        el.addEventListener(evt, fn, false);
      });
    },

    debounce: function (fun, time) {
      var lastTimeout;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, time);
    }
  };
}();
