define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/component/datepicker.html',
	'text!templates/inputForm/textbox.html',
], function($, _, Backbone, Util,
DatePickerHTML, TextBoxHTML) {
	var CreateHolidayPopup = Backbone.View.extend({
		initialize : function() {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            if (!_.isUndefined(el)) this.el=el;
    	    
    	    var _datepicker=$(_.template(DatePickerHTML)({id: "addHolidayDate", label: "날짜"}));
    	    var _textbox=$(_.template(TextBoxHTML)({id: "addHolidayMemo", label: "내용"}));
            $(this.el).append(_datepicker);
            $(this.el).append(_textbox);
            
            var datepicker = $(this.el).find("#addHolidayDate");
            datepicker.datepicker({
                format: "yyyy/mm/dd",
                language: "kr",
                todayHighlight: true
            });
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});