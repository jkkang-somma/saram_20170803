define([
'jquery',
'underscore',
'backbone',
'log',
'dialog',
'spin',
'cryptojs.sha256',
'models/sm/UserModel',
'models/sm/SessionModel',
'text!templates/loginTemplate.html',
'text!templates/loginPasswordSectionTemplate.html',
'i18n!nls/common',
'css!cs/login.css',
], function($, _,Backbone, log, Dialog, Spin, CryptoJS, UserModel, SessionModel, LoginHTML, LoginPasswordSectionHTML, i18nCommon){
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
    	   // this.el.append(this.passwordSection);
     	},
    	
    	login : function(e){
    	    var _view=this;  
       // btn.button('loading')
    	    var data = this.getFormData( this.el.find('form'));
    	    if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){
    	        Dialog.warning(i18nCommon.WARNING.LOGIN.NOT_VALID_LOGIN_INFO);         
    	    } else {
    	       var hash=CryptoJS.SHA256(data.password);
    	       var _hashPassword=hash.toString();
    	        
    	       data.password =_hashPassword;
    	       $("#loginbtn").button("loading");
    	       
    	       
    	       // var opts = {
            //       lines: 7, // The number of lines to draw
            //       length: 1, // The length of each line
            //       width: 4, // The line thickness
            //       radius: 4, // The radius of the inner circle
            //       corners: 1, // Corner roundness (0..1)
            //       rotate: 0, // The rotation offset
            //       direction: 1, // 1: clockwise, -1: counterclockwise
            //       color: '#2ABB9B', // #rgb or #rrggbb or array of colors
            //       speed: 1, // Rounds per second
            //       trail: 60, // Afterglow percentage
            //       shadow: false, // Whether to render a shadow
            //       hwaccel: false, // Whether to use hardware acceleration
            //       className: 'spinner', // The CSS class to assign to the spinner
            //       zIndex: 2e9, // The z-index (defaults to 2000000000)
            //       top: '12px', // Top position relative to parent
            //       left: '5px' // Left position relative to parent
            //     }; 
    	       // var _spin=new Spin(opts).spin($("#loginbtn").find(".spinIcon")[0]);
                SessionModel.login(data).then(function(){
                    _view.app.draw();    
                }).fail(function(e){
                    $("#loginbtn").button('reset');
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
            var hash=CryptoJS.SHA256(data.password);
    	    var _hashPassword=hash.toString();
    	    data.password =_hashPassword;
    	    
            if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){
                Dialog.warning(i18nCommon.WARNING.LOGIN.INIT_PASSWORD_PUT);         
            } else {
                SessionModel.initPassword({id: data.id, password:data.password}).done(function(result){
                    Dialog.show(i18nCommon.SUCCESS.LOGIN[result.msg]);
                    $("#passwadUpdate").fadeOut(100, function(){
                        $("#loginbtn").fadeIn(500, function(){
                             $("#loginbtn").button('reset');
                        });
                    });
                }).fail(function(e){
                    Dialog.error("Init Password fail.");
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
           // form.find(':input:disabled').removeAttr('disabled');
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