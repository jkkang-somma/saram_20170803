define([
	'underscore',
	'backbone'
], function(_, Backbone){

	var BaseView = Backbone.View.extend({
		close : function(){
			this.undelegateEvents();
            this.$el.removeData().unbind(); 
			// if(this.childViews){
			// 	this.childViews.close();
			// }
			// this.remove();
		}
	});

	return BaseView;

});