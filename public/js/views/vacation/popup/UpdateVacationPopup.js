define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'models/sm/SessionModel',
	'models/vacation/VacationModel',
	'text!templates/inputForm/textbox.html',
	'text!templates/inputForm/textarea.html',
], function($, _, Backbone, Util,
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
            			
			var deptnameTextbox=$(_.template(TextBoxHTML)({id: "updateHolidayDept", label: "부서", value : this.selectData.dept_name}));
			var nameTextbox=$(_.template(TextBoxHTML)({id: "updateHolidayName", label: "이름", value : this.selectData.name}));
			var totalTextbox=$(_.template(TextBoxHTML)({id: "updateHolidayTotal", label: "연차휴가", value : this.selectData.total_day}));
			var usedTextbox=$(_.template(TextBoxHTML)({id: "updateHolidayUsed", label: "사용일수", value : this.selectData.used_holiday}));
			var holidayTextbox=$(_.template(TextBoxHTML)({id: "updateHolidayLeft", label: "휴가 잔여 일수", value : this.selectData.holiday}));
			var memoTextarea=$(_.template(TextAreaHTML)({id: "updateHolidayMemo", label: "Memo"}));
			
			
			$(this.el).append(deptnameTextbox);
			$(this.el).append(nameTextbox);
			$(this.el).append(totalTextbox);
			$(this.el).append(usedTextbox);
			$(this.el).append(holidayTextbox);
			$(this.el).append(memoTextarea);
			
			
			$(this.el).find("#updateHolidayDept").prop("disabled", true);
			$(this.el).find("#updateHolidayName").prop("disabled", true);
			$(this.el).find("#updateHolidayUsed").prop("disabled", true);
			$(this.el).find("#updateHolidayLeft").prop("disabled", true);
			$(this.el).find("#updateHolidayMemo").val(this.selectData.memo);
			
			// 일반 사용자는 단순 읽기만 가능
			if (SessionModel.get("user").admin == 0) {
				$(this.el).find("#updateHolidayTotal").prop("disabled", true);
				$(this.el).find("#updateHolidayMemo").prop("disabled", true);
			}			

            dfd.resolve();
            return dfd.promise();
		},
     	onUpdateVacationInfo : function(opt) {	// 연차 수정
     		var data = {
     			dept_name : this.selectData.dept_name,
     			holiday : this.selectData.holiday,
     			id: this.selectData.id,
     			memo: $(this.el).find("#updateHolidayMemo").val(),
     			name: this.selectData.name,
     			total_day :$(this.el).find("#updateHolidayTotal").val(),
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