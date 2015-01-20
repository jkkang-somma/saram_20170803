/**
 * 근태 자료 comment 수정 팝업
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
        'models/sm/SessionModel',
        'models/cm/CommentModel',
        'text!templates/cm/popup/commentUpdatePopupTemplate.html'
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
		SessionModel,
		CommentModel,
		commentUpdatePopupTemplate) {
	
	var CommentPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
            			
			var tpl = _.template(commentUpdatePopupTemplate, {variable: 'data'})(this.selectData);			
			$(this.el).append(tpl);
			
			// 일반 사용자는 단순 읽기만 가능
			if (SessionModel.get("user").admin == 0) {
				$(this.el).find("#comment_reply").prop("readonly", true);
				$(this.el).find("#state").prop("disabled", true);
			}

            dfd.resolve();
            return dfd.promise();			
		},
		updateComment: function(opt) {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData._id = inData.id;
			var commentModel = new CommentModel();
			commentModel.save(inData, opt);
		},
		getInsertData: function() {
     		var newData = Util.getFormJSON( $(this.el).find("form"));
     		if (newData.comment_reply == "" ) {
     			alert("처리 내용을 입력해주시기 바랍니다. ");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});