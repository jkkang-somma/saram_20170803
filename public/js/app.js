// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'log',
  'dialog',
  'i18n!nls/common',
  'i18n!nls/error',
  'views/LoadingView',
  'css!cs/animate.css',
  'css!cs/style.css'
], function($, _, Backbone, Router, log, dialog, i18Common, i18Error, LoadingView){
    var LOG=log.getLogger("APP");
    var loadingView = new LoadingView();
    
    var ApplicationModel = Backbone.Model.extend({
        start : function(){
            LOG.debug("==============================================================================");   
            LOG.debug("==============================Welcome to Sarams.=============================="); 
            LOG.debug("==============================================================================");
            loadingView.render();
            var router = new Router();
            //dialog.show("test!");
		    Backbone.history.start();    
		    loadingView.close();
        }
    })
    
    return ApplicationModel;
});