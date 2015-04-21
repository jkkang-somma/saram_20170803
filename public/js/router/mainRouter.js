// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18

define([
	'jquery',
	'underscore',
	'backbone',
	'animator',
	'util',
	'log',
	'dialog',
  	'data/menu',
  	'i18n!nls/common',
	'models/sm/SessionModel',
	'core/BaseRouter',
	'views/dashboard/DashBoardView',
	'views/LoginView',
	'views/NavigationView',
	'views/sm/UserListView',
	'views/RawData/AddRawDataView',
	'views/RawData/RawDataView',
	'views/Holiday/HolidayManagerView',
	'views/cm/CommuteListView',
	'views/cm/CreateDataView',
	'views/cm/CommuteCommentView',
	'views/vacation/VacationView',
	'views/rm/ReportListView',
	'views/report/ReportCommuteView'
], function($, _,  Backbone, animator, Util, log, Dialog, Menu, i18Common, SessionModel, BaseRouter,
DashBoardView, LoginView, NavigationView, // Main View
UserListView,
AddRawDataView,RawDataView, HolidayManagerView, // 근태관리
CommuteListView, CreateDataView, CommuteCommentView, // CM View
VacationView, 
ReportListView, // report manager
ReportCommuteView
){
	var LOG=log.getLogger('MainRouter');
	var mainContainer='.main-container';
	var loginContainer='.login-container';
	var LOGIN='login';
	
	var Router = BaseRouter.extend({
		routes : {
			'usermanager' : 'showUserList',
			'addrawdata' : 'showAddRawData',
			'createdata' : 'showCreateData',
			'holidaymanager' : 'showHolidayManager',
			'commutemanager' : 'showCommuteManager',
			'commutemanager/comment' : 'showCommuteComment',
			'vacation' : 'showVacation',
			'vacation/:id/:year' : 'showVacationDetail',
			'rawdatalist' : 'showRawdata',
			'reportmanager' : 'showReportManager',
			'reportCommute' : 'showReportCommute',
			'accessIn' : 'accessIn',
			'accessOut' : 'accessOut',
			'*actions' : 'showHome'

		},
		initialize:function(option){
			var affterCallback,beforeCallback;
			if (Util.isNotNull(option)){
				for (var name in option){
					if (name=="affterCallback"||name=="beforeCallback"){
						affterCallback=option[name];
					}
				}
			}
			if (Util.isNotNull(beforeCallback)&&_.isFunction(beforeCallback)){
				beforeCallback();
			} 
			
			if (Util.isNotNull(affterCallback)&&_.isFunction(affterCallback)){
				affterCallback(); 
			} 
		},
		
		before : function(url, next){
			var _nextURL="#"+url;
			var router=this;
			var sessionUser=SessionModel.getUserInfo();
			
			var auth=sessionUser.admin;
			LOG.debug(_nextURL);
			if (auth==1||_nextURL=="#"){//어드민일 경우
				return next();
			}
			
			var subMenu=_.pluck(Menu, "subMenu");
			
			subMenu=subMenu[0].concat(subMenu[1]);
			var _authArr=_.pluck(subMenu, "auth");
			var _urlArr=_.pluck(subMenu, "hashTag");
		
			var index= _.indexOf(_urlArr, _nextURL);
			if (_authArr[index] <= auth){ // 권한 있을 시
				return next();
				LOG.debug("next");
			} else {//권한 없을 때
				var isSubTag= false;
				for (var index in _urlArr){
					var subIndex=_nextURL.indexOf(_urlArr[index]);
					if (subIndex> -1){
						if (!_.isUndefined(subMenu[index].subTag)){
							var configURL=_urlArr[index]+subMenu[index].subTag;
							var configURLTokenArr=configURL.split("/");
							var nextURLTokenArr=_nextURL.split("/");
			 
							if (configURLTokenArr.length==nextURLTokenArr.length){
								isSubTag=true;
							}
						};
					}
				}
			 
				if (isSubTag){
					return next();
				} else {
					LOG.debug("back");
					window.history.back();
				}
			}
		},
		
		after : function(){
		},
		
		changeView : function(view, url){
			LOG.debug("Initalize changeView");
		    if(this.currentView)
				this.currentView.close();

	        this.currentView = view;
	        //view.initialize();
	        if (!_.isUndefined(url)){
	        	var sessionUser=SessionModel.getUserInfo();
			
				var auth=sessionUser.admin;
				
				var subMenu=_.pluck(Menu, "subMenu");
				
				subMenu=subMenu[0].concat(subMenu[1]);
				var _urlArr=_.pluck(subMenu, "hashTag");
				var index= _.indexOf(_urlArr, url);
				var attrKeys=_.keys(subMenu[index]); 
				var hasActionAuth=_.indexOf(attrKeys, "actionAuth");
				if (hasActionAuth!=-1){
					var actionAuth=subMenu[index].actionAuth;
					var _configActionAuth={};
					
					for (var name in actionAuth){//버튼 권한별 셋팅.
						_configActionAuth[name]=actionAuth[name]<=auth?true:false;
					}
					
					view.setActionAuth(_configActionAuth);
				}
	        }
	       
	        
    		view.render();
    		animator.animate($(view.el), animator.FADE_IN);	
		},
		
		showUserList : function(r){
			LOG.debug("Initalize showUserList");
			var userListView = new UserListView();
			this.changeView(userListView, "#usermanager");
		},
		
		showAddRawData : function(){
			var addRawDataView = new AddRawDataView();
			this.changeView(addRawDataView);
		},
		
		showCreateData : function(){
			var createDataView = new CreateDataView();
			this.changeView(createDataView);
		},
		
		showHome : function(){
		    var dashBoardView = new DashBoardView({el:mainContainer});
		    this.changeView(dashBoardView);
		},
		showHolidayManager : function(){
			var holidayManagerView = new HolidayManagerView();
			this.changeView(holidayManagerView);
		},
		
		showCommuteManager : function(){
			var commuteListView = new CommuteListView();
			this.changeView(commuteListView);
		},
		
		showVacation : function() {
			var vacationView = new VacationView();
			this.changeView(vacationView);
		},
		
		showCommuteComment : function(){
			var commuteCommentView = new CommuteCommentView();
			this.changeView(commuteCommentView);
		},
		
		showCommuteCommentListCount : function(id, date) { // url + 검색 조건을 토한 페이지 이동 
			var commuteCommentView = new CommuteCommentView();
			commuteCommentView.setSearchParam({"id": id, "date": date});
			this.changeView(commuteCommentView);			
		},
		
		showRawdata : function(){
			var rawDataView = new RawDataView();
			this.changeView(rawDataView);
		},
		
		showReportManager : function(){
			var reportListView = new ReportListView();
			this.changeView(reportListView);
		},
		showReportCommute : function() {
			var reportCommuteView = new ReportCommuteView();
			this.changeView(reportCommuteView);			
		}
	});
	return Router;
});