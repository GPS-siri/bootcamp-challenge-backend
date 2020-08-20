var createError      = require('http-errors');
var express          = require('express');
var path             = require('path');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser')
var logger           = require('morgan');
var helmet           = require('helmet')                           // 보안강화: xss 기능 막아줌, request header에 의한 해킹 방지
var cors             = require('cors')                             // cross origin request? 허용
var allowed_origins  = require('./config/allowed_origins.js')      // cors 에서 허용해줄 ip 추가
const session        = require('express-session')
const expressSwagger = require('express-swagger-generator')        // 스웨거 설정 - swagger 접속 url '/api-docs'

// router forder add
var indexRouter     = require('./routes/index.js')
var usersRouter     = require('./routes/users.js')
var scheduleRouter  = require('./routes/schedule.js')

var app = express();

// swagger 옵션
let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a challenge test server',
      title: 'Siri-bootcamp-challenge-Server',
      version: '1.0.1',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      "application/json",
      "application/xml"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "",
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'] //Path to the API handle folder
};
// develop 모드에서만 swagger 사용
if (process.env.NODE_ENV !== 'production') {
  expressSwagger(options)
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cors 설정: 허용 ip 추가 / 적용
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowed_origins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
//  보안 강화
app.use(helmet())
app.disable('x-powered-by')
//                                                                                      body-parser 부분 설명 필요
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: false,
}));
// 세션 설정
app.use(session({
  key: 'accessToekn',
  secret: 'protectmasterkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/', httpOnly: true,
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}))
//권한 설정
// app.use(function (req, res, next) {
//   const sessionURL = ['/users', '/schedule']
//   if (sessionURL.indexOf('/' + req.url.split('/')[1]) > -1) {
//     if (req.session.user === undefined) {
//       return res.status(403).json({ error: '권한이 없습니다. 로그인이 필요합니다.' })
//     }
//   }
//   next()
// });

// router folder link
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/schedule', scheduleRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
