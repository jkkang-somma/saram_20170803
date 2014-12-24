var express = require('express');
var debug = require('debug')('/routes/session');
var router = express.Router();
var service = require('../service/user.js');
var encryptor = require('../lib/encryptor.js');

router.route('/')
.get(function(req, res){
    // get Session info 
    if(typeof req.session.loginid !== 'undefined'){
        res.send({login: true, id : req.session.id, loginid: req.session.loginid});
    }else{
        res.send({login: false});
    }
}).post(function(req,res){
    var loginid = req.body.loginid;
    var password = req.body.password;
    service.selectUser(function(result){
        debug(result);
        if(result.length === 0){
            // can`t find id
            res.send({login: false, msg: "Can`t find ID"});
        }else{
            if(result[0].password === '' || result[0].password === null){
                res.send({login: false, init: loginid});
            }else{
                debug(result[0].password);
                debug(encryptor.encrypte(password));
                if(result[0].password == encryptor.encrypte(password)){
                    debug('login Success!!');
                    req.session.loginid = loginid;
                    res.send({login: true, id : req.session.id, loginid: req.session.loginid});
                    
                }else{
                    res.send({login: false, msg: "incorrect password"});
                }
            }
        }
    }, loginid);
    
})

router.route('/:id')
.delete(function(req, res){
    req.session.regenerate(function(err){
        res.send({login: false});
    });
});

module.exports = router;
