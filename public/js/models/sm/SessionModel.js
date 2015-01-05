define([
  'jquery',
  'underscore',
  'backbone',
  'util',
], function($, _,Backbone,Util){
    var SessionModel=Backbone.Model.extend({
        url: '/session',
        defaults : {
            
        },
        initialize : function(){
            
        },
        login : function(userinfo){// POST or PUT
            this.set({'user':userinfo});
            return this.save();
        },
        logout : function(){
            var that = this;
            // DELETE /session
            this.destroy({
                success : function(model, res){
                    model.clear();
                    model.id = null;
                    that.set({user_id : null, isLogin : false});
                }
            });
        },
        get : function(){
            return this.fetch();
        }
    });

    var INSTANCE;
    return {
    	getInstance:function(){
    		if (Util.isNull(INSTANCE)){
    			INSTANCE= new SessionModel();
    		}
    		return INSTANCE;
    	}
    };
});