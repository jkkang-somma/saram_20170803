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
			console.log( $(tpl).find("#state").val());
			$(tpl).find("select[name=state] option:selected").val(this.selectData.state);
			$(tpl).find("#state").val("처리중").attr("selected", "selected");
			console.log( $(tpl).find("#state").val());
			
			$(tpl).find("#state > option[value=처리중]").attr("selected", "ture");
			
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
     		
     		newData.reply_id = '100501';
     		alert("답변자 ID 고정되어 있음!!!!!!");
     		
     		if (newData.comment_reply == "" ) {
     			alert("처리 내용을 입력해주시기 바랍니다. ");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});