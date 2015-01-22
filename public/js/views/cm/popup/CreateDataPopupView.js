define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/default/datepicker.html',
	'views/component/ProgressbarView'
], function(
	$, _, Backbone, Util,
	DatePickerHTML,
	ProgressbarView
) {
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function() {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            
            if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
    	    
    	    var _startdatePicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "cdStartDatePicker",
    	    			label : "시작일",
    	    			name : "startDate"
    	    		}
    	    		
    	    	})
    	    );
    	    var _enddatePicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "cdEndDatePicker",
    	    			label : "종료일",
    	    			name : "endDate"
    	    		}
    	    		
    	    	})
    	    );

            this.progressbar = new ProgressbarView();
            
            $(this.el).append(_startdatePicker);
            $(this.el).append(_enddatePicker);
            $(this.el).append(this.progressbar.render());
            
            $(this.el).find("#cdStartDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            $(this.el).find("#cdEndDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            dfd.resolve();
            return dfd.promise();
		},
		disabledProgressbar : function(flag){
			this.progressbar.disabledProgressbar(flag);
		},
		setProgressbarPercent : function(percent){
			this.progressbar.setPercent(percent);
		},
		getStartDate : function(){
			return $(this.el).find("#cdStartDatePicker").data("DateTimePicker").getDate();
		},
		getEndDate : function(){
			return $(this.el).find("#cdEndDatePicker").data("DateTimePicker").getDate();
		}
	});
	
	return ChangeHistoryPopupView;
});