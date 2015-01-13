define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'gridtemp',
  'schemas',
  'bootstrap-dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'text!templates/holiday/holidaytoolsTemplate.html',
  'collection/common/HolidayCollection',
  'models/common/HolidayModel',
  'bootstrap-datepicker'
], function($, _, Backbone, BaseView, Grid, Schemas, BootstrapDialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  HolidaytoolsTemplate, HolidayCollection, HolidayModel, datepicker){

    var holidays = [
    	{ date: "01-01", memo : "신정",         lunar : false,  _3days : false},
    	{ date: "03-01", memo : "삼일절",       lunar : false,  _3days : false},
    	{ date: "05-05", memo : "어린이날",     lunar : false,  _3days : false},
    	{ date: "06-06", memo : "현충일",       lunar : false,  _3days : false},
    	{ date: "08-15", memo : "광복절",		lunar : false,  _3days : false},
    	{ date: "10-03", memo : "개천절",		lunar : false,  _3days : false},
    	{ date: "10-09", memo : "한글날",		lunar : false,  _3days : false},
    	{ date: "12-25", memo : "성탄절",		lunar : false,  _3days : false},
    	{ date: "01-01", memo : "설날",		    lunar : true,   _3days : true },
    	{ date: "04-08", memo : "석가탄신일",	lunar : true,   _3days : false},
    	{ date: "08-15", memo : "추석",		    lunar : true,   _3days : true },
    ];
    
    var HolidayListView = BaseView.extend({
        el:".main-container",
        
    	initialize:function(){
    	    this.holidayCollection = new HolidayCollection();
    	    
    		this.gridOption = {
    		    el:"holidayList_content",
    		    id:"holidayListTable",
    		    column:["날짜", "내용"],
    		    dataschema:["date", "memo"],
    		    collection:this.holidayCollection,
    		    detail: false,
    		    buttons:[]
    		}
    		
            this.dialogInit();
    	},
    	
    	events:{
    	    "click #holidayListToolBtn" : "showHolidayTools"
    	},
    	dialogInit: function(){
    	    var that = this;
    	    this.dialog = new BootstrapDialog({
                title: "휴일 관리",
                message: function(dialogRef){
                    var template = $(HolidaytoolsTemplate);
                    
                    template.find("#yearCommit").click(function(obj){
                        var year = dialogRef.getModalBody().find("#yearCombo").val();
                        var newHolidayCollection = new HolidayCollection();
                        
                        for(var key in holidays){
                            holidays[key].year = year;
                            newHolidayCollection.add(holidays[key]);
                        }
                        
                        newHolidayCollection.save({
                            success : function(){
                                that.grid.render();
                                dialogRef.close();
                            }
                        });
                        return false;
                    });
                    
                    var datepicker = template.find("#holidayDatepicker");
                    datepicker.datepicker({
                        format: "yyyy/mm/dd",
                        language: "kr",
                        todayHighlight: true
                    });
                    
                    template.find("#addHolidayCommit").click(function(obj){
                        var date = datepicker.datepicker("getDate");
                        var month = date.getMonth()+1 < 10 ? "0" + (date.getMonth()+1) : date.getMonth()+1;
                        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                        var memo = dialogRef.getModalBody().find("#holidayMemo").val();
                        
                        var holidayModel = new HolidayModel();
                        
                        var modelOption = { date: month+"-"+day , memo : memo, year: date.getFullYear()};
                        
                        holidayModel.save(modelOption, {
                            success : function(){
                                that.grid.render();
                                dialogRef.close();
                            }
                        });

                        return false;
                    });
            
                    return template;
                },
                closable: true
            });
    	},
    	showHolidayTools: function(){
            this.dialog.realize();
            this.dialog.open();
    	},

    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"휴일 관리 ", subTitle:"휴일 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
            var _toolBtn=$(ButtonHTML);
    	    _toolBtn.attr("id", "holidayListToolBtn");
            _toolBtn.addClass(_glyphiconSchema.value("wrench"));
            
            
            var _btnBox=$(RightBoxHTML);
            _btnBox.append(_toolBtn);
            _head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            
            this.grid.render();

     	}
    });
    
    return HolidayListView;
});