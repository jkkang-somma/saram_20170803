define([
	'jquery',
	'underscore',
	'backbone',
	'core/BaseView',
	'cmoment',
	'grid',
	'lodingButton',
	'schemas',
	'i18n!nls/common',
	'dialog',
	'text!templates/default/head.html',
	'text!templates/default/row.html',
	'text!templates/default/rowdatepickerRange.html',
	'text!templates/default/rowbuttoncontainer.html',
	'text!templates/default/rowbutton.html',
	'text!templates/default/content.html',
	'text!templates/layout/default.html',
	'models/cm/CommuteTodayModel',
	'collection/cm/CommuteTodayCollection',
	'text!templates/default/button.html',
	], function($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, i18nCommon, Dialog, HeadHTML, RowHTML, 
		DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, ContentHTML, LayoutHTML, 
		CommuteTodayModel, CommuteTodayCollection, ButtonHTML){
		
		var commuteTodayView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		this.commuteTodayCollection = new CommuteTodayCollection();
    		this.gridOption = {
        		    el:"commute_content",
        		    id:"commuteDataTable",
        		    column:[
     	                   	{ data : "date",            "title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.DATE },
     	                   	{ data : "dept_name", 		"title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.DEPARTMENT },
                            { data : "name",            "title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.NAME },
     	                   	{ data : "out_office_name", "title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.OUT_OFFICE },
     	                   	{ data : "start_time", 		"title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.START_TIME },
     	                   	{ data : "end_time", 		"title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.END_TIME },
     	                   	{ data : "memo", 			"title" : i18nCommon.COMMUTE_TODAY_LIST.GRID_COL_NAME.MEMO, 
                               render: function(data, type, full, meta) {
                                       var memo = full.memo; 
                                       if (memo.length > 16) {
                                          memo = memo.substring(0, 16) + "...";
                                       }
                                       return memo;
                                   }},
             	        ],
             	    rowCallback: function(row, data){
             	    	// if(data.work_type == 21 || data.work_type == 22){ // 결근 처리
             	    	// 	$(row).addClass("absentce");
             	    	// }else{
             	    	// 	$(row).removeClass("absentce");
             	    	// }
             	    },
        		    collection:this.commuteTodayCollection,
        		    dataschema:["id", "date", "name", "dept_name", "out_office_name", "start_time", "end_time", "memo"],
        		    detail: true,
        		    fetch: false,
        		    order : [[1, "asc"],[2, "asc"],[3, "asc"]]
        	};    		
    		this.buttonInit();
    	},
    	events: {
        	'click #ccmSearchBtn' : 'onClickSearchBtn',
    	},
    	buttonInit: function(){
    	    // var that = this;
    	    // // tool btn
    	    // if (SessionModel.get("user").admin == 1 ) {
    	    // 	this.gridOption.buttons.push(_getCommuteUpdateBtn(that));
    	    // }
    	},
    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault(
    	    	{
    	    		title:i18nCommon.COMMUTE_TODAY_LIST.TITLE,
    	    		subTitle:i18nCommon.COMMUTE_TODAY_LIST.SUB_TITLE
    	    	}
   	    	)));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");

 			var _row=$(RowHTML);
    	    var _datepickerRange=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			fromId : "ccmFromDatePicker",
    	    			toId : "ccmToDatePicker"
    	    		}
    	    	})
    	    );
    	    var _btnContainer = $(_.template(RowButtonContainerHTML)({
    	            obj: {
    	                id: "ccmBtnContainer"
    	            }
    	        })
    	    );
    	    
    	    var _searchBtn = $(_.template(RowButtonHTML)({
    	            obj: {
    	                id: "ccmSearchBtn",
    	                label: i18nCommon.COMMUTE_TODAY_LIST.SEARCH_BTN,
    	            }
    	        })
	        );
	        _btnContainer.append(_searchBtn);
	        
    	    _row.append(_datepickerRange);
    	    _row.append(_btnContainer);
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    
    	    
    	    _layOut.append(_head);
    	    _layOut.append(_row);
    	    _layOut.append(_content);
    	    

    	    $(this.el).html(_layOut);
    
    		// datePkcker 초기화	    
			var today = new Date();

    	    $(this.el).find("#ccmFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        // defaultDate: Moment(today).add(-7,"days").format("YYYY-MM-DD")
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });
            
            $(this.el).find("#ccmToDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).format("YYYY-MM-DD")
            });
            
    	    var _gridSchema=Schemas.getSchema('grid');
    	    this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
            this.grid.render();
            this.selectCommuteToday();
			
            return this;
     	},
     	onClickSearchBtn: function(evt) {
     		this.selectCommuteToday();
     	},
    	selectCommuteToday: function() {
    		var data = {
     		    startDate : Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate()),
     		    endDate : Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate()),
     		};
     		
     		if(data.startDate.isAfter(data.endDate)){
     			Dialog.warning("시작일자가 종료일자보다 큽니다.");
     			return;
     		}
     		
     		data.startDate = data.startDate.format("YYYY-MM-DD");
     		data.endDate = data.endDate.format("YYYY-MM-DD");
     		
            var _this = this;
            Dialog.loading({
                action:function(){
                    var dfd = new $.Deferred();
                    _this.commuteTodayCollection.fetch({ 
		     			data: data,
		     			success: function(){
                            dfd.resolve();
                        }, error: function(){
                            dfd.reject();
                        }
		     		});
		     		return dfd.promise();
        	    },
        	    
                actionCallBack:function(res){//response schema
                    _this.grid.render();
                },
                errorCallBack:function(response){
                    Dialog.error(i18nCommon.COMMUTE_RESULT_LIST.MSG.GET_DATA_FAIL);
                },
            });
    	}
	});
	return commuteTodayView;
});