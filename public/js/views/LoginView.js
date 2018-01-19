define([
'jquery',
'underscore',
'backbone',
'log',
'dialog',
'spin',
'validator',
'cryptojs.sha256',
'models/sm/UserModel',
'models/sm/SessionModel',
'models/MessageModel',
'text!templates/login/loginTemplate.html',
'text!templates/login/loginPasswordSectionTemplate.html',
'text!templates/login/initPasswordTemplate.html',
'text!templates/login/findPasswordSectionTemplate.html',
'i18n!nls/common',
'css!cs/login.css',
], function($, _,Backbone, log, Dialog, Spin, _V, CryptoJS, UserModel, SessionModel, MessageModel, LoginHTML, LoginPasswordSectionHTML 
, InitPasswordHTML, FindPasswordSectionHTML
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
               _view.commitPassword();
            });
            this.passwordSection.find("#initCanceleBtn").click(function(){
                _view.render(_view.app);
            });
            this.passwordSection.find("#initRePasswordInput").bind('keydown', function(e){
               if(e.keyCode == 13) {
                   e.preventDefault();
                   _view.commitPassword();
               }
            });
            this.passwordSection.find("#initPasswordInput").bind('keydown', function(e){
               if(e.keyCode == 13) {
                   e.preventDefault();
                   _view.commitPassword();
               }
            });
            
            this.loginPasswordSection.find("#findPasswordBtn").click(function(e){
                 e.preventDefault();
                _view.formSection.addClass("bounceOut");
                _view.passwordSection.addClass("fadeOutLeftBig");
                _view.loginPasswordSection.addClass("fadeOutRightBig");
                
                setTimeout(function timeoutTimeout() {
                    _view.formSection.css("display", "none");
                    _view.passwordSection.css("display", "none");
                    _view.loginPasswordSection.css("display", "none");
                    
                    _view.findPasswordSection.css("display", "block");
                    _view.findPasswordSection.addClass("fadeInLeftBig");
                }, 300);
                
    	        return false;
    	    });
    	    
    	    this.findPasswordSection.find("#findCloseBtn").click(function(){
                _view.render(_view.app);
            });
            
            this.findPasswordSection.find("#findPasswordBtn").click(function(){
                _view.findPassword();
            });
            this.findPasswordSection.find("#findIdInput").bind('keydown', function(e){
               if(e.keyCode == 13) {
                   e.preventDefault();
                   _view.findPassword();
               }
            });
            this.findPasswordSection.find("#findEmailInput").bind('keydown', function(e){
               if(e.keyCode == 13) {
                   e.preventDefault();
                   _view.findPassword();
               }
            });
            
            this.findPasswordSection.find('form').submit(false);
            this.passwordSection.find('form').submit(false);
    	},
    	render:function(app, data){
            this.formSection=$(_.template(LoginHTML)({//로그인 창
                title:i18nCommon.LOGIN_VIEW.TITLE,
                idPlaceholder:i18nCommon.LOGIN_VIEW.ID_PLACEHOLDER,
                passwordPlaceholder:i18nCommon.LOGIN_VIEW.PASSWORD_PLACEHOLDER,
                loginSatusBtn:i18nCommon.LOGIN_VIEW.LOGIN_SATUS_BTN,
                loginBtn:i18nCommon.LOGIN_VIEW.LOGIN_BTN
            }));
            
            this.passwordSection=$(_.template(InitPasswordHTML)({//비밀번호 설정창
                title:i18nCommon.LOGIN_VIEW.TITLE,
                newPasswordPlaceholder:i18nCommon.INIT_PASSWORD_VIEW.NEW_PASSWORD_PLACEHOLDER,
                rePasswordPlaceholder:i18nCommon.INIT_PASSWORD_VIEW.RE_PASSWORD_PLACEHOLDER,
                initPasswordStatusBtn:i18nCommon.INIT_PASSWORD_VIEW.INIT_PASSWORD_STATUS_BTN,
                initPasswordBtn:i18nCommon.INIT_PASSWORD_VIEW.INIT_PASSWORD_BTN,
                closeBtn:i18nCommon.DIALOG.BUTTON.CLOSE
            }));
            
            
            this.loginPasswordSection=$(_.template(LoginPasswordSectionHTML)({//비밀번호 찾기 텍스트 창
                text:i18nCommon.LOGIN_VIEW.FIND_PASSWORD_TEXT
            }));
            
            this.findPasswordSection=$(_.template(FindPasswordSectionHTML)({//비밀번호 찾기 창
                title:i18nCommon.FIND_PASSWORD_VIEW.TITLE,
                idPlaceholder:i18nCommon.LOGIN_VIEW.ID_PLACEHOLDER,
                emailPlaceholder:i18nCommon.FIND_PASSWORD_VIEW.EMAIL_PLACEHOLDER,
                findPasswordStatusBtn:i18nCommon.FIND_PASSWORD_VIEW.FIND_PASSWORD_STATUS_BTN,
                findPasswordBtn:i18nCommon.FIND_PASSWORD_VIEW.FIND_PASSWORD_BTN,
                closeBtn:i18nCommon.DIALOG.BUTTON.CLOSE,
                findTextInfo:i18nCommon.FIND_PASSWORD_VIEW.FIND_TEXT_INFO
            }));
            
            this.passwordSection.css("display", "none");
            this.findPasswordSection.css("display", "none");
            
    	    this.el.html(this.formSection);
    	    this.el.append(this.loginPasswordSection);
    	    this.el.append(this.passwordSection);
    	    this.el.append(this.findPasswordSection);
    	    
    	    this.addClickEvent();
    	    
    	    this.app=app;
    	    this.el.find(".form-control").on("focus",function(){
    	        $(".login-input").removeClass("login-input-focus");
    	        $(this).parent().addClass("login-input-focus");
    	    });
    	    
    	    if (!_.isUndefined(data)){//data 가 잇을 경우에는 셋팅하고 자동 로그인 
    	       this.formSection.find("#loginIdTextbox").val(data.id);
    	       this.formSection.find("#loginPasswordTextbox").val(data.password);
    	       this.login();
    	    }
    	    
    	    this.formSection.find("#loginIdTextbox").focus();
    	    
    	    var messageModel = new MessageModel();
    	    messageModel.fetch({
    	        success : function(result){
    	            if(result.get("visible") == 1){
    	                Dialog.info( result.get("text") );      
                	       
    	            }
    	            
    	        }
    	    })
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
    	        //$("#loginbtn").button("loading");
    	        
    	        var _spin=new Spin(opts).spin($("#loginbtn").find(".spinIcon")[0]);
                SessionModel.login(data).then(function(){
                    _view.app.draw();    
                }).fail(function(e){
                    if (!_.isUndefined(e.user)){
                        
                        _view.loginPasswordSection.addClass("fadeOutRightBig");
                        _view.formSection.addClass("bounceOut").one(transitionEnd, function(){
                            $("#loginbtn").button('reset');
                            _view.passwordSection.find("#initIdInput").val(data.id);
                            _view.formSection.css("display", "none");
                            _view.passwordSection.addClass("fadeInLeftBig");
                            _view.passwordSection.css("display", "block");
                        });;
                    } else {
                        $("#loginbtn").button('reset');
                        _view.formSection.find("#loginPasswordTextbox").val('');
                        
                        Dialog.warning(i18nCommon.WARNING.LOGIN[e.msg], function(){
                            _view.formSection.find("#loginPasswordTextbox").focus();
                        });
                    }
                });
            }
    	    return false;
    	},
    	commitPassword : function(){
    		 var _view=this;
             var minLen = 4;
             var data = this.getFormData(this.passwordSection.find('form'));
             if ((_.isUndefined(data.repassword)||_.isEmpty(data.repassword)) || (_.isUndefined(data.password)||_.isEmpty(data.password)) || (data.repassword!=data.password)
                 || data.password.length < minLen){//validation
                 if ((data.repassword!=data.password)){//초기화 암호 입력된 값이 맞지 않을 때
                     Dialog.warning("입력하신 비밀번호를 확인해주세요.");   
                 }else if(data.password.length < minLen){
                     Dialog.warning(i18nCommon.WARNING.LOGIN.MIN_LENGTH_PASSWORD);
                 }  else {//초기화 암호 입력 안한경우
                     Dialog.warning(i18nCommon.WARNING.LOGIN.INIT_PASSWORD_PUT);   
                 }       
            } else {
                //암호화
                var _inputPasswordValue=data.password;
                var hash=CryptoJS.SHA256(data.password);
        	    var _hashPassword=hash.toString();
        	    data.password =_hashPassword;
        	    
                $("#initPaswordBtn").button("loading");
    	        var _spin=new Spin(opts).spin($("#initPaswordBtn").find(".spinIcon")[0]);
    	        $("#initCanceleBtn").button("loading");
    	        
                SessionModel.initPassword({id: data.id, password:data.password}).done(function(result){
                    _view.passwordSection.addClass("fadeOutLeftBig").one(transitionEnd, function(){
                        data.password=_inputPasswordValue;//암호화 안된 값 로그인 정보 세팅.
                        _view.render(_view.app, data);
                    });
                }).fail(function(e){
                    Dialog.error("Init Password fail.");
                });
            }
            return false;
    	},
    	findPassword:function(){//비밀번호 찾기
    	    var _view=this;
            var data = this.getFormData(this.findPasswordSection.find('form'));
            if ((_.isUndefined(data.id)||_.isEmpty(data.id)) || (_.isUndefined(data.email)||_.isEmpty(data.email))){//validation
                Dialog.warning(i18nCommon.WARNING.LOGIN.FIND_PASSWORD_PUT);   
            } else {
                
                var validateObject=_V.validate([
                    {
                        validator:_V.number,
                        value:data.id,
                        message:"아이디가 올바르지 않습니다."
                    },
                    {
                        validator:_V.email,
                        value:data.email,
                        message:"이메일이 올바르지 않습니다." 
                    }
                ]);
                
                if (validateObject.isValid){//Email 유효성 검사
                    _view.findPasswordSection.find("#findPasswordBtn").button("loading");
        	        var _spin=new Spin(opts).spin(_view.findPasswordSection.find("#findPasswordBtn").find(".spinIcon")[0]);
        	        _view.findPasswordSection.find("#findCloseBtn").button("loading");
        	        
                    SessionModel.findPassword({id: data.id, email:data.email}).done(function(result){
                        
    					Dialog.show(i18nCommon.SUCCESS.LOGIN[result.message],function(){
    					    
                            // _view.findPasswordSection.find("#findPasswordBtn").button("reset");
                            // _view.findPasswordSection.find("#findCloseBtn").button("reset");
                            window.location="http://webmail.yescnc.co.kr";
                            //_view.findPasswordSection.find("#findCloseBtn").trigger("click");
    					});
                    }).fail(function(e){
                        Dialog.warning(i18nCommon.WARNING.LOGIN[e.message]);
                        _view.findPasswordSection.find("#findPasswordBtn").button("reset");
                        _view.findPasswordSection.find("#findCloseBtn").button("reset");
                    });
                } else {
                    Dialog.warning(validateObject.message);   
                }
            }
            return false;
    	},
    	close:function(){// 창 다 닫기
           // this.formSection.removeClass("bounceIn");
           // this.passwordSection.removeClass("fadeInRightBig");
            //this.loginPasswordSection.removeClass("fadeInRightBig");
           // this.findPasswordSection.removeClass("fadeUpRightBig");
            
            this.formSection.addClass("bounceOut");
            this.passwordSection.addClass("fadeOutRightBig");
            //his.loginPasswordSection.addClass("fadeOutRightBig");
           // this.findPasswordSection.removeClass("fadeDownRightBig");
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