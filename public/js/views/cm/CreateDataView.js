define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'dialog',
  'moment',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/component/progressbar.html',
  'collection/common/HolidayCollection',
  'collection/common/RawDataCollection',
  'collection/sm/UserCollection',
  'collection/cm/CommuteCollection',
  'collection/vacation/OutOfficeCollection',
  'views/cm/popup/CreateDataPopupView',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, Moment,
HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML,
HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection,
CreateDataPopupView){
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
    var CreateDataView = BaseView.extend({
        
        el:$(".main-container"),
        
    	initialize:function(){
    	    var that = this;
    	    
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    		this.gridOption = {
    		    el:"createCommuteListContent",
    		    id:"createCommuteListTable",
    		    column:[
                    {"title": "날짜", "data": "date"},
                    {"title": "이름", "data": "name"},
                    {"title": "출근시간", "data": "in_time",
                        "render": function (data, type, rowData, meta) {
                            // if(rowData.in_time_type == 2 && rowData.work_type != "31" && rowData.work_type != "31"){
                            //     // $(nTd).addClass("autoCreate");
                            // }
                            return _.isNull(rowData.in_time) ? null : Moment(rowData.in_time).format("YYYY-MM-DD HH:mm");
                       }
                    },
                    {"title": "퇴근시간", "data": "out_time",
                        "render": function (data, type, rowData, meta) {
                            // if(rowData.out_time_type == 2 && rowData.work_type != "31" && rowData.work_type != "31"){
                            //     // $(nTd).addClass("autoCreate");
                            // }
                            return _.isNull(rowData.out_time) ? null : Moment(rowData.out_time).format("YYYY-MM-DD HH:mm");
                            
                       }
                    },
                    {"title": "Type", "data": "work_type"},
                    
                    {"title": "출근기준", "data": "standard_in_time",
                        "render": function (data, type, rowData, meta) {
                            return _.isNull(rowData.standard_in_time) ? null : Moment(rowData.standard_in_time).format("YYYY-MM-DD HH:mm");
                       }
                    },
                    {"title": "퇴근기준", "data": "standard_out_time",
                        "render": function (data, type, rowData, meta) {
                            return _.isNull(rowData.standard_out_time) ? null : Moment(rowData.standard_out_time).format("YYYY-MM-DD HH:mm");
                       }
                    },
                    {"title": "지각", "data": "late_time"},
                    {"title": "초과", "data": "over_time"},
                    {"title": "초과근무", "data": "overtime_code"},
                    {"title": "근태", "data": "vacation_code"},
    		    ],
    		    dataschema:["date", "name", "in_time", "out_time", "work_type", "standard_in_time" ,"standard_out_time", "late_time", "over_time", "overtime_code", "vacation_code"],
                // rowCallback : function(row, data){
                //     if(data.work_type == WORKTYPE.ABSENTCE || data.work_type == WORKTYPE._ABSENTCE){
                //         $(row).addClass("autoCreate");
                //     }
                // },
    		    collection:this.commuteCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search","refresh"]
    		};
    		
    		this.dialogInit();
    		
    	},
    	events: {
    	    
    	},
    	dialogInit: function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        click:function(){
                    var createDataPopupView= new CreateDataPopupView();
                    Dialog.show({
                        title:"근태 데이터 생성", 
                        content:createDataPopupView, 
                        buttons: [{
                            id: 'createDataCreateBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '데이터 생성',
                            action: function(dialog) {
                                var progress = dialog.getModalBody().find(".progress");
                                var progressbar = dialog.getModalBody().find(".progress-bar");
                                var startDatepicker = dialog.getModalBody().find("#cdStartdayDatePicker");
                                var endDatepicker = dialog.getModalBody().find("#cdEnddayDatePicker");
        
                                var startDate = startDatepicker.data("DateTimePicker").getDate().toDate();
                                var endDate = endDatepicker.data("DateTimePicker").getDate().toDate();
                                var yesterday = new Date(startDate);
                                yesterday.setDate(startDate.getDate() -1);

                                var selectedDate = {
                                    start:Util.dateToString(startDate),
                                    end:Util.dateToString(endDate)
                                };
                                
                                if(startDate == "Invalid Date" || endDate== "Invalid Date"){
                                    alert("시작일과 종료일을 지정해주세요");
                                    return;
                                }
                                
                                if(selectedDate.start > selectedDate.end){
                                    alert("시작일이 종료일보다 큽니다.");
                                    return;
                                }
                                
                                progress.css("display", "block"); // display progressbar 
                                $(this).prop("disabled", true); // 버튼 disabled
                                
                                that.commuteCollection.reset();
                                var rawDataCollection = new RawDataCollection();
                                var userCollection = new UserCollection();
                                var holidayCollection = new HolidayCollection();
                                var outOfficeCollection = new OutOfficeCollection();
                                var yesterdayCommuteCollection = new CommuteCollection();

                                $.when(
                                    rawDataCollection.fetch({data: selectedDate}),
                                    userCollection.fetch(),
                                    holidayCollection.fetch({
                                        data : {  
                                            year : startDate.getFullYear()
                                        },
                                        success : function(){
                                            that.grid.render();
                                        }
                                    }),
                                    outOfficeCollection.fetch(),
                                    yesterdayCommuteCollection.fetchDate(Util.dateToString(yesterday))
                                ).done(function(){
                                    
                                    var startDate = new Date(selectedDate.start);
                                    var endDate = new Date(selectedDate.end);
                                    endDate.setDate(endDate.getDate() - 1);
                                    
                                    var diff_days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일의 날짜 차이를 구함
                                    
                                    _.each(userCollection.models, function(userModel, idx){
                                        var today = new Date(startDate);
                                        var userId = userModel.attributes.id;
                                        var userName = userModel.attributes.name;
                                        var userDepartment = userModel.attributes.dept_name;
                                        
                                        if(userDepartment.slice(0,4) === "품질검증" || userDepartment == "무소속" || userDepartment==="임원"){
                                            
                                        }else{
                                            var yesterdayAttribute = {};
                                            
                                            var userRawDataCollection = new RawDataCollection(); // 해당 사용자의 출입기록 Collection
                                            _.each(rawDataCollection.filterID(userId), function(model){
                                                userRawDataCollection.add(model);
                                            });
                                            
                                            var userOutOfficeCollection = new OutOfficeCollection(); // 해당 사용자의 출입기록 Collection
                                            _.each(outOfficeCollection.filterID(userId), function(model){
                                                userOutOfficeCollection.add(model);
                                            });
                                            
                                            var filterDate = yesterdayCommuteCollection.where({id : userId}); // 시작일 - 1의 출입기록
                                            if(filterDate.length > 0){
                                                yesterdayAttribute = filterDate[0].toJSON();
                                                yesterdayAttribute.out_time = Moment(yesterdayAttribute.out_time).year(yesterdayAttribute.year);
                                                yesterdayAttribute.out_time = yesterdayAttribute.out_time.toDate();
                                            }
                                                
                                            ResultTimeFactory.init(userId, userName, userDepartment); //계산전 초기화
                                            
                                            for(var i=0; i <= diff_days; i++){ //차이나는 날짜만큼 기본데이터 생성 (사원수 X 날짜)
                                                var todayStr = Util.dateToString(today);    // 오늘 날짜(str)
                                                var holidayData = holidayCollection.where({ // 오늘 휴일 목록
                                                    date: todayStr
                                                });    
                                                
                                                ResultTimeFactory.initToday(todayStr, holidayData); //계산전 초기화    
                                                
                                                // 출근 기준시간 판단 01:00 = 10:00, 02:00 = 11:00, 03:00 = 13:20
                                                var yesterdayOutTime = new Date(yesterdayAttribute.out_time);
                                                ResultTimeFactory.setStandardInTime(yesterdayOutTime);
                                                
                                                // 휴가/외근/휴일 판단
                                                var todayOutOffice = userOutOfficeCollection.where({date: todayStr});
                                                ResultTimeFactory.setOutOffice(todayOutOffice);
                                                
                                                // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                                                var rawData = userRawDataCollection.filterDate(todayStr);
                                                _.each(rawData, function(rawDataModel){
                                                    var destTime = new Date(rawDataModel.get("char_date"));
                                                    var type  = rawDataModel.get("type");
                                                    ResultTimeFactory.checkTime(destTime, type);   
                                                });
                                                
                                                var result = ResultTimeFactory.getResult();
                                                
                                                that.commuteCollection.add(result);
                                                yesterdayAttribute = result;
                                                
                                                today.setDate(today.getDate() + 1);
                                            }
                                        }
                                        progressbar.css("width", ((idx+1) / userCollection.models.length * 100) + "%");
                                    });
                                    
                                    that.grid.render();
                                    
                                    Dialog.show("데이터 생성 완료!", function(){
                                        progress.css("display", "none");
                                        progressbar.css("width","0%");
                                        dialog.close();    
                                        $(that).prop("disabled", false);
                                        that.selectedDate = selectedDate;
                                    });
                                    
                                });
                            }
                        }, {
                            label : "취소",
                            action: function(dialog){
                                dialog.close();
                            }
                        }],
                        closable: true
                    });
                        
                }
                
    	    });
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"ok",
    	        click:function(){
    	            that._disabledProgressbar(false);
    	            that.commuteCollection.save({
    	                success : function(){
    	                    Dialog.info("데이터 전송 성공!");
    	                    that._disabledProgressbar(true);
    	                }
    	            });
    	        }
    	    });
        },
    	render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리 ", subTitle:"근태 데이터 생성"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    var _progressBar=$(_.template(ProgressbarHTML)({percent : 100}));
    	     
    	    _layout.append(_head);
            _layout.append(_content);
            _layout.append(_progressBar);
    	    $(this.el).append(_layout);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));

            return this;
     	},
     	
     	_disabledProgressbar : function(flag){
     	    var progressbar = $(this.el).find(".progress");
     	    if(flag){
     	        progressbar.css("display","none");
     	    }else{
     	        progressbar.css("display","block");
     	    }
     	}
        
    });
    
    var ResultTimeFactory = {
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
        
        setStandardInTime : function(yesterdayOutTime){
            if(Util.dateToString(yesterdayOutTime) == this.date){
            var outTimeHour = yesterdayOutTime.getHours();
                if(outTimeHour >= 3)        this.standardInTime.setHours(13,20,0);
                else if(outTimeHour >= 2)   this.standardInTime.setHours(11,0,0);
                else if(outTimeHour >= 1)   this.standardInTime.setHours(10,0,0);
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

                    if(_.indexOf(OUTOFFICE_CODES) >= 0){
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
            if(type == "출근" && this.date == Util.dateToString(destTime)){ // 출근 기록일 경우
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
                standard_in_time : _.isNull(this.standardInTime) ? null : Moment(this.standardInTime).format("YYYY-MM-DD HH:mm"),
                standard_out_time :_.isNull(this.standardOutTime) ? null : Moment(this.standardOutTime).format("YYYY-MM-DD HH:mm"),
                in_time : _.isNull(this.inTime) ? null : Moment(this.inTime).format("YYYY-MM-DD HH:mm"),
                out_time : _.isNull(this.outTime) ? null : Moment(this.outTime).format("YYYY-MM-DD HH:mm"),
                in_time_type : this.inTimeType,
                out_time_type: this.outTimeType,
                late_time : this.lateTime,
                over_time : this.overTime,
                vacation_code : this.vacationCode,
                overtime_code : this.overtimeCode,
                out_office_code : this.outOfficeCode,
                out_office_start_time : _.isNull(this.outOfficeStartTime) ? null : Moment(this.outOfficeStartTime).format("YYYY-MM-DD HH:mm"),
                out_office_end_time : _.isNull(this.outOfficeEndTime) ? null : Moment(this.outOfficeEndTime).format("YYYY-MM-DD HH:mm"),
            };
        }
    };
    
    return CreateDataView;
});