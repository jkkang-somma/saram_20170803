define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/default/datepicker.html',
	'text!templates/inputForm/textbox.html',
], function($, _, Backbone, Util,
DatePickerHTML, TextBoxHTML) {
	var CreateHolidayPopup = Backbone.View.extend({
		initialize : function() {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            if (!_.isUndefined(el)) this.el=el;
    	    
    	    var _datepicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "ahDatePicker",
    	    			label : "날짜",
    	    			name : "startDate"
    	    		}
    	    		
    	    	})
    	    );
    	    
    	    var _textbox=$(_.template(TextBoxHTML)({id: "addHolidayMemo", label: "내용", value : ""}));
            $(this.el).append(_datepicker);
            $(this.el).append(_textbox);
            
            $(this.el).find("#ahDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});