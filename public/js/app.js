// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'log',
  'bootstrap',
  'dialog',
  'i18n!nls/common',
  'data/code',
  'router',
  'models/sm/SessionModel',
  'views/LoadingView',
  'views/LoginView',
  'views/NavigationView', 
  'moment', 'bootstrap-datetimepicker',
], function($, _, Backbone, log, Bootstrap, Dialog, i18Common, Code, MainRouter, SessionModel, LoadingView, LoginView, NavigationView){
    var LOG=log.getLogger("APP");
    var _loadingView;
    var _saram;
    var _router;
    var _navigationView;
    var _initFlalg= true;
    var App = Backbone.Model.extend({
        start : function(){
            LOG.debug("==============================================================================");   
            LOG.debug("==============================Welcome to Sarams.=============================="); 
            LOG.debug("==============================================================================");
            
            $.ajaxSetup({ cache: false });
            
            var _app=this;
            var _loginView;
            
            //Global Error Handle
            $(document).ajaxError(function (event, xhr) {
                if (xhr.status == 401){// 권한 없음.
                    Dialog.error(i18Common.ERROR.AUTH.EXPIRE_AUTH, function(){
                        
                        _navigationView.hide();
                        _initFlalg=false;
                        
                        $(document).unbind('ajaxError');
                        //_app.start();
                        window.location="/";
                    });
                } else if (xhr.status == 404){
                    Dialog.error(i18Common.ERROR.HTTP.NOT_FIND_PAGE);
                }
                    
            });

            //Session 체크 
            SessionModel.checkSession().done(function(isLogin){
                if (!isLogin){
                    LOG.debug("Not login User.");
                    //_loadingView.disable(function(){
                        _loginView= new LoginView({el:$(".main-container")});
                        _loginView.render(_app);
                    //});
                    return;
                } else {
                        _app.draw();   
                }    
            });
        },
        draw:function(){
            $("body").removeClass("login-body");
            Code.init().then(function(){
                _router = new MainRouter({
                    affterCallback:function(){// mainRouter create
                        if (_.isUndefined(_navigationView)){
                            _navigationView= new NavigationView();
                		    _navigationView.render();
                        } else {
                            _navigationView.show();
                        }
                        
                        if (_initFlalg){
                            Backbone.history.start({root:"/"});
                        } else {
                            Backbone.history.loadUrl();
                        }
                    }
                });     
            }, function(){
                Dialog.error("Code Init Fail");
            });
        }
    });
    return App;
});