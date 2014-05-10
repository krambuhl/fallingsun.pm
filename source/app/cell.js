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
  window.addEventListener('scroll', onWindowScroll.bind(null, cell));

  onWindowResize(cell);
}

function onWindowResize(cell) {
  updateScreenSize(cell);
  updateWrapperSize(cell);
}

function onWindowScroll() {

}

function updateScreenSize(cell) {
  cell.$el.css({
    width: window.innerWidth,
    minHeight: window.innerHeight
  });
}

function updateWrapperSize(cell) {
  var wh = window.innerHeight;
  var ch = cell.ui.wrapper.innerHeight();
  var isFloating = ch +  offset < wh ? true : false;

  cell.$el[isFloating ?  'addClass' : 'removeClass']('is-floating');
  // cell.ui.wrapper.css({
  //   top: isFloating ? (wh - ch) / 2 : ''
  // });
}


module.exports = Cell;
