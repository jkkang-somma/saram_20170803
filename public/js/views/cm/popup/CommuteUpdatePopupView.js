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
        'resulttimefactory',
        'core/BaseView',
        'models/sm/SessionModel',
        'models/cm/CommuteModel',
        'models/cm/ChangeHistoryModel',
        'collection/cm/CommuteCollection',
        'text!templates/cm/popup/commuteUpdatePopupTemplate.html',
        'text!templates/inputForm/textbox.html',
        'text!templates/default/datepicker.html',
        
], function(
$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, ResultTimeFactory,
BaseView,
SessionModel,
CommuteModel, ChangeHistoryModel, CommuteCollection, 
commuteUpdatePopupTemplate,
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
			
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupDate", label : "일자", value : this.selectData.date}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupDept", label : "부서", value : this.selectData.department}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupId", label : "사번", value : this.selectData.id}));
			$(this.el).append(_.template(TextBoxHTML)({id: "commutUpdatePopupName", label : "이름", value : this.selectData.name}));
			$(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commutUpdatePopupIn",
    	    			label : "출근 시간",
    	    			name : "in_time",
    	    			format : "YYYY-MM-DD HH:mm:ss"
    	    			
    	    		}
    	    		
    	    	})
    	    );
    	    $(this.el).append(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "commutUpdatePopupOut",
    	    			label : "퇴근 시간",
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
			$(this.el).find("#commutUpdatePopupId").attr("disabled", "true");
			$(this.el).find("#commutUpdatePopupDept").attr("disabled", "true");
			$(this.el).find("#commutUpdatePopupName").attr("disabled", "true");
			
			
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
     				var resultCommuteCollection = new CommuteCollection();
     				
	     			var currentDayCommute = resultCollection.models[0];
	     			
	     			resultTimeFactory.initByModel(currentDayCommute);
	     			
	     			if(!_.isNull(data.in_time)){
	     				resultTimeFactory.inTime = Moment(data.in_time);
	     				resultTimeFactory.inTimeChange = resultTimeFactory.inTimeChange + 1;; 
	     			}
	     			
	     			if(!_.isNull(data.out_time)){
	     				resultTimeFactory.outTime = Moment(data.out_time);
	     				resultTimeFactory.outTimeChange = resultTimeFactory.outTimeChange + 1;
	     			}
	     			
	     			var currentResult = resultTimeFactory.getResult();

	     			var nextDayCommute = resultCollection.models[1];		
	     			resultTimeFactory.initByModel(nextDayCommute);
	     			
	     			if(currentResult.out_time)
                    	resultTimeFactory.setStandardInTime(Moment(currentResult.out_time));
                    
                    var yesterdayResult = resultTimeFactory.getResult();
					resultCommuteCollection.add(currentResult);
					resultCommuteCollection.add(yesterdayResult);
					resultCommuteCollection.save({
						success: function(result){
							var commuteModel = new CommuteModel();
							commuteModel.save(data, {
								success: function(){
									dfd.resolve(resultCommuteCollection);		
								}
							});
						},
						error : function(){
							dfd.reject();
						}
					});
     			},error : function(){
     				dfd.reject();
     			}
     		});		
     		
     		return dfd.promise();
			
		},
		getInsertData: function() {
			var inTimeDatePicker = $(this.el).find("#commutUpdatePopupIn").data("DateTimePicker");
			var outTimeDatePicker = $(this.el).find("#commutUpdatePopupOut").data("DateTimePicker");
     		var newData = {
     			date : $(this.el).find("#commutUpdatePopupDate").val(),
     			id : $(this.el).find("#commutUpdatePopupId").val(),
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