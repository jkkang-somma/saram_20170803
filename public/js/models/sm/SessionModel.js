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
            var _saram=$.cookie('saram');
            if (_.isUndefined(_saram)){
                this.isLogin=false;
            }
            _.bindAll(this, "checkSession");
            //this.fetch();
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
        login : function(userinfo){// POST or PUT
            var dfd= new $.Deferred();
            this.save({user:userinfo}, {
                success:function(resultModel, result, s, sd){
                    var _login=result.isLogin;
                    if ((!_.isUndefined(result.isLogin)) && _login){
                        //Dialog.show($.cookie('saram'));
                        
                        //{"user":{"id":"140602","name":"이정구","password":"333","dept_code":"7100","dept_name":null,"name_commute":"이정구","join_company":"2014-06-10","leave_company":"","privilege":"3","admin":0},"id":"ZW0csQEVea2ZN1uVVCpjY7mOnEpYzFov","auth":null,"isLogin":true,"initPassword":false,"msg":null}
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
                }
            });
        },
        wait:false
        
    });
    return new SessionModel();
});