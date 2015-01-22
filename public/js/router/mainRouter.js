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
  	'i18n!nls/common',
	'models/sm/SessionModel',
	'core/BaseRouter',
	'views/DashBoardView',
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
], function($, _,  Backbone, animator, Util, log, Dialog, i18Common, SessionModel, BaseRouter,
DashBoardView, LoginView, NavigationView, // Main View
UserListView,
AddRawDataView,RawDataView, HolidayManagerView, // 근태관리
CommuteListView, CreateDataView, CommuteCommentView, // CM View
VacationView, 
ReportListView // report manager
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
			'commutemanager/comment/:id/:date' : 'showCommuteCommentListCount',
			'vacation' : 'showVacation',
			'rawdatalist' : 'showRawdata',
			'reportmanager' : 'showReportManager',
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
			LOG.debug(url);
			// var router=this;
			// var session=SessionModel.getInstance();
			
			// if(!session.isLogin){
			// 	if (url==LOGIN){// session이 없을 때 로그인화면으로 전환시 next()를 해줘야지 정상적으로 넘어감. 안그러면 계속 login으로 navigate함.
			// 		return next();
			// 	}
			// 	Backbone.history.navigate(LOGIN, { trigger : true });
			// }else{
			// 	return next();
			// } 
			return next();
		},
		
		after : function(){
		},
		
		changeView : function(view){
			LOG.debug("Initalize changeView");
		    if(this.currentView)
				this.currentView.close();

	        this.currentView = view;
	        view.initialize();
    		view.render();
    		animator.animate($(view.el), animator.FADE_IN);	
		},
		
		showUserList : function(){
			LOG.debug("Initalize showUserList");
			var userListView = new UserListView();
			this.changeView(userListView)
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
		}
	});

	return Router;
});