var express = require('express');
var debug = require('debug')('index');
var index = express.Router();
index.get('/', function(req, res) {
    debug("wellcom");    
    res.render("index", {title:"express",name:"sanghee Park"});
});

module.exports = index;
