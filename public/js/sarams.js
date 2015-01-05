// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// js lib config
// load end event ==> app.initialize();
require.config({
   waitSeconds: 2000,
   shim: {
      'util' : {deps : ['jquery']},
      'bootstrap' : { deps : ['jquery'] , exports: '$.fn' },
      'bootstrap-dialog': { deps: ['jquery','bootstrap']  },
      'log' : {deps : ['jquery', 'util', 'log4javascript']},
      'animator' : {deps : ['jquery', 'log','util'] }
   },
   paths: {
   //    jquery: 'tool/jquery.min',
      backbone: 'tool/backbone/backbone-min',
      underscore: 'tool/underscore/underscore-min',
      log4javascript:'tool/log4javascript',
      bootstrap:'tool/bootstrap/js/bootstrap',
      'bootstrap-dialog':'tool/bootstrap/js/bootstrap-dialog',
      dialog:'lib/dialog',
      animator:'lib/animator',
      router:'router/mainRouter',
      
      sessionManager:'lib/sessionManager',
      log:'lib/debug',
      util:'lib/util',
      
      i18n:'tool/i18n-master/i18n',
      fittext:'tool/textillate/jquery.fittext',
      lettering:'tool/textillate/jquery.lettering',
      textillate:'tool/textillate/jquery.textillate',
      templates:'../templates',
      cs:'../css'
   },
   config:{
      i18n:{
         locale:'kr'
      }
   }
});

require([
    'app',
], function(App){
   var app = new App();
   app.start();
});