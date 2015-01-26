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
    'core/BaseView',
    'models/cm/CommentModel',
	'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
	'text!templates/default/datepickerChange.html',
], function(
	$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, 
	i18Common,
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
			
			$(this.el).append(_.template(TextBoxHTML)({id: "commentAddPopupDate", label : "일자", value : this.selectData.date}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commentAddPopupDept", label : "부서", value : this.selectData.department}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commentAddPopupName", label : "이름", value : this.selectData.name + " ("+this.selectData.id+")"}));
			$(this.el).append(_.template(DatePickerChangeHTML)(
				{
					id: "commentAddPopupInTime", 
					label : "출근시간",
					beforeTime:  this.selectData.in_time,
					checkId : "",
					
				}
			));
			
			$(this.el).append(_.template(DatePickerChangeHTML)(
				{
					id: "commentAddPopupOutTime", 
					label : "퇴근시간",
					beforeTime:  this.selectData.out_time,
					checkId : "",
				}
			));
			
			$(this.el).append(_.template(TextAreaHTML)({id: "commentAddPopupComment", label : "Comment"}));
			

			$(this.el).find("#commentAddPopupInTime").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS"
            });
            
			$(this.el).find("#commentAddPopupOutTime").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS"
            });

			$(this.el).find("#commentAddPopupDate").attr("disabled", "true");
			$(this.el).find("#commentAddPopupDept").attr("disabled", "true");
			$(this.el).find("#commentAddPopupName").attr("disabled", "true");
			
            dfd.resolve();
            return dfd.promise();			
		},
		insertComment: function(opt) {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData["state"] = i18Common.COMMENT.STATE.ACCEPTING;
			var commentModel = new CommentModel();
			commentModel.save(inData, opt);
		},
		getInsertData: function() {
			var inTimeDatePicker = $(this.el).find("#commentAddPopupInTime").data("DateTimePicker");
			var outTimeDatePicker = $(this.el).find("#commentAddPopupOutTime").data("DateTimePicker");
			var commentTextArea = $(this.el).find("#commentAddPopupComment");
			
     		var newData = {
     			comment : commentTextArea.val(),
     			date: this.selectData.date,
     			id: this.selectData.id,
     			year : this.selectData.year
     		};
     		
     		if(inTimeDatePicker.getText()!==""){
     			newData.want_in_time = inTimeDatePicker.getDate().format("YYYY-MM-DD HH:mm:ss");
     		}
     		
     		if(outTimeDatePicker.getText()!==""){
     			newData.want_out_time = outTimeDatePicker.getDate().format("YYYY-MM-DD HH:mm:ss");
     		}
     		
     		newData.before_in_time = this.selectData.in_time;
     		newData.before_out_time = this.selectData.out_time;

     		if (newData.comment.length == 0) {
     			alert("Comment를 입력해주시기 바랍니다.");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});
