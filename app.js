const createError = require("http-errors");
const express = require("express");
const fs = require('fs');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const crypto = require('crypto');

const passport = require("passport");
const cookieSession = require('cookie-session')
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require("passport-local").Strategy;

const keys = require("./config/keys");

const bdd = require("./module/bdd");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ressourceRouter = require("./routes/ressource");
const searchRouter = require("./routes/search");
const uploadRouter = require("./routes/upload");
const wojak_sender = require("./routes/wojak_sender");
const wojakList = require("./routes/wojak_list");
const wojakCategory = require("./routes/wojakCategory");
const wojakTag = require("./routes/wojakTag");
const login = require('./routes/login');
const pp_sender = require('./routes/pp_sender');
const profile = require('./routes/profile');
const fav = require('./routes/fav');
const local = require('./routes/local');
const rgpd = require('./routes/rgpd');
const cgu = require('./routes/cgu');
const favicon = require('serve-favicon');




var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(favicon(__dirname + '/public/images/logo.ico'));

if(keys.status == 'prod'){
  app.enable('trust proxy');
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
  })
}



app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:[keys.session.cookieKey]
}))
app.use(passport.initialize());
app.use(passport.session());


//Time for security

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  bdd.get_user_by_id(id).then(user => {
    done(null, user);
  }, err => {
    done(null, false);
  })
});

//Google

passport.use(
  new GoogleStrategy(
  {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "https://wojakparadise.net/auth/google/callback",
  }, 
  (request,accessToken, refreshToken, profile, done) => {
    console.log(profile);

    bdd.get_user_by_id(profile.id).then(user => {      
      return done(null, profile)
    }, err => {
      var user = {
        id: profile.id,
        name: profile.displayName,
        provider: 'google', 
        verified: true
      }
      bdd.save_user(user).then(result => {        
        return done(null, profile)
      })
    })   
  }
  )
);

app.get('/auth/google',
 passport.authenticate('google',
 {scope: ['https://www.googleapis.com/auth/plus.login']
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')   
  });

  //Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      bdd.get_user_by_id(profile.id).then(user => {      
        return done(null, profile)
      }, err => {
        var user = {
          id: profile.id,
          name: profile.name.givenName,
          provider: 'facebook',
          verified: true
        }
        bdd.save_user(user).then(result => {        
          return done(null, profile)
        })
      })   
      done(null, profile);
    }
  )
);

app.get('/auth/facebook',
 passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')
  });

//Local
passport.use(
  new LocalStrategy(
    function(username, password, done){            
      bdd.get_user_by_email(username).then(user => {
        bdd.verify_password(user.id, password).then( () => {
          return done(null, user)
        }, () => {
          return done(null, false)
        })
      }, () => {
        return done(null, false)
      });

    }
  )
)

app.post('/auth/local/login', passport.authenticate('local', {failureRedirect: '/login'}), function (req, res){
  console.log(req.user);
  res.redirect('/');
})

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ressource", ressourceRouter);
app.use("/wojak/add", uploadRouter);
app.use("/wojak", wojak_sender);
app.use("/wojak", wojakList);
app.use("/category", wojakCategory);
app.use("/tag", wojakTag);
app.use("/search", searchRouter);
app.use('/login', login);
app.use('/user', pp_sender);
app.use('/user', profile);
app.use('/fav', fav);
app.use('/auth/local', local);
app.use('/rgpd', rgpd)
app.use('/cgu', cgu)




app.use('/test', function (req, res){
  console.log(req.user);
  res.sendStatus(200);
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(8080);
