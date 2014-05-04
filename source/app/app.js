var $ = require('jquery');
var View = require('./view.js');

$(function() {
  var screens = $('.screen');
  var app = {};

  app.children = [];
  screens.each(function(i) {
    app.children.push(new View(this));
  });

  window.app = app;
});
