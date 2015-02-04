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
    'comboBox',
    'core/BaseView',
    'data/code',
	'i18n!nls/common',
	'lib/component/form',
    'models/sm/SessionModel',
    'models/cm/CommuteModel',
    'models/cm/ChangeHistoryModel',
    'collection/cm/CommuteCollection',
    'collection/cm/ChangeHistoryCollection',
    'text!templates/inputForm/textbox.html',
    'text!templates/default/datepicker.html',
    'text!templates/inputForm/combobox.html',
        
], function(
$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, ResultTimeFactory, ComboBox,
BaseView, Code, i18nCommon, Form,
SessionModel,
CommuteModel, ChangeHistoryModel, CommuteCollection,  ChangeHistoryCollection,
TextBoxHTML, DatePickerHTML , ComboboxHTML
) {
	var resultTimeFactory = ResultTimeFactory.Builder;
	var CommuteUpdatePopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
			
			var _view=this;
			var overtimeCodes = Code.getCodes(Code.OVERTIME);
			var comboItem = [{key:" ", value:" "}];
			var selectedCode = null;
    	    for(var key in overtimeCodes){
    	    	comboItem.push({key:overtimeCodes[key].code, value:overtimeCodes[key].name});
    	    }
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"destInfo",
	                label:"수정 대상",
	                initOpen:true
	            },{
	                name:"modifyItem",
	                label:"수정내역",
	                initOpen:true
	            }],
		        
		        childs:[{
	                type:"input",
	                name:"date",
	                label:"날짜",
	                value:this.selectData.date,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"department",
	                label:"부서",
	                value:this.selectData.department,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"name",
	                label:"이름",
	                value:this.selectData.name,
	                group:"destInfo",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"inTime",
	                label:"출근시간",
	                value:_.isNull(this.selectData.in_time) ? null : Moment(this.selectData.in_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss"),
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	}, {
	                type:"datetime",
	                name:"outTime",
	                label:"퇴근시간",
	                value:_.isNull(this.selectData.out_time) ? null : Moment(this.selectData.out_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss"),
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	}, {
	                type:"combo",
	                name:"overtime",
	                label:"초과근무",
	                value:this.selectData.overtime_code,
	                collection:comboItem,
	                group:"modifyItem"
		        }]
		    });
		    
		    _form.render().done(function(){
		        _view.form=_form;
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
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
     					{ changeInTime : data.in_time, changeOutTime : data.out_time, changeOvertimeCode : data.overtime_code},
     					data.changeHistoryCollection
     				).done(function(resultCommuteCollection){ // commute_result, changeHistroy 수정 성공!
	     				dfd.resolve(resultCommuteCollection);		
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
			var data = this.form.getData();
			
     		var newData = {
     			date : this.selectData.date,
     			id : this.selectData.id,
     			in_time : data.inTime,
     			out_time : data.outTime,
     			overtime_code : data.overtime
     		};
			
     		var userId = SessionModel.get("user").id;
			
			var inChangeModel = _getChangeHistoryModel("in_time", newData, this.selectData, userId);
			var outChangeModel = _getChangeHistoryModel("out_time", newData, this.selectData, userId);
			var overtimeChangeModel = _getChangeHistoryModel("overtime_code", newData, this.selectData, userId);
			
			newData.changeHistoryCollection = new ChangeHistoryCollection();
			
			if (inChangeModel) {
				newData.changeHistoryCollection.add(inChangeModel);
			}else{
				newData.in_time = null;
			}
			
			if (outChangeModel) {
				newData.changeHistoryCollection.add(outChangeModel);
			}else{
				newData.out_time = null;
			}
			
			if (overtimeChangeModel) {
				newData.changeHistoryCollection.add(overtimeChangeModel);
			}else{
				newData.overtime_code = null;
			}
			
			if (newData.changeHistoryCollection.length === 0) {
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