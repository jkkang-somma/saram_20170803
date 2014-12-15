var express = require('express');
var debug = require('debug')('login.js');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
    var id = req.body.username;
    var pwd = req.body.password;
    
    req.getConnection(function(err,connection){
        connection.query("SELECT * FROM user_info where user_id='"+id+"'", function(err,rows){
            if(err){
                debug("##Error Selecting : %s", err);
            }else{
                debug(rows);
                if(rows.length == 1){
                    if(rows[0].user_password == pwd){
                        res.render("login",{id:id, pwd:pwd});
                    }else{
                        res.end();
                    }
                }else{
                    res.end();
                }
            }
        });
    });
});

module.exports = router;
