
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var actions = require('./lib/actions');
var http = require('http');
var https = require( 'https');
var path = require('path');
var googleapis = require('googleapis');
var OAuth2Client = googleapis.OAuth2Client;
var config = require('./config/config.json');
var fs = require('fs');


var oauth2 = new OAuth2Client(config.web.client_id, config.web.client_secret, config.web.redirect_uris);
var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// START Google API Token

var success = function (data) {
    console.log('success', data);
};
var failure = function (data) {
    console.log('failure', data);
};
var gotToken = function () {
    googleapis
        .discover('mirror', 'v1')
        .execute(function (err, client) {
            if (!!err) {
                failure();
                return;
            }
            console.log('mirror client', client);
            listTimeline(client, failure, success);
            insertHello(client, failure, success);
            getLocation(client, failure, success);
            insertLocation(client, failure, success);
        });
};


// send a simple 'hello world' timeline card with a delete option
var insertHello = function (client, errorCallback, successCallback) {
    client
        .mirror.timeline.insert(
        {
            "text": "Glass Brew",
            "html": "<article>Glass Brew HTML</article>",
            "callbackUrl": "https://localhost:5000",
            "menuItems": [
                {"action": "DELETE"}
            ]
        }
    )
        .withAuthClient(oauth2)
        .execute(function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
};

// send a simple 'hello world' timeline card with a delete option
var insertLocation = function (client, errorCallback, successCallback) {


    client
        .mirror.timeline.insert(
        {
            "text": "Brewery DB on the Glass Brew app",
            "callbackUrl": "https://localhost:5000",
            "location": {
                "kind": "mirror#location",
                "latitude": 37.4028344,
                "longitude": -122.0496017,
                "displayName": "Brewery Name",
                "address": "400 Cottonwood Circle, Raleigh NC"
            },
            "menuItems": [
                {"action":"NAVIGATE"},
                {"action": "REPLY"},
                {"action": "DELETE"}
            ]
        }
    )
        .withAuthClient(oauth2)
        .execute(function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
};


var listTimeline = function (client, errorCallback, successCallback) {
    client
        .mirror.timeline.list()
        .withAuthClient(oauth2)
        .execute(function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
};

var gotToken = function () {
    googleapis
        .discover('mirror', 'v1')
        .execute(function (err, client) {
            if (!!err) {
                failure();
                return;
            }
            console.log('mirror client', client);
            listTimeline(client, failure, success);
            insertHello(client, failure, success);
            insertLocation(client, failure, success);
        });
};

var grabToken = function (code, errorCallback, successCallback) {
    oauth2.getToken(code, function (err, tokens) {
        if (!!err) {
            errorCallback(err);
        } else {
            console.log('tokens', tokens);
            oauth2.credentials = tokens;
            successCallback();
        }
    });
};



// END Google API Token

app.get('/', function(req, res){
    if (!oauth2.credentials) {
        // generates a url that allows offline access and asks permissions
        // for Mirror API scope.
        var url = oauth2.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/glass.timeline'
        });
        res.redirect(url);
    } else {
        gotToken();
    }
    res.render('index', { title: 'Glass Brew on Google Glass' });
});

app.get('/locations/:lat/:lng', function( req, res ){
    actions.getData( req, res );
});


app.get('/oauth2callback', function (req, res) {
    // if we're able to grab the token, redirect the user back to the main page
    grabToken(req.query.code, failure, function () {
        res.redirect('/');
    });
});


// https setup for keys
var credentials = {
    key: fs.readFileSync('eminem-key.pem'),
    cert: fs.readFileSync('eminem-key-cert.pem')
};

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
https.createServer(credentials, app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

//http://www.recursiverobot.com/post/57348836217/getting-started-with-the-mirror-api-using-node-js