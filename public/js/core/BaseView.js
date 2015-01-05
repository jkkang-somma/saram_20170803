// 각 View 마다 동일한 변수나 function 이 있을경우 이곳에 추가하여 사용
// 각 View는 BaseView 를 상속 하여 생성한다.
define([
	'underscore',
	'backbone',
	'animator'
], function(_, Backbone, animator){

	var BaseView = Backbone.View.extend({
		close : function(){
			var view=this;
			view.undelegateEvents();
            view.$el.removeData().unbind(); 
            view.$el.html('');	
		}
	});

	return BaseView;

});