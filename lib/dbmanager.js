var mysql = require('mysql');
var debug = require('debug')('/dbmanager.js');
var xml_digester = require("xml-digester");
var fs = require("fs");
var path = require("path");
var digester = xml_digester.XmlDigester({});
var querys = [];

var pool = mysql.createPool({
    host: 'localhost',
    user: 'carran',
    password : '',
    port : 3306,
    database:'c9'
});

fs.readFile(path.dirname(module.parent.filename) + "/../xml/query.xml","utf8", function(err, data) {
    if(err){
        debug(err);
        return;
    }else{
        digester.digest(data, function(err, result) {
            if (err) { 
                debug(err);
            } else {
                for(var i = 0; i < result.querys.group.length; i++){
                    querys[result.querys.group[i].id] = result.querys.group[i].query;
                }
            }
        });     
    }
});

exports.getQuery = function(groupid, id){
    var groupitem = querys[groupid];
    for(var i = 0; i< groupitem.length ; i++){
        var item = groupitem[i]
        if(item.id == id){
            debug(item._text);
            return item._text;
        }
    }
    throw new Error('Can not find Query');
}

exports.query = function(queryStr, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
        }else{
            try{
                connection.query(queryStr, function(err, rows){
                    if(err){
                        connection.release();
                        throw err;
                    }
                    debug(rows);
                    connection.release();
                    callback(rows);
                });
            }catch(err){
                console.log(err);
            }
        }
    });
};