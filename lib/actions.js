var request = require('request');
var http = require('http');
var config = require('../config/config.json');


exports.getData = function (req, res) {
    var url = config.brewery.url + req.url + '?region=North%20Carolina&key=' +config.brewery.apiKey;
    request(url, function (error, response, body) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(body);
        res.end();

    });
};