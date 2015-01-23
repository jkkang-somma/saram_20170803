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
    'cmoment',
    'resulttimefactory',
    'core/BaseView',
    'models/sm/SessionModel',
    'models/cm/CommuteModel',
    'models/cm/ChangeHistoryModel',
    'collection/cm/CommuteCollection',
    'text!templates/inputForm/textbox.html',
    'text!templates/default/datepicker.html',
        
], function(
$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, ResultTimeFactory,
BaseView,
SessionModel,
CommuteModel, ChangeHistoryModel, CommuteCollection, 
TextBoxHTML, DatePickerHTML
) {
	var resultTimeFactory = ResultTimeFactory.Builder;
	var CommuteUpdatePopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
			
			$(this.el).append(_.template(TextBoxHTML)({id: "commuteUpdatePopupDate", label : "일자", value : this.selectData.date}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commuteUpdatePopupDept", label : "부서", value : this.selectData.department}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commuteUpdatePopupName", label : "이름", value : this.selectData.name  + " ("+this.selectData.id+")"}));
			$(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commuteUpdatePopupIn",
    	    			label : "출근 시간",
    	    			name : "in_time",
    	    			format : "YYYY-MM-DD HH:mm:ss"
    	    			
    	    		}
    	    		
    	    	})
    	    );
    	    $(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commuteUpdatePopupOut",
    	    			label : "퇴근 시간",
    	    			name : "out_time",
    	    			format : "YYYY-MM-DD HH:mm:ss"
    	    		}
    	    	})
    	    );

			$(this.el).find("#commuteUpdatePopupIn").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS",
		        defaultDate: Moment(this.selectData.in_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss")
            });
            
            $(this.el).find("#commuteUpdatePopupOut").datetimepicker({
            	pickTime: true,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD HH:mm:SS",
		        defaultDate: Moment(this.selectData.out_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss")
            });
            
			$(this.el).find("#commuteUpdatePopupDate").attr("disabled", "true");
			$(this.el).find("#commuteUpdatePopupId").attr("disabled", "true");
			$(this.el).find("#commuteUpdatePopupDept").attr("disabled", "true");
			$(this.el).find("#commuteUpdatePopupName").attr("disabled", "true");
			
			
            dfd.resolve();
            return dfd.promise();
		},
		updateCommute: function() {
			var dfd= new $.Deferred();
     		var data = this.getInsertData(); 
     		if (data === null) {
     			return;
     		}     		
     		
     		data._id = this.selectData.id;	
     		
     		var commuteCollection = new CommuteCollection();
     		
     		commuteCollection.fetch({ 
     			data: {
     				id : data.id,
     				startDate : data.date,	
     				endDate : Moment(data.date).add(1, 'days').format("YYYY-MM-DD"),
     			},success : function(resultCollection){
     				resultTimeFactory.modifyByCollection( // commute_result 수정
     					resultCollection,
     					{ changeInTime : data.in_time, changeOutTime : data.out_time }
     				).done(function(resultCommuteCollection){ // commute_result 수정 성공!
     					var commuteModel = new CommuteModel();
						commuteModel.save(data, { // changehistory tbl 수정
							success: function(){
								dfd.resolve(resultCommuteCollection);		
							}
						});
     				}).fail(function(){
     					dfd.reject();
     				});
     			},error : function(){
     				dfd.reject();
     			}
     		});		
     		
     		return dfd.promise();
			
		},
		getInsertData: function() {
			var inTimeDatePicker = $(this.el).find("#commuteUpdatePopupIn").data("DateTimePicker");
			var outTimeDatePicker = $(this.el).find("#commuteUpdatePopupOut").data("DateTimePicker");
     		var newData = {
     			date : this.selectData.date,
     			id : this.selectData.id,
     			in_time : inTimeDatePicker.getText()==="" ? null: inTimeDatePicker.getDate().format("YYYY-MM-DD HH:mm:ss"),
     			out_time : outTimeDatePicker.getText()==="" ? null: outTimeDatePicker.getDate().format("YYYY-MM-DD HH:mm:ss"),
     		}
			
     		var userId = SessionModel.get("user").id;
			
			var inChangeModel = _getChangeHistoryModel("in_time", newData, this.selectData, userId);
			var outChangeModel = _getChangeHistoryModel("out_time", newData, this.selectData,userId);
			
			newData.changeHistoryJSONArr = [];
			
			if (inChangeModel) {
				newData.changeHistoryJSONArr.push(inChangeModel);
			}else{
				newData.in_time = null;
			}
			
			if (outChangeModel) {
				newData.changeHistoryJSONArr.push(outChangeModel);
			}else{
				newData.out_time = null;
			}
			
			if (newData.changeHistoryJSONArr.length === 0) {
				Dialog.show("변경된 사항이 없습니다.");
				return null;
			}
			
			return newData;
		}
	});
	
	function _getChangeHistoryModel(changeColumn, newData, oriData, changeId ) {
		if (oriData[changeColumn] == newData[changeColumn]){
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
	
	return CommuteUpdatePopupView;
});