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
        'data/code',
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
		$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment,BaseView, Code,
		HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
		SessionModel, CommuteModel, CommuteCollection,
		CommuteUpdatePopupView, CommentPopupView, ChangeHistoryPopupView,
		searchFormTemplate, btnNoteCellTemplate){

	
	// 출퇴근 시간 셀 생성
	function _createHistoryCell(cellType, cellData, change) {
		if (cellData[change]){
			var data = JSON.stringify({
				change_column : cellType,
				idx : cellData.idx
			});
			var aHrefStr = "<a class='td-in-out-time' data='" + data +"'  href='-' onclick='return false'>" + _getTimeCell( cellData[cellType] ) + "</a>";
			return aHrefStr;
 		} else {
 			return _getTimeCell( cellData[cellType] );
 		}
		 
	}
	
	// 시간 값을 두 줄로 표시 
	function _getTimeCell(time) {
		if (Util.isNotNull(time) ) {
			var tArr = time.split(" ");
			if (tArr.length == 2) {
				return tArr[0] + "</br>" + tArr[1]; 
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
	};
		
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
	        tooltip:"수정",
	        click:function(_grid){
	        	var selectItem =_grid.getSelectItem();	        	
	        	_openCommuteUpdatePopup(selectItem, that);
	        }
	    };
	}
	
	// 근태 수정 팝업 열기
	function _openCommuteUpdatePopup(selectItem, that) {
    	if ( Util.isNull(selectItem) ) {
			Dialog.warning("사원을 선택 하여 주시기 바랍니다.");
			return;
    	}
    	
        var commuteUpdatePopupView = new CommuteUpdatePopupView(selectItem);
        Dialog.show({
            title:"출퇴근시간 수정", 
            content: commuteUpdatePopupView,
            buttons: [{
                id: 'updateCommuteBtn',
                cssClass: Dialog.CssClass.SUCCESS,
                label: '수정',
                action: function(dialog) {
                	commuteUpdatePopupView.updateCommute().done(function(result){
    					// console.log(result);
    					var current = result.models[0];
    					var yesterday = result.models[1];
    					current.set({idx : selectItem.idx});
    					that.grid.updateRow(current.attributes);
    					var yesterdayRow = that.grid.getRowByFunction(
    						function(idx, data, node){
        						if(data.date === yesterday.get("date") && data.id === yesterday.get("id")){
        							return true;
        							
        						}else{
        							return false;
        						}
        					}
        				);
        				yesterday.set({idx : yesterdayRow.data().idx});
        				yesterdayRow.data(yesterday.attributes);
    					
						Dialog.show("성공", function() {
            				dialog.close();
            			})
    				}).fail(function(){

    				});
                }
            }, {
                label : "취소",
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
     	                   	{ data : "date", 			"title" : "일자" },
     	                   	{ data : "department", 		"title" : "부서" },
     	                   	{ data : "name", 			"title" : "이름" },
     	                   	{ data : "work_type", 	"title" : "근무</br>타입",
     	                   		render : function(data, type, full, meta){
     	                   			return _getBrString(Code.getCodeName(Code.WORKTYPE, data));
     	                   		}
     	                   	},
     	                   	{data: "vacation_code", title: "휴가",
		                        "render": function (data, type, rowData, meta) {
		                            return Code.getCodeName(Code.OFFICE, data);
		                       }
		                    },
     	                   	{ data : "out_office_code", 	"title" : "외근</br>정보",
     	                   		render : function(data, type, full, meta){
     	                   			return Code.getCodeName(Code.OFFICE, data);
     	                   		}
     	                   	},
     	                   	{ data : "in_time", "title" : "출근</br>시간",
     	                   		render: function(data, type, full, meta) {
   	                    			return  _createHistoryCell("in_time", full,"in_time_change" );
     	                   		}
     	                    },
     	                    { data : "out_time", "title" : "퇴근</br>시간",
     	                    	render: function(data, type, full, meta) {
									return _createHistoryCell("out_time", full, "out_time_change");
     	                   		}
     	                    },
     	                    { data : "late_time", 		"title" : "지각</br>시간",
     	                    	render: function(data, type, full, meta){
     	                    		return _getTimeStr(data);
     	                    	}
     	                    }, 
     	                   	{ data : "overtime_code", 		"title" : "초과</br>근무",
     	                   		render : function(data, type, full, meta){
     	                   			return Code.getCodeName(Code.OVERTIME, data);
     	                   		}
     	                   	},
     	                    { data : "comment_count", "title" : "비고",
     	                     	render: function(data, type, full, meta) {
     	                     		return _createCommentCell(full);
     	                   		}
     	                     },
     	                     {"title": "출근타입", "data": "in_time_type", visible: false},
                    		 {"title": "퇴근타입", "data": "out_time_type" , visible: false},
             	        ],
             	    rowCallback: function(row, data){
             	    	if(data.work_type == 21 || data.work_type == 22){ // 결근 처리
             	    		$(row).css("background-color", "rgb(236, 131, 131)");
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
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리 ", subTitle:"근태 자료 조회"})));
    	    
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
    	                label: "검색"
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
    	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    	    
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
                title:"Comment 등록", 
                content: commentPopupView,
                buttons: [{
                    id: 'updateCommuteBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: '수정',
                    action: function(dialog) {
                    	commentPopupView.insertComment({
                    		success: function(model, response) {
                    			Dialog.show("성공", function() {
                    				dialog.close();
                    				selectItem.comment_count++;	 // comment 수 증가 
                    				that.grid.updateRow(selectItem, selectItem.idx -1 );	// index 0부터 시작 
                    			});
                         	}, error : function(model, res){
                         		Dialog.show("업데이트가 실패했습니다.");
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
            Dialog.show({
                title: ( (data.change_column == "in_time")? "출근 시간 변경 이력":"퇴근 시간 변경 이력" ), 
                content: changeHistoryPopupView,
                buttons: [{
                    label : "취소",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            });
     	},
    	selectCommute: function() {
    		var data = {
     		    startDate : $(this.el).find("#ccmFromDatePicker").data("DateTimePicker"),
     		    endDate : $(this.el).find("#ccmToDatePicker").data("DateTimePicker")
     		};
     		   		
     		data.startDate.getText() === "" ? null : data.startDate = data.startDate.getDate().format("YYYY-MM-DD");
     		data.endDate.getText() === "" ? null : data.endDate = data.endDate.getDate().format("YYYY-MM-DD");
     		
     		if (_.isNull(data.startDate) || _.isNull(data.endDate)) {
     			Dialog.error("시작일 / 종료일을 입력해 주십시오");
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
                    Dialog.error("데이터 조회 실패! \n ("+ response.responseJSON.message +")");
                },
            });
            
    	//     this.progressbar.disabledProgressbar(false);
     //		var data = {
     //		    startDate : $(this.el).find("#ccmFromDatePicker").data("DateTimePicker"),
     //		    endDate : $(this.el).find("#ccmToDatePicker").data("DateTimePicker")
     //		};
     		   		
     //		data.startDate.getText() === "" ? null : data.startDate = data.startDate.getDate().format("YYYY-MM-DD");
     //		data.endDate.getText() === "" ? null : data.endDate = data.endDate.getDate().format("YYYY-MM-DD");
     		
     //		if (_.isNull(data.startDate) || _.isNull(data.endDate)) {
     //			Dialog.error("시작일 / 종료일을 입력해 주십시오");
     //			return;
     //		}
     		
     //       var _this = this;
     //		this.commuteCollection.fetch({ 
     //			data: data,
	 			// success: function(result) {
	 			// 	_this.grid.render();
	 			// 	_this.progressbar.disabledProgressbar(true);
	 			// },
	 			// error : function(result) {
	 			// 	alert("데이터 조회가 실패했습니다.");
	 			// }
     //		});     		
     		
    	}
	});
	return commuteListView;
});