var $ = require('jquery');
var _ = require('lodash');

function Cell(el, options) {
  _.extend(this, options);
  setElement(this, el);

  setup(this);
}

function setElement(cell, el) {
  cell.el = $(el).eq(0);
  cell.$ = function (el) { return cell.el.find(el); };
}

function setup(cell) {
  setupDom(cell);

  // $(window).on('resize', _.bind(onWindowResize, null, cell));
  window.addEventListener('resize', onWindowResize.bind(null, cell));
  onWindowResize(cell);
}

function setupDom(cell) {
  _.extend(cell.dom, {
     wrapper: cell.$(".screen-wrapper")
  });
}

function onWindowResize(cell) {
  updateScreenSize(cell);
}

function updateScreenSize(cell) {
  cell.el.css('min-height', window.innerHeight);
}

module.exports = Cell;
