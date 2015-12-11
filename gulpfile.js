var watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    exit = require('gulp-exit'),
    browserSync = require('browser-sync').create();

// default
gulp.task("default", ["sync", "js"]);

// Static server
gulp.task("sync", function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["./index.html" , "css/*.css", "js/*.js"]).on("change", browserSync.reload);
});

// add custom browserify options here
var opts = {
  entries: ['./js/app.js'],
  debug: true,
  transform: [babelify.configure({ loose: "all", sourceMaps: "inline"})]
  // cache: {},
  // packageCache: {}
};
var b = watchify(browserify(opts));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('./js/app.js'))
    // optional (NO, IT'S a MUST), remove if you don't need to buffer file contents
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // here you can run uglify
    .pipe(rename({
        // this means to but it directly in the "dist" folder, without using subfolders
        dirname: ''
    }))
    // .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())

    .pipe(gutil.env.type === 'production' ? exit() : gutil.noop());
}
