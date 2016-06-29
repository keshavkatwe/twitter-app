var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var serve = require('gulp-serve');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var gulpSequence = require('gulp-sequence');
var open = require('gulp-open');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./",
        notify: false
    });

    gulp.watch("./assets/sass/**/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("./assets/sass/**/*.scss")
            .pipe(sass())
            .pipe(gulp.dest("./assets/css"))
            .pipe(sass().on('error', sass.logError))
            .pipe(browserSync.stream());
});

gulp.task('html-minify', function () {
    return gulp.src(['./*.html', '!node_modules/**', '!dist/**'])
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest('dist'))
});

gulp.task('css-minify', function () {
    return gulp.src('assets/css/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('image-min', function () {
    return gulp.src('assets/img/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('open', function () {
    gulp.src(__filename)
            .pipe(open({uri: 'http://localhost:3000/'}));
});

gulp.task('dev', ['serve']);

gulp.task('serve-production', serve('dist'));

gulp.task('default', gulpSequence('html-minify', 'css-minify', 'image-min', 'serve-production', 'open'));