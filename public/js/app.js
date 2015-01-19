// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/sm/SessionModel',
  'log',
  'bootstrap',
  'dialog',
  'i18n!nls/common',
  'i18n!nls/error',
  
  'router',
  'models/sm/SessionModel',
  'views/LoadingView',
  'views/LoginView',
  'views/NavigationView', 
  'moment', 'bootstrap-datetimepicker',
], function($, _, Backbone, SessionModel, log, Bootstrap, Dialog, i18Common, i18Error,  MainRouter, SessionModel, LoadingView, LoginView, NavigationView){
    var LOG=log.getLogger("APP");
    var loadingView;
    var _saram;
    var App = Backbone.Model.extend({
        start : function(){
            LOG.debug("==============================================================================");   
            LOG.debug("==============================Welcome to Sarams.=============================="); 
            LOG.debug("==============================================================================");
            
            var _app=this;
            loadingView = new LoadingView();
            loadingView.render();
            
            var _loginView;
            //유효한 세션인지 체크한다.
            
            
            // SessionModel.checkSession().done(function(isLogin){
            //     if (!isLogin){
            //         LOG.debug("Not login User.");
            //         loadingView.disable(function(){
            //             _loginView= new LoginView({el:$(".main-container")});
            //             _loginView.render(_app);
            //         });
            //         return;
            //     } else {
                   _app.draw(); 
            //     }    
            // });
            
            
            // _user=$.cookie('saram', JSON.stringify({
            //     user : {
            //         id:"babo"
            //     }})
            // );

            
        },
        draw:function(){
            var router = new MainRouter({affterCallback:function(){// mainRouter create
                loadingView.disable(function(){// loadingView close
                    var navigationView= new NavigationView();
        		    navigationView.render();
                    Backbone.history.start({root:"/"});
                });
            }});
        }
    });
    return App;
});