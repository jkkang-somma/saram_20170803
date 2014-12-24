define([
  'jquery',
  'underscore',
  'backbone'
], function($, _,Backbone){
    var SessionModel=Backbone.Model.extend({
        url: '/session',
        
        defaults : {
            
        },
        
        initialize : function(){
            this.fetch();
        },
        
        login : function(userinfo){
            // POST /session
            this.save(userinfo, {
               success:function(){
                   
               } 
            });
        },
        
        logout : function(){
            var that = this;
            // DELETE /session
            this.destroy({
                success : function(model, res){
                    model.clear();
                    model.id = null;
                    that.set({user_id : null, })
                }
            })
        },
        
        get : function(){
            this.fetch();
        }
    });
    
    return new SessionModel();
});