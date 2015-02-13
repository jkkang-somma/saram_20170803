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
    'code',
	'i18n!nls/common',
	'lib/component/form',
    'models/sm/SessionModel',
    'models/cm/CommuteModel',
    'models/cm/ChangeHistoryModel',
    'collection/cm/CommuteCollection',
    'collection/cm/ChangeHistoryCollection',
], function(
$, _, Backbone, Util, Schemas, Grid, Dialog, Datatables, Moment, ResultTimeFactory, ComboBox,
BaseView, Code, i18nCommon, Form,
SessionModel,
CommuteModel, ChangeHistoryModel, CommuteCollection,  ChangeHistoryCollection
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
			var comboItem = [{key:"", value:" "}];
			var selectedCode = null;
    	    for(var key in overtimeCodes){
    	    	comboItem.push({key:overtimeCodes[key].code, value:overtimeCodes[key].name});
    	    }
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"destInfo",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.GROUP_DEST,
	                initOpen:true
	            },{
	                name:"modifyItem",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.GROUP_NEW,
	                initOpen:true
	            }],
		        
		        childs:[{
	                type:"input",
	                name:"date",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.DATE,
	                value:this.selectData.date,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"department",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.DEPARTMENT,
	                value:this.selectData.department,
	                group:"destInfo",
	                disabled:true
	        	}, {
	        		type:"input",
	                name:"name",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.NAME,
	                value:this.selectData.name,
	                group:"destInfo",
	                disabled:true
	        	}, {
	                type:"datetime",
	                name:"inTime",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.IN_TIME,
	                value:_.isNull(this.selectData.in_time) ? null : Moment(this.selectData.in_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss"),
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	}, {
	                type:"datetime",
	                name:"outTime",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.OUT_TIME,
	                value:_.isNull(this.selectData.out_time) ? null : Moment(this.selectData.out_time).year(this.selectData.year).format("YYYY-MM-DD HH:mm:ss"),
	                format:"YYYY-MM-DD HH:mm:ss",
	                group:"modifyItem"
	        	}, {
	                type:"combo",
	                name:"overtime",
	                label:i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.FORM.OVER_TIME,
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
     		var changeData = { };
     		if (data === null) {
     			Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.NOTING_CHANGED);
     			dfd.reject();
     		}else{
				var message = "";
				_.each(data.changeHistoryCollection.models, function(model){
					switch(model.get("change_column")){
						case "in_time":
							message = message + i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.IN_TIME_MSG;
							changeData.changeInTime = data.in_time;
							break;
						case "out_time":
							message = message + i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.OUT_TIME_MSG;
							changeData.changeOutTime = data.out_time;
							break;
						case "overtime_code":
							message = message + i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.OVER_TIME_MSG;
							changeData.changeOvertimeCode = data.overtime_code;
							break;
					}
					message = message + "[ " + model.get("change_before") + " > " +model.get("change_after") + "]\n";
				});
				
				message = message + i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.OVER_TIME_MSG_MEMO;
				
				data._id = this.selectData.id;	
	     		var commuteCollection = new CommuteCollection();
	     		
	     		Dialog.confirm({
					msg : message,
					action:function(){
						var actionDfd = new $.Deferred();
						commuteCollection.fetch({ 
			     			data: {
			     				id : data.id,
			     				startDate : Moment(data.date).add(-1, 'days').format("YYYY-MM-DD"),	
			     				endDate : Moment(data.date).add(1, 'days').format("YYYY-MM-DD"),
			     			},success : function(resultCollection){
			     				resultTimeFactory.modifyByCollection( // commute_result 수정
			     					resultCollection,
			     					changeData,
			     					data.changeHistoryCollection
			     				).done(function(result){ // commute_result, changeHistroy 수정 성공!
				     				actionDfd.resolve(result);		
			     				}).fail(function(){
			     					actionDfd.reject();		
			     				});
			     			},error : function(){
			     				actionDfd.reject();	
			     			}
			     		});
	    	            return actionDfd.promise();
	                },
	                actionCallBack:function(res){//response schema
						dfd.resolve(res);	
	                },
	                errorCallBack:function(){
	                	dfd.reject();
	                },
	            });
     		}
     		
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