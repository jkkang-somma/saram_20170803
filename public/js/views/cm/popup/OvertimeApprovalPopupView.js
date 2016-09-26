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
	
	var OvertimeApprovalPopupView = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			if (!_.isUndefined(el)) this.el=el;
			
			var overtimeCollection = [];
			for(var i=0; i<= 40; i++){
				overtimeCollection.push({
					key : i*10,
					value : i*10
				});
			}
			var _view=this;
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"infoGroup",
	                label:"근무",
	                initOpen:true
	            },{
	                name:"inputGroup",
	                label:"상신내용",
	                initOpen:true
	            }],
		        
		        childs:[{
	        		type:"input",
	                name:"department",
	                label:"부서",
	                value:this.selectData.department,
	                group:"infoGroup",
	                disabled:true
                }, {
                	type:"input",
	                name:"name",
	                label:"이름",
	                value:this.selectData.name,
	                group:"infoGroup",
	                disabled:true
                }, {
                	type:"input",
	                name:"intime",
	                label:"출근시간",
	                value:this.selectData.in_time,
	                group:"infoGroup",
	                disabled:true
                }, {
                	type:"input",
	                name:"outtime",
	                label:"퇴근시간",
	                value:this.selectData.out_time,
	                group:"infoGroup",
	                disabled:true
                }, {
                	type:"input",
	                name:"overtime",
	                label:"초과근무(분)",
	                value:this.selectData.over_time,
	                group:"infoGroup",
	                disabled:true
                }, {
                	type:"combo",
	                name:"except",
	                label:"제외시간(분)",
	                collection : overtimeCollection,
	                value: 0,
	                group:"inputGroup",
                }, {
                	type:"input",
	                name:"changeOverTime",
	                label:"확정 초과근무(분)",
	                value:this.selectData.over_time,
	                group:"inputGroup",
	                disabled:true
		        }]
		    });
		    
		    _form.render().done(function(){
		        _view.form=_form;
		        var except = _form.getElement("except");
		        except.find("select")
		        	.change(function(evt){
		        		var val = $(this).val();
	        			var overtime = _view.selectData.over_time;
		        		_form.getElement("changeOverTime").find("input").val(overtime - val);
			        });
			        
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
            dfd.resolve();
            return dfd.promise();
		},
		
		getData: function(){
			return this.form.getData();
		}
		
	});
	
	return OvertimeApprovalPopupView;
});