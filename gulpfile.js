/**
 * Created by lenovo on 2015/10/15.
 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    spritesmith = require("gulp.spritesmith");




gulp.task('less', function() {
    return gulp.src('public/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('public/css/'));
});


gulp.task('sprite', function () {
    var spriteData = gulp.src('public/images/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.less'
    }));
    return spriteData.img.pipe(gulp.dest('public/images/dest/')),spriteData.css.pipe(gulp.dest('public/less/'));
});
gulp.task('default',['less','sprite']);