define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'bootstrap-dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'text!templates/component/datepicker.html',
  'bootstrap-datepicker',
  'models/common/HolidayModel',
  'collection/common/HolidayCollection',
  'models/am/RawDataModel',
  'collection/am/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, BootstrapDialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML, DatePickerHTML, datepicker,
HolidayModel, HolidayCollection, RawDataModel, RawDataCollection, UserModel, UserCollection, CommuteModel, CommuteCollection){
    var CreateDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    		this.gridOption = {
    		    el:"createCommuteListContent",
    		    id:"createCommuteListTable",
    		    column:["날짜","사번","부서","이름","출근시간","퇴근시간", "Type", "출근기준", "퇴근기준", "지각", "초과", "code"], //,"vacation_code","out_office_code","overtime_code","late_time","over_time","in_time_change","out_time_change","comment_count"],
    		    dataschema:["date","id","department","name","in_time","out_time", "work_type", "standard_in_time", "standard_out_time", "late_time", "over_time", "overtime_code"], //,"vacation_code","out_office_code","overtime_code","late_time","over_time","in_time_change","out_time_change","comment_count"],
    		    collection:this.commuteCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:[]
    		};
    		
    		this.dialogInit();
    		
    	},
    	events: {
    	    "click #createCommuteToolBtn" : "showDialog"
    	},
    	dialogInit: function(){
    	    var that = this;
    	    this.dialog = new BootstrapDialog({
                title: "근태 데이터 생성",
                message: function(dialogRef){
                    var dialogTemplate = $("<div></div>");
                    
                    var _datePicker=$(_.template(DatePickerHTML)({label : "기간"}));
                    dialogTemplate.append(_datePicker);
                    
                    dialogTemplate.find("#datepicker").datepicker({
                        format: "yyyy/mm//dd",
                        todayHighlight: true
                    });
                    
                    return dialogTemplate;
                },
                
                buttons: [{
                    label: '데이터 생성',
                    action: function(dialog) {
                        var datepicker = dialog.getModalBody().find("#datepicker");
                        
                        console.log(datepicker.find("#start").datepicker("getDate"));
                        console.log(datepicker.find("#end").datepicker("getDate"));
                        
                        var selectedDate = {
                            start:"2014-10-25",
                            end:"2014-11-26"
                            
                        };
                        
                        if(selectedDate.start > selectedDate.end){
                            // 오류발생
                        }
                        
                        var rawDataCollection = new RawDataCollection();
                        var userCollection = new UserCollection();
                        var holidayCollection = new HolidayCollection();
                        
                        
                        $.when(rawDataCollection.fetch({data: selectedDate}),userCollection.fetch(), holidayCollection.fetch())
                        .done(function(){
                            var startDate = new Date(selectedDate.start);
                            var endDate = new Date(selectedDate.end);
                            endDate.setDate(endDate.getDate() - 1);
                            
                            var diff_days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); // 시작일과 종료일의 날짜 차이를 구함
                            
                            _.each(userCollection.models, function(userModel){
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
                                    
                                    for(var i=0; i < diff_days; i++){ //차이나는 날짜만큼 기본데이터 생성 (사원수 X 날짜)
                                        var dateStr = Util.dateToString(today);
                                        
                                        var commuteAttribute = {
                                            id : userId,
                                            name : userName,
                                            department : userDepartment,
                                            year: today.getFullYear(),
                                            date: dateStr,
                                            work_type : "00",
                                            in_time: "",
                                            out_time: "",
                                            standard_in_time: "09:00:00",
                                            standard_out_time:"18:00:00",  
                                            late_time : 0,
                                            over_time : 0,
                                            overtime_code : "",
                                        };
                                        
                                       
                                        // 출근 기준시간 판단 01:00 = 10:00, 02:00 = 11:00, 03:00 = 13:20
                                        var yesterdayOutTime = new Date(yesterdayAttribute.out_time);
                                        if(Util.dateToString(yesterdayOutTime) == Util.dateToString(today)){
                                            var outTimeHour = yesterdayOutTime.getHours();
                                            if(outTimeHour >= 3){
                                                commuteAttribute.standard_in_time = "13:20:00";  
                                            }else if(outTimeHour >= 2){
                                                commuteAttribute.standard_in_time = "11:00:00";  
                                            }else if(outTimeHour >= 1){
                                                commuteAttribute.standard_in_time = "10:00:00";  
                                            }
                                        }
                                        
                                        // 휴일 근무 판단
                                        var holidayData = holidayCollection.where({
                                            date: dateStr,
                                            year: today.getFullYear()
                                        });
                                        
                                        if(holidayData.length > 0 || today.getDay() === 0 || today.getDay() === 6){ // 휴일일 경우 work_type 바꿈
                                            commuteAttribute.work_type = "33";
                                            commuteAttribute.standard_in_time = null;  
                                            commuteAttribute.standard_out_time = null;  
                                        }
                                        
                                        
                                        var rawData = userRawDataCollection.filterDate(Util.dateToString(today)); // 당일 사용자의 출입기록
                                        
                                        var earliestTime = null;
                                        var inTime = null;
                                        var outTime = null;
                                        var latestTime = null;
                                        
                                        _.each(rawData, function(rawDataModel){ // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                                            var rawDataTime = new Date(rawDataModel.get("char_date"));
                                            
                                            if(rawDataModel.get("type").slice(0,2) == "출근" && Util.dateToString(today) == Util.dateToString(rawDataTime)){ // 출근 기록일 경우
                                                if(Util.isNull(inTime))
                                                    inTime = rawDataTime;
                                                else
                                                    if(inTime - rawDataTime > 0) inTime = rawDataTime;
                                                
                                            }else if(rawDataModel.get("type").slice(0,2) == "퇴근"){ // 퇴근기록일 경우
                                                if(Util.isNull(outTime))
                                                    outTime = rawDataTime;
                                                else
                                                    if(outTime - rawDataTime < 0) outTime = rawDataTime;
                                            }else{ // 출입기록일경우 출퇴근 기록이 없을때를 대비해서 이른시간 / 늦은시간을 구한다.
                                                if(Util.isNull(earliestTime))
                                                    earliestTime = rawDataTime;
                                                else
                                                    if(earliestTime - rawDataTime > 0) earliestTime = rawDataTime;
                                                    
                                                if(Util.isNull(latestTime))
                                                    latestTime = rawDataTime;
                                                else
                                                    if(latestTime - rawDataTime < 0) outTime = rawDataTime;
                                            }
                                        });
                                        
                                        // 출퇴근시간 판단
                                        if(Util.isNotNull(inTime))
                                            commuteAttribute.in_time = Util.dateToString(inTime) + " " + Util.timeToString(inTime);
                                        else{
                                            if(Util.isNotNull(earliestTime)){
                                                commuteAttribute.in_time = Util.dateToString(earliestTime) + " " + Util.timeToString(earliestTime);
                                                inTime = earliestTime;
                                            }
                                        }
                                        
                                        if(Util.isNotNull(outTime))
                                            commuteAttribute.out_time = Util.dateToString(outTime) + " " + Util.timeToString(outTime);
                                        else{
                                            if(Util.isNotNull(latestTime)){
                                                commuteAttribute.out_time = Util.dateToString(latestTime) + " " + Util.timeToString(latestTime);
                                                outTime = latestTime;
                                            }
                                        }
                                        
                                        // 지각시간 판단
                                        var standardInTime = new Date(Util.dateToString(today) + " " +commuteAttribute.standard_in_time);
                                        var lateTime = 0;
                                        if(Util.isNotNull(inTime)){
                                            if(inTime - standardInTime > 0){
                                                lateTime = (inTime - standardInTime) / 1000 / 60;
                                                commuteAttribute.work_type = "10";
                                            }
                                        }
                                        commuteAttribute.late_time = lateTime;
                                        
                                        // 초과근무시간 판단 over_time
                                        var standardOutTime = new Date(Util.dateToString(today) + " " +commuteAttribute.standard_out_time);
                                        var overTime = 0;
                                        if(commuteAttribute.work_type == "33"){ //휴일근무인 경우
                                            overTime = (outTime - inTime) / 1000 / 60;
                                            if(overTime > 480){ // 휴일근무 시간 적용
                                                commuteAttribute.overtime_code = "2015_BC";
                                            }else if(overTime > 360){
                                                commuteAttribute.overtime_code = "2015_BB";
                                            }else if(overTime > 240){
                                                commuteAttribute.overtime_code = "2015_BA";
                                            }
                                        }else if(Util.isNotNull(outTime)){
                                            lateTime = (Math.ceil(lateTime/10)) * 10 * 1000 *60; // 지각으로 인해 추가 근무 해야하는시간 (millisecond)
                                            
                                            if(outTime - standardOutTime >= 0) {
                                                overTime = ((outTime - standardOutTime) - lateTime) / 1000 / 60;
                                                if(overTime > 360){ // 추가근무 시간 적용
                                                    commuteAttribute.overtime_code = "2015_AC";
                                                }else if(overTime > 240){
                                                    commuteAttribute.overtime_code = "2015_AB";
                                                }else if(overTime > 120){
                                                    commuteAttribute.overtime_code = "2015_AA";
                                                }else{
                                                    overTime = 0;
                                                }
                                            }else{
                                                if(commuteAttribute.work_type == "10"){
                                                    commuteAttribute.work_type == "11";
                                                }else{
                                                    commuteAttribute.work_type == "01";
                                                }
                                            }
                                        }
                                        
                                        commuteAttribute.over_time = overTime;
                                        
                                        that.commuteCollection.add(commuteAttribute);
                                        
                                        yesterdayAttribute = commuteAttribute;
                                        today.setDate(today.getDate() + 1);
                                    }
                                }
                            });
                            
                            console.log(that.commuteCollection);
                            that.grid.render();
                            dialog.close();
                            
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
    	},
    	showDialog: function(){
            this.dialog.realize();
            this.dialog.open();
    	},
    	render:function(){
            var _headSchema=Schemas.getSchema('headTemp');
    	    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리 ", subTitle:"근태 데이터 생성"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
            var _toolBtn=$(ButtonHTML);
    	    _toolBtn.attr("id", "createCommuteToolBtn");
            _toolBtn.addClass(_glyphiconSchema.value("wrench"));
            
            var _btnBox=$(RightBoxHTML);
            _btnBox.append(_toolBtn);
            _head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layout.append(_head);
    	    
    	    
            _layout.append(_content);
            
            
    	    $(this.el).append(_layout);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            
            //is.grid.render();
            
            return this;
     	}
    });
    
    return CreateDataView;
});