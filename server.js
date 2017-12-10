var express = require('express');
var passport = require('passport');
var Strategy = require('passport-localapikey-update').Strategy;
var bodyParser = require('body-parser');
var morgan = require('morgan');

const user = {
    username: 'admin',
    apikey: 'test'
}
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
var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing
app.use(morgan('combined'));
app.use(bodyParser.json());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());

app.post('/test',
    passport.authenticate('localapikey', {
        session: false
    }),
    function (req, res) {
        res.json(req.body);
    });

app.listen(3000);