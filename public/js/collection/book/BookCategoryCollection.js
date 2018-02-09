//collection
define(
	['jquery', 
	 'backbone',
	 'models/book/BookCategoryModel'],
		
	function($, Backbone, Model) {
		
		var collection = Backbone.Collection.extend({
			model : Model,
			url: 'resources/category.json',
			parse: function (response) {
				return response.categories;
			}
		});
		return collection;
	}
);