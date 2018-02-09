define(
	['backbone'],
		
	function(Backbone) {
	
		var model = Backbone.Model.extend({
			
			defaults: {
				name: undefined,
				separator : undefined,
				child : undefined
			}, 
		});
		
		return model;
	}
);