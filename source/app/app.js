var $ = require('jquery');
var fastclick = require('fastclick');

var Meta = require('./meta.js');
var Tracklist = require('./tracklist.js');

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
  app.tracklist = new Tracklist('[data-screen="tracklist"]');
  fastclick(document.body);
}
