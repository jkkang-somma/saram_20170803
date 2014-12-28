// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'log',
  'bootstrap',
  'dialog',
  'i18n!nls/common',
  'i18n!nls/error',
  'views/LoadingView',
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
    
    return App;
});