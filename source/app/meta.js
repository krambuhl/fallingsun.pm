var $ = require('jquery');
var Cell = require('./cell.js');

function Meta(el, options) {
  this.el = el;
  this.$el = $(el);

  this.cell = new Cell(el);

  setup(this);
}

function setup(self) {
  // console.log(self, 'meta-update');
}


module.exports = Meta;
