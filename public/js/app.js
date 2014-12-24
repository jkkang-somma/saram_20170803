// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'log',
  'domReady',
  'i18n!nls/common',
  'i18n!nls/error',
  'loading',
  'dialog',
  'views/SaramView',
  'css!cs/animate.css',
  'css!cs/style.css'
], function($, _, Backbone, Router, log, domReady, i18Common, i18Error, loading, Dialog, SaramView){
    
    var LOG=log.getLogger("APP");
    // domReady(function(e){
        
    // });
    LOG.debug("==============================================================================");   
    LOG.debug("==============================Welcome to Sarams.=============================="); 
    LOG.debug("==============================================================================");
    var initialize = function(callBack){
        Router.initialize().done(function(){
            LOG.debug("Router initialize");
            var mainPage= new SaramView({
                affterInitialize:function(){
                    callBack();
                  //  Dialog.error(i18Error.APP_LODING_FAIL);
                }
            });
        });
    };
  
    return { 
        initialize: initialize
    };
});