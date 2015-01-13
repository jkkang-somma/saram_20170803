define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'dialog',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'collection/sm/UserCollection',
  'views/sm/AddUserView',
  'models/sm/UserModel',
], function($, _, Backbone, BaseView, Grid, Schemas, Dialog, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  UserCollection, AddUserView, UserModel){
    var userListCount=0;
    var UserListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var userCollection= new UserCollection();
    	    var _id="userList_"+(userListCount++);
    		this.option = {
    		    el:_id+"_content",
    		    column:["사번", "이름", "부서", "name_commute", "입사일", "퇴사일", "권한"],
    		    dataschema:["id", "name", "dept_name", "name_commute", "join_company", "leave_company", "privilege"],
    		    collection:userCollection,
    		    buttons:[],
    		    detail:true
    		    //gridOption
    		}
    	},
    	render:function(){
    	    //this.beforeRender();
    	    var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    
    	    //Head 
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"User Manager ", subTitle:"User list"})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
    	    //Button Group
    	    var _refreshBtn=$(ButtonHTML);
    	    _refreshBtn.attr("id", "userList_refreshBtn");
            _refreshBtn.addClass(_glyphiconSchema.value("refresh"));
            var _addshBtn=$(ButtonHTML);
    	    _addshBtn.attr("id", "userList_addshBtn");
            _addshBtn.addClass(_glyphiconSchema.value("add"));
            var _removeBtn=$(ButtonHTML);
    	    _removeBtn.attr("id", "userList_removeBtn");
            _removeBtn.addClass(_glyphiconSchema.value("remove"));
            
            var _btnBox=$(RightBoxHTML);
            
            _btnBox.append(
                    '<div class="input-group-sm">'+
                        '<input type="text" class="form-control" placeholder="Search for...">'+
                        '<span class="input-group-btn">'+
                            '<button class="btn btn-default btn-sm btn-success" type="button"><span class="glyphicon glyphicon-search" aria-hidden="true"></button>'+
                        '</span>'+
                    '</div>'
            );
  
  
            _btnBox.append(_addshBtn);
            _btnBox.append(_removeBtn);
            _btnBox.append(_refreshBtn);
            //_head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	    _layOut.append(_head);
    	    _layOut.append(_btnBox);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.option));
    	    
    	     _refreshBtn.click(function(){
                _view.render();
            });
    	    _addshBtn.click(function(){
                var addUserView= new AddUserView();
                Dialog.show({
                    title:"Registration User", 
                    content:addUserView
                    , 
                    buttons:[{
                        label: "Add",
                        cssClass: Dialog.CssClass.SUCCESS,
                        action: function(dialogRef){// 버튼 클릭 이벤트
                            addUserView.submitAdd().done(function(model){
                                grid.addRow(model.attributes);
                                dialogRef.close();
                                Dialog.show("Complete Add User.");
                            });//실패 따로 처리안함 add화면에서 처리.
                        }
                    }, {
                        label: 'Close',
                        action: function(dialogRef){
                            dialogRef.close();
                        }
                    }]
                    
                });
            });
            _removeBtn.click(function(){
               var selectItem=grid.getSelectItem();
               if (_.isUndefined(selectItem)){
                   Dialog.warning("Plese Select User.");
               } else {
                   selectItem._id="-1";
                   Dialog.confirm({
                       msg:"Do you want Delete User?",
                       action:function(){
                           var userModel=new UserModel(selectItem);
                           return userModel.remove();
                       },
                       actionCallBaCK:function(res){//response schema
                           if (res.status){
                               grid.removeRow(selectItem);
                           }
                       }
                   });
               }
            });
          //  this.affterRender();
     	}
    });
    
    return UserListView;
});