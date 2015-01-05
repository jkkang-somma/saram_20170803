// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore', 
  'backbone',
  'log',
  'util',
  'dialog',
  'models/sm/SessionModel'
], function($, _, Backbone, log, Util, Dialog, SessionModel){
    var LOG=log.getLogger('SessionManager');
    //Singleton SessionManager;
    var SessionManager=function(){
    	LOG.debug('Create Singleton SessionManager');
		var sessionModel=new SessionModel();
		var session;
		//var sessionModel;
		//세션 정보 서버 요청 매서드
		var createModel=function(){
			//sessionModel= new SessionModel();
			return sessionModel.get();
		}
		
		//로그인 요청 매서드
		var signIn=function(data){
			//sessionModel=new SessionModel();
			LOG.debug(data);
			sessionModel.login(data).done(function(result){
				LOG.debug(result.data);
				
				init
			}).fail(function(msg){
				Dialog.error("Error:002"+msg);
			});
	  		//SessionModel.login(data);
		}
		//로그아웃 요청 매서드
		var signOut=function(){
		}
		//세션 정보 요청 매서드
		var createSession=function(){
			var dfd= new $.Deferred();
			if (Util.isNotNull(session)){
				dfd.resolve(session);
			} else {
				createModel().done(function(obj){
	    			LOG.debug('Create Session Success.');
	    			session=obj;
	    			LOG.debug('My Session Info.');
	    			LOG.debug(session);
	    			dfd.resolve(session.data);
	    		}).fail(function(){
	    			LOG.error('Create Session Fail.');
	    			dfd.reject();
	    		});
			}
			return dfd.promise();
		}
		var getSession=function(){
			return session;
		}
		return {
			signIn:signIn,
			signOut:signOut,
			getSession:getSession,
			createSession:createSession,
		}
    };
    
    var INSTANCE;
    return {
    	getInstance:function(){
    		if (Util.isNull(INSTANCE)){
    			INSTANCE= new SessionManager();
    		}
    		return INSTANCE;
    	}
    };
});