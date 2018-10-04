var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/*****************MongoDBに接続****************************/
var mongoose = require('mongoose');
//book-storeデータベースへ接続
var con = mongoose.connect('mongodb://localhost/sample');
var db = con.connection;

//接続エラー時にコールバック実行
//db.on('error', console.error.bind(console, 'connection error:'));

//接続成功時にコールバック実行
/* db.once('open', function (callback) {
    console.log("connect successfully")
}); */

/********************スキーマの設定**************************/
var Schema = mongoose.Schema;

/* var bookSchema = new Schema({
  _id: Number,
  title: String,
  price: Number,
  publishDate: Date,
  author: { type: Number, ref: 'Author' }
});

var authorSchema = new Schema({
  _id: Number,
  name: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

var Book = mongoose.model('Book', bookSchema);
var Author = mongoose.model('Author', authorSchema); */

var account_user = mongoose.Schema;

var account_user = new Schema({
  "_id": String,
  "email": String,
  "name": String,
  "password": String,
  "role": String
});

var User = mongoose.model('User', account_user);

/*********************MongoDBに保存*******************************/
var userModel = new User();
userModel._id = "tanaka";
userModel.email = "tanaka@sample.com";
userModel.name = "tanaka";
userModel.password = "password";
userModel.role = "group1"
userModel.save(function (err, account_user) {
  if (err) {
    console.error(err);
  } else {
    console.log("userModel saved:" + account_user)
  }
});

/*********************findOne関数*******************************
Book.findOne({ "title": "JavaScriptリファレンス" })
  .populate("author").exec(function (err, book) {
    if (err) throw new Error(err);
    console.log(book);
  });

/*********************update関数*******************************
Book.update({ title: 'JavaScriptリファレンス' }, { $set: { price: 200 } },
  { upsert: false }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("update success.");
    }
  }
);

/*********************remove関数******************************
User.remove({ _id: 'tanaka' }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("delete success.");
  }
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
