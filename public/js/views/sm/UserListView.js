define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'collection/sm/UserCollection',
  'views/sm/AddUserView',
  'views/sm/EditUserView',
  'models/sm/UserModel',
], function($, _, Backbone, BaseView, Grid, Schemas, i18Common, Dialog, SessionModel, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  UserCollection, AddUserView, EditUserView,  UserModel){
    var userListCount=0;
    var _currentFilter=0;
    var UserListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var view=this;
    	    var userCollection= new UserCollection();
    	    var _id="userList_"+(userListCount++);
    		this.option = {
    		    el:_id+"_content",
    		    column:[
    		        i18Common.USER.ID, i18Common.USER.NAME, 
    		        { "title" : i18Common.USER.DEPT, "render": function(data, type, row){
                        return row.dept_name;
                    }}
                    , i18Common.USER.NAME_COMMUTE, i18Common.USER.JOIN_COMPANY, i18Common.USER.LEAVE_COMPANY,
                    // { "title" : i18Common.USER.PRIVILEGE, "render": function(data, type, row){
                    //     var result=i18Common.CODE.PRIVILEGE_1;
                    //     if (row.privilege == 3){
                    //         result=i18Common.CODE.PRIVILEGE_3;
                    //     } else if (row.privilege == 2){
                    //         result=i18Common.CODE.PRIVILEGE_2;
                    //     }
                    //     return result;
                    // }},
                    { "title" : i18Common.USER.ADMIN, "render": function(data, type, row){
                        var result=i18Common.CODE.ADMIN_0;
                        if (row.admin > 0){
                            result=i18Common.CODE.ADMIN_1;
                        }
                        return result;
                    }}
                ],
    		    dataschema:["id", "name", "dept_code", "name_commute", "join_company", "leave_company", "admin"],
    		    collection:userCollection,
    		    detail:true,
    		    view:this
    		    //gridOption
    		}
    	},
    	render:function(){
    	    //this.beforeRender();
    	    var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:i18Common.PAGE.TITLE.USER_MANAGER, subTitle:i18Common.PAGE.SUB_TITLE.USER_LIST})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //grid button add;
    	    var _buttons=["search"];
    	    
    	    var _filterText=[i18Common.CODE.ALL, i18Common.CODE.WORKER, i18Common.CODE.LEAVE_USER]
    	    _buttons.push({//User Remove
    	        type:"custom",
    	        name:"filter",
    	        tooltip:"사용자 유형",
    	        filterBtnText:_filterText,
    	        click:function(_grid, _button){
    	           
    	           var filters=[
    	                function(){
    	                    return true;
    	                },
    	                function(data){
    	                    var _data=data[6];
    	                    return _.isEmpty(_data);
    	                },
    	                function(data){
    	                    var _data=data[6];
    	                    return !_.isEmpty(_data);
    	                }
    	           ];
    	           
                   if (_currentFilter==2){
                        _currentFilter=0;
                   } else {
    	                _currentFilter++;
                   }
                   
                   _button.html(_filterText[_currentFilter]);
                   _grid.setBtnText(_button, _filterText[_currentFilter]);
                   var filteredData = _grid.filtering(function(data){
                       var fn=filters[_currentFilter];
                       return fn(data);
                   }, "userType");
                }
    	    });
    	    
    	    if (this.actionAuth.add){
    	        _buttons.push({//User Add
        	        type:"custom",
        	        name:"add",
        	        tooltip:"사용자 등록",
        	        click:function(){
                        var addUserView= new AddUserView();
                        Dialog.show({
                            title:i18Common.DIALOG.TITLE.USER_ADD, 
                            content:addUserView, 
                            buttons:[{
                                label: i18Common.DIALOG.BUTTON.ADD,
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef){// 버튼 클릭 이벤트
                                    addUserView.submitAdd().done(function(data){
                                        grid.addRow(data);
                                        dialogRef.close();
                                        Dialog.show(i18Common.SUCCESS.USER.ADD);
                                    });//실패 따로 처리안함 add화면에서 처리.
                                }
                            }, {
                                label: i18Common.DIALOG.BUTTON.CLOSE,
                                action: function(dialogRef){
                                    dialogRef.close();
                                }
                            }]
                            
                        });
                    }
        	    });
    	    }
    	    
    	    if (this.actionAuth.edit){
        	    _buttons.push({//User edit
        	        type:"custom",
        	        name:"edit",
        	        tooltip:"사용자 수정",
        	        click:function(_grid){
        	            var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            var editUserView= new EditUserView(selectItem);
                            Dialog.show({
                                title:i18Common.DIALOG.TITLE.USER_UPDATE, 
                                content:editUserView, 
                                buttons:[{
                                    label: i18Common.DIALOG.BUTTON.INIT_PASSWORD,
                                    cssClass: Dialog.CssClass.SUCCESS,
                                    action: function(dialogRef){// 버튼 클릭 이벤트
                                        editUserView.initializePassword().done(function(data){
                                            grid.updateRow(data);
                                            dialogRef.close();
                                            Dialog.show(i18Common.SUCCESS.USER.SAVE);
                                        });//실패 따로 처리안함 add화면에서 처리.
                                    }
                                },{
                                    label: i18Common.DIALOG.BUTTON.SAVE,
                                    cssClass: Dialog.CssClass.SUCCESS,
                                    action: function(dialogRef){// 버튼 클릭 이벤트
                                        editUserView.submitSave().done(function(data){
                                            grid.updateRow(data);
                                            dialogRef.close();
                                            Dialog.show(i18Common.SUCCESS.USER.SAVE);
                                        });//실패 따로 처리안함 add화면에서 처리.
                                    }
                                }, {
                                    label: i18Common.DIALOG.BUTTON.CLOSE,
                                    action: function(dialogRef){
                                        dialogRef.close();
                                    }
                                }]
                                
                            });
                        }
                    }
        	    });
    	    }    
    	    
    	    
    	    if (this.actionAuth.remove){
        	    _buttons.push({//User Remove
        	        type:"custom",
        	        name:"remove",
        	        tooltip:"사용자 삭제",
        	        click:function(_grid){
                        var selectItem=_grid.getSelectItem();
                        if (_.isUndefined(selectItem)){
                            Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
                        } else {
                            selectItem._id="-1";
                            var dd=Dialog.confirm({
                                msg:i18Common.CONFIRM.USER.REMOVE, //"Do you want Delete User?",
                                action:function(){
                                   var userModel=new UserModel(selectItem);
                                   return userModel.remove();
                                },
                                actionCallBack:function(res){//response schema
                                    if (res.status){
                                        _grid.removeRow(selectItem);
                                        Dialog.show(i18Common.SUCCESS.USER.REMOVE);
                                    }
                                },
                                errorCallBack:function(){
                                    //dd.close();
                                }
                            });
                        }
                    }
        	    });
    	    }
    	    
    	    //Refresh
    	    _buttons.push("refresh");
    	    
    	    this.option.buttons=_buttons;
    	    
    	    //grid 
    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.option));
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	    
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);
          //  this.affterRender();
     	}
    });
    
    return UserListView;
});