// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore");
var Promise = require('bluebird');
var CommuteDao = require('../dao/commuteDao.js');
var ChangeHistoryDao = require('../dao/changeHistoryDao.js');
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

var Commute = function() {	
	var _getCommute = function(data) {
		return CommuteDao.selectCommute(data);
	};

	var _insertCommute = function(data){
		return new Promise(function(resolve, reject){
			var queryArr = [];
			for(var idx in data){
				queryArr.push(CommuteDao.insertCommute(data[idx]));
			}
			
			db.queryTransaction(queryArr).then(function(resultArr){
				resolve(resultArr);
			}, function(err){
				reject(err);
			});
		});
	};
	
	var _updateCommute = function(data){
		return new Promise(function(resolve, reject){
			var queryArr = [];
			for(var idx in data.data){
				queryArr.push(CommuteDao.updateCommute_t(data.data[idx]));
			}
			for(var idx in data.changeHistory){
				queryArr.push(ChangeHistoryDao.inserChangeHistory(data.changeHistory[idx]));	
			}
			console.log(queryArr);
			db.queryTransaction(queryArr).then(function(resultArr){
				resolve(resultArr);	
			},function(err){
				reject(err);
			});
		});
	};
	
	var _getCommuteDate = function(date){
		return CommuteDao.selectCommuteDate(date);
	};
	
	var _getCommuteByID = function(data){
		return CommuteDao.selectCommuteByID(data);
	};
	
	var _getLastiestDate = function(){
		return CommuteDao.getLastiestDate();
	};
	
	var _getCommuteToday = function(date){
		return CommuteDao.selectCommuteToday(date);
	};

	var _sendLateForWorkEmail = function(data){

		return new Promise(function(resolve, reject){
			var lateData;
			for(var idx in data){
				lateData = data[idx];
				CommuteDao.getCommuteMailData(lateData).then(function(mailData){
					/*
					in_time,
					mem.name,
					mem.email,
					mem.leave_company,
					dept.area as dept_area,
					work.name as work_type,
					dept.leader as leader_id,
					leader.name as leader_name,
					leader.email as leader_email
					*/
					if(mailData.length == 1 ){
						mailData = mailData[0];
						//console.log(mailData);
					}

					fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/reportForTardy.html","utf8").then(function (html) {

						var sendData = {
							name : mailData.name,
							code_name : mailData.work_type,
							date : mailData.in_time,
							submit_comment : ""
						};
						var temp=_.template(html);
						var sendHTML=temp(sendData);

							var cc = [];
							// 부서장 mail
							cc.push({name : mailData.leader_name, address : mailData.leader_email, id : mailData.leader_id});
							// 지각 당사자 mail
							cc.push({name : mailData.name, address : mailData.email, id : mailData.id});

							/* 지각 메일 임원 추가 /
							if(mailData.dept_area != "수원"){
								cc.push({ name :"유강재", address: "youkj@yescnc.co.kr", id:"160301"});
								cc.push({ name :"최홍락", address: "redrock.choi@yescnc.co.kr", id:"160401"});
							} else {
								cc.push({ name :"이남노", address: "nnlee@yescnc.co.kr", id:"170701"});
							}*/
							_.uniq(cc, function(d) {return d.address});	// 중복 제거

							
							var mailOptions= {
								from: 'webmaster@yescnc.co.kr', // sender address 
								to: cc/*[
									{ name: "김성식", address: "sskim@yescnc.co.kr"},
									{ name :"김은영", address: "eykim@yescnc.co.kr"}
								]*/,
								subject:"[근태보고] " + mailData.name + "_" + mailData.work_type,
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
					}).catch(SyntaxError, function (e) {
						reject(e);
					}).error(function (e) {
						reject(e);
					});
				});
				lateData = null;
			}
		});
	};
	
	return {
		getCommute : _getCommute,
		updateCommute : _updateCommute,
		insertCommute : _insertCommute,
		getCommuteDate : _getCommuteDate,
		getCommuteByID: _getCommuteByID,
		getLastiestDate : _getLastiestDate,
		getCommuteToday : _getCommuteToday,
		sendLateForWorkEmail : _sendLateForWorkEmail
	};
};

module.exports = new Commute();
