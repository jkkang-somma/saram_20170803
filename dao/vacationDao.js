var db = require('../lib/dbmanager.js');
var group = "vacation";

var VacationDao = function () {
};

// 연차 조회 
VacationDao.prototype.selectVacationsByYear =  function (year) {
    return db.query(group, "selectVacationsByYear", [year]);
};

// 연차 갯수 조회 - 해당 년도의 연차 데이터 생성 여부 체크 위해서 
VacationDao.prototype.selectVacatonCount =  function (year) {
    return db.query(group, "selectVacatonCount", [year]);
};

// 연차 조회 - id 별 연차를 조회하기 위해
VacationDao.prototype.selectVacatonById =  function (data) {
    return db.query(group, "selectVacationsById", [data.year, data.id]);
};

// vacation 1개 등록
VacationDao.prototype.insertVacation =  function (data) {	
    return {
        group : group,
        item : "insertVacation",
        data : [
                data.id, data.year, data.total_day, data.id, data.year
        ]
    };
};

//vacation 수정
VacationDao.prototype.updateVacation =  function (data) {
    return db.query(group, "updateVacation", [data.total_day, data.memo, data.id, data.year]);
};

// 특정 기간내에 사용한 연차 일수 구하기
VacationDao.prototype.selectSimpleVacation =  function (yearMonth, fromDate, toDate) {
    return db.query(group, "selectSimpleVacation", [fromDate, toDate, yearMonth]);
};

module.exports = new VacationDao();

