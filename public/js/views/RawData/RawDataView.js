define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'dialog',
  'csvParser',
  'cmoment',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/row.html',
  'text!templates/default/datepickerRange.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'views/component/ProgressbarView',
], function($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser, Moment,
HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
RawDataModel, RawDataCollection,UserModel, UserCollection,
ProgressbarView){
    var RawDataView = BaseView.extend({
        el:$(".main-container"),
        
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    this.rawDataCollection = new RawDataCollection();
    
            this.departmentCollection = null;
            this.userCollection = new UserCollection();
            this.userCollection.fetch();
            
            this.gridOption = {
    		    el:"rawDataContent",
    		    id:"rawDataTable",
    		    //column:["사번", "이름", "부서", "출입시간", "출입기록"],
    		    column:[
   	                   	{ data : "name", 			"title" : "이름", 
 	                   		render: function(data, type, full, meta) {
 	                   			return full.name + "</br>(" +full.id + ")";
 	                   		}
 	                   	},
 	                   	{ data : "department", 		"title" : "부서" },
 	                   	{ data : "char_date", 		"title" : "출입시간" },
 	                   	{ data : "type", 			"title" : "출입기록" },
 	                   	{ data : "char_date", 		"title" : "IP" },
 	                   	{ data : "char_date", 		"title" : "MAC" } 	                   
    		    ],
    		    dataschema:["id", "name", "department", "char_date", "type"],
    		    collection:this.rawDataCollection,
    		    detail: true,
    		    fetch: false,
    		    buttons:["search","refresh"]
    		};

    	},
        events : {
            "click #rdSearchBtn" : "getRawData"
        },
        getRawData : function(){
            var startDate = $(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate();
            var endDate = $(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate();
            this.renderTable(startDate, endDate);
        },
        renderTable : function(startDate, endDate){
            var that = this;
            this.progressbar.disabledProgressbar(false);
            this.rawDataCollection.fetch({
                data : {start : Moment(startDate).format("YYYY-MM-DD"), end : Moment(endDate).format("YYYY-MM-DD")},
                success: function(){
                    that.grid.render();
                    that.progressbar.disabledProgressbar(true);
                    Dialog.info("검색이 완료되었습니다");
                }
    	    });
        },
        
    	render:function(){
    	    var that = this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layout=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"출입 기록 관리 ", subTitle:"출입 기록 조회"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    var _row=$(RowHTML);
    	    var _datepickerRange=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			fromId : "rdFromDatePicker",
    	    			toId : "rdToDatePicker"
    	    		}
    	    		
    	    	})
    	    );
    	    var _btnContainer = $(_.template(RowButtonContainerHTML)({
    	            obj: {
    	                id: "rdBtnContainer"
    	            }
    	        })
    	    );
    	    
    	    var _searchBtn = $(_.template(RowButtonHTML)({
    	            obj: {
    	                id: "rdSearchBtn",
    	                label: "검색"
    	            }
    	        })
	        );
	        _btnContainer.append(_searchBtn);
	        
    	    _row.append(_datepickerRange);
    	    _row.append(_btnContainer);
            this.progressbar = new ProgressbarView();
            
    	    _layout.append(_head);
    	    _layout.append(_row);
            _layout.append(_content);
            _layout.append(this.progressbar.render());

    	    $(this.el).append(_layout);
    	    
    	    var today = new Date();
    	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    	    $(this.el).find("#rdFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(firstDay).format("YYYY-MM-DD")
            });
            
            $(this.el).find("#rdToDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });
            
    	    var _gridSchema=Schemas.getSchema('grid');
        	that.grid= new Grid(_gridSchema.getDefault(that.gridOption));
            that.grid.render();
            
            
            return this;
     	},
    });
    return RawDataView;
});