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
        'moment',
        'core/BaseView',
        'text!templates/default/head.html',
        'text!templates/default/content.html',
        'text!templates/layout/default.html',
        'text!templates/default/row.html',
        'text!templates/default/datepickerRange.html',
        'text!templates/default/rowbuttoncontainer.html',
        'text!templates/default/rowbutton.html',
        'models/sm/SessionModel',
        'collection/cm/CommentCollection',
        'views/cm/popup/CommentUpdatePopupView',
        'text!templates/cm/searchFormTemplate.html'
], function(
		$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, 
		BaseView,
		HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML,
		SessionModel, CommentCollection,
		CommentUpdatePopupView,	searchFormTemplate){
	
	function _getCommentUpdateBtn(that){
		return {
	        type:"custom",
	        name: (SessionModel.get("user").admin == 1)?"edit" : "read",
	        click:function(_grid){
	        	var selectItem =_grid.getSelectItem();
	        	if ( Util.isNull(selectItem) ) {
        			Dialog.warning("사원을 선택 하여 주시기 바랍니다.");
        			return;
	        	}
	        	
	            var commentUpdatePopupView = new CommentUpdatePopupView(selectItem);	            
	            var buttons = [];
	            
	            if(SessionModel.get("user").admin == 1) {
	            	buttons.push({
                        id: 'updateCommentBtn',
                        cssClass: Dialog.CssClass.SUCCESS,
                        label: '수정',
                        action: function(dialog) {
                        	commentUpdatePopupView.updateComment({
                        		success: function(model, response) {
                        			if (Util.isNull( response["error"] )) {
                            			Dialog.show("성공", function() {
                            				dialog.close();
                            				that.selectComments();
                            			});                        				
                        			} else {
                						Dialog.warning("Error: " + response["error"]);
                        			}
                             	}, error : function(model, res){
                             		Dialog.show("업데이트가 실패했습니다.");
                             	}
                            });
                        }
                    });
	            }
	            buttons.push({
                    label : "취소",
                    action : function(dialog){
                        dialog.close();
                    }
                });
	            
	            Dialog.show({
	                title:"Comment 입력", 
                    content: commentUpdatePopupView,
                    buttons: buttons
	            });
	        }
	    };
	}

	var CommuteCommentView = BaseView.extend({
		el:$(".main-container"),
		initialize:function(){
    		this.commentCollection = new CommentCollection();
    		this.gridOption = {
        		    el: "commute_content",
        		    id: "commuteDataTable",
        		    column:[
     			           { data : "date", "title" : "일자" },
    			           { data : "name", "title" : "이름",
     			        	   render: function(data, type, full, meta) {
    			        		   return full.name + "</br>(" + full.id +")";
    			        	   }
    			           },
    			           { data : "comment", "title" : "접수내용",
     			        	   render: function(data, type, full, meta) {
    			        		   var comment = full.comment; 
    			        		   if (comment.length > 7) {
    			        			   comment = comment.substring(0, 10) + "...";
    			        		   }
    			        		   return comment;
    			        	   }
    			           },
    			           { data : "writer_name", "title" : "작성자",
     			        	   render: function(data, type, full, meta) {
    			        		   return full.writer_name + "</br>(" + full.writer_id +")";
    			        	   }
    			           },
    			           { data : "comment_date", "title" : "신청일자"},
    			           { data : "comment_reply", "title" : "처리내용",
     			        	   render: function(data, type, full, meta) {
    			        		   var comment_reply = full.comment_reply; 
    			        		   if (comment_reply.length > 7) {
    			        			   comment_reply = comment_reply.substring(0, 10) + "...";
    			        		   }
    			        		   return comment_reply;
    			        	   }    			        	   
    			           },
    			           { data : "reply_name", "title" : "답변자",
     			        	   render: function(data, type, full, meta) {
    			        		   if (full.reply_id == "" || full.reply_name == "") {
    			        			   return "";
    			        		   } else {
    			        			   return full.reply_name + "</br>(" + full.reply_id +")";  
    			        		   }
    			        	   }
    			           },
    			           { data : "comment_reply_date", "title" : "업데이트일자"},
    			           { data : "state", "title" : "처리상태"}
             	        ],
        		    collection: this.commentCollection,
        		    dataschema:["date", "name", "comment", "writer_name", "comment_date", "comment_reply", "reply_name", "comment_reply_date", "state"],
        		    detail: true,
        		    buttons: ["search"],
        		    fetch: false
        	};    		
    		this.buttonInit();
		},
		events: {
			'click #ccmSearchBtn' : 'onClickSearchBtn'
		},
		buttonInit: function(){
    	    var that = this;
    	    // tool btn
    	    this.gridOption.buttons.push( _getCommentUpdateBtn(that) );
    	},
		render: function(){
	   	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"연차 관리 ", subTitle:"Comment 관리"})));
    	    
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
    	    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
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

            this.selectComments();
            return this;
    	},
    	onClickSearchBtn: function() {
    		this.selectComments();
    	},
     	getSearchForm: function() {	// 검색 조건
     		var data = {
     		    startDate : $(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD"),
     		    endDate : $(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD")
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
	 			},
	 			error : function(result) {
	 				alert("데이터 조회가 실패했습니다.");
	 			}
     		}); 
     	}
    });
	
	return CommuteCommentView;
});