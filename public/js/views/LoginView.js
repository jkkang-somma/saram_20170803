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
//'text!templates/loginPasswordSectionTemplate.html',
'text!templates/initPasswordTemplate.html',
'i18n!nls/common',
'css!cs/login.css',
], function($, _,Backbone, log, Dialog, Spin, CryptoJS, UserModel, SessionModel, LoginHTML//, LoginPasswordSectionHTML 
, InitPasswordHTML
, i18nCommon){
    var opts = {
        lines: 7, // The number of lines to draw
        length: 1, // The length of each line
        width: 4, // The line thickness
        radius: 4, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '10px', // Top position relative to parent
        left: '5px' // Left position relative to parent
    }; 
    
    var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
    var LOG=log.getLogger('LoginView');
    var LoginView = Backbone.View.extend({
    	initialize:function(){
            this.el=$(".main-container");
            $("body").addClass("login-body");
             
            _.bindAll(this, 'render');
            _.bindAll(this, 'close');
    	},
    	addClickEvent:function(){
    	    var _view=this;
    	    this.formSection.find("#loginbtn").click(function(){
                _view.login();
                return false;
            });
            this.passwordSection.find("#initPaswordBtn").click(function(){
               // this.log
            });
            this.passwordSection.find("#initCanceleBtn").click(function(){
                _view.render(_view.app);
            });
            this.passwordSection.find("#initRePasswordInput").bind('keydown', function(e){
               if(e.keyCode == 13) {
               }
            });
  
    	},
    	render:function(app){
    	    var _window_size = $(window).height();
    	    
    	    this.el.removeClass("container");
            this.formSection=$(LoginHTML);
            this.passwordSection=$(InitPasswordHTML);
            this.passwordSection.css("display", "none");
    	    this.el.html(this.formSection);
    	    this.el.append(this.passwordSection);
    	    
    	    this.addClickEvent();
    	    
    	    this.app=app;
    	    this.el.find(".form-control").on("focus",function(){
    	        $(".login-input").removeClass("login-input-focus");
    	        $(this).parent().addClass("login-input-focus");
    	    });
    	    $("#loginIdTextbox").focus();
    	    
    	   // this.el.find("#initPasswordBtn").click(function(){
    	   //     Dialog.show("초기화 요청");
    	   //     return false;
    	   // })
    	   // this.el.append(this.passwordSection);
     	},
    	
    	login : function(){
    	    var _view=this;  
       // btn.button('loading')
    	    var data = this.getFormData( _view.formSection.find('form'));
    	    if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){
    	        Dialog.warning(i18nCommon.WARNING.LOGIN.NOT_VALID_LOGIN_INFO);         
    	    } else {
    	       var hash=CryptoJS.SHA256(data.password);
    	       var _hashPassword=hash.toString();
    	        
    	        data.password =_hashPassword;
    	        $("#loginbtn").button("loading");
    	        
    	        var _spin=new Spin(opts).spin($("#loginbtn").find(".spinIcon")[0]);
                SessionModel.login(data).then(function(){
                    _view.app.draw();    
                }).fail(function(e){
                    if (!_.isUndefined(e.user)){
                        // Dialog.warning(i18nCommon.WARNING.LOGIN[e.msg]);
                        
                        _view.formSection.addClass("bounceOut").one(transitionEnd, function(){
                            $("#loginbtn").button('reset');
                            _view.passwordSection.find("#initIdInput").val(data.id);
                            _view.formSection.css("display", "none");
                            _view.passwordSection.addClass("fadeInLeftBig");
                            
                            _view.passwordSection.css("display", "block");
                          // _view.formSection.removeClass("bounceOut");
                        });;
                        
                    } else {
                        $("#loginbtn").button('reset');
                        Dialog.warning(i18nCommon.WARNING.LOGIN[e.msg]);
                    }
                });
            }
    	    return false;
    	},
    	commitPassword : function(e){
            var data = this.getFormData(this.passwordSection.find('form'));
    	    
            if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.password)||_.isEmpty(data.password))){//validation
                Dialog.warning(i18nCommon.WARNING.LOGIN.INIT_PASSWORD_PUT);         
            } else {
                //암호화
                var hash=CryptoJS.SHA256(data.password);
        	    var _hashPassword=hash.toString();
        	    data.password =_hashPassword;
        	    
                $("#initPaswordBtn").button("loading");
    	        var _spin=new Spin(opts).spin($("#initPaswordBtn").find(".spinIcon")[0]);
    	        
                SessionModel.initPassword({id: data.id, password:data.password}).done(function(result){
                    //Dialog.show(i18nCommon.SUCCESS.LOGIN[result.msg]);
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