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
        'moment',
        'core/BaseView',
        'text!templates/default/head.html',
        'text!templates/default/content.html',
        'text!templates/default/right.html',
        'text!templates/default/button.html',
        'text!templates/layout/default.html',        
        'models/cm/CommuteModel',
        'collection/cm/CommuteCollection',
        'views/cm/popup/CommuteUpdatePopupView',
        'views/cm/popup/CommentPopupView',
        'views/cm/popup/ChangeHistoryPopupView',
        'text!templates/cm/searchFormTemplate.html',
        'text!templates/cm/btnCommentAddTemplate.html'
], function(
		$,
		_,
		Backbone, 
		Util, 
		Schemas,
		Grid,
		Dialog,
		Datatables,
		Moment,
		BaseView,
		HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,
		CommuteModel, 
		CommuteCollection,
		CommuteUpdatePopupView,
		CommentPopupView,
		ChangeHistoryPopupView,
		searchFormTemplate,
		btnCommentAddTemplate){

	// 분 -> 시간 
	function _getMinToHours(inMin) {
		if ( Util.isNotNull(inMin) ) {
			inMin = parseInt( inMin);				
			if (inMin === NaN) {
				inMin = 0;
			}	
		} else {
			inMin = 0;
		}
		var min = inMin % 60;
		var hours = inMin / 60;
		hours = parseInt(hours);
		
		min = (min == 0)? '': (" " + min + "분");
		hours = (hours == 0)? '': (hours + "시간");
		return hours + min;
	}
	
	// 출퇴근 시간 셀 생성
	function _createHistoryCell(cellType, cellData) {
		 var data = JSON.stringify({
			 change_column : cellType,
			 idx : cellData.idx
 		 });
		 
 		 var aHrefStr = "<a class='td-in-out-time' data='" + data +"'  href='-' onclick='return false'>" + cellData[cellType] + "</a>";
 		 return aHrefStr;
	}
	
	// comment Cell 페이지 링크 
	function _createCommentCell(cellData) {
		 var data = JSON.stringify({
			 idx : cellData.idx
		 });
		 var aHrefStr = "<a class='td-comment' data='" + data +"'  href='-' onclick='return false'>" + cellData.comment_count + " 건</a>";
		 return aHrefStr;
	}
	
	// comment Cell 추가 팝어 버튼 
	function _createCommentCellAddBtn(cellData, tpl) {
		 var data = JSON.stringify({
			 idx : cellData.idx
		 });
		 var tp = $(tpl);
		 tp.find(".btn").attr("data", data);
		 return tp.html();
	}

	var commuteListView = BaseView.extend({
        el:$(".main-container"),
    	initialize:function(){
    		this.commuteCollection = new CommuteCollection();
    		this.gridOption = {
        		    el:"commute_content",
        		    id:"commuteDataTable",
        		    column:[
//      	                   { data : "year", 			"title" : "년", visible: false},
     	                   { data : "date", 			"title" : "일자" },
     	                   { data : "department", 		"title" : "부서" },
//     	                   { data : "id", 				"title" : "ID", visible: false },
     	                   { data : "name", 			"title" : "이름", 
     	                	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
    	                            $(nTd).html(oData.name + "</br>(" +oData.id + ")");
    	                       }
     	                   },
     	                   { data : "work_type_name", 	"title" : "근무</br>타입"},
     	                   { data : "vacation_name", 	"title" : "휴가</br>타입"},
     	                   { data : "out_office_name", 	"title" : "외근</br>정보"},
     	                   { data : "overtime_pay", 	"title" : "초과</br>근무수당",
     	                    	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
       	                            $(nTd).html(oData.overtime_pay + " 원");
       	                        }
     	                   },
     	                   { data : "late_time", 		"title" : "지각</br>시간"},
     	                   { data : "over_time", 		"title" : "초과</br>근무시간",
     	                	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
     	                		   $(nTd).html(  _getMinToHours(oData.over_time));
     	                	   }
     	                   },
     	                   { data : "in_time", "title" : "출근시간",
     	                	   fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                    		 if (oData.in_time_change){
     	                    			$(nTd).html( _createHistoryCell("in_time", oData) );
     	                    		 } else {
     	                    			$(nTd).html(oData.in_time);
     	                    		 }
     	                        }
     	                     },
     	                     { data : "out_time", "title" : "퇴근시간",
     	                    	 fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                    		 if (oData.out_time_change) {
     	                    			$(nTd).html( _createHistoryCell("out_time", oData) );
     	                    		 } else {
     	                    			$(nTd).html(oData.out_time);
     	                    		 }
     	                        }
     	                     },
     	                     { data : "comment_count", "title" : "Comment",
     	                    	 fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
     	                            if (oData.comment_count) {
     	                            	$(nTd).html(_createCommentCell(oData) + _createCommentCellAddBtn(oData, btnCommentAddTemplate));
     	                            } else {
     	                            	$(nTd).html("0 건" + _createCommentCellAddBtn(oData, btnCommentAddTemplate) );
     	                            }
     	                        }
     	                     }
