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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var transport = nodemailer.createTransport(smtpTransport({
    host: 'wsmtp.ecounterp.com',
    port: 587,
    auth: {
        user: 'webmaster@yescnc.co.kr',
        pass: 'yes112233'
    },
    rejectUnauthorized: false,
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
		    var queryArr = [];
		    for(var idx in data.data){
		        queryArr.push(ApprovalDao.updateApprovalConfirm(data.data[idx]));    
		    }
		    
		    if(!(_.isUndefined(data.outOffice) || _.isNull(data.outOffice))){
		        var outOfficeData = {};
		        for(var key in data.outOffice.arrInsertDate){
		            outOfficeData[key] = _.clone( data.outOffice);
		            outOfficeData[key].date = data.outOffice.arrInsertDate[key];
                    outOfficeData[key].year = outOfficeData[key].date.substr(0,4);
                    outOfficeData[key].black_mark = (data.outOffice.black_mark == undefined)? "" : data.outOffice.black_mark;
                    queryArr.push(OutOfficeDao.insertOutOffice(outOfficeData[key]));
		        }
		    }
		    
		    if(!(_.isUndefined(data.inOffice) || _.isNull(data.inOffice))){
		        var inOfficeData = {};
		        for(var inKey in data.inOffice.arrInsertDate){
		            inOfficeData[inKey] = _.clone( data.inOffice );
		            inOfficeData[inKey].date = data.inOffice.arrInsertDate[inKey];
                    inOfficeData[inKey].year = inOfficeData[inKey].date.substr(0,4);
                    inOfficeData[inKey].black_mark = (data.inOffice.black_mark == undefined)? "" : data.inOffice.black_mark;
                    queryArr.push(InOfficeDao.insertInOffice(inOfficeData[inKey]));    
		        }
		        
		    }
		    
		    if(!(_.isUndefined(data.commute) || _.isNull(data.commute))){
		        for(var idx in data.commute){
			        queryArr.push(CommuteDao.updateCommute_t(data.commute[idx])); 
			    }
	            
		    }
		    
            db.queryTransaction(queryArr).then(function(resultArr){
                resolve(resultArr); 
            }, function(err){
                reject(err);
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
                                    if(result[idx].leave_company == "" || _.isNull(result[idx].leave_company))
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
                                console.log(error);
                                reject();
                            }else{
                                resolve();
                            }
                        });    
                    });
                }).catch(SyntaxError, function (e) {
                    reject(e);
                }).error(function (e) {
                    reject(e);
                });    
    	    });
    	    
        });
    };
    
    var _sendApprovalEmail = function(doc_num, managerId){
        return new Promise(function(resolve, reject){
            ApprovalDao.getApprovalMailData(doc_num).then(function(data){
                if(data.length == 1 )
                    data = data[0];
                
                if(data.start_date == data.end_date)
                    data.end_date = null;
                
    	        fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/outofficeApproval.html","utf8").then(function (html) {
                    var temp=_.template(html);
                    var sendHTML=temp(data);
                    
                    ApprovalDao.getManagerId(managerId).then(function(result){
                        var to = [];
                        var cc = [];
                        
                        for(var idx in result){
                            if(result[idx].email != "" || !_.isNull(result[idx].email) || !_.isUndefined(result[idx].email)){
                                var person = result[idx];
                                to.push({name : person.name, address: person.email});
                                if(person.name == "김특훈"){
                                    cc.push({ name: "김성식", address: "sskim@yescnc.co.kr"});
                                }
                            }
                        }
                        
                        var mailOptions= {
                            from: 'webmaster@yescnc.co.kr', // sender address 
                            to: to,
                            subject:"[근태 상신 알림] " + data.name + "_" + data.code_name,
                            html:sendHTML,
                        	text:"",
                        };
                        
                        if(cc.length > 0){
                            mailOptions["cc"] = cc;
                        }
                        
                        transport.sendMail(mailOptions, function(error, info){
                            if(error){//메일 보내기 실패시 
                                console.log(error);
                                reject();
                            }else{
                                resolve();
                            }
                        });    
                    });
                }).catch(SyntaxError, function (e) {
                    reject(e);
                }).error(function (e) {
                    reject(e);
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
        
        if(_param.seq != null)
            return ApprovalDao.updateMaxIndex(_param);            
        else
            return ApprovalDao.insertApprovalIndex(_param);
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
        sendOutofficeEmail:_sendOutofficeEmail,
        sendApprovalEmail : _sendApprovalEmail
    };
};

module.exports = Approval;

