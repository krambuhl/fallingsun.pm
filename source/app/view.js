var $ = require('jquery');

function View(el, options) {
  self = this;

  this.el = el;
  this.$el = $(el);
  this.options = $.extend({}, options);

  setup(this);
}

function setup(view) {
  var setupUI = function() {
    var elements = {};
    for (var el in view.options.ui) {
        elements[el] = dom(ui[el], $el);
    }
    return elements;
  };

  var setupListeners = function() {
    $(window).on('resize', updateScreenSize.bind(null, view)).trigger('resize');
  };

  if (view.options.ui) view.ui = setupUI();
  setupListeners();
}

function updateScreenSize(view) {
  view.$el.css({
    width: window.innerWidth,
    minHeight: window.innerHeight
  });
}


module.exports = View;
