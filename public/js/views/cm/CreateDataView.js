define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'moment',
  'resulttimefactory',
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
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, Moment, ResultTimeFactory,
HeadHTML, ContentHTML, LayoutHTML, ProgressbarHTML,
HolidayCollection, RawDataCollection, UserCollection, CommuteCollection, OutOfficeCollection,
CreateDataPopupView){
    var resultTimeFactory = ResultTimeFactory.Builder;
    
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
                            return _.isNull(rowData.in_time) ? null : Moment(rowData.in_time).format("YYYY-MM-DD HH:mm");
                       }
                    },
                    {"title": "퇴근시간", "data": "out_time",
                        "render": function (data, type, rowData, meta) {
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
        
                                var startDate = startDatepicker.data("DateTimePicker").getDate();
                                var endDate = endDatepicker.data("DateTimePicker").getDate();
                                var yesterday = Moment(startDate).subtract(1, 'days');

                                if(startDate.isAfter(endDate)){
                                    Dialog.error("시작일이 종료일보다 큽니다.");
                                    return;
                                }
                                
                                var selectedDate = {
                                    start:startDate.format(ResultTimeFactory.DATEFORMAT),
                                    end:endDate.format(ResultTimeFactory.DATEFORMAT)
                                };
                                
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
                                            year : startDate.year()
                                        },
                                        success : function(){
                                            that.grid.render();
                                        }
                                    }),
                                    outOfficeCollection.fetch(),
                                    yesterdayCommuteCollection.fetchDate(yesterday.format(ResultTimeFactory.DATEFORMAT))
                                ).done(function(){
                                    // var startDate = new Date(selectedDate.start);
                                    // var endDate = new Date(selectedDate.end);
                                    // endDate.setDate(endDate.getDate() - 1);
                                    
                                    var diff_days = endDate.diff(startDate, 'days')
                                    console.log("diff_days : " + diff_days)
                                    
                                    _.each(userCollection.models, function(userModel, idx){
                                        var today = Moment(startDate);
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
                                                
                                            resultTimeFactory.init(userId, userName, userDepartment); //계산전 초기화
                                            
                                            for(var i=0; i <= diff_days; i++){ //차이나는 날짜만큼 기본데이터 생성 (사원수 X 날짜)
                                                var todayStr = today.format(ResultTimeFactory.DATEFORMAT);    // 오늘 날짜(str)
                                                var holidayData = holidayCollection.where({ // 오늘 휴일 목록
                                                    date: todayStr
                                                });    
                                                
                                                resultTimeFactory.initToday(todayStr, holidayData); //계산전 초기화    
                                                
                                                // 출근 기준시간 판단 01:00 = 10:00, 02:00 = 11:00, 03:00 = 13:20
                                                var yesterdayOutTime = new Date(yesterdayAttribute.out_time);
                                                resultTimeFactory.setStandardInTime(yesterdayOutTime);
                                                
                                                // 휴가/외근/휴일 판단
                                                var todayOutOffice = userOutOfficeCollection.where({date: todayStr});
                                                resultTimeFactory.setOutOffice(todayOutOffice);
                                                
                                                // 당일 사용자의 출입기록을 보고 출근 / 퇴근/  가장 빠른,늦은시간 출입 기록을 구한다
                                                var rawData = userRawDataCollection.filterDate(todayStr);
                                                _.each(rawData, function(rawDataModel){
                                                    var destTime = new Date(rawDataModel.get("char_date"));
                                                    var type  = rawDataModel.get("type");
                                                    resultTimeFactory.checkTime(destTime, type);   
                                                });
                                                
                                                var result = resultTimeFactory.getResult();
                                                
                                                that.commuteCollection.add(result);
                                                yesterdayAttribute = result;
                                                
                                                today.add(1, 'days');
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
    
    return CreateDataView;
});