define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'models/vacation/VacationModel',
	'text!templates/vacation/vacationInfoPopupTemplate.html'
], function($, _, Backbone, Util,
		VacationModel,
		vacationInfoPopupTemplate) {
	
	var UpdateVacationPopup = Backbone.View.extend({
		initialize : function(data) {
			this.selectData = data;
		},
		render : function(el) {
			var dfd= new $.Deferred();
			
			if (!_.isUndefined(el)) this.el=el;
            			
			var tpl = _.template( vacationInfoPopupTemplate, {variable: 'data'} )( this.selectData );
			
			$(this.el).append(tpl);

            dfd.resolve();
            return dfd.promise();
		},
     	onUpdateVacationInfo : function(opt) {	// 연차 수정
     		var data = Util.getFormJSON( $(this.el).find("form") );
     		var reg = new RegExp('^\\d+$');
     		
     		if (!reg.test(data.total_day)) {
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