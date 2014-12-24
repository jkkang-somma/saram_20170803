var express = require('express');
var debug = require('debug')('login.js');
var router = express.Router();



router.route('/')
.get(function(req, res) {
    res.send(res.render('login'));    
});

module.exports = router;
