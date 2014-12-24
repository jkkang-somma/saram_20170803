var express = require('express');
var debug = require('debug')('index.js:');
var router = express.Router();

router.route('/')
.get(function(req, res) {
    res.send( res.render("index"));
});

module.exports = router;
