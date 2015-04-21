// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');
var OutOfficeDao= require('../dao/outOfficeDao.js');
var InOfficeDao= require('../dao/inOfficeDao.js');

var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');

var fs = require('fs');
var path = require("path");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    host: 'webmail.yescnc.co.kr',
    port: 25,
    secure: false,
    auth: {
        user: 'webmaster@yescnc.co.kr',
        pass: 'Yes112233'
    },
    connectionTimeout:10000
}));

var Approval = function (data) {
    var _getApprovalList = function (doc_num) {
        return ApprovalDao.selectApprovalList(doc_num);
    };
    var _getApprovalListWhere = function (startDate, endDate, managerId) {
        if(managerId != undefined && managerId != ""){
            return ApprovalDao.selectApprovalByManager(managerId, startDate, endDate);
        }
        return ApprovalDao.selectApprovalListWhere(startDate, endDate);
    };
    var _getApprovalListById = function(data){
        return ApprovalDao.selectApprovalListById(data);
    };
    var _insertApproval = function (data) {
        return ApprovalDao.insertApproval(data);
    };
    var _updateApprovalConfirm = function(data) {
        return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
			    var promiseArr = [];
			    promiseArr.push(ApprovalDao.updateApprovalConfirm(connection, data.data));
			    
			    if(!(_.isUndefined(data.outOffice) || _.isNull(data.outOffice))){
			        var outOfficeData = {};
			        for(var key in data.outOffice.arrInsertDate){
			            outOfficeData[key] = _.clone( data.outOffice);
			            outOfficeData[key].date = data.outOffice.arrInsertDate[key];
                        outOfficeData[key].year = outOfficeData[key].date.substr(0,4);
                        outOfficeData[key].black_mark = (data.outOffice.black_mark == undefined)? "" : data.outOffice.black_mark;
			        }
			        
			        promiseArr.push(OutOfficeDao.insertOutOffice(connection, outOfficeData));
			    }
			    
			    if(!(_.isUndefined(data.inOffice) || _.isNull(data.inOffice))){
			        var inOfficeData = {};
			        for(var inKey in data.inOffice.arrInsertDate){
			            inOfficeData[inKey] = _.clone( data.inOffice );
			            inOfficeData[inKey].date = data.inOffice.arrInsertDate[inKey];
                        inOfficeData[inKey].year = inOfficeData[inKey].date.substr(0,4);
                        inOfficeData[inKey].black_mark = (data.inOffice.black_mark == undefined)? "" : data.inOffice.black_mark;
			        }
			        promiseArr.push(InOfficeDao.insertInOffice(connection, inOfficeData));
			    }
			    
			    if(!(_.isUndefined(data.commute) || _.isNull(data.commute))){
		            promiseArr.push(CommuteDao.updateCommute_t(connection, data.commute));    
			    }
                
				Promise.all(promiseArr).then(function(resultArr){
					connection.commit(function(){
					    resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					});
				}).catch(function(){
				    connection.rollback(function(){
				        connection.release();
				        reject();
				    });
				});	
			});
		});
    };
    
    var _sendOutofficeEmail = function(doc_num){
        return new Promise(function(resolve, reject){
            ApprovalDao.getApprovalMailData(doc_num).then(function(data){
                if(data.length == 1 )
                    data = data[0];
                
                if(data.start_date == data.end_date)
                    data.end_date = null;
                
    	        fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/outofficeApproval.html","utf8").then(function (html) {
                    var temp=_.template(html);
                    var sendHTML=temp(data);
                    
                    ApprovalDao.getApprovalMailingList(data.dept_code).then(function(result){
                        var cc = [];
                        if(data.dept_code != "5100" && data.dept_code != "5200"){
                            for(var idx in result){
                                if(result[idx].email != "" || !_.isNull(result[idx].email) || !_.isUndefined(result[idx].email)){
                                    cc.push({name : result[idx].name, address: result[idx].email});
                                }
                            }
                        }
                        
                        var mailOptions= {
                            from: 'webmaster@yescnc.co.kr', // sender address 
                            to: [
                                { name: "김성식", address: "sskim@yescnc.co.kr"},
                                { name :"김은영", address: "eykim@yescnc.co.kr"},
                                ],
                            subject:"[근태보고] " + data.name + "_" + data.code_name,
                            html:sendHTML,
                        	text:"",
                            cc: cc
                        };
                        
                        transport.sendMail(mailOptions, function(error, info){
                            if(error){//메일 보내기 실패시 
                                reject();
                            }else{
                                resolve();
                            }
                        });    
                    });
                }).catch(SyntaxError, function (e) {
                    console.log("file contains invalid file");
                    reject();
                }).error(function (e) {
                    console.log(e);
                    reject();
                });    
    	    });
    	    
        });
    };
    
    var _getApprovalIndex = function (yearmonth) {
        return ApprovalDao.selectApprovalIndex(yearmonth);
    };
    
    var _setApprovalIndex = function () {
        var _schema = new Schemas('approval_index');
        var _param = _schema.get(data);
        var _result = null;
        if(_param.seq != null){
            _result = ApprovalDao.updateMaxIndex(_param);            
        }else{
            _result = ApprovalDao.insertApprovalIndex(_param);
        }
        
        return _result;
    };
    var _updateApprovalIndex = function (yearmonth) {
        return ApprovalDao.updateMaxIndex(yearmonth);
    };
    return {
        getApprovalList:_getApprovalList,
        getApprovalListWhere:_getApprovalListWhere,
        getApprovalListById:_getApprovalListById,
        insertApproval:_insertApproval,
        updateApprovalConfirm:_updateApprovalConfirm,
        getApprovalIndex:_getApprovalIndex,
        setApprovalIndex:_setApprovalIndex,
        updateApprovalIndex:_updateApprovalIndex,
        sendOutofficeEmail:_sendOutofficeEmail
    };
};

module.exports = Approval;

