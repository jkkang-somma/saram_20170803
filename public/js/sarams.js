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
      bootstrap_dialog:'tool/bootstrap/js/bootstrap-dialog.min',
      log:'lib/debug',
      util:'lib/util',
      dialog:'lib/dialog',
      loading:'loading',
      animator:'lib/animator',
      domReady:'tool/domReady',
      i18n:'tool/i18n-master/i18n',
      fittext:'tool/textillate/jquery.fittext',
      lettering:'tool/textillate/jquery.lettering',
      textillate:'tool/textillate/jquery.textillate',
      templates:'../templates',
      cs:'../css'
   },
   config:{
      i18n:{
         locale:"kr"
      }
   }
});

require([
  'jquery',
  'underscore',
  'backbone',
  'loading',
  'domReady'
], function($, _, backbone, loading, domReady){
   domReady(function(e){
      loading.run().done(function(){
         require([
            'bootstrap',
            'css!tool/bootstrap/css/bootstrap-theme.css',
            'css!tool/bootstrap/css/bootstrap.min.css'
         ], function(bootstrap){
             require([
             'bootstrap_dialog',
             'app',
             'css!tool/bootstrap/css/bootstrap-dialog.min.css'
            ], function(BootstrapDialog, App){
               App.initialize(function(){
                  loading.stop();
               });
            });
         });  
      }).fail(function(){//error 처리
         alert("load fail");
      });  
   });
});