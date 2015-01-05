// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/sm/SessionModel',
  'router',
  'log',
  'bootstrap',
  'dialog',
  'i18n!nls/common',
  'i18n!nls/error',
  'views/LoadingView',
<<<<<<< HEAD
], function($, _, Backbone, SessionModel, MainRouter, log, Bootstrap, Dialog, i18Common, i18Error, LoadingView){
    var LOG=log.getLogger("APP");
    var loadingView;
    var App = Backbone.Model.extend({
        start : function(){
            LOG.debug("==============================================================================");   
            LOG.debug("==============================Welcome to Sarams.=============================="); 
            LOG.debug("==============================================================================");
            
            SessionModel.getInstance().get().done(function(){// session create
                var router = new MainRouter({affterCallback:function(){// mainRouter create
                    loadingView.disable(function(){// loadingView close
                        Backbone.history.start(/*{pushState: true, root:"/"}*/);
                    });
                }});
            }).fail(function(e){//session create Fail.
                Dialog.error('Error:001'+e);  
            });
        },
        initialize:function(){
            loadingView = new LoadingView();
            loadingView.render();
        }
    });
=======
  'css!cs/animate.css',
  'css!cs/style.css'
], function($, _, Backbone, Router, log, Bootstrap, dialog, i18Common, i18Error, LoadingView){
    var LOG=log.getLogger("APP");
     var loadingView = new LoadingView();
    
    var App = Backbone.Model.extend({
        start : function(){
            loadingView.render();
            
            LOG.debug("==============================================================================");   
            LOG.debug("==============================Welcome to Sarams.=============================="); 
            LOG.debug("==============================================================================");
            var router = new Router();
		    Backbone.history.start(/*{pushState: true, root:"/"}*/);
		    
		    loadingView.close();
		    
		    dialog.show("test!");
        }
    })
    
>>>>>>> 8cf4868f7ceeee743d9082079f909399d91ac7e2
    return App;
});