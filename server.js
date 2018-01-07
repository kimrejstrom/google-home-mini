const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const spotify = require('spotify-node-applescript');
const yamaha = require('./yamaha');

// Setup user credentials
const user = {
    username: 'admin',
    apikey: 'vuWMm73hxLUV'
}

// Authentication 
const checkAuth = (apiKey) => (apiKey === user.apikey);
function authenticate(req, res, next) {
    if (checkAuth(req.query.api_key)) {
        return next(null, user);
    } else {
        res.status(403).json({
            error: 'Access denied'
        });
    }
}

// Create a new Express application.
const app = express();

// Use application-level middleware for common functionality, including logging, parsing
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(authenticate);

/** ROUTES */
app.post('/test', (req, res) => {
    res.json(req.body)
});

//Spotify On trigger
app.get('/spotify-on',
    (req, res) => yamaha.powerOn()
    .then(() => yamaha.setMainInputTo("HDMI4"))
    .then(() => yamaha.setVolumeTo(-400))
    .then(() => yamaha.set7chMode())
    .then(() => spotify.play())
    .then(() => res.json({
        status: 'Successfully turned on Yamaha and Spotify'
    }))
    .catch((err) => (res.json(err)))
);

//Spotify Off trigger
app.get('/spotify-off',
    (req, res) => yamaha.powerOff()
    .then(() => spotify.pause())
    .then(() => res.json({
        status: 'Successfully turned off Yamaha and Spotify'
    }))
    .catch((err) => (res.json(err)))
);

app.listen(3000);