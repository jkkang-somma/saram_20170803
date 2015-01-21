define([
'jquery',
'underscore',
'backbone',
'log',
'dialog',
'models/sm/UserModel',
'models/sm/SessionModel',
'text!templates/loginTemplate.html',
'text!templates/loginPasswordSectionTemplate.html',
'i18n!nls/common',
'css!cs/login.css',
], function($, _,Backbone, log, Dialog, UserModel, SessionModel, LoginHTML, LoginPasswordSectionHTML, i18nCommon){
    var LOG=log.getLogger('LoginView');
    var LoginView = Backbone.View.extend({
        events: {
            "click .login-btn": "login",
            "click .save-password-btn": "commitPassword"
        },
    	initialize:function(){
            this.el=$(".main-container");
            $("body").addClass("login-body");
            
            this.formSection=$(LoginHTML);
            this.passwordSection=$(LoginPasswordSectionHTML);
            
            _.bindAll(this, 'render');
            _.bindAll(this, 'login');
            _.bindAll(this, 'close');
    	},
    	render:function(app){
    	    var _window_size = $(window).height();
    	    this.el.removeClass("container");
    	    this.el.html(this.formSection);
    	    this.app=app;
    	    $("#passwadUpdate").css("display","none");
    	    this.el.find(".form-control").on("focus",function(){
    	        $(".login-input").removeClass("login-input-focus");
    	        $(this).parent().addClass("login-input-focus");
    	    });
    	    $("#loginIdTextbox").focus();
    	    
    	    this.el.find("#initPasswordBtn").click(function(){
    	        Dialog.show("초기화 요청");
    	        return false;
    	    })
    	    this.el.append(this.passwordSection);
     	},
    	
    	login : function(e){
    	    var _view=this;
    	    var data = this.getFormData( this.el.find('form'));
    	    if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){
    	        Dialog.warning(i18nCommon.WARNING.LOGIN.NOT_VALID_LOGIN_INFO);         
    	    } else {
                SessionModel.login(data).then(function(){
                    _view.app.draw();    
                }).fail(function(e){
                    if (!_.isUndefined(e.user)){
                        Dialog.warning(i18nCommon.WARNING.LOGIN[e.msg]);
            
                        $("#loginbtn").fadeOut(100, function(){
                            $("#passwadUpdate").fadeIn(500, function(){
                                $("#loginPasswordTextbox").val("");
                                $("#loginPasswordTextbox").focus();
                            });
                        });
                    } else {
                        Dialog.warning(i18nCommon.WARNING.LOGIN[e.msg]);
                    }
                });
            }
    	    return false;
    	},
    	commitPassword : function(e){
            var data = this.getFormData( this.$el.find('form'));
            if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){
                Dialog.warning(i18nCommon.WARNING.LOGIN.INIT_PASSWORD_PUT);         
            } else {
                SessionModel.initPassword({id: data.id, password:data.password}).done(function(result){
                    Dialog.show(i18nCommon.SUCCESS.LOGIN[result.msg]);
                    $("#passwadUpdate").fadeOut(100, function(){
                        $("#loginbtn").fadeIn(500, function(){
                        });
                    });
                }).fail(function(){
                    
                });
            }
            return false;
    	},
    	close:function(){
            this.formSection.removeClass("bounceIn");
            this.passwordSection.removeClass("fadeInRightBig");
            
            this.formSection.addClass("bounceOut");
            this.passwordSection.addClass("fadeOutRightBig");
    	},
    	getFormData: function(form) {
            form.find(':input:disabled').removeAttr('disabled');
            var unindexed_array = form.serializeArray();
            var indexed_array= {};
            
            $.map(unindexed_array, function(n, i){
                  indexed_array[n['name']] = n['value'];
            });
              
            return indexed_array;
    	}
    });
    return LoginView;
});