define([
  'jquery',
  'underscore',
  'moment'
], function($, _, Moment){
    var WORKTYPE = {
        NORMAL : "00",
        EARLY : "01",
        LATE : "10",
        EARLY_LATE : "11",
        ABSENTCE : "21",
        _ABSENTCE : "22",
        HOLIDAY : "30",
        VACATION : "31"
    };
    
    var TIMEFORMAT = "HH:mm:SS";
    
    var DATEFORMAT = "YYYY-MM-DD";
    
    var DATETIMEFORMAT = "YYYY-MM-DD HH:mm:SS";
    
    var Builder = {
        id:                 "",
        name:               "",
        department:         "",
        year:               null,
        date:               null,
        workType:           WORKTYPE.NORMAL,
        standardInTime:     null,
        standardOutTime:    null,  
        earliestTime:       null,
        inTime:             null,
        inTimeType:         1,
        outTime:            null,
        outTimeType:        1,
        latestTime:         null,
        lateTime:           0,
        holidayWorkTime:    0,
        lateTimeOver:       0,
        overTime:           0,
        vacationCode:       null,
        outOfficeCode:      null,
        overtimeCode:       null,
        holidayData:        null,
        outOfficeStartTime: null,
        outOfficeEndTime:   null,

        init : function(userId, userName, userDepartment){
            this.id = userId;
            this.name = userName;
            this.department = userDepartment;            
            this.year = null;
            this.date = null;
            this.standardInTime = null;
            this.standardOutTime = null;  
            this.earliestTime = null;
            this.inTime = null;
            this.inTimeType = 1;
            this.outTime = null;
            this.outTimeType = 1;
            this.latestTime = null;
            this.lateTime = 0;
            this.holidayWorkTime = 0;
            this.lateTimeOver = 0;
            this.overTime = 0;
            this.workType = WORKTYPE.NORMAL;
            this.vacationCode= null;
            this.outOfficeCode= null;
            this.overtimeCode = null;
            this.holidayData = null;
            this.outOfficeStartTime = null;
            this.outOfficeEndTime = null;
        },
        
        initToday : function(todayStr, holidayData){
            this.year = new Date(todayStr);
            this.year = this.year.getFullYear();
            this.date = todayStr;
            this.standardInTime = new Date(todayStr);
            this.standardInTime.setHours(9,0,0);
            this.standardOutTime = new Date(todayStr);
            this.standardOutTime.setHours(18,0,0);  
            this.earliestTime = null;
            this.inTime = null;
            this.inTimeType = 1;
            this.outTime = null;
            this.outTimeType = 1;
            this.latestTime = null;
            this.lateTime = 0;
            this.holidayWorkTime = 0;
            this.lateTimeOver = 0;
            this.overTime = 0;
            this.workType = WORKTYPE.NORMAL;
            this.vacationCode= null;
            this.outOfficeCode= null;
            this.overtimeCode = null;
            this.holidayData = holidayData;
            this.outOfficeStartTime = null;
            this.outOfficeEndTime = null;
        },
        
        initByModel : function(model){
            this.id = model.get("id");
            this.name = model.get("name");
            this.department = model.get("department");
            this.year = model.get("year");
            this.date = model.get("date");
            this.standardInTime = this.standardInTime ? null : Moment(model.get("standard_in_time")).toDate();
            this.standardOutTime = this.standardOutTime ? null : Moment(model.get("standard_out_time")).toDate();
            this.inTime = this.inTime ? null : Moment(model.get("in_time")).toDate();
            this.outTime = this.outTime ? null : Moment(model.get("out_time")).toDate();
            this.inTimeType = model.get("in_time_type");
            this.outTimeType = model.get("out_time_type");
            this.lateTime = model.get("late_time");
            // this.holidayWorkTime = model.get("holidayWorkTime");
            // this.lateTimeOver = model.get("lateTimeOver");
            this.overTime = model.get("over_time");
            this.workType = model.get("work_type");
            this.vacationCode= model.get("vacation_code");
            this.outOfficeCode= model.get("out_office_code");
            this.overtimeCode = model.get("overtime_code");
            this.outOfficeStartTime = model.get("out_office_start_time");
            this.outOfficeEndTime = model.get("out_office_end_time");
        },
        
        setStandardInTime : function(yesterdayOutTime){
            if(Moment(yesterdayOutTime).format(DATEFORMAT) == this.date){
                var outTimeHour = yesterdayOutTime.getHours();
                if(outTimeHour >= 3)        this.standardInTime.setHours(13,20,0);
                else if(outTimeHour >= 2)   this.standardInTime.setHours(11,0,0);
                else if(outTimeHour >= 1)   this.standardInTime.setHours(10,0,0);
            }else{
                this.standardInTime.setHours(9,0,0);
            }
        },
        
        setOutOffice : function(todayOutOffice){
            if(todayOutOffice.length > 0){
                for (var i = 0; i <todayOutOffice.length; i++){
                    var code = todayOutOffice[i].get("office_code");
                    var VACATION_CODES = ["V01","V02","V03","V04","V05","V06"];
                    var OUTOFFICE_CODES = ["W01","W02"];

                    if(_.indexOf(VACATION_CODES, code) >= 0){
                        this.vacationCode = code;
                        switch(code){
                            case "V02": // 오전반차
                                this.standardInTime = this.standardInTime.setHours(13,20,0);    
                                break;
                            case "V03": // 오후반차
                                this.standardOutTime = this.standardOutTime.setHours(12,20,0);
                                break;
                            case "V01": // 연차휴가
                            case "V04": // 경조휴가
                            case "V05": // 공적휴가
                            case "V06": // 특별휴가
                                this.standardInTime = null;    
                                this.standardOutTime = null;
                                this.workType = WORKTYPE.VACATION;
                                break;
                        }
                    }

                    if(_.indexOf(OUTOFFICE_CODES, code) >= 0){
                        this.outOfficeCode = code;
                    }
                }
            }
            
            this.setHoliday();
        },
        
        setHoliday : function(){
            var today = new Date(this.date);
            if(this.holidayData.length > 0 || today.getDay() === 0 || today.getDay() === 6){ // 휴일일 경우 work_type 바꿈
                this.workType = WORKTYPE.HOLIDAY;
                this.standardInTime = null;  
                this.standardOutTime = null;  
                this.inTime = null;  
                this.outTime = null; 
            }
        },
        
        checkTime : function(destTime, type){
            type = type.slice(0,2);
            if(type == "출근" && this.date == Moment(destTime).format(DATEFORMAT)){ // 출근 기록일 경우
                this.setInTime(destTime);
                this.setEarliestTime(destTime);
            }else if(type == "퇴근"){ // 퇴근기록일 경우
                this.setOutTime(destTime);
                this.setLatestTime(destTime);
            }else{
                if(type == "외출"){
                    this.outOfficeStartTime = destTime;
                }else if(type == "복귀"){
                    this.outOfficeEndTime = destTime;
                }
                
                // 출퇴근 기록이 없을때를 대비해서 이른시간 / 늦은시간을 구한다.
                this.setEarliestTime(destTime);
                this.setLatestTime(destTime);
            }
        },
        
        setEarliestTime : function(destTime){
            if(_.isNull(this.earliestTime)) this.earliestTime = destTime;
            else
                if(this.earliestTime - destTime > 0) this.earliestTime = destTime;
        },
        
        setInTime : function(destTime){
            if(_.isNull(this.inTime)) this.inTime = destTime;
            else
                if(this.inTime - destTime > 0) this.inTime = destTime;
        },
        
        setOutTime : function(destTime){
            if(_.isNull(this.outTime)) this.outTime = destTime;
            else
                if(this.outTime - destTime < 0) this.outTime = destTime;
        },
        
        setLatestTime : function(destTime){
            if(_.isNull(destTime)) this.latestTime = destTime;
            else
                if(this.latestTime - destTime < 0) this.latestTime = destTime;
        },
        
        getLateTime : function(){
            if(!_.isNull(this.inTime)){
                this.lateTime = Math.floor((this.inTime - this.standardInTime) / 1000 / 60);
                this.workType = WORKTYPE.NORMAL;
                if(this.lateTime > 0 ){
                    this.workType = WORKTYPE.LATE;  // 지각
                }else{
                    this.lateTime = 0;
                }
            }
            this.lateTime;
        },
        
        getHolidayWorkTimeCode : function(){
            if(!(_.isNull(this.outTime)) && !(_.isNull(this.inTime))){
                this.holidayWorkTime = Math.floor((this.outTime - this.inTime) / 1000 / 60); // 휴일근무 시간
                if (this.holidayWorkTime > 480)              this.overtimeCode =  "2015_BC";
                else if (this.holidayWorkTime > 360)         this.overtimeCode =  "2015_BB";
                else if (this.holidayWorkTime > 240)         this.overtimeCode =  "2015_BA";
                this.overTime = this.holidayWorkTime;
            }
        },
        
        getOverTimeCode : function(){
            this.lateTimeOver= (Math.ceil(this.lateTime/10)) * 10 * 1000 *60; // 지각으로 인해 추가 근무 해야하는시간 (millisecond)
                                                    
            if(this.outTime - this.standardOutTime >= 0) {
                this.overTime = Math.floor( ((this.outTime - this.standardOutTime) - this.lateTimeOver) / 1000 / 60 ); // 초과근무 시간 (지각시간 제외)
                if(this.vacationCode === null || this.vacationCode === "V02"){
                    if(this.overTime > 360)                 this.overtimeCode = "2015_AC";
                    else if(this.overTime > 240)            this.overtimeCode =  "2015_AB";
                    else if(this.overTime > 120)            this.overtimeCode =  "2015_AA";
                }
            }else{ // 조퇴 판정
                if (this.workType == WORKTYPE.LATE)
                    this.workType = WORKTYPE.EARLY_LATE;
                else
                    this.workType = WORKTYPE.EARLY;
            }
        },

        getResult : function(){
            // 출퇴근시간 판단
            if(!this.inTime){ // 출근기록이 없을경우
                if(this.earliestTime){
                    this.inTime = this.earliestTime;   // 저장된 가장 이른 출입시간을 출근시간으로 표시
                    this.inTimeType = 2;               
                }
                 // 출근기록 없다는것 표시
            }
            
            if(!this.outTime){// 퇴근 기록이 없는경우
                if(this.latestTime){
                    this.outTime = this.latestTime;// 저장된 가장 늦은 출입시간을 퇴근시간으로 표시
                    this.outTimeType = 2;                
                }
                
            }

            // 초과근무시간 판단 over_time
            if (this.workType == WORKTYPE.HOLIDAY){ //휴일근무인 경우
                this.getHolidayWorkTimeCode();
            } else {
                this.getLateTime();
                if (this.outTime){
                    this.getOverTimeCode();
                }
            }
            
            if(!this.inTime && !this.outTime && !(this.workType == WORKTYPE.VACATION || this.workType==WORKTYPE.HOLIDAY)){
                this.workType = WORKTYPE.ABSENTCE;
            }
            
            return {
                id : this.id,
                name : this.name,
                department : this.department,
                year : this.year,
                date : this.date,
                work_type : this.workType,
                standard_in_time : _.isNull(this.standardInTime) ? null : Moment(this.standardInTime).format(DATETIMEFORMAT),
                standard_out_time :_.isNull(this.standardOutTime) ? null : Moment(this.standardOutTime).format(DATETIMEFORMAT),
                in_time : _.isNull(this.inTime) ? null : Moment(this.inTime).format(DATETIMEFORMAT),
                out_time : _.isNull(this.outTime) ? null : Moment(this.outTime).format(DATETIMEFORMAT),
                in_time_type : this.inTimeType,
                out_time_type: this.outTimeType,
                late_time : this.lateTime,
                over_time : this.overTime,
                vacation_code : this.vacationCode,
                overtime_code : this.overtimeCode,
                out_office_code : this.outOfficeCode,
                out_office_start_time : _.isNull(this.outOfficeStartTime) ? null : Moment(this.outOfficeStartTime).format(DATETIMEFORMAT),
                out_office_end_time : _.isNull(this.outOfficeEndTime) ? null : Moment(this.outOfficeEndTime).format(DATETIMEFORMAT),
            };
        }
    };
    
    return {
        TIMEFORMAT : TIMEFORMAT,
        DATEFORMAT : DATEFORMAT,
        DATETIMEFORMAT : DATETIMEFORMAT,
        WORKTYPE : WORKTYPE,
        Builder : Builder
    };  
});