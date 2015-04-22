var db = require('../lib/dbmanager.js');
var moment = require('moment');
var _ = require("underscore");
var Promise = require("bluebird");
var debug = require("debug")("DBBatchJob");
var createDbArr =[
    "dept_code_tbl",
    "position_code_tbl",
    "members_tbl",
    "vacation_tbl",
    "commute_base_tbl",
    "office_code_tbl",
    "overtime_code_tbl",
    "work_type_code_tbl",
    "approval_tbl",
    "out_office_tbl",
    "in_office_tbl",
    "commute_result_tbl",
    "comment_tbl",
    "change_history_tbl",
    "holiday_tbl",
    "approval_index_tbl",
    "black_mark_tbl",
    "msg_tbl"];

var dbArr = [
    "members_tbl",
    "dept_code_tbl",
    "position_code_tbl",
    "vacation_tbl",
    "commute_base_tbl",
    "out_office_tbl",
    "in_office_tbl",
    "approval_tbl",
    "comment_tbl",
    "change_history_tbl",
    "commute_result_tbl",
    "overtime_code_tbl",
    "work_type_code_tbl",
    "office_code_tbl",
    "holiday_tbl",
    "approval_index_tbl",
    "black_mark_tbl",
    "msg_tbl"];


var DBBatchJobExecuter = function(){
    // this.insertQuery = "";  
    // this.createQuery = "";
    // this.dropQuery = "";
    this.result = {};
    this.backup = "";
    for(var idx =0; idx < dbArr.length ; idx++){
        this.result[dbArr[idx]] = {};  
    }
};

DBBatchJobExecuter.prototype.getTables = function(){
    return db.query(null,null,null, 'SHOW TABLES');
};

DBBatchJobExecuter.prototype.doTableEntries = function(tables){
    var that = this;
    var tableDefinitionGetters = [];
    
    for(var key in tables){
        var destTableName = tables[key]['Tables_in_'+db.getDbInfo().database];
        tableDefinitionGetters.push(
            new Promise(function(resolve,reject){
                var tableName = destTableName;
                db.query(null,null,null,'SHOW CREATE TABLE ' + tableName).then(
                    function(createTableQryResult){
                        that.result[tableName]["dropQuery"] = "drop table if exists " + tableName +";\n\n";
                        that.result[tableName]["createQuery"] = createTableQryResult[0]["Create Table"] + ";\n\n";
                        resolve();
                    }
                );    
            })
            
            
        );
        
        tableDefinitionGetters.push(
            new Promise(function(resolve, reject){
                var tableName = destTableName;
                var queryColumn = "";
                var queryItem = "";
                var query ="";
                db.query(null,null,null,'select * from ' + tableName).then(
                    function(result){
                        query = "INSERT INTO " + tableName;
                        
                        queryColumn = "(";
                        for(var i in result[0]){
                            if(i != "seq")
                                queryColumn += i + ",";    
                        }
                        queryColumn = queryColumn.slice(0,-1);
                        queryColumn += ") ";
                        
                        query += queryColumn;
                        
                        query += "VALUES";
                        
                        queryItem = "";
                        for(var key in result){
                            queryItem += "(";
                            for(var item in result[key]){
                                if(item != "seq"){
                                    if(typeof result[key][item] === "number" || result[key][item] == null){   
                                        queryItem += result[key][item] + ",";
                                    }else{
                                        queryItem += "'"+ result[key][item] + "',";
                                    }
                                }
                            }
                            queryItem = queryItem.slice(0,-1);
                            queryItem += "),\n";
                        }
                        if(queryItem != ""){
                            queryItem = queryItem.slice(0,-1);
                            queryItem += ";\n\n";
                            query += queryItem;
                            that.result[tableName]["insertQuery"] = query;
                        }
                        resolve();
                    }
                );
            })
        );
    }
    return tableDefinitionGetters;
};

DBBatchJobExecuter.prototype.saveFile = function(){
    var filename = moment().format("YYYYMMDD_HHmmss") + ".sql";
    for(var idx1 in dbArr){
        if(!_.isUndefined(this.result[dbArr[idx1]].dropQuery)){
            this.backup += this.result[dbArr[idx1]].dropQuery;    
        }
    }
    
    for(var idx2 in createDbArr){
        if(!_.isUndefined(this.result[createDbArr[idx2]].createQuery)){
            this.backup += this.result[createDbArr[idx2]].createQuery;
        }
    }
    
    for(var idx3 in createDbArr){
        if(!_.isUndefined(this.result[dbArr[idx3]].insertQuery)){
            this.backup += this.result[dbArr[idx3]].insertQuery;
        }
    }
    
    return require('fs').writeFile(filename, this.backup);
};

DBBatchJobExecuter.prototype.backupDb = function(){
    var that = this;
    debug("DB Schedule Start :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));
    
    db.getConnection().then(function(connection){
        that.getTables().then(function(result){
            Promise.all(that.doTableEntries(result)).then(function(){
                that.saveFile();
                debug("DB Schedule End :" + moment().format("YYYYMMDD_HH:mm:ss SSS"));      
            });
        }).catch( function(err) {
            debug('Something went away', err);
        }).finally( function() {
            connection.release();
        });    
    });
};

module.exports = new DBBatchJobExecuter();