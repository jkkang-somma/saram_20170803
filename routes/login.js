var express = require('express');
var debug = require('debug')('login.js');
var router = express.Router();
/*var query = require('./lib/query.js');*/
/*var encryptor = require('./lib/encryptor.js');*/
var util = require('util');
/*var defaultConfig = require("../config/default.json");*/
/*
router.get('/', function(req, res) {
    debug(req.session.loginid);
    if(req.session.loginid){
        //res.redirect('/');
    }else{
        res.send(res.render('login', {config:defaultConfig}));    
    }
});



router.post('/', function(req, res){
    var id = req.body.id;
    var pwd = req.body.password;
    
    req.db.pool.getConnection(function(err,connection){
        
        var queryStr = util.format(query.getQuery('sm', 'select_user') , id);
        
        connection.query(queryStr, [], function(err,rows){
            if(err){
                debug('##Error Selecting : %s', err);
            }else{
                debug("!!!!!!!!!");
                debug(rows);
                if(rows.length == 1){
                    debug('login succecss!');
                    debug()
                    if(rows[0].user_password === null){
                        res.redirect('/sm/initpassword');                           
                    }else if(rows[0].user_password == encryptor.encrypte(pwd)){
                        req.session.loginid = id;
                        res.redirect('/');
                    }else{
                        debug('incorrect password');
                        // error message (incorrect password)
                    }
                }else{
                    // error message (duplicate id)
                    res.end();
                }
                
            }
        });
    });
});
*/


module.exports = router;
