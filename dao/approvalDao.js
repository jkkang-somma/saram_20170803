// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var db = require('../lib/dbmanager.js');
var util = require('../lib/util.js');
var group = "approval";
var debug = require('debug')('ApprovalDao');

var ApprovalDao = function () {
};

ApprovalDao.prototype.selectApprovalList =  function (doc_num) {
    return db.query(group, "selectApprovalList", [doc_num]);
};

ApprovalDao.prototype.selectApprovalListWhere =  function (startDate, endDate, submitId) {
    return db.query(group, "selectApprovalListWhere", [startDate, endDate,startDate,endDate, submitId]);
};

ApprovalDao.prototype.selectApprovalByManager =  function (manager_id, startDate, endDate) {
    return db.query(group, "selectApprovalByManager", [manager_id,startDate,endDate,startDate,endDate]);
};

ApprovalDao.prototype.rejectApprovalConfirm =  function (data) {
    return {
        group : group,
        item : "rejectApprovalConfirm",
        data : [data.decide_comment, data.doc_num],
    };
};

ApprovalDao.prototype.insertApproval =  function (data) {
    
    // 1:정상, 2:당일결재, 3:익일결재, 4:당일상신, 5:익일상신
    // 4,5 중 선택하여 데이타 셋팅

    var today = new Date();
    var todayDate = today.getFullYear() + "-" + util.getzFormat((today.getMonth() + 1), 2) + "-" + util.getzFormat(today.getDate(), 2);
    var todayTime = util.getzFormat(today.getHours(), 2) + ":" + util.getzFormat(today.getMinutes(), 2);
    
    debug("data :  START_DATE: " + data.start_date + ", OFFICE_CODE: " + data.office_code);
    debug("today : " + today  + ", todayDate: " + todayDate + ", todayTime: " + todayTime);

    var black_mark = '-1';

    if (data.start_date > todayDate) {
        // 정상
        black_mark = '1';
    }
    else if (data.start_date == todayDate) 
    {
        if (todayTime > "12:00" ) 
        {
            black_mark = '4'    // 당일 상신
        }else{
            black_mark = '1'    // 정상
        }
    }else{
        black_mark = '5';       // 익일상신
    }

    var state = data.state;
    if(state == null || state == undefined){
        state = '상신';
    }
    

    return db.query(group, "insertApproval",
        [ data.doc_num,data.submit_id,data.manager_id
        ,data.submit_comment,data.start_date,data.end_date
        ,data.office_code,state,black_mark,data.start_time,data.end_time,data.day_count ]
    );
};

// updateApprovalState
ApprovalDao.prototype.updateApprovalState =  function (data) {
    return db.query(group, "updateApprovalState"
        ,[data.state, data.submit_id, data.start_date, data.end_date]);
};

ApprovalDao.prototype.updateApprovalConfirm =  function (data) {
    return {
        group : group,
        item : "updateApprovalConfirm",
        data : [data.decide_comment, data.state, data.doc_num],
    };
};

ApprovalDao.prototype.updateApprovalConfirm2 =  function (data) {
    return {
        group : group,
        item : "updateApprovalConfirm2",
        data : [data.decide_comment, data.state, data.black_mark, data.doc_num],
    };
};


ApprovalDao.prototype.selectApprovalListById =  function (data) {
    return db.query(group, "selectApprovalListById", [data.id, data.year]);
};

ApprovalDao.prototype.getApprovalMailData =  function (doc_num) {
    return db.query(group, "getApprovalMailData", [doc_num]);
};

ApprovalDao.prototype.getApprovalMailingList =  function (dept_code) {
    return db.query(group, "getApprovalMailingList", [dept_code]);
};

ApprovalDao.prototype.getManagerId =  function (manager_id) {
    return db.query(group, "getManagerId", [manager_id]);
};

ApprovalDao.prototype.selectApprovalIndex =  function (yearmonth) {
    return db.query("approval_index", "selectMaxIndexApproval", [yearmonth]);
};

ApprovalDao.prototype.insertApprovalIndex =  function (data) {
    return db.query("approval_index", "insertApprovalIndex", [data.yearmonth]);
};

ApprovalDao.prototype.updateMaxIndex =  function (data) {
    return db.query("approval_index", "updateMaxIndex", [data.seq, data.yearmonth]);
};




module.exports = new ApprovalDao();