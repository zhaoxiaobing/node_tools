var express = require('express');
var path = require('path');
var dir = process.cwd();
var bodyParser = require('body-parser');
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



//app.use(express.static(path.resolve(dir, 'public')));
app.use('/public',express.static(path.resolve(dir, 'public')));
app.use('/projects',express.static(path.resolve(dir, 'projects')));

app.use('/', function(req, res,next){
    gulp.src('public/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/css/'));
    next();
});





var mock = require('./tools/mock');
mock(app);








app.listen(3000);
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });*/




