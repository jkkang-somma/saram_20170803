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
        'text!templates/default/right.html',
        'text!templates/default/button.html',
        'text!templates/layout/default.html',
        'collection/cm/CommentCollection',
        'views/cm/popup/CommentUpdatePopupView',
        'text!templates/cm/searchFormTemplate.html'
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
		CommentCollection,
		CommentUpdatePopupView,
		searchFormTemplate){

	var CommuteCommentView = BaseView.extend({
		el:$(".main-container"),
		initialize:function(){
    		this.commentCollection = new CommentCollection();
    		this.gridOption = {
        		    el: "commute_content",
        		    id: "commuteDataTable",
        		    column:[
        		           { data : "year", "title" : "년" },
     			           { data : "date", "title" : "일자" },
    			           { data : "id", "title" : "ID" },
    			           { data : "name", "title" : "이름"},
    			           { data : "comment", "title" : "접수내용"},
    			           { data : "comment_reply", "title" : "처리내용"},
    			           { data : "comment_date", "title" : "신청일자"},
    			           { data : "comment_reply_date", "title" : "업데이트일자"},
    			           { data : "state", "title" : "처리상태"}   
             	        ],
        		    collection: this.commentCollection,
        		    detail: true,
        		    buttons: ["search","refresh"],
        		    fetch: false
        	};    		
    		this.buttonInit();
		},
		events: {
			'click #btnSearch' : 'onClickSearchBtn'
		},
		buttonInit: function(){
    	    var that = this;
    	    this.gridOption.buttons.push({
    	        type:"custom",
    	        name:"edit",
    	        click:function(_grid){
    	        	var selectItem =_grid.getSelectItem();
    	            var commentUpdatePopupView = new CommentUpdatePopupView(selectItem);
    	            Dialog.show({
    	                title:"Comment 업데이트", 
                        content: commentUpdatePopupView,
                        buttons: [{
                            id: 'updateCommentBtn',
                            cssClass: Dialog.CssClass.SUCCESS,
                            label: '수정',
                            action: function(dialog) {
                            	commentUpdatePopupView.updateComment({
                            		success: function(model, response) {
                            			Dialog.show("성공", function() {
                            				dialog.close();
                            				that.selectComments();
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
		render: function(){
	   	    //var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"연차 관리 ", subTitle:"Comment 관리"})));
    	    
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

            this.selectComments();
            return this;
    	},
    	onClickSearchBtn: function() {
    		this.selectComments();
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