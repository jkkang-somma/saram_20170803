/**
 * Comment 관리
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
        'lib/component/form',
        'i18n!nls/common',
        'core/BaseView',
        'text!templates/default/head.html',
        'text!templates/default/content.html',
        'text!templates/layout/default.html',
        'text!templates/default/row.html',
        'text!templates/default/rowdatepickerRange.html',
        'text!templates/default/rowbuttoncontainer.html',
        'text!templates/default/rowbutton.html',
        'models/sm/SessionModel',
        'collection/cm/CommentCollection',
        'views/cm/popup/CommentUpdatePopupView',
        'text!templates/cm/searchFormTemplate.html'
], function(
		$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment,
		Form, i18Common, 
		BaseView,
		HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
		SessionModel, CommentCollection,
		CommentUpdatePopupView,	searchFormTemplate){

	var _currentFilter=0;
	function _getGridFilterBtn() {	// 검색 필터 
		var STATE = i18Common.COMMENT.STATE;
	    var _filterText=[STATE.ALL, STATE.ACCEPTING, STATE.PROCESSING, STATE.COMPLETE];
	    return {//User Remove
	        type:"custom",
	        name:"filter",
	        tooltip:"처리상태",
	        filterBtnText:_filterText,
	        click:function(_grid, _button){
        	  
	           var filters=[
	                function(data){
	                    return _getClickFilterResult(data, "");
	                },
	                function(data){
	                    return _getClickFilterResult(data, STATE.ACCEPTING);
	                },
	                function(data){
						return _getClickFilterResult(data, STATE.PROCESSING);	
	                    // return (_data == STATE.PROCESSING)?true:false;
	                },
	                function(data){
						return _getClickFilterResult(data, STATE.NPROCESSING);	
	                },
	                function(data){
						return _getClickFilterResult(data, STATE.COMPLETE);	
	                    // return (_data == STATE.COMPLETE)?true:false;
	                }
	           ];
	           
               if (_currentFilter==3){
                    _currentFilter=0;
               } else {
	                _currentFilter++;
               }
               
               _button.html(_filterText[_currentFilter]);
               var filteredData = _grid.filtering(function(data){
                   var fn=filters[_currentFilter];
                   return fn(data);
               },"state");
            }
	    };
	}
	function _getClickFilterResult(data, value){
		var _data= (value == "")? "" : data[9];
       	var result = (_data == value )?true:false;
       	return result;
	}
	function _getCommentUpdateBtn(view){	// comment 수정 
		var that = view;
		return {
	        type:"custom",
	        name: (SessionModel.get("user").admin == 1)?"edit" : "read",
	        tooltip: (SessionModel.get("user").admin == 1)?"답변달기" : "상세보기",
	        click:function(_grid){
	        	var selectItem =_grid.getSelectItem();
	        	_clickCommentUpdateBtn(that, selectItem);
	        }
	    };
	}
	
	function _clickCommentUpdateBtn(view, selectItem ){
		if ( Util.isNull(selectItem) ) {
			Dialog.warning("사원을 선택 하여 주시기 바랍니다.");
			return;
    	}
    	
        var commentUpdatePopupView = new CommentUpdatePopupView(selectItem);	            
        var buttons = [];
        
        if(selectItem.state != "처리"){
        	if(SessionModel.get("user").id == selectItem.approval_id && selectItem.state == "상신"){ // 결재자인 경우
            	buttons.push({
                    id: 'updateCommentBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: '결재',
                    action: function(dialog) {
                    	commentUpdatePopupView.approvalComment().done(function(result){
                    		view.grid.updateRow(result.attributes[0]);	// 업데이트 후 재조회한 데이터 
                			Dialog.show("결재가 완료되었습니다..");
            				dialog.close();
                        }).fail(function(){
                        	Dialog.show("결재가 실패했습니다.");
                        });
                    }
                });
            	buttons.push({
                    id: 'updateCommentBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: '반려',
                    action: function(dialog) {
                    	commentUpdatePopupView.NapprovalComment().done(function(result){
                    		view.grid.updateRow(result.attributes[0]);	// 업데이트 후 재조회한 데이터 
                			Dialog.show("결재가 반려되었습니다..");
            				dialog.close();
                        }).fail(function(){
                        	Dialog.show("결재가 실패했습니다.");
                        });
                    }
                });
            }else if(SessionModel.get("user").admin == 1 && selectItem.state == "결재" && selectItem.state != "반려"){ // 관리자인 경우
            	buttons.push({
                    id: 'updateCommentBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: '처리',
                    action: function(dialog) {
                    	commentUpdatePopupView.updateComment().done(function(result){
                			view.grid.updateRow(result.attributes[0]);	// 업데이트 후 재조회한 데이터 
            				dialog.close();
                        }).fail(function(){
                        	Dialog.show("처리에 실패했습니다.");
                        });
                    }
                });
            }else if(SessionModel.get("user").id == selectItem.writer_id && selectItem.state == "상신"){
            	buttons.push({
                    id: 'updateCommentBtn',
                    cssClass: Dialog.CssClass.SUCCESS,
                    label: '상신취소',
                    action: function(dialog) {
                    	commentUpdatePopupView.NACCEPTING().done(function(result){
                			view.grid.updateRow(result.attributes[0]);	// 업데이트 후 재조회한 데이터 
                			Dialog.show("상신이 취소되었습니다..");
            				dialog.close();
                        }).fail(function(){
                        	Dialog.show("처리에 실패했습니다.");
                        });
                    }
                });
            }	
        }
        
        buttons.push({
            label : "취소",
            action : function(dialog){
                dialog.close();
            }
        });
        
        Dialog.show({
            title:"Comment 처리", 
            content: commentUpdatePopupView,
            buttons: buttons
        });
	}
	
	var CommuteCommentView = BaseView.extend({
		el:$(".main-container"),
		setSearchParam : function(searchParam) {
			this.searchParam = searchParam; // url + 검색 조건으로 페이지 이동시 조건감들 {id: id, date: date}
		},
		initialize:function(){
    		this.commentCollection = new CommentCollection();
    		this.gridOption = {
        		    el: "commute_content",
        		    id: "commuteDataTable",
        		    column:[
        		    	   { data : "comment_date", "title" : "신청일자", 
        		    	   		render: function(data, type, full, meta) {
    			        		   return Moment(data).format("YYYY-MM-DD<br>HH:mm");
    			        	   }
        		    	   },
    			           { data : "name", "title" : "이름"},
    			           { data : "date", "title" : "일자" },
    			           { data : "comment", "title" : "접수내용",
     			        	   render: function(data, type, full, meta) {
    			        		   var comment = full.comment; 
    			        		   if (comment.length > 7) {
    			        			   comment = comment.substring(0, 10) + "...";
    			        		   }
    			        		   return comment;
    			        	   }
    			           },
    			           { data : "writer_name", "title" : "작성자" },
    			           { data : "comment_reply", "title" : "처리내용",
     			        	   render: function(data, type, full, meta) {
    			        		   var comment_reply = full.comment_reply; 
    			        		   if (comment_reply.length > 7) {
    			        			   comment_reply = comment_reply.substring(0, 10) + "...";
    			        		   }
    			        		   return comment_reply;
    			        	   }    			        	   
    			           },
    			           { data : "comment_reply_date", "title" : "처리일자"},
    			           { data : "approval_name", "title" : "결재자" },
    			           { data : "state", "title" : "처리상태", "render": function(data, type, row){
					           var dataVal = "<div style='text-align: center;'>" + row.state + "</div>";
					           dataVal += "<div style='text-align: center;'>";
					           dataVal +=  "<button class='btn list-detailComm-btn btn-default btn-sm' id='btnDetail"+row.doc_num+"'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button>";
					           dataVal +=  "</div>";
					          return dataVal;
				         	}}
             	        ],
        		    collection: this.commentCollection,
        		    dataschema:["date", "name", "comment", "writer_name", "comment_date", "comment_reply", "approval_name", "comment_reply_date", "state"],
        		    detail: true,
        		    buttons: ["search",{
        		    	type:"myRecord",
				        name: "myRecord",
				        filterColumn:["name", "approval_name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
				        tooltip: "",
        		    }],
        		    fetch: false
        	};    		
    		this.buttonInit();
		},
		events: {
			'click #ccmSearchBtn' : 'onClickSearchBtn',
			'click .list-detailComm-btn' : 'onClickListDetailCommBtn'
		},
		buttonInit: function(){
    	    // tool btn
			this.gridOption.buttons.push( _getGridFilterBtn() );
    	    this.gridOption.buttons.push( _getCommentUpdateBtn(this) );
    	},
		render: function(){
	   	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"근태 관리", subTitle:"Comment 관리"})));
    	    
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
            firstDay.setMonth(firstDay.getMonth()-1);
    	    $(this.el).find("#ccmFromDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD",
		        defaultDate: Moment(firstDay).format("YYYY-MM-DD")
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

            if (Util.isNotNull(this.searchParam) ) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
            	$(this.el).find("#ccmFromDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
     		    $(this.el).find("#ccmToDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
            }
            
            this.selectComments();
            return this;
    	},
    	
    	onClickSearchBtn: function() {
    		this.selectComments();
    	},
    	
    	onClickListDetailCommBtn : function(evt){
    		evt.stopPropagation();
    		var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
	        $('.selected').removeClass('selected');
	        $currentTarget.addClass('selected');
	        var selectData=this.grid.getSelectItem();
	        _clickCommentUpdateBtn(this, selectData);
    	},
    	
     	getSearchForm: function() {	// 검색 조건
     		var data = {
     		    startDate : $(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD"),
     		    endDate : $(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD")
     		}
     		
     		if (Util.isNotNull(this.searchParam) ) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
     			data.id = this.searchParam.id;
     		}
     		
     		if ( Util.isNull(data.startDate) ) {
     			alert("검색 시작 날짜를 선택해주세요");
     			return null;
     		} else if ( Util.isNull(data.endDate) ) {
     			alert("검색 끝 날짜를 선택해주세요");
     			return null;
     		}
     		
     		return data;
     	},
     	selectComments: function() {	// 데이터 조회
     		var data = this.getSearchForm();     		
     		if (Util.isNull (data) ) {
     			return;
     		}

            var _this = this;
     		this.commentCollection.fetch({ 
     			data: data,
	 			success: function(result) {
	 				_this.grid.render();
	 				
		     		if (Util.isNotNull(_this.searchParam) ) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
	 					_this.searchParam = null; // url 접속 - 최초 검색 후 초기화
	 					
	 					// URL 접속시 필터를 전체로 변경하기 위해 강제 크릭 
	 					var filterBtn =$(_this.el).find("#commuteDataTable_custom_myRecord_Btn");
	 					if(filterBtn.text() =="나")
		 					$(_this.el).find("#commuteDataTable_custom_myRecord_Btn").trigger("click");	
	 				}
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		}); 
     	}
    });
	
	return CommuteCommentView;
});