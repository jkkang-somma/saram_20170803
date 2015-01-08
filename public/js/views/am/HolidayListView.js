define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'collection/am/HolidayCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  HolidayCollection){
    var userListCount=0;
    var holidays = [
    	{ date: "01-01", memo : "신정"          },
    	{ date: "03-01", memo : "삼일절"        },
    	{ date: "05-05", memo : "어린이날"      },
    	{ date: "06-06", memo : "현충일"        },
    	{ date: "08-15", memo : "광복절"		},
    	{ date: "10-03", memo : "개천절"		},
    	{ date: "10-09", memo : "한글날"		},
    	{ date: "12-25", memo : "성탄절"		},
    	{ date: "12-28", memo : "설연휴",		lunar : true },
    	{ date: "01-01", memo : "설날",		    lunar : true },
    	{ date: "01-02", memo : "설연휴",		lunar : true },
    	{ date: "04-08", memo : "석가탄신일",	lunar : true },
    	{ date: "08-14", memo : "추석연휴",	    lunar : true },
    	{ date: "08-15", memo : "추석",		    lunar : true },
    	{ date: "08-16", memo : "추석연휴",	    lunar : true }
    ];
    
    var HolidayListView = BaseView.extend({
        el:".main-container",
        
    	initialize:function(){
    	    var holidayCollection= new HolidayCollection();
    	    var _id="holidayList_"+(userListCount++);
    		this.gridOption = {
    		    el:_id+"_content",
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
    	    
    	    var _refreshBtn=$(ButtonHTML);
    	    _refreshBtn.attr("id", "holidayList_refreshBtn");
            _refreshBtn.addClass(_glyphiconSchema.value("refresh"));
            
            var _addBtn=$(ButtonHTML);
    	    _addBtn.attr("id", "holidayList_addBtn");
            _addBtn.addClass(_glyphiconSchema.value("add"));
            
            var _removeBtn=$(ButtonHTML);
    	    _removeBtn.attr("id", "holidayList_removeBtn");
            _removeBtn.addClass(_glyphiconSchema.value("remove"));
            
            var _btnBox=$(RightBoxHTML);
            _btnBox.append(_addBtn);
            _btnBox.append(_removeBtn);
            _btnBox.append(_refreshBtn);
            _head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    
    	    var grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	    
    	    _refreshBtn.click(function(){
               // _view.render();
               grid.options.collection
            });
            
    	    _addBtn.click(function(){
                for(var key in holidays){
                    holidays[key].year = "2014";
                    console.log(holidays[key]);
                    grid.options.collection.add(holidays[key]);
                }
                console.log(grid.options.collection);
                grid.options.collection.save();
            });
            
            _removeBtn.click(function(){
               var selectItem=grid.getSelectItem();
            });
     	}
    });
    
    return HolidayListView;
});