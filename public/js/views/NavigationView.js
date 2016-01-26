define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'dialog',
  'i18n!nls/common',
  'core/BaseView',
  'text!templates/navigation.html',
  'data/menu',
  'code',
  'models/sm/SessionModel',
  'models/common/RawDataModel',
  'views/sm/ConfigUserView',
  'views/AdminSettingView',
  'views/DocumentView'
], function($, _, Backbone, animator,Dialog, i18Common, 
		BaseView, navigation, Menu, Code,
		SessionModel, RawDataModel,
		ConfigUserView, AdminSettingView, DocumentView
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
            for (var subName in _subMenu){
                var subMenu=_subMenu[subName];
                if (subMenu.auth <= _auth){//로그인 사용자의 admin 값보다 같거나 작을 때만 보여짐
                    var subLi=$(_subliTag);
                    var subA=$('<a href="'+subMenu.hashTag+'">'+subMenu.title+'</a>');
                    subLi.append(subA);
                    subUl.append(subLi);
                }
            }
            li.append(subUl);
            _leftMenu.append(li);
        }
        
	    var ip_office = SessionModel.getUserInfo().ip_office;
	    if ( ip_office == "" || _.isNull(ip_office) || _.isUndefined(ip_office)) { 
        // if ( ip_office == "" || _.isNull(ip_office) || _.isUndefined(ip_office) || isOnLoginModule && isMobile.any()) { 
        	$(this.el).find('#accessIn').remove();
        	$(this.el).find('#accessOut').remove();
        }
        
        if(_auth == 1){
            $("#setting").html('<span class="glyphicon glyphicon-cog"></span> 설정');    
        }else{
            $(this.el).find('#setting').remove();
        }
        $("#userConifg").html('<span class="glyphicon glyphicon-user"></span> ' + SessionModel.getUserInfo().name);
        animator.animate(this.el, animator.FADE_IN_DOWN);
        
        $("#document").html('<span class="glyphicon glyphicon-file"></span>  양식');
    },
    events: {
		'click #logout': 'logout',
		'click #userConifg' :'userConifg',
		'click #accessIn' : 'accessIn',
		'click #accessOut' : 'accessOut',
		'click #setting' : 'setting',
		'click #document' : 'document'
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
	
	accessIn: function() {	// 출근 기록
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
                clearInterval(myVar);
                obj.mac='';
                obj.ip_pc='';
            // }
            
            obj.type='출근(Web)';
            var model = new RawDataModel();
            model.companyAccessUrl().save(obj,{
                success: function(model, response) {
                    Dialog.show("출근 등록 되었습니다.\n"+ "출근시간 : " + response.data.char_date );
                }, 
                error : function(model, res){
                    Dialog.error("출근 등록이 실패했습니다.");
                }
            });
        }
	},
	
	
	
// 		type : req.body.type,
// 		ip_pc : req.body.ip,
// 		mac : req.body.mac,
// 		ip_office : req.ip
	
	accessOut: function() { // 퇴근 기록
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
                clearInterval(myVar);
                obj.mac='';
                obj.ip_pc='';
            // }
            
            obj.type='퇴근(Web)';
            var model = new RawDataModel();
            model.companyAccessUrl().save(obj, {
                success: function(model, response) {
                    Dialog.show("퇴근 등록 되었습니다.\n퇴근시간 : " + response.data.char_date );
                }, 
                error : function(model, res){
                    Dialog.error("퇴근 등록이 실패했습니다.");
                }
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
	}
	
  });
  return NavigationView;
});
