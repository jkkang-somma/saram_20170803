define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'text!templates/holiday/holidaytoolsTemplate.html',
  'collection/common/HolidayCollection',
  'models/common/HolidayModel',
  'views/Holiday/popup/CreateHolidayPopup',
  'views/Holiday/popup/AddHolidayPopup',
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog,
HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,
HolidaytoolsTemplate,
HolidayCollection, HolidayModel,
CreateHolidayPopup, AddHolidayPopup){

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
    
    var holidayManagerView = BaseView.extend({
        el:".main-container",
        
    	initialize:function(){
    	    this.holidayCollection = new HolidayCollection();
    	    
    		this.gridOption = {
    		    el:"holidayList_content",
    		    id:"holidayListTable",
    		    column:["날짜", "내용"],
    		    dataschema:["date", "memo"],
    		    collection:this.holidayCollection,
    		    detail: true,
    		    buttons:["search","refresh"]
    		}
    		
            this.buttonInit();
    	},
    	
    	buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"wrench",
    	        click:function(){
    	            var createHolidayPopup = new CreateHolidayPopup();
    	            Dialog.show({
    	                title:"공휴일 생성", 
                        content:createHolidayPopup, 
                        buttons: [{
                            id: 'createHolidayBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '생성',
                            action: function(dialog) {
                                var year = dialog.getModalBody().find("#createHolidayCombo").val();
                                var newHolidayCollection = new HolidayCollection();
                                
                                for(var key in holidays){
                                    holidays[key].year = year;
                                    newHolidayCollection.add(holidays[key]);
                                }
                                
                                newHolidayCollection.save({
                                    success : function(){
                                        that.grid.render();
                                        dialog.close();
                                    }
                                });
                                return false;
                            }
                        }, {
                            label : "취소",
                            action : function(dialog){
                                dialog.close();
                            }
                        }]
    	            })
    	        }
    	    });
    	    
    	    // add buton
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"add",
    	        click:function(){
    	            var addHolidayPopup = new AddHolidayPopup();
    	            Dialog.show({
    	                title:"휴일 추가", 
                        content:addHolidayPopup, 
                        buttons: [{
                            id: 'addHolidayBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '추가',
                            action: function(dialog) {
                                var datepicker = dialog.getModalBody().find("#addHolidayDate");
                                
                                var date = datepicker.datepicker("getDate");
                                var month = date.getMonth()+1 < 10 ? "0" + (date.getMonth()+1) : date.getMonth()+1;
                                var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                                
                                var memo = dialog.getModalBody().find("#addHolidayMemo").val();
                                
                                var holidayModel = new HolidayModel({ date: month+"-"+day , memo : memo, year: date.getFullYear()});
                                
                                holidayModel.save({}, {
                                    success : function(){
                                        that.grid.render();
                                        dialog.close();
                                    }
                                });

                            }
                        }, {
                            label : "취소",
                            action : function(dialog){
                                dialog.close();
                            }
                        }]
    	            })
    	        }
    	    });
    	},


    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"휴일 관리 ", subTitle:"휴일 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");

    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();
            
            return this;
     	}
    });
    
    return holidayManagerView;
});