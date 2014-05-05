var $ = require('jquery');
var Hammer = require('hammerjs');
var Cell = require('./cell.js');

function Tracklist(el, options) {
  this.el = el;
  this.$el = $(el);

  this.cell = new Cell(el);

  setup(this);
}

function setup(self) {
  self.ui = {
    tracklist: self.$el.find('.tracklist'),
    tracklistItems: self.$el.find('.tracklist-item'),
    tracks: self.$el.find('.track')
  };

  setupTracks(self);
}

function setupTracks(self) {
  self.ui.tracklistItems.on('click', function () {
    var data = '[data-index="' + $(this).attr('data-index') + '"]';

    self.ui.tracks.removeClass('is-active')
      .filter(data).addClass('is-active');

    self.ui.tracklistItems.removeClass('is-active')
      .filter(data).addClass('is-active');

      console.log(self.ui.tracklistItems, data)
  });
}


module.exports = Tracklist;
