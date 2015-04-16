/**
 * 근태 자료 관리
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'util',
        'schemas',
        'grid',
        'dialog',
        'datatables',
        'cmoment',
        'core/BaseView',
        'code',
        'i18n!nls/common',
        'text!templates/default/head.html',
        'text!templates/default/content.html',
        'text!templates/default/right.html',
        'text!templates/default/button.html',
        'text!templates/layout/default.html',      
        'text!templates/default/row.html',
        'text!templates/default/datepickerRange.html',
        'text!templates/default/rowbuttoncontainer.html',
        'text!templates/default/rowbutton.html',
        'models/sm/SessionModel',
        'models/cm/CommuteModel',
        'collection/cm/CommuteCollection',
        'views/cm/popup/CommuteUpdatePopupView',
        'views/cm/popup/CommentPopupView',
        'views/cm/popup/ChangeHistoryPopupView',
        'text!templates/cm/searchFormTemplate.html',
        'text!templates/cm/btnNoteCellTemplate.html'
], function(
		$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment,BaseView, Code, i18nCommon,
		HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
		SessionModel, CommuteModel, CommuteCollection,
		CommuteUpdatePopupView, CommentPopupView, ChangeHistoryPopupView,
		searchFormTemplate, btnNoteCellTemplate){

	
	// 출퇴근 시간 셀 생성
	function _createHistoryCell(cellType, cellData, change) {
		var text = null; 
		if(cellType == "overtime_code")
 			text = Code.getCodeName(Code.OVERTIME, cellData[cellType]);
 		else
 			text = _getTimeCell( cellData[cellType] );
 			
 		if(_.isNull(text)){
 			text = "-";	
 		}
 		
		if (cellData[change]){
			var data = JSON.stringify({
				change_column : cellType,
				idx : cellData.idx
			});
			var aHrefStr = "<a class='td-in-out-time' data='" + data +"'  href='-' onclick='return false'>" + text + "</a>";	
			return aHrefStr;
 		} else {
 			return text;
 		}
		 
	}
	
	// 시간 값을 두 줄로 표시 
	function _getTimeCell(time) {
		if (Util.isNotNull(time) ) {
			var tArr = time.split(" ");
			if (tArr.length == 2) {
				return tArr[0] + "</br>" + tArr[1]; 
			}else{
				return time;
			}
		}
		return null;
	}
	
	function _getTimeStr(min){
		
		var hour = Math.floor(min / 60);
		var minute = min % 60;
		var result = "";
		if(min >0){
			result += (hour < 10 ? "0"+ hour : hour) +":";
			result += (minute < 10 ? "0"+ minute : minute);
		}
		return result;
	}
		
	function _createCommentCell(cellData) {
		var data = {
			comment_count: cellData.comment_count,
			idx: cellData.idx,
			id: cellData.id,
			date: cellData.date,
			isShowEditBtn: (SessionModel.get("user").admin == 1)?true: false
		};
		var tpl = _.template(btnNoteCellTemplate)(data);
		return tpl;
	}
	
	function _getBrString(result){
		var resultArr = result.split(/(,|_| )/);
		if(resultArr.length > 1){
			result = "";
			for(var i =0; i < resultArr.length; i++){
				if(i % 2 == 1)
					continue;
				if(i == resultArr.length-1){
					result += resultArr[i];
				}else{
					result += resultArr[i] + "<br>";
				}
			}
		}
		return result;
	}
	
	function _getCommuteUpdateBtn(that) {
		return {
	        type:"custom",
	        name:"edit",
	        tooltip:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.TOOLTIP,
	        click:function(_grid){
	        	var selectItem =_grid.getSelectItem();	        	
	        	_openCommuteUpdatePopup(selectItem, that);
	        }
	    };
	}
	
	// 근태 수정 팝업 열기
	function _openCommuteUpdatePopup(selectItem, that) {
    	if ( Util.isNull(selectItem) ) {
			Dialog.warning(i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.NOTING_SELECTED);
			return;
    	}
    	
        var commuteUpdatePopupView = new CommuteUpdatePopupView(selectItem);
        Dialog.show({
            title:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.TITLE, 
            content: commuteUpdatePopupView,
            buttons: [{
                id: 'updateCommuteBtn',
                cssClass: Dialog.CssClass.SUCCESS,
                label: i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.BUTTON.MODIFY,
                action: function(dialog) {
                	commuteUpdatePopupView.updateCommute().done(function(result){
    					// console.log(result);
    					var current = result.models[0];
    					var yesterday = result.models[1];
    					current.set({idx : selectItem.idx});
    					that.grid.updateRow(current.attributes);
    					if(!_.isUndefined(yesterday)){
	    					var yesterdayRow = that.grid.getRowByFunction(
	    						function(idx, data, node){
	        						if(data.date === yesterday.get("date") && data.id === yesterday.get("id")){
	        							return true;
	        							
	        						}else{
	        							return false;
	        						}
	        					}
	        				);
	        				if(!_.isUndefined(yesterdayRow.data().idx)){
	        					yesterday.set({idx : yesterdayRow.data().idx});
		        				yesterdayRow.data(yesterday.attributes);
	        				}
    					}
						Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.UPDATE_COMPLETE, function() {
            				dialog.close();
            			});
    				}).fail(function(){

    				});
                }
            }, {
                label : i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.BUTTON.CANCEL,
                action : function(dialog){
                    dialog.close();
                }
            }]
        });
	}
	
	var commuteListView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		this.commuteCollection = new CommuteCollection();
    		this.gridOption = {
        		    el:"commute_content",
        		    id:"commuteDataTable",
        		    column:[
     	                   	{ data : "date", 			"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.DATE },
     	                   	{ data : "department", 		"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.DEPARTMENT },
     	                   	{ data : "name", 			"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.NAME },
     	                   	{ data : "work_type", 	"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.WORK_TYPE,
     	                   		render : function(data, type, full, meta){
     	                   			return _getBrString(Code.getCodeName(Code.WORKTYPE, data));
     	                   		}
     	                   	},
     	                   	{data: "vacation_code", title: i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.VACATION,
		                        "render": function (data, type, rowData, meta) {
		                            return Code.getCodeName(Code.OFFICE, data);
		                       }
		                    },
     	                   	{ data : "out_office_code", 	"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.OUT_OFFICE,
     	                   		render : function(data, type, full, meta){
     	                   			return Code.getCodeName(Code.OFFICE, data);
     	                   		}
     	                   	},
     	                   	{ data : "in_time", "title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.IN_TIME,
     	                   		render: function(data, type, full, meta) {
   	                    			return  _createHistoryCell("in_time", full,"in_time_change" );
     	                   		}
     	                    },
     	                    { data : "out_time", "title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.OUT_TIME,
     	                    	render: function(data, type, full, meta) {
									return _createHistoryCell("out_time", full, "out_time_change");
     	                   		}
     	                    },
     	                    { data : "late_time", 		"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.LATE_TIME,
     	                    	render: function(data, type, full, meta){
     	                    		return _getTimeStr(data);
     	                    	}
     	                    }, 
     	                   	{ data : "overtime_code", 		"title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.OVERTIME_CODE,
     	                   		render : function(data, type, full, meta){
     	                   			return _createHistoryCell("overtime_code", full, "overtime_code_change");
     	                   		}
     	                   	},
     	                    { data : "comment_count", "title" : i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.MEMO,
     	                     	render: function(data, type, full, meta) {
     	                     		return _createCommentCell(full);
     	                   		}
     	                     },
             	        ],
             	    rowCallback: function(row, data){
             	    	if(data.work_type == 21 || data.work_type == 22){ // 결근 처리
             	    		$(row).addClass("absentce");
             	    	}else{
             	    		$(row).removeClass("absentce");
             	    	}
             	    },
        		    collection:this.commuteCollection,
        		    dataschema:["date", "department", "name", "work_type_name", "vacation_name", "out_office_name", "overtime_pay", "late_time", "over_time", "in_time", "out_time", "comment_count"],
        		    detail: true,
        		    buttons:["search",{
        		    	type:"myRecord",
				        name: "myRecord",
				        filterColumn:["name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
				        tooltip: "",
        		    }],
        		    fetch: false,
        		    order : [[1, "asc"]]
        	};    		
    		this.buttonInit();
    	},
    	events: {
        	'click #ccmSearchBtn' : 'onClickSearchBtn',
        	'click #commuteDataTable .td-in-out-time' : 'onClickOpenChangeHistoryPopup',
        	'click #commuteDataTable .btn-comment-add' : 'onClickOpenInsertCommentPopup',
        	'click #commuteDataTable .btn-commute-edit' : 'onClickOpenUpdateCommutePopup', 
    	},
    	buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    if (SessionModel.get("user").admin == 1 ) {
    	    	this.gridOption.buttons.push(_getCommuteUpdateBtn(that));
    	    }
    	},
    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault(
    	    	{
    	    		title:i18nCommon.COMMUTE_RESULT_LIST.TITLE,
    	    		subTitle:i18nCommon.COMMUTE_RESULT_LIST.SUB_TITLE
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
    	                label: i18nCommon.COMMUTE_RESULT_LIST.SEARCH_BTN,
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
    	    
			var today = new Date();

    	    $(this.el).find("#ccmFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(today).add(-7,"days").format("YYYY-MM-DD")
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
            this.selectCommute();
			
            return this;
     	},
     	onClickSearchBtn: function(evt) {
     		this.selectCommute();
     	},
     	onClickOpenInsertCommentPopup: function(evt) {
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
     		// 0부터 시작
        	var selectItem = this.grid.getDataAt(data.idx-1);
        	
            var commentPopupView = new CommentPopupView(selectItem);
            var that = this;
            Dialog.show({
                title: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.TITLE, 
                content: commentPopupView,
                buttons: [{
                    id: 'updateCommuteBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.BUTTON.ADD,
                    action: function(dialog) {
                    	commentPopupView.insertComment({
                    		success: function(model, response) {
                    			Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.COMMENT_ADD_COMPLETE, function() {
                    				dialog.close();
                    				selectItem.comment_count++;	 // comment 수 증가 
                    				that.grid.updateRow(selectItem, selectItem.idx -1 );	// index 0부터 시작 
                    			});
                         	}, error : function(model, res){
                         		Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.COMMENT_ADD_FAIL);
                         	}
                        });
                    }
                }, {
                    label : i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.BUTTON.CANCEL,
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
     	},
     	onClickOpenUpdateCommutePopup: function(evt) {	// 근태 수정 팝업 
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
     		// 0부터 시작
        	var selectItem = this.grid.getDataAt(data.idx-1);
        	_openCommuteUpdatePopup(selectItem, this);
     	},
     	onClickOpenChangeHistoryPopup: function(evt) {
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
        	var selectItem = this.grid.getDataAt(data.idx-1); // 0부터 시작
			var searchData = {
					id : selectItem.id,
					year : selectItem.year, 
					date : selectItem.date,
					change_column : data.change_column
			};
        	
            var changeHistoryPopupView = new ChangeHistoryPopupView(searchData);
            var title = "";
            switch(data.change_column){
            	case "in_time" :
            		title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_IN;
            		break;
            	case "out_time" :
            		title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_OUT;
            		break;
            	case "overtime_code" :
            		title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_OVER;
            		break;
            }
            Dialog.show({
                title: title, 
                content: changeHistoryPopupView,
                buttons: [{
                    label : i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.BUTTON.CANCEL,
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
     	},
    	selectCommute: function() {
    		var data = {
     		    startDate : Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate()),
     		    endDate : Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate())
     		};
     		
     		if(data.startDate.isAfter(data.endDate)){
     			Dialog.warning("시작일자가 종료일자보다 큽니다.");
     			return;
     		}
     		
     		if(data.endDate.diff(data.startDate, 'days') > 92){
                Dialog.warning("검색 기간이 초과되었습니다. (최대 3개월)");
                return;
     		}
     		
            var _this = this;
            Dialog.loading({
                action:function(){
                    var dfd = new $.Deferred();
                    _this.commuteCollection.fetch({ 
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
	return commuteListView;
});
