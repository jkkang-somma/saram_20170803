define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'bootstrap-dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'text!templates/testform.html',
  'collection/am/HolidayCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, BootstrapDialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  TestForm, HolidayCollection){

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
    	    var holidayCollection= new HolidayCollection();
    		this.gridOption = {
    		    el:"holidayList_content",
    		    column:["날짜", "내용"],
    		    dataschema:["date", "memo"],
    		    collection:holidayCollection,
    		    buttons:[]
    		}
    	},
    	
    	render:function(){
    	    var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"휴일 관리 ", subTitle:"휴일 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    

            var _toolBtn=$(ButtonHTML);
    	    _toolBtn.attr("id", "holidayList_addBtn");
            _toolBtn.addClass(_glyphiconSchema.value("wrench"));
            
            
            var _btnBox=$(RightBoxHTML);
            _btnBox.append(_toolBtn);
            _head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    
    	    var grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	
    	    _toolBtn.click(function(){
    	        var dialog = new BootstrapDialog({
    	            title: "휴일 관리",
                    message: function(dialogRef){
                        var template = $(TestForm);
                        var yearCombo = template.find("#yearCombo");
                        var yearCommit = template.find("#yearCommit");
                        
                        yearCommit.click(function(obj){
                            var year = yearCombo.val();
                            console.log(year);

                            console.log(grid.options.collection);
                            for(var key in holidays){
                                holidays[key].year = year;
                                grid.options.collection.add(holidays[key]);
                            }
                            console.log(grid.options.collection);
                            
                            grid.options.collection.save({
                                success: function(){
                                    grid.options.collection.reset();
                                    dialog.close();
                                }
                            });
                            return false;
                        })
                
                        return template;
                    },
                    closable: true
                });
                dialog.realize();
                dialog.open();
                

            });
            
     	}
    });
    
    return HolidayListView;
});