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
	'models/sm/UserModel',
	'models/cm/CommentModel',
	'code',
	'models/sm/SessionModel',
	'text!templates/default/datepickerChange.html',
], function(
	$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment,
	i18nCommon, Form,
	BaseView,
	UserModel, CommentModel, Code, SessionModel,
	DatePickerChangeHTML
) {

	var CommentPopupView = Backbone.View.extend({
		initialize: function(data) {
			this.selectData = data;
			console.log(this.selectData);
		},
		render: function(el) {
			var dfd = new $.Deferred();

			if (!_.isUndefined(el)) this.el = el;
			var _view = this;

			var userModel = new UserModel({
				id: this.selectData.id
			});

			userModel.fetch().done(function(result) {
				if (result.length > 0) {
					var formop = {
						el: _view.el,
						form: undefined,
						group: [{
							name: "destInfo",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.GROUP_DEST,
							initOpen: true
						}, {
							name: "modifyItem",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.GROUP_NEW,
							initOpen: true
						}],

						childs: [{
							type: "input",
							name: "date",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.DATE,
							value: _view.selectData.date,
							group: "destInfo",
							disabled: true
						}, {
							type: "input",
							name: "department",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.DEPARTMENT,
							value: _view.selectData.department,
							group: "destInfo",
							disabled: true
						}, {
							type: "input",
							name: "name",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.NAME,
							value: _view.selectData.name,
							group: "destInfo",
							disabled: true
						}, {
							type: "checkBox",
							name: "normal",
							checkLabel: '근태 정상처리 요청',
							value: false,
							group: "modifyItem",
							full: true
						}, {
							type: "input",
							name: "inTimeBefore",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_BEFORE,
							value: _view.selectData.in_time,
							group: "modifyItem",
							disabled: true
						}, {
							type: "datetime",
							name: "inTimeAfter",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.IN_TIME_AFTER,
							format: "YYYY-MM-DD HH:mm",
							group: "modifyItem"
						}, {
							type: "input",
							name: "outTimeBefore",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_BEFORE,
							value: _view.selectData.out_time,
							group: "modifyItem",
							disabled: true
						}, {
							type: "datetime",
							name: "outTimeAfter",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.OUT_TIME_AFTER,
							format: "YYYY-MM-DD HH:mm",
							group: "modifyItem"
						}, {
							type: "text",
							name: "comment",
							label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.FORM.COMMENT,
							group: "modifyItem"
						}, {
							type: "input",
							name: "approval",
							label: "결재자",
							value: result[0].approval_name,
							disabled: true,
							group: "modifyItem",
						// }, {
						// 	type: "combo",
						// 	name: "comment_type",
						// 	label: "유형",
						// 	data : 0,
						// 	collection : [
						// 		{key : 0, value : "-"},
						// 		{key : 1, value : "결재"},
						// 		{key : 2, value : "일반"}
						// 	],
						// 	group: "modifyItem",
						}]
					};

					if (Code.isSuwonWorker(SessionModel.get('user').dept_code)) {
						formop.childs = _.reject(formop.childs, function(i) {
							return i.name == "normal";
						});
					}

					var _form = new Form(formop);

					_form.render().done(function() {
						_view.form = _form;
						var normal = _view.form.getElement("normal");
						var inTimeAfter = $(_view.form.getElement("inTimeAfter")).find("input");
						var outTimeAfter = $(_view.form.getElement("outTimeAfter")).find("input");
						$(_view.form.getElement("approval")).data("id", result[0].approval_id);
						
						$(normal).click(function(evt) {
							if ($(evt.currentTarget).find("input").is(":checked")) {
								$(inTimeAfter).attr("disabled", "true");
								$(outTimeAfter).attr("disabled", "true");
							}
							else {
								$(inTimeAfter).removeAttr("disabled");
								$(outTimeAfter).removeAttr("disabled");
							}
						});
						
						// var type = $(_view.form.getElement("comment_type"));
						// type.find("select").change(function(evt){
						// 	var value = $(this).val();
							
						// 	switch(value){
						// 		case "0" :
						// 		case "1" :
						// 			$(normal).find("input").removeAttr("disabled", "true");
						// 			if($(normal).find("input").is(":checked")){
						// 				$(inTimeAfter).attr("disabled", "true");
						// 				$(outTimeAfter).attr("disabled", "true");	
						// 			}else{
						// 				$(inTimeAfter).removeAttr("disabled");
						// 				$(outTimeAfter).removeAttr("disabled");
						// 			}
						// 			break;
						// 		case "2" :
						// 			$(normal).find("input").attr("disabled", "true");
						// 			$(inTimeAfter).attr("disabled", "true");
						// 			$(outTimeAfter).attr("disabled", "true");
						// 			break;
						// 	}
						// });
						dfd.resolve();
					}).fail(function() {
						dfd.reject();
					});
				}
			});


			return dfd.promise();
		},
		insertComment: function(opt) {
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
				comment: data.comment,
				date: this.selectData.date,
				id: this.selectData.id,
				year: this.selectData.year,
				approval_name: data.approval,
				approval_id: $(this.form.getElement("approval")).data("id"),
				want_in_time : null,
				want_out_time : null,
				want_normal : 0,
			};

			// switch(data.comment_type){
			// 	case "0" :
			// 		Dialog.warning("Comment 유형을 선택해 주십시오 <br> (정상처리, 출퇴근시간 변경시 결재, 이외의 경우는 일반)");
			// 		break;
			// 	case "1" : // approval
				if (data.inTimeAfter != "") {
					newData.want_in_time = data.inTimeAfter;
				}
	
				if (data.outTimeAfter != "") {
					newData.want_out_time = data.outTimeAfter;
				}
	
				var normal = this.form.getElement("normal");
				
				if(!_.isUndefined(normal)){
					if (normal.find("input").is(":checked")) {
						newData.want_normal = 1;
						newData.want_in_time = null;
						newData.want_ouet_time = null;
					}
					else {
						newData.want_normal = 0;
					}
				}
				newData.before_in_time = this.selectData.in_time;
				newData.before_out_time = this.selectData.out_time;
				
				if( newData["want_normal"] == 0
					&&  _.isNull(newData["want_in_time"]) 
					&& _.isNull(newData["want_out_time"])){
					Dialog.warning("근태 정상처리요청, 출퇴근 수정요청중 한가지는 입력되어야 합니다.");
					return null;
				}
				
				// case "2" : // normal
					if (newData.comment.length == 0) {
						Dialog.warning(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.EMPTY_COMMENT_ERR);
						return null;
					}
					return newData;
			// }
		}
	});

	return CommentPopupView;
});
