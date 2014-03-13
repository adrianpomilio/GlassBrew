var request = require('request');
var http = require('http');
var config = require('../config/config.json');


exports.getData = function (req, res) {
    var url = config.brewery.url + 'search/geo/point?lat=' +req.params.lat+ '&lng=' +req.params.lng+ '&key=' +config.brewery.apiKey;
    request(url, function (error, response, body) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(body);
        res.end();

    });
};

exports.getGlassLocation = function(req, res){
    var url='www.googleapis.com/mirror/v1/locations/'
    request(url, function(error, response, body){
        console.log(body);
        return body;
    });
}
