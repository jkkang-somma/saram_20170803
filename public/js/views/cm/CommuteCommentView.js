/**
 * Comment 관리
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'core/BaseView',
  'collection/cm/CommentCollection',
  'text!templates/cm/CommuteCommentTemplate.html'
], function($, _, Backbone, Util, BaseView, 
		CommentCollection, CommuteCommentTemplate){
	
	var _commentDataTbl = null;
	
	var CommuteCommentView = BaseView.extend({
		el:$(".main-container"),
		events: {
			'click #btnSearch' : 'onClickSearchBtn',
			'click #btnUpdate' : 'onClickOpenCommentUpdatePopup',
			'click #commentDataTbl tbody tr': 'onSelectRow',
		},
		initialize:function(){
			this.collection = new CommentCollection();
			$(this.el).html('');
			$(this.el).empty();
		},
		destroy: function() {
			if (Util.isNotNull(_commentDataTbl) ) {
				this.$el.find("#commentDataTbl").DataTable().destroy();
				_commentDataTbl = null;
			}
		},
		render: function(){
    		var tpl = _.template( CommuteCommentTemplate, {} );
    		this.$el.append(tpl);
    		
    		_commentDataTbl = this.$el.find("#commentDataTbl").dataTable({
    			columns : [
    			           { data : "date", "title" : "일자" },
    			           { data : "id", "title" : "ID" },
    			           { data : "name", "title" : "이름"},
    			           { data : "comment", "title" : "접수내용"},
    			           { data : "comment_reply", "title" : "처리내용"},
    			           { data : "comment_date", "title" : "신청일자"},
    			           { data : "comment_reply_date", "title" : "업데이트일자"},
    			           { data : "state", "title" : "처리상태"}
    			]
    		});
    	},
    	onClickSearchBtn:  function(evt){
    		return false;
    	},
    	onClickOpenCommentUpdatePopup: function(evt) {
    		
    	},
    	onSelectRow: function(evt) {
     		var $currentTarget = $(evt.currentTarget);
            if ( $currentTarget.hasClass('selected') ) {
            	$currentTarget.removeClass('selected');
            }
            else {
            	_commentDataTbl.$('tr.selected').removeClass('selected');
            	$currentTarget.addClass('selected');
            }
    	}
    });
	
	return CommuteCommentView;
});