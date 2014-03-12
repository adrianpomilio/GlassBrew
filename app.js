
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var actions = require('./lib/actions');
var http = require('http');
var path = require('path');
var googleapis = require('googleapis');
var OAuth2Client = googleapis.OAuth2Client;
var config = require('./config/config.json');


var oauth2 = new OAuth2Client(config.web.client_id, config.web.client_secret, config.web.redirect_uri[2]);
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

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/locations/:lat/:lng', function( req, res ){
    actions.getData( req, res );
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//http://www.recursiverobot.com/post/57348836217/getting-started-with-the-mirror-api-using-node-js