var express = require('express');
var debug = require('debug')('index.js');
var index = express.Router();
index.get('/', function(req, res) {
    res.render("index", {title:"Login"});
});

module.exports = index;
