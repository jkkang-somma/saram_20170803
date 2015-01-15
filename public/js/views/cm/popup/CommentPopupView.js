/**
 * 근태 자료 comment 등록 팝업
 */

define([ 'jquery',
         'underscore',
         'backbone',
         'util',
         'models/cm/CommentModel',
         'text!templates/cm/popup/commentPopupTemplate.html'
], function($, _, Backbone, Util, CommentModel, commentPopupTemplate) {
	
	var CommentPopupView = Backbone.View.extend({
		initialize : function(opt) {
			this.parentView = opt.parentView;
		},
		destroy: function() {
			this.parentView = null;
			this.remove();
		},
		events : {
			'click #btnInsertComment' : 'onClickBtnInsertComment',
			'hidden.bs.modal' : 'onClosePopup'
		},
		render: function(data) {
			var tpl = _.template(commentPopupTemplate, {variable: 'data'})(data);
			this.setElement( tpl);
			return this;
		},
		show: function(data) {
			this.render(data);
			this.$el.modal('show');
		},
		onClickBtnInsertComment: function() {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData["state"] = "접수중";
			var commentModel = new CommentModel();
			commentModel.save(inData, {
				success: function(model, response) {
					_this.parentView.selectCommutes();
					_this.$el.modal('hide');
				},
				error: function(model, res) {
					alert("Comment 등록이 실패 했습니다.");
				}
			})
		},
		onClosePopup: function() {
			this.remove();
		},
		getInsertData: function() {
     		var newData = Util.getFormJSON( this.$el.find('#commentInfoForm'));
     		if (newData.comment.length == 0) {
     			alert("Comment를 입력해주시기 바랍니다.");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});