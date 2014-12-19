var express = require('express');
var debug = require('debug')('/sm');
var router = express.Router();
/*var encryptor = require('../lib/encryptor.js');*/
/*var db = require('../lib/dbmanager.js');*/
var util = require('util');
var service = require('../../service/sm/sm.js');

// Get User List
router.get('/userlist', function(req, res){
    var result = service.selectUserAll();
    res.send(result);
});

/*
// /sm/adduser - GET
router.get('/adduser', function(req, res){
    res.send(res.render('/sm/adduser'));
});

// /sm/adduser - POST
router.post('/adduser', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var department = req.body.department;
    var nameCommute = req.body.nameCommute;
    var joinDate = req.body.joinDate;
    
    debug(req.body);
    
    db.getConnection(function(err,connection){

        var queryStr = util.format(query.getQuery('sm', 'add_user') , id, name, department, nameCommute, joinDate);

        connection.query(queryStr, [], function(err,rows){
            if(err){
                debug('##Error Selecting : %s', err);
                res.end();
            }else{
                debug(rows);
                res.redirect('/sm/adduser');
            }
        });
    });

});*/


/*
// /sm/initpassword - GET
router.get('/initpassword', function(req, res){
    res.send(res.render('sm/initpassword'));
});

// /sm/initpassword - POST
router.post('/initpassword', function(req, res){
    var id = req.body.id;
    var password = req.body.password;
    
    if(password[0] == password[1]){
        db.getConnection(function(err, connection){
            var queryStr = util.format(query.getQuery('sm', 'update_password'), id, encryptor.encrypte(password[0]));
            
            connection.query(queryStr, [], function(err,rows){
                if(err){
                    debug('##Error Selecting : %s', err);
                    res.end();
                }else{
                    console.log(rows);
                }
            });
                
        });
    }else{
        // password incorrect
    }
});
*/
module.exports = router;