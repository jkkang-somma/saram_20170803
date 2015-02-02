define([ 
	'jquery',
	'underscore',
	'backbone',
	'util',
	'comboBox',
	'cmoment',
	'text!templates/inputForm/combobox.html',
], function($, _, Backbone, Util, Combobox, Moment,
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
    	    var $yearCombo= $(this.el).find("#createHolidayCombo");
    	    
    	    var today = Moment();
    	    var year = today.year();
    	    
    	    for(var i = -1; i< 5; i++){
    	    	$yearCombo.append($("<option>"+(year + i)+"</option>"));
    	    }
    	    
    	    $yearCombo.find("select").val(year);
         	Combobox.createCombo($yearCombo);
         	
            dfd.resolve();
            return dfd.promise();
		}
	});
	
	return CreateHolidayPopup;
});