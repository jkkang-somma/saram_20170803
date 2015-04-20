define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'lib/component/form',
	'models/sm/SessionModel',
	'models/vacation/VacationModel',
	'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
], function($, _, Backbone, Util, Form,
	SessionModel,VacationModel,
	TextBoxHTML, TextAreaHTML
) {
	
	var UpdateVacationPopup = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			if (!_.isUndefined(el)) this.el=el;
			var _view=this;
			var _form = new Form({
		        el:_view.el,
		        form:undefined,
		        group:[{
	                name:"userGroup",
	                label:"사용자 정보",
	                initOpen:true
	            },{
	                name:"vacationGroup",
	                label:"연차 정보",
	                initOpen:true
	            }],
		        
		        childs:[{
	                type:"input",
	                name:"department",
	                label:"부서",
	                value:this.selectData.dept_name,
	                disabled : true,
	                group:"userGroup",
	        	}, {
	        		type:"input",
	                name:"name",
	                label:"이름",
	                disabled : true,
	                value:this.selectData.name,
	                group:"userGroup",
	        	}, {
	        		type:"input",
	                name:"total_day",
	                label:"전체 휴가 일수",
	                disabled : SessionModel.get("user").admin == 0,
	                value:this.selectData.total_day,
	                group:"vacationGroup",
	        	}, {
	        		type:"input",
	                name:"used_holiday",
	                label:"휴가 사용 일수",
	                disabled : true,
	                value:this.selectData.used_holiday,
	                group:"vacationGroup",
	        	}, {
	        		type:"input",
	                name:"holiday",
	                label:"잔여 휴가 일수",
	                disabled : true,
	                value:this.selectData.holiday,
	                group:"vacationGroup",
	        	}, {
        		  	type:"text",
	                name:"memo",
	                label:"Memo",
	                value:this.selectData.memo,
	                disabled: SessionModel.get("user").admin == 0,
	                group:"vacationGroup"
		        }]
		    });
		    
		    _form.render().done(function(){
		        _view.form=_form;
		        dfd.resolve();
		    }).fail(function(){
		        dfd.reject();
		    });  
		    
            return dfd.promise();
		},
     	onUpdateVacationInfo : function(opt) {	// 연차 수정
     		var formData = this.form.getData();
     		var data = {
     			dept_name : this.selectData.dept_name,
     			holiday : this.selectData.holiday,
     			id: this.selectData.id,
     			memo: formData.memo,
     			name: this.selectData.name,
     			total_day :formData.total_day,
     			used_holiday : this.selectData.used_holiday,
     			year : this.selectData.year
     		};
     		
     		if ( !(data.total_day - parseFloat( data.total_day ) >= 0) ) {
     			alert("숫자만 입력 가능합니다.");
     			return;     			
     		}
     		
     		var vacationModel = new VacationModel();
     		var _this = $(this.el);
     		data._id = data.id;
     		vacationModel.save(data, opt);
     	}
	});
	
	return UpdateVacationPopup;
});