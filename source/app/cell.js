var $ = require('jquery');
var _ = require('lodash');
var offset = 80;

function Cell(el) {
  this.el = el;
  this.$el = $(el);

  setup(this);
}

function setup(cell) {
  cell.ui = {
    wrapper: cell.$el.find(".screen-wrapper")
  };

  window.addEventListener('resize', onWindowResize.bind(null, cell));
  onWindowResize(cell);
}

function onWindowResize(cell) {
  updateScreenSize(cell);
}

function updateScreenSize(cell) {
  cell.$el.css({
    width: window.innerWidth,
    minHeight: window.innerHeight
  });
}

module.exports = Cell;
