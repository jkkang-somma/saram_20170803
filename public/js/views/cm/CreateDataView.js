define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'gridtemp',
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
  'models/cm/CommuteModel',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, BootstrapDialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML, DatePickerHTML, datepicker,
HolidayModel, HolidayCollection, RawDataModel, RawDataCollection, UserModel, UserCollection, CommuteModel, CommuteCollection){
    var CreateDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.commuteCollection = new CommuteCollection();
    	    
    	    this.holidayCollection = new HolidayCollection();
    	    
    		this.gridOption = {
    		    el:"holidayList_content",
    		    id:"holidayListTable",
    		    column:["날짜", "내용"],
    		    dataschema:["date", "memo"],
    		    collection:this.holidayCollection,
    		    detail: false,
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
                title: "휴일 관리",
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
                                
                        rawDataCollection.fetch({
                            data: selectedDate,
                            success: function(rawDataResult){
                                
                                var userCollection = new UserCollection();
                                userCollection.fetch({
                                    success : function(userResult){
                                        var startDate = new Date(selectedDate.start);
                                        var endDate = new Date(selectedDate.end);
                                        endDate.setDate(endDate.getDate() - 1);
                                        
                                        var diff_days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                        _.each(userResult.models, function(userModel){
                                            var date = new Date(startDate);
                                            
                                            for(var i=0; i < diff_days; i++){
                                                var whereRawData = rawDataResult.where({
                                                    id: userModel.attributes.id,
                                                    name : userModel.attributes.name,
                                                });
                                                
                                                var dataArr = [];
                                                var inTime =null;
                                                var outTime = null;
                                                for(var key in whereRawData){
                                                    if(whereRawData[key].attributes.date.slice(0,10) == Util.dateToString(date)){
                                                        dataArr.push(whereRawData[key]);
                                                        if(whereRawData[key].attributes.type.slice(0,2) == "출근"){
                                                            var attributesInTime = Date.parse(whereRawData[key].attributes.date);
                                                            if(Util.isNotNull(inTime)){
                                                                if(inTime - attributesInTime < 0){
                                                                    inTime = attributesInTime;
                                                                }
                                                            }else{
                                                                inTime = attributesInTime;
                                                            }
                                                        }else if(whereRawData[key].attributes.type.slice(0,2) == "퇴근"){
                                                            var attributesOutTime = Date.parse(whereRawData[key].attributes.date);
                                                            if(Util.isNotNull(outTime)){
                                                                if(outTime - attributesOutTime > 0){
                                                                    outTime = attributesOutTime;
                                                                }
                                                            }else{
                                                                outTime = attributesOutTime;
                                                            }
                                                            
                                                        }
                                                    }
                                                }
                                                // console.log(inTime + " " + outTime);                                                
                                                
                                                var commuteCollectionAttribute = {
                                                    date: Util.dateToString(date),
                                                    year: date.getFullYear(),
                                                    id : userModel.attributes.id,
                                                    department : userModel.attributes.dept_name,
                                                    name : userModel.attributes.name,
                                                    in_time : Util.isNull(inTime)? null : Util.timeToString(inTime),
                                                    out_time : Util.isNull(outTime)? null : Util.timeToString(outTime), 
                                                };
                                                
                                                // if(dataArr.length==0){ // 해당일 출입기록 없음
                                                //     console.log(Util.dateToString(date));
                                                //     console.log(userModel.attributes.id);
                                                //     console.log(userModel.attributes.name);
                                                // }else{
                                                //     for(var j = 0 ; j < dataArr.length ; j++){
                                                        
                                                        
                                                //     }
                                                // }
                                                
                                                that.commuteCollection.add(commuteCollectionAttribute);
                                                
                                                date.setDate(date.getDate() + 1);
                                            }
                                        });
                                        console.log(that.commuteCollection);
                                    }
                                });
                            }
                        });
                        // dialog.close();
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
            
            this.grid.render();
            
            return this;
     	}
    });
    
    return CreateDataView;
});