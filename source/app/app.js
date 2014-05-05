var $ = require('jquery');
var Meta = require('./meta.js');

$(function() {
  window.app = new App("body");
});

function App(el) {
  this.el = el;
  this.$el = $(el);

  setup(this);
}

function setup(app) {
  app.meta = new Meta('[data-screen="meta"]');
}
