define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/component/datepickerRange.html',
	'text!templates/component/progressbar.html',
], function($, _, Backbone, Util, DatePickerHTML, ProgressbarHTML) {
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function() {

		},
		events : {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    
    	    var _datePicker=$(_.template(DatePickerHTML)({label : "기간"}));
            var _progressBar=$(_.template(ProgressbarHTML)({percent : "100"}));
            
            $(this.el).append(_datePicker);
            $(this.el).append(_progressBar);
            
            $(this.el).find("#datepicker").datepicker({
                format: "yyyy/mm//dd",
                todayHighlight: true,
                language: "kr"
            });
            
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return ChangeHistoryPopupView;
});