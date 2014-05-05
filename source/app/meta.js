var $ = require('jquery');
var Hammer = require('hammerjs');
var Cell = require('./cell.js');

function Meta(el, options) {
  this.el = el;
  this.$el = $(el);

  this.cell = new Cell(el);

  setup(this);
}

function setup(self) {
  self.ui = {
    gallery: self.$el.find('.gallery'),
    galleryItems: self.$el.find(".gallery-item")
  };

  // console.log(self, 'meta-update');
  setupGallery(self);
}

function setupGallery(self) {
  var currentIndex = 0;

  function setActive(index) {
    var max = self.ui.galleryItems.length - 1;
    currentIndex = index <= max ? index > 0 ? index : 0 : max; // boundries

    self.ui.galleryItems.removeClass('is-active')
      .eq(currentIndex).addClass('is-active');
  }

  function next() {
    setActive(currentIndex + 1);
  }

  function prev() {
    setActive(currentIndex - 1);
  }

  self.galleryHammer = new Hammer(self.ui.gallery[0]);

  self.galleryHammer.on('dragend', function (ev) {
    if (ev.gesture && ev.gesture.direction) {
      if (ev.gesture.direction == "left") next();
      if (ev.gesture.direction == "right") prev();
    }
  });

  setActive(0);
}


module.exports = Meta;
