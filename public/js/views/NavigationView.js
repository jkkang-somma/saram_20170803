define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'dialog',
  'util',
  'schemas',
  'i18n!nls/common',
  'core/BaseView',
  'text!templates/navigation.html',
  'data/menu',
  'code',
  'models/sm/SessionModel',
  'models/common/RawDataModel',
  'views/sm/ConfigUserView',
  'views/AdminSettingView',
  'views/DocumentView',
  'views/BookView',
  'views/rm/AddNewReportView',
], function($, _, Backbone, animator,Dialog, Util, Schemas, i18Common, 
		BaseView, navigation, Menu, Code,
		SessionModel, RawDataModel,
		ConfigUserView, AdminSettingView, DocumentView, BookView, AddNewReportView
){
  
  var NavigationView = BaseView.extend({
    el: "#mainNavigation",
  	initialize:function(){
  		_.bindAll(this, 'render');
  		_.bindAll(this, 'show');
  		_.bindAll(this, 'hide');
  	},  	
    render: function(){
        $(this.el).append(navigation);
        var _auth= SessionModel.getUserInfo().admin;
        var _liTag='<li class="dropdown"></li>';     
        var _aTag='<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"></a>';
        var _subUlTag='<ul class="dropdown-menu" role="menu"></ul>';
        var _subliTag="<li></li>";
        
        var _leftMenu=$("#top_menu_left");
        
        for (var name in Menu) {//상위 메뉴 생성
            var _menu=Menu[name];
            
            var li=$(_liTag);
            var a=$(_aTag);
            a.html(_menu.title+'<span class="caret"></span>');
            li.append(a);
            
            var _subMenu=_menu.subMenu;//하위 메뉴 생성
            var subUl=$(_subUlTag);
            var subCount = 0;
            
            for (var subName in _subMenu){
                var subMenu=_subMenu[subName];
                if (subMenu.auth <= _auth){//로그인 사용자의 admin 값보다 같거나 작을 때만 보여짐
                    var subLi=$(_subliTag);
                    var subA=$('<a href="'+subMenu.hashTag+'">'+subMenu.title+'</a>');
                    subLi.append(subA);
                    subUl.append(subLi);
                    subCount ++;
                }
            }
            
            if(subCount > 0){
            	li.append(subUl);
            	_leftMenu.append(li);
            }
        }
        
        var ip_office = SessionModel.getUserInfo().ip_office;
        var ip_pc = SessionModel.getUserInfo().ip_pc;
        if ( (ip_office != "" && !_.isNull(ip_office) && !_.isUndefined(ip_office))
            || (ip_pc != "" && !_.isNull(ip_pc) && !_.isUndefined(ip_pc)) ){ 
            var agent = navigator.userAgent.toLowerCase();
            var filter = "win16|win32|win64|mac";
            var platform = navigator.platform.toLowerCase();
            if(agent.indexOf("chrome") < 0 && agent.indexOf("firefox") < 0 && filter.indexOf(platform) > -1){ // 크롬, 모바일이 아닐 경우 
                $(this.el).find('#accessIn').remove();
                $(this.el).find('#accessOut').remove();
                if(agent.indexOf("chrome") < 0){
                    Dialog.info("출근/퇴근 등록은 크롬이나 파이어폭스에서 해주시기 바랍니다.");
                }
            }else{
                var isAttend = SessionModel.isAttend //출근 버튼 선택 후 로그인시 처리
                if(!_.isNull(isAttend)
                && !_.isUndefined(isAttend)
                && isAttend) {
                    this.accessIn(isAttend)
                }
            }
        }else{
            $(this.el).find('#accessIn').remove();
            $(this.el).find('#accessOut').remove();
        }
        
        if(_auth == Schemas.ADMIN){
            $("#setting").html('<span class="glyphicon glyphicon-cog"></span> 설정');    
        }else{
            $(this.el).find('#setting').remove();
        }
        $("#userConifg").html('<span class="glyphicon glyphicon-user"></span> ' + SessionModel.getUserInfo().name);
        animator.animate(this.el, animator.FADE_IN_DOWN);
        
        $("#apprAppend").html('<span class="glyphicon glyphicon-file"></span>  상신');
        $("#document").html('<span class="glyphicon glyphicon-file"></span>  양식');
        $("#book").html('<span class="glyphicon glyphicon-file"></span>  도서');
    },
    events: {
		'click #logout': 'logout',
		'click #userConifg' :'userConifg',
		'click #accessIn' : 'accessIn',
		'click #accessOut' : 'accessOut',
        'click #setting' : 'setting',
        'click #document' : 'document',
        'click #apprAppend' : 'apprAppend',
        'click #userConifg' :'userConifg',
		'click #book' : 'book'
    },
    show:function(){
      var _view=this;
      $(_view.el).fadeIn();
    },
    hide:function(callback){
      var _view=this;
      $(_view.el).fadeOut();
    },
	logout:function(){
		SessionModel.logout();
	},
	userConifg:function(){
		var configView=new ConfigUserView();
		Dialog.show({
            title:i18Common.DIALOG.TITLE.USER_UPDATE, 
            content:configView, 
            buttons:[{
                label: i18Common.DIALOG.BUTTON.SAVE,
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef){// 버튼 클릭 이벤트
                    configView.submitSave().done(function(data){
                        dialogRef.close();
                    });//실패 따로 처리안함 add화면에서 처리.
                }
            }, {
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
            
        });
	},
    
    checkPlatformBrowser: function() {

        var platformType = "Unknown device";
        var browserType = "Unknown browser";

        if (navigator.platform.indexOf("Win") != -1) {
            if (navigator.userAgent.indexOf("NT 6.1") != -1) {
                platformType = "Windows 7";
            } else if (navigator.userAgent.indexOf("NT 10.0") != -1) {
                platformType = "Windows 10";  
            } else if (navigator.userAgent.indexOf("NT 6.0") != -1) {
                platfromType = "Windows Vista/Server 2008";
            } else if (navigator.userAgent.indexOf("NT 5.2") != -1) {
                platfromType = "Windows Server 2003";
            } else if (navigator.userAgent.indexOf("NT 5.1") != -1) {
                platfromType = "Windows XP";
            } else if (navigator.userAgent.indexOf("NT 5.0") != -1) {
                platfromType = "Windows 2000";
            } else {
                platfromType = "Windows";
            }

            if (navigator.userAgent.indexOf("Trident") != -1) {
                browserType = "IE";
            } else if (navigator.userAgent.indexOf("Chrome") != -1) {
                browserType = "Chrome";
            } else if (navigator.userAgent.indexOf("Opera") != -1) {
                browserType = "Opera";
            } else if (navigator.userAgent.indexOf("Firefox") != -1) {
                browserType = "Firefox";
            }
        } else if (navigator.platform.indexOf("Mac") != -1) {
            platformType = "Mac";
            if (navigator.userAgent.indexOf("Macintosh") != -1) {
                if (navigator.userAgent.indexOf("Chrome") != -1) {
                    browserType = "Chrome";
                } else if (navigator.userAgent.indexOf("Safari") != -1) {
                    browserType = "Safari";
                }
            } 

        } else if (navigator.platform.toLowerCase().indexOf("iphone") != -1) {
            platformType = "iPhone";
            if (navigator.userAgent.indexOf("iPhone") != -1) {
                if (navigator.userAgent.indexOf("CriOS") != -1) {
                    browserType = "Chrome";
                } else if (navigator.userAgent.indexOf("Safari") != -1) {
                    browserType = "Safari";
                }
            }
            
        } else if (navigator.platform.toLowerCase().indexOf("ipad") != -1) {
            platformType = "iPad";
            if (navigator.userAgent.indexOf("iPad") != -1) {
                if (navigator.userAgent.indexOf("CriOS") != -1) {
                    browserType = "Chrome";
                } else if (navigator.userAgent.indexOf("Safari") != -1) {
                    browserType = "Safari";
                }
            }
            
        } else if (navigator.userAgent.indexOf("Android") != -1 && navigator.userAgent.indexOf("Mobile") != -1) {
            platformType = "Android";
            if (navigator.userAgent.indexOf("OPR") != -1) {
                browserType = "Opera";
            } else if (navigator.userAgent.indexOf("SamsungBrowser") != -1) {
                    browserType = "Samsung";
            } else if (navigator.userAgent.indexOf("Chrome") != -1) {
                browserType = "Chrome";
            }  else if (navigator.userAgent.indexOf("Firefox") != -1) {
                browserType = "Firefox";
            }
        }

        return platformType + ", " + browserType;
    },

    accessIn: function(isAttend = false) {	// 출근 기록
        var $this = this;
        var myVar = setInterval(function(){ myTimer() }, 500);
        function myTimer() {
            var obj={};
            // if (isOnLoginModule){
            //     var status=LoginModule.status;
            //     if (status==2){
            //             clearInterval(myVar);
            //             var info=LoginModule.registIpInfos();
            //             obj = JSON.parse(info);
                        
            //     } else {
            //         clearInterval(myVar);
            //         Dialog.error("로긴 정보가 올바르지 않습니다.");
            //     }
            // } else {
                // clearInterval(myVar);
                // obj.mac='';
                // obj.ip_pc='';
            // }

            clearInterval(myVar);
            Util.getClientIp().always(function(result){
                obj.mac='';
                obj.ip_pc=result;
                obj.type='출근(온라인)';
                obj.platform_type = $this.checkPlatformBrowser();

                var model = new RawDataModel();
                model.companyAccessUrl().save(obj,{
                    success: function(model, response) {
                        Dialog.show({
                            title: "출근",
                            message:"출근 등록 되었습니다.\n"+ "출근시간 : " + response.data.char_date,
                            buttons:[{
                                label: "확인",
                                action: function(dialogRef){
                                    dialogRef.close();
                                    //var dateTime = response.data.char_date.split(' ');
                                    //window.location.href="#rawdatalist/"+response.data.id+"/"+dateTime[0];  //response.data.id  response.data.char_date
                                    if (isAttend) {
                                        window.location.href="#action" 
                                    } else {
                                        window.location.href="#rawdatalist";
                                    }                                    
                                }
                            }]
                            });
                    }, 
                    error : function(model, res){
                        Dialog.error("출근 등록이 실패했습니다.");
                    }
                });
            });
        }
	},
	
	
	
// 		type : req.body.type,
// 		ip_pc : req.body.ip,
// 		mac : req.body.mac,
// 		ip_office : req.ip
	
    accessOut: function() { // 퇴근 기록
        var $this = this;
        var myVar = setInterval(function(){ myTimer() }, 500);
        function myTimer() {
            var obj={};
            // if (isOnLoginModule){
            //     var status=LoginModule.status;
            //     if (status==2){
            //             clearInterval(myVar);
            //             var info=LoginModule.registIpInfos();
            //             obj = JSON.parse(info);
                        
            //     } else {
            //         clearInterval(myVar);
            //         Dialog.error("로긴 정보가 올바르지 않습니다.");
            //     }
            // } else {
                // clearInterval(myVar);
                // obj.mac='';
                // obj.ip_pc='';
            // }
            
            clearInterval(myVar);
            Util.getClientIp().always(function(result){
                obj.type='퇴근(온라인)';
                obj.mac='';
                obj.ip_pc=result;
                obj.platform_type = $this.checkPlatformBrowser();
                
                var model = new RawDataModel();
                model.companyAccessUrl().save(obj, {
                    success: function(model, response) {
                        Dialog.show({
                            title: "퇴근",
                            message: "퇴근 등록 되었습니다.\n퇴근시간 : " + response.data.char_date ,                        
                            buttons:[{
                                label: "확인",
                                action: function(dialogRef){
                                    dialogRef.close();
    //                                var dateTime = response.data.char_date.split(' '); 
    //                                window.location.href="#rawdatalist/"+response.data.id+"/"+dateTime[0];
                                    window.location.href="#rawdatalist";
                                }
                            }]
                            });
                    }, 
                    error : function(model, res){
                        Dialog.error("퇴근 등록이 실패했습니다.");
                    }
                });
            });
        }
	},
	
	setting:function(){
	    var adminSettingView=new AdminSettingView();
		Dialog.show({
            title:"관리자 설정", 
            content:adminSettingView, 
            buttons:[{
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
            
        });
	},
	
	document:function(){
	    var documentView=new DocumentView();
	    Dialog.show({
	        title:"주요 양식 다운로드",
	        content:documentView,
	        buttons:[{
	            label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
	        }]
	    });
    },
    
    apprAppend: function(){
        var _addNewReportView = new AddNewReportView();
        
        Dialog.show({
            title: "결재 상신",
            content: _addNewReportView,
            buttons: [{
                label: "상신",
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef) { // 버튼 클릭 이벤트
                    _addNewReportView.onClickBtnSend(dialogRef).done(function(model) {
                        window.location.href = "#reportmanager";
                        dialogRef.close();
                    });
                }
            }, {
                label: '닫기',
                action: function(dialogRef) {
                    dialogRef.close();
                }
            }]
        });
    },
	book:function(){
	    var bookView=new BookView();
	    Dialog.show({
	        title:"도서 다운로드",
	        content:bookView,
	        buttons:[{
	            label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function(dialogRef){
                    dialogRef.close();
                }
	        }]
	    });
	}
	
  });
  return NavigationView;
});
