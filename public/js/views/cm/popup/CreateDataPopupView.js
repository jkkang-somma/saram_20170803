define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'moment',
	'text!templates/default/datepicker.html',
	'views/component/ProgressbarView'
], function(
	$, _, Backbone, Util, Moment,
	DatePickerHTML,
	ProgressbarView
) {
	var ChangeHistoryPopupView = Backbone.View.extend({
		initialize : function(data) {
			console.log("init "+data);
			
			this.date = data.date;
			console.log("init "+this.date);
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
		        format: "YYYY-MM-DD",
		        
            });
            
            $(this.el).find("#cdEndDatePicker").datetimepicker({
            	pickTime: false,
		        language: "ko",
		        todayHighlight: true,
		        format: "YYYY-MM-DD"
            });
            
            $(this.el).find("#cdStartDatePicker input").attr("disabled","true");
            
            dfd.resolve(this);
            return dfd.promise();
		},
		afterRender : function(){
			this.setDate();	
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
		setDate : function(){
			if(_.isNull(this.date)){
				$(this.el).find("#cdStartDatePicker").data("DateTimePicker").setDate("2015-01-01");
			}else{
				$(this.el).find("#cdStartDatePicker").data("DateTimePicker").setDate(Moment(this.date).add(1,'days'));
			}
			
		},
		getEndDate : function(){
			return $(this.el).find("#cdEndDatePicker").data("DateTimePicker").getDate();
		}
	});
	
	return ChangeHistoryPopupView;
});