// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router', 
  'log4javascript',
  'views/LodingView'
], function($, _, Backbone, Router, log4javascript, LodingView){
    var log = log4javascript.getLogger();
    var appender=new log4javascript.BrowserConsoleAppender();
    var layout = new log4javascript.PatternLayout("[%-5p] %m");
    appender.setLayout(layout)
    log.addAppender(appender);
    log.debug("Welcome to Sarams."); 
    
  var initialize = function(){
    var lodingView = new LodingView();
    lodingView.render();
    Router.initialize();
  };
  return { 
    initialize: initialize
  };
});