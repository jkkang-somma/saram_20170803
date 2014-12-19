// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// js lib config
// load end event ==> app.initialize();
require.config({
  paths: {
    jquery: 'tool/jquery.min',
    underscore: 'tool/underscore/underscore-min',
    backbone: 'tool/backbone/backbone-min',
    log4javascript:'tool/log4javascript',
    bootstrap:'tool/bootstrap/js/bootstrap.min',
    fittext:'tool/textillate/jquery.fittext',
    lettering:'tool/textillate/jquery.lettering',
    textillate:'tool/textillate/jquery.textillate',
    templates:'../templates',
    cs:'../css'
  }
});

require([
  'app'
], function(App){
   App.initialize();
});