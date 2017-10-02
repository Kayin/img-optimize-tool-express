const express      = require('express'),
      path         = require('path'),
      favicon      = require('serve-favicon'),
      logger       = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      nunjucks     = require('nunjucks'),
      markdown     = require('nunjucks-markdown'),
      marked       = require('marked'),
      multer       = require('multer'),
      hljs         = require('highlight.js');

const app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

/// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
let njk = nunjucks.configure('views', { autoescape: true, express: app });
markdown.register(njk, marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs lang-'
}));

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/// routes setup
const routes = {
  index    : require('./routes/index'),
  upload   : require('./routes/upload'),
  download : require('./routes/download')
};
app.use('/', routes.index);
app.use('/upload', routes.upload);
app.use('/download', routes.download);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

/// Uploader/Downloader buffer bucket
app.locals.IMG_BUFFER = [];
app.locals.IMG_NAME   = '';
app.locals.IMG_TYPE   = '';

module.exports = app;
