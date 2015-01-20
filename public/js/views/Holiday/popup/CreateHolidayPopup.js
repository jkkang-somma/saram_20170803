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
    	    
    	    var today = new Date();
    	    var year = today.getFullYear();
    	    for(var i = -1; i< 5; i++){
    	    	$(this.el).find("#createHolidayCombo").append($("<option>"+(year + i)+"</option>"));
    	    }
            
            _yearCombo.find("select").val(year);
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});