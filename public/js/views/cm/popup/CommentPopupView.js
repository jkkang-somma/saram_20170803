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
    'cmoment',
    'i18n!nls/common',
    'lib/component/form',
    'core/BaseView',
    'models/cm/CommentModel',
	'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
	'text!templates/default/datepickerChange.html',
], function(
	$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, 
	i18nCommon, Form,
	BaseView,
	CommentModel,
	TextBoxHTML, TextAreaHTML, DatePickerChangeHTML
) {
	
	var CommentPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
				var _view=this;
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"destInfo",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.GROUP_DEST,
	                initOpen:true
	            },{
	                name:"modifyItem",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.GROUP_NEW,
	                initOpen:true
	            }],
		        
		        childs:[{
	                type:"input",
	                name:"date",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.DATE,
	                value:this.selectData.date,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"department",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.DEPARTMENT,
	                value:this.selectData.department,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"name",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.NAME,
	                value:this.selectData.name,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"inTimeBefore",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_BEFORE,
	                value:this.selectData.in_time,
	                group:"modifyItem",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"inTimeAfter",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_AFTER,
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	}, {
	        		type:"input",
	                name:"outTimeBefore",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_BEFORE,
	                value:this.selectData.out_time,
	                group:"modifyItem",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"outTimeAfter",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_AFTER,
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	},{
        		  	type:"text",
	                name:"comment",
	                label:i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.COMMENT,
	                group:"modifyItem"
		        }]
		    });
		    
		    _form.render().done(function(){
		        _view.form=_form;
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
		
            return dfd.promise();			
		},
		insertComment: function(opt) {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData["state"] = i18nCommon.COMMENT.STATE.ACCEPTING;
			var commentModel = new CommentModel();
			commentModel.save(inData, opt);
		},
		getInsertData: function() {
			var data = this.form.getData();
			
     		var newData = {
     			comment : data.comment,
     			date: this.selectData.date,
     			id: this.selectData.id,
     			year : this.selectData.year
     		};
     		
     		if(data.inTimeAfter != ""){
     			newData.want_in_time = data.inTimeAfter;
     		}
     		
     		if(data.outTimeAfter != ""){
     			newData.want_out_time = data.outTimeAfter;
     		}
     		
     		newData.before_in_time = this.selectData.in_time;
     		newData.before_out_time = this.selectData.out_time;

     		if (newData.comment.length == 0) {
     			Dialog.warning(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.EMPTY_COMMENT_ERR);
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});