//     	                     { data : "in_time_change", "title" : "", visible: false},
//     	                     { data : "out_time_change", "title" : "", visible: false}   
             	        ],
        		    collection:this.commuteCollection,
        		    detail: true,
        		    buttons:["search","refresh"],
        		    fetch: false
        	};    		
    		this.buttonInit();
    	},
    	events: {
        	'click #btnSearch' : 'onClickSearchBtn',
        	'click #commuteDataTable .td-in-out-time' : 'onClickOpenChangeHistoryPopup',
        	'click #commuteDataTable .btn-comment-add' : 'onClickOpenInsertCommentPopup'
    	},
    	buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"edit",
    	        click:function(_grid){
    	        	var selectItem =_grid.getSelectItem();
    	            var commuteUpdatePopupView = new CommuteUpdatePopupView(selectItem);
    	            Dialog.show({
    	                title:"연차 수정", 
                        content: commuteUpdatePopupView,
                        buttons: [{
                            id: 'updateCommuteBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '수정',
                            action: function(dialog) {
                            	commuteUpdatePopupView.updateCommute({
                            		success: function(model, response) {
                            			Dialog.show("성공", function() {
                            				dialog.close();
                            				that.selectCommute();
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
    	        }
    	    });
    	},
    	render:function(){
    	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"연차 관리 ", subTitle:"연차 관리"})));
    	    
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
      	    
    	    var $searchForm = $(searchFormTemplate);
    	        	    
    		var today = new Moment().format("YYYY-MM-DD");
    		$searchForm.find('#startDate').val( today.toString() );
    		$searchForm.find('#endDate').val( today.toString() );

    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append($searchForm);
    	    _layOut.append(_content);
    	      	    
    	    $(this.el).html(_layOut);

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
                    				that.selectCommute();
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
     	onClickOpenChangeHistoryPopup: function(evt) {
			var data = JSON.parse( $(evt.currentTarget).attr('data') );
        	var selectItem = this.grid.getItemAt(data.idx-1); // 0부터 시작
			var searchData = {
					id : selectItem.id,
					year : selectItem.year, 
					date : selectItem.date,
					change_column : data.change_column
			};
        	
            var changeHistoryPopupView = new ChangeHistoryPopupView(searchData);
            var that = this;
            Dialog.show({
                title: ( (data.change_column == "in_time")? "출근 시간 변경 이력":"퇴근 시간 변경 이력" ), 
                content: changeHistoryPopupView,
                buttons: [{
                    label : "취소",
                    action : function(dialog){
                        dialog.close();
                    }
                }]
            }, function() {
            	alert(1);
            })
     	},
     	getSearchForm: function() {	// 검색 조건  
     		var data = Util.getFormJSON( this.$el.find('.form-inline'));
     		
     		if ( Util.isNull(data.startDate) ) {
     			alert("검색 시작 날짜를 선택해주세요");
     			return null;
     		} else if ( Util.isNull(data.endDate) ) {
     			alert("검색 끝 날짜를 선택해주세요");
     			return null;
     		}
     		
     		return data;
     	},
    	selectCommute: function() {
     		var data = this.getSearchForm();     		
     		if (Util.isNull (data) ) {
     			return;
     		}
     		
            var _this = this;
     		this.commuteCollection.fetch({ 
     			data: data,
	 			success: function(result) {
	 				_this.grid.render();
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		});     		
     		
    	}
	});
	return commuteListView;
});