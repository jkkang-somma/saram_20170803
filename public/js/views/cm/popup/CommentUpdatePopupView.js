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
    'models/cm/CommuteModel',
    'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
	'text!templates/default/datepickerChange.html',
	'text!templates/inputForm/combobox.html',
], function(
	$, _, Backbone,	Util, Schemas, Grid, Dialog, Datatables, Moment, BaseView, 
	SessionModel, CommentModel, CommuteModel,
	TextBoxHTML, TextAreaHTML, DatePickerChangeHTML, ComboboxHTML
) {
	var CommentPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render: function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
            var that = this;
            var currentCommuteModel = new CommuteModel();
            currentCommuteModel.fetch({
            	data : {
            		startDate : this.selectData.date,
            		endDate : this.selectData.date,
            		id : this.selectData.id	
            	}, success : function(result){
            		$(that.el).append(_.template(TextBoxHTML)({id: "commentUpdatePopupDate", label : "일자", value : that.selectData.date}));
					$(that.el).append(_.template(TextBoxHTML)({id: "commentUpdatePopupId", label : "사번", value : that.selectData.id}));
					$(that.el).append(_.template(TextBoxHTML)({id: "commentUpdatePopupName", label : "이름", value : that.selectData.name}));
					$(that.el).append(_.template(DatePickerChangeHTML)(
						{
							id: "commentUpdatePopupInTime", 
							label : "출근시간",
							beforeTime:  result.attributes[0].in_time
						}
					));
					
					$(that.el).append(_.template(DatePickerChangeHTML)(
						{
							id: "commentUpdatePopupOutTime", 
							label : "퇴근시간",
							beforeTime:  result.attributes[0].out_time
						}
					));
					$(that.el).append(_.template(TextAreaHTML)({id: "commentUpdatePopupComment", label : "접수내용"}));
					$(that.el).append(_.template(TextAreaHTML)({id: "commentUpdatePopupReply", label : "처리내용"}));
					
				   	$(that.el).append(_.template(ComboboxHTML)({id: "commentUpdatePopupState", label: "상태"}));
				   	$(that.el).find("#commentUpdatePopupState").append($("<option>접수중</option>"));
				   	$(that.el).find("#commentUpdatePopupState").append($("<option>처리중</option>"));
				   	$(that.el).find("#commentUpdatePopupState").append($("<option>처리완료</option>"));
				   	
				   	
					$(that.el).find("#commentUpdatePopupInTime").datetimepicker({
		            	pickTime: true,
				        language: "ko",
				        todayHighlight: true,
				        format: "YYYY-MM-DD HH:mm:SS",
				        defaultDate: Moment(that.selectData.want_in_time).format("YYYY-MM-DD HH:mm:ss")
		            });
		            
					$(that.el).find("#commentUpdatePopupOutTime").datetimepicker({
		            	pickTime: true,
				        language: "ko",
				        todayHighlight: true,
				        format: "YYYY-MM-DD HH:mm:SS",
				        defaultDate: Moment(that.selectData.want_out_time).format("YYYY-MM-DD HH:mm:ss")
		            });
		
					$(that.el).find("#commentUpdatePopupDate").attr("disabled", "true");
					$(that.el).find("#commentUpdatePopupId").attr("disabled", "true");
					$(that.el).find("#commentUpdatePopupName").attr("disabled", "true");
					$(that.el).find("#commentUpdatePopupComment").attr("disabled", "true");
					
					// 일반 사용자는 단순 읽기만 가능
					if (SessionModel.get("user").admin == 0) {
						$(that.el).find("#commentUpdatePopupInTime input").attr("disabled","true");
						$(that.el).find("#commentUpdatePopupOutTime input").attr("disabled","true");
						$(that.el).find("#comment_reply").prop("readonly", true);
						$(that.el).find("#commentUpdatePopupComment").attr("disabled", "true");
						$(that.el).find("#commentUpdatePopupReply").attr("disabled", "true");
						$(that.el).find("#commentUpdatePopupState").prop("disabled", true);
					}
            		dfd.resolve();
            	}, error : function(){
            		Dialog.error("근태 데이터 조회 실패");
            		dfd.reject();
            	}
            });
            
			return dfd.promise();			
		},
		updateComment: function(opt) {
			var _this = this;
			var inData = this.getInsertData();
			
			if (inData == null) {
				return;
			}
			
			inData._id = inData.id;
			// Comment table 수정
			var commentModel = new CommentModel();
			commentModel.save(inData, opt);
			// CommuteResult 수정
		},
		getInsertData: function() {
     		var newData = {
     			id: this.selectData.id,
     			year: this.selectData.year,
     			date: this.selectData.date,
     			comment_reply: $(this.el).find("#commentUpdatePopupReply").val(),
     			state: $(this.el).find("#commentUpdatePopupState").val()
     		}
     		if (newData.comment_reply == "" ) {
     			alert("처리 내용을 입력해주시기 바랍니다. ");
     			return null;
     		}
			return newData;
		}
	});
	
	return CommentPopupView;
});