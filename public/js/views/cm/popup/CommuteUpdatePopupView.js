/**
 * 근태 자료 수정 팝업
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
        'models/cm/CommuteModel',
        'models/cm/ChangeHistoryModel',
        'collection/cm/CommuteCollection',
        'text!templates/cm/popup/commuteUpdatePopupTemplate.html'
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
		CommuteModel,
		ChangeHistoryModel,
		CommuteCollection, 
		commuteUpdatePopupTemplate) {

	// 입력받은 시간을 YYYY-MM-DD HH:mm:ss 형식으로 반환 또는 체크
	function _getTimeStr(inTime) {
		if ( Util.isNotNull(inTime) ) {
			var t = moment( inTime , "YYYY-MM-DD HH:mm:ss");				
			if (t.isValid()) {
				return t.format("YYYY-MM-DD HH:mm:ss");
			} else {
				Dialog.show("시간을 입력해 주시기 바랍니다. ex: 2015-01-01 09:00:00");
				return null;
			}
		} else {
			Dialog.show("시간을 입력해 주시기 바랍니다. ex: 2015-01-01 09:00:00");
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
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
            			
			var tpl = _.template( commuteUpdatePopupTemplate, {variable: 'data'} )( this.selectData );
			$(this.el).append(tpl);

            dfd.resolve();
            return dfd.promise();
		},
		updateCommute: function(opt) {
     		var _this = this;			
     		var inData = this.getInsertData(); 
     		if (inData == null) {
     			return;
     		}     		
     		
     		inData._id = this.selectData.id;	// PUT으로 전송하기
			var commuteModel = new CommuteModel();
			commuteModel.save(inData, opt)
		},
		getInsertData: function() {
     		var newData = Util.getFormJSON( $(this.el).find("form") );
			
			newData.in_time = _getTimeStr(newData.in_time);			
			if (newData == null) {
				return null;
			} 

			newData.out_time = _getTimeStr(newData.out_time);
			if (newData.out_time == null) {
				return null;
			}
				
			Dialog.show("!!!! 수정자 ID 고정되어있음 !!!!");
			var inChangeModel = _getChangeHistoryModel("in_time", this.selectData, newData, '130702');
			var outChangeModel = _getChangeHistoryModel("out_time", this.selectData, newData, '130702');
			
			newData.changeHistoryJSONArr = [];
			
			if (inChangeModel) {
				newData.changeHistoryJSONArr.push(inChangeModel);
			}
			
			if (outChangeModel) {
				newData.changeHistoryJSONArr.push(outChangeModel);
			}
			
			if (newData.changeHistoryJSONArr.length == 0) {
				Dialog.show("변경된 사항이 없습니다.");
				return null;
			}
			
			return newData;
		}
	});
	
	return CommuteUpdatePopupView;
});