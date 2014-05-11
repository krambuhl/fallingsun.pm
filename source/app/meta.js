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
    wrapper: self.$el.find('.screen-wrapper'),
    gallery: self.$el.find('.gallery'),
    galleryItems: self.$el.find(".gallery-item")
  };

  // console.log(self, 'meta-update');
  setupGallery(self);
  window.addEventListener('resize', updateWrapperSize.bind(null, self));

  updateWrapperSize(self);
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

function updateWrapperSize(self) {
  var wh = window.innerHeight;
  var ch = self.ui.wrapper.innerHeight();
  var isFloating = ch + (window.innerWindow * 0.1) < wh ? true : false;

  self.$el[isFloating ?  'addClass' : 'removeClass']('is-floating');
  self.ui.wrapper.css({
    top: isFloating ? (wh - ch) / 2 : ''
  });
}



module.exports = Meta;
