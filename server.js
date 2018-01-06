const express = require('express');
const passport = require('passport');
const Strategy = require('passport-localapikey-update').Strategy;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const spotify = require('spotify-node-applescript');
const yamaha = require('./yamaha');

// Setup user credentials
const user = {
    username: 'admin',
    apikey: 'test'
}

// Authentication 
const checkAuth = (apiKey) => (apiKey === user.apikey);
passport.use(new Strategy(
    function (apiKey, done) {
        if (checkAuth(apiKey)) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

// Create a new Express application.
const app = express();

// Use application-level middleware for common functionality, including logging, parsing
app.use(morgan('combined'));
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());

app.post('/test',
    passport.authenticate('localapikey', {
        session: false
    }),
    (req, res) => res.json(req.body)
);

//On trigger
app.get('/spotify-on',
    passport.authenticate('localapikey', {
        session: false
    }),
    (req, res) => yamaha.powerOn()
    .then(() => yamaha.setMainInputTo("HDMI4"))
    .then(() => yamaha.setVolumeTo(-400))
    .then(() => yamaha.set7chMode())
    .then(() => spotify.play())
    .then(() => res.json({status: 'Successfully turned on Yamaha and Spotify'}))
    .catch((err) => (res.json(err)))
);

//Off trigger
app.get('/spotify-off',
    passport.authenticate('localapikey', {
        session: false
    }),
    (req, res) => yamaha.powerOff()
    .then(() => spotify.pause())
    .then(() => res.json({status: 'Successfully turned off Yamaha and Spotify'}))
    .catch((err) => (res.json(err)))
);

app.listen(3000);