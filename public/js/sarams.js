// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// js lib config
// load end event ==> app.initialize();
require.config({
   waitSeconds: 2000,
   shim: {
      'bootstrap' : { deps : ['jquery'] , exports: '$.fn' },
      'bootstrap-dialog': { deps: ['jquery','bootstrap']  },
      'dialog' : {deps : ['jquery','bootstrap', 'bootstrap-dialog']}
   },
   paths: {
      jquery: 'tool/jquery.min',
      backbone: 'tool/backbone/backbone-min',
      underscore: 'tool/underscore/underscore-min',
      log4javascript:'tool/log4javascript',
      bootstrap:'tool/bootstrap/js/bootstrap.min',
      'bootstrap-dialog':'tool/bootstrap/js/bootstrap-dialog.min',
      dialog:'lib/dialog',
      log:'lib/debug',
      util:'lib/util',
      animator:'lib/animator',
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
   'css!tool/bootstrap/css/bootstrap-theme.css',
   'css!tool/bootstrap/css/bootstrap.min.css',
   'css!tool/bootstrap/css/bootstrap-dialog.min.css'
], function(App){
   var app = new App();
   app.start();
});