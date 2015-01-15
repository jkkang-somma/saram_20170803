define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'models/common/HolidayModel',
  'collection/common/HolidayCollection',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'models/cm/CommuteModel',
  'collection/cm/CommuteCollection',
  'models/vacation/OutOfficeModel',
  'collection/vacation/OutOfficeCollection',
  'views/cm/popup/CreateDataPopupView',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, 
HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,
HolidayModel, HolidayCollection, RawDataModel, RawDataCollection, UserModel, UserCollection, CommuteModel, CommuteCollection, OutOfficeModel, OutOfficeCollection,
CreateDataPopupView){
    var CreateDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    		this.gridOption = {
    		    el:"createCommuteListContent",
    		    id:"createCommuteListTable",
    		    column:["날짜",/*"사번","부서",*/"이름","출근시간","퇴근시간", "Type", "출근기준", "퇴근기준", "지각", "초과", "code", "휴가"],
    		    dataschema:["date",/*"id","department",*/"name","in_time","out_time", "work_type", "standard_in_time", "standard_out_time", "late_time", "over_time", "overtime_code", "out_office_code"], 
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
                                var datepicker = dialog.getModalBody().find("#datepicker");
        
                                var startDate = datepicker.find("#start").datepicker("getDate");
                                var endDate = datepicker.find("#end").datepicker("getDate")
                                var yesterdayDate = new Date(startDate);
                                
                                yesterdayDate.setDate(startDate.getDate() -1);
                                
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
                                    holidayCollection.fetch(),
                                    outOfficeCollection.fetch(),
                                    yesterdayCommuteCollection.fetchDate(Util.dateToString(yesterdayDate)))
                                .done(function(){
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
                                            
                                            var filterDate = yesterdayCommuteCollection.where({id : userId}); // 시작일 - 1
                                            if(filterDate.length > 0){
                                                yesterdayAttribute = filterDate[0].toJSON();
                                                yesterdayAttribute.in_time = Util.timeToString(new Date(yesterdayAttribute.in_time));
                                                yesterdayAttribute.out_time = Util.timeToString(new Date(yesterdayAttribute.out_time));
                                                yesterdayAttribute.standard_in_time = Util.timeToString(new Date(yesterdayAttribute.standard_in_time));
                                                yesterdayAttribute.standard_out_time = Util.timeToString(new Date(yesterdayAttribute.standard_out_time));
                                            }
                                                
                                            for(var i=0; i <= diff_days; i++){ //차이나는 날짜만큼 기본데이터 생성 (사원수 X 날짜)
                                                var todayStr = Util.dateToString(today);
                                                
                                                var holidayData = holidayCollection.where({ // 오늘 휴일 목록
                                                    date: todayStr,
                                                    year: today.getFullYear()
                                                });    
                                                
                                                var commuteAttribute = {
                                                    id : userId,
                                                    name : userName,
                                                    department : userDepartment,
                                                    year: today.getFullYear(),
                                                    date: todayStr,
                                                    work_type : "00",
                                                    in_time: null,
                                                    out_time: null,
                                                    standard_in_time: "09:00:00",
                                                    standard_out_time:"18:00:00",  
                                                    late_time : 0,
                                                    over_time : 0,
                                                    overtime_code : null,
                                                    out_office_code : null,
                                                    vacation_code : null,
                                                };
                                                
                                                // 출근 기준시간 판단 01:00 = 10:00, 02:00 = 11:00, 03:00 = 13:20
                                                var yesterdayOutTime = new Date(yesterdayAttribute.out_time);
                                                if(Util.dateToString(yesterdayOutTime) == todayStr){
                                                    var outTimeHour = yesterdayOutTime.getHours();
                                                    if(outTimeHour >= 3){
                                                        commuteAttribute.standard_in_time = "13:20:00";  
                                                    }else if(outTimeHour >= 2){
                                                        commuteAttribute.standard_in_time = "11:00:00";  
                                                    }else if(outTimeHour >= 1){
                                                        commuteAttribute.standard_in_time = "10:00:00";  
                                                    }
                                                }
                                                
                                                // 휴가/외근 판단
                                                var todayOutOffice = userOutOfficeCollection.where({date: todayStr});
                                                if(todayOutOffice.length > 0){
                                                    var outOfficeCode = todayOutOffice[0].get("office_code");
                                                    commuteAttribute.out_office_code = outOfficeCode;    
                                                    switch(outOfficeCode){
                                                        case "V02": // 오전반차
                                                            commuteAttribute.standard_in_time = "13:20:00";    
                                                            break;
                                                        case "V03": // 오후반차
                                                            commuteAttribute.standard_out_time = "12:20:00";
                                                            break;
                                                        case "V01": // 연차휴가
                                                        case "V04": // 경조휴가
                                                        case "V05": // 공적휴가
                                                        case "V06": // 특별휴가
                                                            commuteAttribute.standard_in_time = null;    
                                                            commuteAttribute.standard_out_time = null;
                                                            break;
                                                    }
                                                    
                                                    commuteAttribute.in_time = null;  
                                                    commuteAttribute.out_time = null; 
                                                }
                                                
                                                // 휴일
                                                if(holidayData.length > 0 || today.getDay() === 0 || today.getDay() === 6){ // 휴일일 경우 work_type 바꿈
                                                    commuteAttribute.work_type = "33";
                                                    commuteAttribute.standard_in_time = null;  
                                                    commuteAttribute.standard_out_time = null;  
                                                    commuteAttribute.in_time = null;  
                                                    commuteAttribute.out_time = null; 
                                                }
                                                
                                                var rawData = userRawDataCollection.filterDate(todayStr); // 당일 사용자의 출입기록
                                                
                                                // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                                                var earliestTime = null;
                                                var inTime = null;
                                                var outTime = null;
                                                var latestTime = null;
                                                _.each(rawData, function(rawDataModel){
                                                    var rawDataTime = new Date(rawDataModel.get("char_date"));
                                                    if(rawDataModel.get("type").slice(0,2) == "출근" && todayStr == Util.dateToString(rawDataTime)){ // 출근 기록일 경우
                                                        if(Util.isNull(inTime))
                                                            inTime = rawDataTime;
                                                        else
                                                            if(inTime - rawDataTime > 0) inTime = rawDataTime;
                                                        
                                                    }else if(rawDataModel.get("type").slice(0,2) == "퇴근"){ // 퇴근기록일 경우
                                                        if(Util.isNull(outTime))
                                                            outTime = rawDataTime;
                                                        else
                                                            if(outTime - rawDataTime < 0) outTime = rawDataTime;
                                                    }
                                                    // 출퇴근 기록이 없을때를 대비해서 이른시간 / 늦은시간을 구한다.
                                                    if(Util.isNull(earliestTime))
                                                        earliestTime = rawDataTime;
                                                    else
                                                        if(earliestTime - rawDataTime > 0) earliestTime = rawDataTime;
                                                        
                                                    if(Util.isNull(latestTime))
                                                        latestTime = rawDataTime;
                                                    else
                                                        if(latestTime - rawDataTime < 0) outTime = rawDataTime;
                                                    
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
                                                var standardInTime = new Date(todayStr + " " +commuteAttribute.standard_in_time);
                                                var lateTime = 0;
                                                if(Util.isNotNull(inTime)){
                                                    if(inTime - standardInTime > 0){
                                                        lateTime = (inTime - standardInTime) / 1000 / 60;
                                                        commuteAttribute.work_type = "10";
                                                    }
                                                }
                                                commuteAttribute.late_time = lateTime;
                                                
                                                // 초과근무시간 판단 over_time
                                                var standardOutTime = new Date(todayStr + " " +commuteAttribute.standard_out_time);
                                                var overTime = 0;
                                                if(commuteAttribute.work_type == "33"){ //휴일근무인 경우
                                                    overTime = (outTime - inTime) / 1000 / 60; // 휴일근무 시간
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
                                                        overTime = ((outTime - standardOutTime) - lateTime) / 1000 / 60; // 초과근무 시간 (지각시간 제외)
                                                        if(overTime > 360){ // 추가근무 시간 적용
                                                            commuteAttribute.overtime_code = "2015_AC";
                                                        }else if(overTime > 240){
                                                            commuteAttribute.overtime_code = "2015_AB";
                                                        }else if(overTime > 120){
                                                            commuteAttribute.overtime_code = "2015_AA";
                                                        }
                                                    }else{ // 조퇴 판정
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
    	            that.commuteCollection.save({
    	                success : function(){
    	                    Dialog.info("데이터 전송 성공!");
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
    	    _layout.append(_head);
            _layout.append(_content);
            
    	    $(this.el).append(_layout);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));

            return this;
     	}
    });
    
    return CreateDataView;
});