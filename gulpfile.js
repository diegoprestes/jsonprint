var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require('gulp-babel');
var $ = require('gulp-load-plugins')();
var config = require('./config/env');

var runSequence = require('run-sequence');
var del = require('del');

const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var onError = function (err) {
  $.util.beep();
  console.log(err);
};

gulp.task("clean", function () {
  return gulp.src(config.clean.dest)
    .pipe($.clean());
})

gulp.task('devimg', function () {
  return gulp.src(config.img.all)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.img.dest))
});

gulp.task('img', function () {
  return gulp.src(config.img.all)
    .pipe($.imagemin())
    .pipe($.rev())
    .pipe(gulp.dest(config.img.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.img.rev))
});

gulp.task('devfonts', function () {
  return gulp.src(config.fonts.all)
    .pipe(gulp.dest(config.fonts.dest))
});

gulp.task('fonts', function () {
  return gulp.src(config.fonts.all)
    .pipe($.rev())
    .pipe(gulp.dest(config.fonts.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.fonts.rev))
});

gulp.task('js', function () {
  const b = browserify({
    entries: 'js/index.js',
    transform: babelify,
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(gulp.dest(config.js.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.js.rev));
});

gulp.task('devjs', function () {
  const b = browserify({
    entries: 'js/index.js',
    transform: babelify,
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))

    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.js.dest))
    .pipe(reload({stream: true}));
});

gulp.task('css', function () {
  return gulp.src(config.css.tmp)
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: false
    }))
    .pipe($.rev())
    .pipe(gulp.dest(config.css.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.css.rev));
});

gulp.task('devcss', function () {
  return gulp.src(config.css.all)
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: false
    }))
    .pipe(gulp.dest(config.css.dest))
    .pipe(reload({stream: true}));
});

gulp.task('revCss', function () {
  return gulp.src(['build/rev/**/*.json', 'css/*.scss'])
    .pipe($.revCollector())
    .pipe(gulp.dest('build/tmp'));
});

gulp.task('revJs', function () {
  return gulp.src(['build/rev/**/*.json', 'js/*.js'])
    .pipe($.revCollector())
    .pipe(gulp.dest('build/tmp'));
});

gulp.task('html', function () {
  return gulp.src(['build/rev/**/*.json', '*.html'])
    .pipe($.revCollector({
      replaceReved: true,
    }))
    .pipe( $.minifyHtml({
      empty:true,
      spare:true
    }))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('revJson', function () {
  return gulp.src(['build/**/*.*'])
    .pipe($.rev())
    .pipe($.revFormat({
      prefix: '.',
      suffix: '.cache',
      lastExt: false
    }))
    .pipe($.rev.manifest())
    .pipe(gulp.dest("build/tmp"));
});


gulp.task('addVersion',['revJson'], function() {
  var manifest = gulp.src(["build/tmp/rev-manifest.json"]);

  function modifyUnreved(filename) {
    return filename;
  }

  function modifyReved(filename) {
    if (filename.indexOf('.cache') > -1) {
      const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
      const _filename = filename.replace(/\.[\w]*\.cache/, "");
      filename = _filename + "?v=" + _version;
      return filename;
    }
    return filename;
  }

  return gulp.src(['*.html'])
    .pipe($.replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g, "$1"))
    .pipe($.revReplace({
      manifest: manifest,
      modifyUnreved: modifyUnreved,
      modifyReved: modifyReved
    }))
    .pipe(gulp.dest(config.html.dest));
})


gulp.task('delrev', function () {
  del(['build/rev','build/tmp']);
})

gulp.task('watch', function (done) {
  gulp.watch(config.css.all, ['devcss']);
  gulp.watch(config.js.all, ['devjs']);
  gulp.watch(config.img.all, ['devimg']);
  gulp.watch(config.fonts.all, ['devfonts']);
  gulp.watch("*.html", reload);
  done();
})

gulp.task('server', function (done) {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  done();
});

gulp.task('dist', function (done) {
  runSequence(
    'img',
    'fonts',
    'revCss',
    'revJs',
    ['css', 'js'],
    'html',
    'delrev'
  );
  done();
});

gulp.task('default', function (done) {
  runSequence(
    'devimg',
    'devfonts',
    ['devcss', 'devjs'],
    'html',
    'watch',
  function () {
    gulp.start(['server'])
    done();
  });
});