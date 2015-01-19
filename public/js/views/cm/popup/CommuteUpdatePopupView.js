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
        'text!templates/cm/popup/commuteUpdatePopupTemplate.html',
        'text!templates/inputForm/textbox.html',
        'text!templates/default/datepicker.html',
], function(
		$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment,
		BaseView,
		CommuteModel, ChangeHistoryModel, CommuteCollection, 
		commuteUpdatePopupTemplate,
		TextBoxHTML, DatePickerHTML) {

	function _getTimeStr(datePicker) {
		if ( Util.isNotNull(datePicker) ) {
			return datePicker.getDate().format("YYYY-MM-DD HH:mm:ss")
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
            			
			// var tpl = _.template( commuteUpdatePopupTemplate, {variable: 'data'} )( this.selectData );
			// $(this.el).append(tpl);
			
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupDate", label : "일자", value : this.selectData.date}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupDept", label : "부서", value : this.selectData.department}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupName", label : "이름", value : this.selectData.name}));
			$(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commutUpdatePopupIn",
    	    			label : "날짜",
    	    			name : "in_time",
    	    			format : "YYYY-MM-DD HH:mm:ss"
    	    			
    	    		}
    	    		
    	    	})
    	    );
    	    $(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commutUpdatePopupOut",
    	    			label : "날짜",
    	    			name : "out_time",
    	    			format : "YYYY-MM-DD HH:mm:ss"
    	    		}
    	    		
    	    	})
    	    );
			
			$(this.el).find("#commutUpdatePopupIn").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS",
		        defaultDate: Moment(this.selectData.in_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss")
            });
            
            $(this.el).find("#commutUpdatePopupOut").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS",
		        defaultDate: Moment(this.selectData.out_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss")
            });
            
			$(this.el).find("#commutUpdatePopupDate").attr("disabled", "true");
			$(this.el).find("#commutUpdatePopupDept").attr("disabled", "true");
			$(this.el).find("#commutUpdatePopupName").attr("disabled", "true");
			
			

            dfd.resolve();
            return dfd.promise();
		},
		updateCommute: function(opt) {
     		var inData = this.getInsertData(); 
     		if (inData === null) {
     			return;
     		}     		
     		
     		inData._id = this.selectData.id;	// PUT으로 전송하기
			var commuteModel = new CommuteModel();
			commuteModel.save(inData, opt)
		},
		getInsertData: function() {
     		var newData = {
     			in_time : $(this.el).find("#commutUpdatePopupIn").data("DateTimePicker"),
     			out_time : $(this.el).find("#commutUpdatePopupOut").data("DateTimePicker")
     		}
			
			newData.in_time = _getTimeStr(newData.in_time);			
			if (newData.in_time === null) {
				return null;
			} 

			newData.out_time = _getTimeStr(newData.out_time);
			if (newData.out_time === null) {
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
			
			if (newData.changeHistoryJSONArr.length === 0) {
				Dialog.show("변경된 사항이 없습니다.");
				return null;
			}
			
			return newData;
		}
	});
	
	return CommuteUpdatePopupView;
});