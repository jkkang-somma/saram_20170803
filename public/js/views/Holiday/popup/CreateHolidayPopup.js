define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'text!templates/inputForm/combobox.html',
], function($, _, Backbone, Util,
ComboboxHTML) {
	var CreateHolidayPopup = Backbone.View.extend({
		initialize : function() {

		},
		events : {

		},
		render : function(el) {
			var dfd= new $.Deferred();
            if (!_.isUndefined(el)) this.el=el;
    	    
    	    var _yearCombo=$(_.template(ComboboxHTML)({id: "createHolidayCombo", label: "연도"}));
    	    $(this.el).append(_yearCombo);
    	    
    	    for(var year = 2010; year< 2060; year++){
    	    	$(this.el).find("#createHolidayCombo").append($("<option>"+year+"</option>"));
    	    }
            
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});