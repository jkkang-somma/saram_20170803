/**
 * 근태 자료 comment 등록 팝업
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
        'models/cm/CommentModel',
        'text!templates/cm/popup/commentPopupTemplate.html'
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
		CommentModel,
		commentPopupTemplate) {
	
	var CommentPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
            			
			var tpl = _.template(commentPopupTemplate, {variable: 'data'})(this.selectData);			
			$(this.el).append(tpl);
			
			$(this.el).find("#wantInTimePopup").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS"
            });
            
			$(this.el).find("#wantOutTimePopup").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS"
            });

            dfd.resolve();
            return dfd.promise();			
		},
		insertComment: function(opt) {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData["state"] = "접수중";
			var commentModel = new CommentModel();
			commentModel.save(inData, opt);
		},
		getInsertData: function() {
     		var newData = Util.getFormJSON( $(this.el).find("form"));
     		if (newData.comment.length == 0) {
     			alert("Comment를 입력해주시기 바랍니다.");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});