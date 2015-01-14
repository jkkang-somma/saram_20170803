/**
 * 근태 자료 수정 팝업
 */

define([ 'jquery',
         'underscore',
         'backbone',
         'util',
         'datatables',
         'moment',
         'bootstrap-datetimepicker',
         'core/BaseView',
         'models/cm/CommuteModel',
         'models/cm/ChangeHistoryModel',
         'collection/cm/CommuteCollection',
         'text!templates/cm/popup/commuteUpdatePopupTemplate.html'
], function($, _, Backbone, Util, Datatables, Moment,
		Datetimepicker,
		BaseView,
		CommuteModel, ChangeHistoryModel,
		CommuteCollection, commuteUpdatePopupTemplate) {

	// 입력받은 시간을 YYYY-MM-DD HH:mm:ss 형식으로 반환 또는 체크
	function _getTimeStr(inTime) {
		if ( Util.isNotNull(inTime) ) {
			var t = moment( inTime , "YYYY-MM-DD HH:mm:ss");				
			if (t.isValid()) {
				return t.format("YYYY-MM-DD HH:mm:ss");
			} else {
				alert("시간을 입력해 주시기 바랍니다. ex: 2015-01-01 09:00:00");
				return null;
			}
		} else {
			alert("시간을 입력해 주시기 바랍니다. ex: 2015-01-01 09:00:00");
			return null;
		}
	}

	function _getChangeHistoryModel(changeColumn, oriData, newData, changeId ) {
		if (oriData[changeColumn] == newData[changeColumn]) {
			return null;
		} else {
			var changeHistoryModel = new ChangeHistoryModel({
				year : oriData.year,
				id : oriData.id,
				date : oriData.date,
				change_column : changeColumn,
				change_before : oriData[changeColumn],
				change_after : newData[changeColumn],
				change_id : changeId 
			});				
			return changeHistoryModel;
		}
	}
	
	var CommuteUpdatePopupView = Backbone.View.extend({
		initialize : function(opt) {
			this.parentView = opt.parentView;
		},
		destroy: function() {
			this.parentView = null;
			this.remove();
		},
		events : {
			'click #btnUpdateCommute' : 'onClickBtnUpdateCommute',
			'hidden.bs.modal' : 'onCloseChangeHistoryPopup'
		},
		render: function(data) {
			var tpl = _.template(commuteUpdatePopupTemplate, {variable: 'data'})(data);
			this.setElement( tpl);
			
			this.$el.find("#in_time").datetimepicker();
			this.$el.find("#out_time").datetimepicker();			

			return this;
		},
		show: function(data) {
			this.originalCommuteData = data;
			this.render(data);
			this.$el.modal('show');
		},
		onClickBtnUpdateCommute: function() {
     		var _this = this;			
     		var inData = this.getInsertData(); 
     		if (inData == null) {
     			return;
     		}     		
     		
     		inData._id = this.originalCommuteData.id;	// PUT으로 전송하기

			var commuteModel = new CommuteModel();
			commuteModel.save(inData, {
				success: function(model, response) {
					_this.parentView.selectCommutes();
					_this.$el.modal('hide');
				},
				error: function(model, res) {
					alert("업데이트가 실패했습니다.");
				}
			})
		},
		onCloseChangeHistoryPopup: function() {
			this.remove();
		},
		getInsertData: function() {
     		var newData = Util.getFormJSON( this.$el.find('#commuteInfoForm'));
			
			newData.in_time = _getTimeStr(newData.in_time);			
			if (newData == null) {
				return null;
			} 

			newData.out_time = _getTimeStr(newData.out_time);
			if (newData.out_time == null) {
				return null;
			}
				
			alert("!!!! 수정자 ID 고정되어있음 !!!!");
			var inChangeModel = _getChangeHistoryModel("in_time", this.originalCommuteData, newData, '130702');
			var outChangeModel = _getChangeHistoryModel("out_time", this.originalCommuteData, newData, '130702');
			
			newData.changeHistoryJSONArr = [];
			
			if (inChangeModel) {
				newData.changeHistoryJSONArr.push(inChangeModel);
			}
			
			if (outChangeModel) {
				newData.changeHistoryJSONArr.push(outChangeModel);
			}
			
			if (newData.changeHistoryJSONArr.length == 0) {
				alert("변경된 사항이 없습니다.");
				return null;
			}
			
			return newData;

		}
	});
	
	return CommuteUpdatePopupView;
});