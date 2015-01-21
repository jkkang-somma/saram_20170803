// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// js lib config
// load end event ==> app.initialize();
require.config({
   locale: "kr",
   waitSeconds: 2000,
   shim: {
      'util' : {deps : ['jquery', 'underscore']},
      'bootstrap' : { deps : ['jquery'] , exports: '$.fn' },
      'bootstrap-dialog': { deps: ['jquery','bootstrap']  },
      momentjs:{deps:['jquery']},
      moment:{deps:['momentjs']},
      'bootstrap-datepicker': { deps: ['jquery','bootstrap', 'moment']  },
      'log' : {deps : ['jquery', 'util', 'log4javascript']},
      'animator' : {deps : ['jquery', 'log','util'] },
      'resulttimefactory' : { deps : ['jquery, underscore, moment'] },
   },
   paths: {
   //    jquery: 'tool/jquery.min',
      backbone: 'tool/backbone/backbone',
      underscore: 'tool/underscore/underscore-min',
      'underscore.string': 'tool/underscore/underscore.string.min',
      log4javascript:'tool/log4javascript',
      bootstrap:'tool/bootstrap/js/bootstrap',
      'bootstrap-dialog':'tool/bootstrap/js/bootstrap-dialog',
      moment:'tool/moment/cutom-moment', // moment config
      momentjs:'tool/moment/moment', //moment lib js 파일 define 오류 때문에 수정함. 주의 !!
      'bootstrap-datetimepicker' : 'tool/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
      'datatables':'tool/datatables/media/js/jquery.dataTables',
      //'fnFindCellRowIndexes':'tool/datatables/media/js/fnFindCellRowIndexes', DataTable 플러그인 작동안됨 --;
      
      dialog:'lib/dialog',
      animator:'lib/animator',
      router:'router/mainRouter',
      log:'lib/debug',
      util:'lib/util',
      csvParser:'lib/csvParser',
      
      monthpicker:'lib/component/monthpicker',
      grid:'lib/component/grid',
      schemas:'lib/schemas',
      resulttimefactory: 'lib/resultTimeFactory',
      
      i18n:'tool/i18n-master/i18n',
      fittext:'tool/textillate/jquery.fittext',
      lettering:'tool/textillate/jquery.lettering',
      textillate:'tool/textillate/jquery.textillate',
      templates:'../templates',
      cs:'../css'
   },
   wrapShim: true,//moment 사용시 
   config:{
      i18n:{
         locale:'kr'
      }
   }
});

require([
   'views/LoadingView',
], function(LoadingView){
   LoadingView.render();
});

require([
   'app',
   'views/LoadingView',
], function(App, LoadingView){
   LoadingView.disable(function(){
      var app = new App();
      app.start();
   });   

});