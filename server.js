const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const config = require('./config');
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require('firebase/app');

var firebaseConfig = {
    apiKey: "AIzaSyCblIJ0DGBWqNotFCdlSx3c4kkBHrB3BUA",
    authDomain: "zct-zadanie-9a925.firebaseapp.com",
    databaseURL: "https://zct-zadanie-9a925.firebaseio.com",
    projectId: "zct-zadanie-9a925",
    storageBucket: "zct-zadanie-9a925.appspot.com",
    messagingSenderId: "622619409204",
    appId: "1:622619409204:web:833c6637e160d03b2e8361",
    measurementId: "G-Z5418SC0Z8"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const port = config.APP.port; // set our port

const publicRoot = __dirname + '/public/';

// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// set static files location
app.use(express.static(publicRoot));

// pass application into routes
require('./app/routes')(app, publicRoot);

// start app
app.listen(port);
console.log('Watson Stock Server starting on port ' + port);
exports = module.exports = app;