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
	var CreateDataRemovePopupView = Backbone.View.extend({
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
    	    			id : "cdrStartDatePicker",
    	    			label : "시작일",
    	    			name : "startDate"
    	    		}
    	    	})
    	    );
    	    var _enddatePicker=$(_.template(DatePickerHTML)(
    	    	{ obj : 
    	    		{
    	    			id : "cdrEndDatePicker",
    	    			label : "종료일",
    	    			name : "endDate"
    	    		}
    	    	})
    	    );

            
            $(this.el).append(_startdatePicker);
            $(this.el).append(_enddatePicker);
            
            $(this.el).find("#cdrStartDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            $(this.el).find("#cdrEndDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            dfd.resolve();
            return dfd.promise();
		},
		getStartDate : function(){
			return $(this.el).find("#cdrStartDatePicker").data("DateTimePicker").getDate();
		},
		getEndDate : function(){
			return $(this.el).find("#cdrEndDatePicker").data("DateTimePicker").getDate();
		}
	});
	
	return CreateDataRemovePopupView;
});