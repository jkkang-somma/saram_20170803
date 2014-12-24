// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// js lib config
// load end event ==> app.initialize();
require.config({
  waitSeconds: 2000,
  paths: {
    jquery: 'tool/jquery.min',
    underscore: 'tool/underscore/underscore-min',
    backbone: 'tool/backbone/backbone-min',
    log4javascript:'tool/log4javascript',
    bootstrap:'tool/bootstrap/js/bootstrap.min',
    log:'lib/debug',
    util:'lib/util',
    templates:'../templates',
    cs:'../css'
  },
  shim: {
    jquery:{
         exports:"$"
    },
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    fittext:{
      deps: ["jquery"],
      exports: "fittext"  
    },
    bootstrap:{
      deps: ["jquery"],
      exports: "bootstrap"  
    },
    log:{
      deps: ["jquery","util"],
      exports: "log" 
    }
  }
});

require(['views/LoginView'], function(LoginView){
  var loginView = new LoginView();
  loginView.render();
});