const { task } = require('gulp');
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const reload = browserSync.reload

function buildStyles() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
};

exports.buildStyles = buildStyles;
exports.watch = function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
};

gulp.task('browser-sync', function () {
  browserSync.init({
    notify: false,
    server: {
      baseDir: './'
    }
  })
  gulp.watch('./*.html').on('change', reload) /*html değiştiğinde reload yapar */
  gulp.watch('./scss/*.scss').on('change', reload); /*css değiştiğinde */
  gulp.watch('./views/**/*.pug', gulp.series('html'))
  gulp.watch('./scss/**/*.scss', gulp.series('css'))
  gulp.watch('./js/**/*.js', reload)
})

gulp.task('css', () => {
  return gulp.src('./scss/main.scss')
  .pipe(plumber([{ errorHandler: false }]))
  .pipe(sass())
  .pipe(prefix())
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream())
})


gulp.task('html', ()=> {
  return gulp.src('views/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./'))
  .on('end', reload)
})

// gulp.task('default', ['browser-sync', 'html', 'css'])
gulp.task('default', gulp.series('browser-sync', 'html', 'css'))