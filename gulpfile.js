//gulp
var gulp = require('gulp');

// npm package
var pkg = require('./package.json');

// npm tools
var fs = require('fs');
var path  = require('path');
var slice = require('sliced');
var es = require('event-stream');

// gulp general plugins
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var refresh = require('gulp-livereload');
var cache = require('gulp-cache');
var source = require('vinyl-source-stream');
var map = require('map-stream');
var concatMaps = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var inject = require("gulp-inject");
var handlebars = require('gulp-compile-handlebars');
var ftp = require('gulp-ftp');

// css tasks
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var minify = require('gulp-clean-css');

// js tasks
var uglify = require('gulp-uglify');

// browserify
var watchify = require('watchify');

// docs & tests
var docco = require("gulp-docco");
var wrapDocco = require('gulp-wrap-docco');

// project directories
var sourceDir = './source';
var destDir = './dist';
var testsDir = './tests';
var testsDir = './tests';

// asset directories
var css = 'sass';
var app = 'app';
var javascript = 'scripts';
var library = 'lib';
var images = 'images';
var templates = 'templates';

// filetype globs
var docGlob = '**/*.{js,css,sass,scss,json,md,html,hbs,handlebars}';
var rawGlob = '**/*.{js,css,sass,scss,md}';


// helper functions
function dir() { return slice(arguments).join('/'); }



// __styles__ task:
// - sass
// - autoprefixer
// - media query combiner
// - css minifier
gulp.task('styles', function() {
  return gulp.src(dir(sourceDir, css, 'style.scss'))
    .pipe(sass({ style: 'expanded', sourceComments: 'map', errLogToConsole: true }))
    .pipe(autoprefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', { cascade: true }))
    .pipe(gulp.dest(destDir))
    .pipe(refresh())
    .pipe(cmq())
    .pipe(minify())
    .pipe(rename('min/style.min.css'))
    .pipe(gulp.dest(destDir));
});


// __lib__ task:
// - concat library files w/ sourcemaps
//   + output:  'dist/lib.js'
// - concat library files w/o sourcemaps
// - uglify / minify
//   + output: 'dist/lib.min.js'
gulp.task('lib', function() {
  var libjs = dir(sourceDir, library, '**/*.js');

  gulp.src(libjs)
    .pipe(concat('min/lib.min.js'))
    .pipe(gulp.dest(destDir))
    .pipe(uglify())
    .pipe(gulp.dest(destDir));

  return gulp.src(libjs)
    .pipe(concatMaps('lib.js'))
    .pipe(gulp.dest(destDir))
    .pipe(refresh());
});


// __app__ task:
// - watchify
//   - watch app directory
//   - browserify
//     + output: 'app-bundle.js'

gulp.task('app', function() {
  var bundler = watchify(dir(sourceDir, 'app', 'app.js'), { debug: true });

  bundler.transform('brfs');
  bundler.on('update', rebundle);

  function rebundle () {
    return bundler.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(destDir))
      .pipe(refresh());
  }

  return rebundle();
});

// __build__ task:
// compiles static templates with enviornment data
//
// - static handlebars
//   + output: various files to './dist/'
gulp.task('build', ['base'], function() {
  var data = {
    meta: require(dir(sourceDir, "data/meta.json")),
    tracklist: require(dir(sourceDir, "data/tracklist.json")),
    scripts: ['app.js'],
    stylesheets: ['style.css']
  };

  var options = {
    helpers : {
      join: function(arr, str) {
        return (arr || []).join(str);
      }
    }
  };

  gulp.src(dir(sourceDir, 'index.html'))
    .pipe(handlebars(data, options))
    .pipe(gulp.dest(destDir));

});


// __docs__ task:
// creates documentation from code in source folder using docco
//
// - docco (side by side documentation)
//   + output: various files to './docs'
gulp.task('docs', function() {
  // es.merge(
  //   gulp.src(dir(sourceDir, docGlob)),
  //   // gulp.src(dir(testsDir, docGlob))
  //   // gulp.src('gulpfile.js'),
  //   gulp.src('README.md')
  // )
  return gulp.src(dir(sourceDir, rawGlob))
    .pipe(wrapDocco())
    .pipe(gulp.dest('./docs'))
    .pipe(refresh());
});


gulp.task('copy-images', function() {
  return gulp.src(dir(sourceDir, images, '**/*.{jpg,jpeg,png,gif}'))
    .pipe(gulp.dest(dir(destDir, images)));
});



gulp.task('groc', function() {
  es.merge(
    gulp.src(dir(sourceDir, docGlob)),
    gulp.src(dir(testsDir, docGlob)),
    gulp.src('gulpfile.js'),
    gulp.src('package.json'),
    gulp.src('README.md')
  ).pipe(shell([
    "groc <%= file.path %> ./README.md --out ./grocs"
  ]));
});


// __watch__ task:
gulp.task('watch', function () {

  // run `styles` task on css file changes
  gulp.watch(dir(sourceDir, css, '**/*.{css,sass,scss}'), ['styles']);

  // run `lib` task on js file changes in './source/lib'
  gulp.watch(dir(sourceDir, library, '**/*.js'), ['lib']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(dir(sourceDir, app, '**/*.js'), ['app']);

  // run `app` task on js file changes in './source/app'
  gulp.watch(dir(sourceDir, '**/*.{json,html,hbs,handlebars}'), ['compile']);

  // run `docs` task on any file changes
  gulp.watch([
    dir(sourceDir, docGlob),
    dir(testsDir, docGlob),
    'gulpfile.js',
    'README.md'
  ], ['docs']);
});


gulp.task('upload', ['compile'], function () {
  gulp.src(dir(destDir, '**/*'))
    .pipe(ftp(require('./ftp.json')));


});

// gulp.task('bump', function () {
//   return gulp.src(['./package.json', './bower.json'])
//     .pipe(bump())
//     .pipe(gulp.dest('./'));
// });


gulp.task('copy', ['copy-images']);

gulp.task('base', ['styles', 'app', 'copy', 'docs']);
gulp.task('compile', ['base', 'build']);
gulp.task('default', ['compile', 'watch']);
