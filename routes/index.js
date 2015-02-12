var express = require('express');
var debug = require('debug')('index.js');
var fs = require('fs');
var path = require('path');

var router = express.Router();

router.route('/')
.get(function(req, res) {
    fs.readFileAsync(path.dirname(module.parent.filename) + "/views/index.html","utf8").then(function (html) {
        res.send(html);
    });
});

module.exports = router;