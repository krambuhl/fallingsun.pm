var $ = require('jquery');
var Hammer = require('hammerjs');
var Cell = require('./cell.js');

function Tracklist(el, options) {
  $.extend(this, {
    setup: setup,
    setActiveTrack: setActiveTrack
  });

  this.el = el;
  this.$el = $(el);

  this.cell = new Cell(el);
  this.setup();
}

function setup() {
  this.ui = setupUI(this);
  this.tracklistHammer = Hammer(this.ui.tracklist[0]);

  setupListeners(this);
  setupTracks(this);
}

function setupUI(self) {
  return {
    menu: self.$el.find('.l-tracks-menu'),
    wrapper: self.$el.find('.screen-wrapper'),
    tracklist: self.$el.find('.tracklist'),
    tracklistItems: self.$el.find('.tracklist-item'),
    tracks: self.$el.find('.track'),
    slider: self.$el.find('.slider')
  };
}

function setupListeners(self) {
  self.ui.tracklistItems.on('click', { self: self }, onTracklistActivate);
  self.tracklistHammer.on('tap', onTracklistToggle.bind(null, self));
  window.addEventListener('resize', updateWrapperHeight.bind(null, self));
}

function setupTracks(self) {
  setTrackHeight(self, 0);
}

function setTrackHeight(self, index) {
  var track = self.ui.tracks[index];
  track.setAttribute("data-height", track.scrollHeight);
  self.ui.slider.css('height', track.scrollHeight);

  updateWrapperHeight(self);
}

function updateWrapperHeight(self) {
  self.ui.menu.css('height', window.innerWidth > 720 ? window.innerHeight - window.innerWidth * 0.2 : '');
}

function onTracklistActivate(ev) {
  var self = ev.data.self;
  self.setActiveTrack(this.getAttribute('data-index'));
}

function onTracklistToggle(self) {
  if (window.innerWidth < 720) {
    self.ui.tracklist.toggleClass('is-expanded');
  } else {
    self.ui.tracklist.removeClass('is-expanded');
  }
}

function setActiveTrack(index) {
  var data = '[data-index="' + index + '"]';

  this.ui.tracks.removeClass('is-active')
    .filter(data).addClass('is-active');

  this.ui.tracklistItems.removeClass('is-active')
    .filter(data).addClass('is-active');

  setTrackHeight(this, index);

  this.currentTrackIndex = index;
}

module.exports = Tracklist;
