define([
  'jquery',
  'underscore',
  'backbone',
  'dialog'
], function($, _,Backbone, Dialog) {
    var SessionModel=Backbone.Model.extend({
        url: '/session',
        defaults : {
            
        },
        initialize : function(){
            _.bindAll(this, "checkSession");
            _.bindAll(this, "getUserInfo");
        },
        checkSession:function(){
            var _session=this;
            var dfd= new $.Deferred();
                this.save({},{
                    success:function(session, result){//{isLogin:false, id:req.session.id}
                        _session.isLogin=result.isLogin;
                        _session.set(result);
                        dfd.resolve(_session.isLogin);
                    },
                    error:function(e){
                        dfd.resolve(false);
                    }
                });
            return dfd.promise();
        },
        initPassword:function(userInfo){
            var dfd= new $.Deferred();
            this.save({initPassword:true, user:userInfo}, {
                success:function(resultModel, result, s, sd){
                    dfd.resolve(result);
                },
                error:function(e){
                    Dialog.error(e.msg);
                    dfd.reject();
                }
            });
            
            return dfd.promise();
        },
        findPassword:function(userInfo){
            var dfd= new $.Deferred();
            this.save({user:userInfo}, {
                url: "/session/findPassword",
                success:function(resultModel, result, s, sd){
                    dfd.resolve(result);
                },
                error:function(e, result){
                    dfd.reject(result.responseJSON);
                }
            });
            
            return dfd.promise();
        },
        login : function(userinfo){// POST or PUT
            var dfd= new $.Deferred();
            var that = this;
            this.save({initPassword:false, user:userinfo}, {
                success:function(resultModel, result, s, sd){
                    var _login=result.isLogin;
                    that.isAttend = userinfo.isAttend // 로그인시 출근 버튼(true) 클릭 여부
                    if ((!_.isUndefined(result.isLogin)) && _login){
                         dfd.resolve();
                    } else {
                        if (result.initPassword){
                            dfd.reject({user:result.user, msg:result.msg});
                        } else {  
                            dfd.reject({msg:result.msg});    
                        }
                        
                    }
                },
                error:function(e){
                    Dialog.error(e.msg);
                    dfd.reject();
                }
            });
            
            return dfd.promise();
        },
        logout : function(){
            var that = this;
            this.destroy({
                success : function(model, res){
                    model.clear();
                    model.id = null;
                    that.set({user_id : null, isLogin : false});
                    window.location.href="/";
                }
            });
        },
        getUserInfo:function(){
            return this.attributes.user;
        },    
        wait:false
    });
    return new SessionModel();
});