define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/default/datepicker.html',
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
    	    
    	    var _startdatePicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "cdStartdayDatePicker",
    	    			label : "시작일",
    	    			name : "startDate"
    	    		}
    	    		
    	    	})
    	    );
    	    var _enddatePicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "cdEnddayDatePicker",
    	    			label : "종료일",
    	    			name : "endDate"
    	    		}
    	    		
    	    	})
    	    );
            var _progressBar=$(_.template(ProgressbarHTML)({percent : "100"}));
            
            $(this.el).append(_startdatePicker);
            $(this.el).append(_enddatePicker);
            $(this.el).append(_progressBar);
            
            $(this.el).find("#cdStartdayDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            $(this.el).find("#cdEnddayDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return ChangeHistoryPopupView;
});