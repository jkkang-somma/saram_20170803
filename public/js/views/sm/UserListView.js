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
    	    var _defatulInputGroup=$('<div class="input-group input-group-sm"></div>');
    	    var _defaultSearchInput=$('<input type="text" class="form-control" placeholder="Search">');
    	    _defaultSearchInput.addClass('yes-form-control');
    	    
    	    _defatulInputGroup.append(_defaultSearchInput);
    	    _defatulInputGroup.css({display:"table"});
    	    var _defaultGroupBtnTag='<span class="input-group-btn"></span>';
    	    var _defaultBtnTag='<button class="btn btn-default btn-sm btn-success" type="button"></button>';
    	    
    	    //SearchButton
            var _searchIcon=$(ButtonHTML);
    	    _searchIcon.attr("id", "userList_searchBtn");
            _searchIcon.addClass(_glyphiconSchema.value("search"));
            var _searchBtn=$(_defaultBtnTag);
            _searchBtn.append(_searchIcon);
            _searchBtn.css({"border-radius":"0px"});
            _searchBtn.css({"border-color":"transparent"});
            _searchBtn.css({"transition":"border-color .5s, background .5s"});
            
            _defatulInputGroup.append($(_defaultGroupBtnTag).append(_searchBtn));
    	    
            //AddButton
            var _addshIcon=$(ButtonHTML);
    	    _addshIcon.attr("id", "userList_addshBtn");
            _addshIcon.addClass(_glyphiconSchema.value("add"));
            var _addshBtn=$(_defaultBtnTag);
            _addshBtn.append(_addshIcon);
            _addshBtn.css({"border-radius":"0px"});
            _addshBtn.css({"border-color":"transparent"});
            _addshBtn.css({"transition":"border-color .5s, background .5s"});
            _defatulInputGroup.append($(_defaultGroupBtnTag).append(_addshBtn));
            
            //EditButton
            var _editIcon=$(ButtonHTML);
    	    _editIcon.attr("id", "userList_addshBtn");
            _editIcon.addClass(_glyphiconSchema.value("edit"));
            var _editBtn=$(_defaultBtnTag);
            _editBtn.append(_editIcon);
            _editBtn.css({"border-radius":"0px"});
            _editBtn.css({"border-color":"transparent"});
            _editBtn.css({"transition":"border-color .5s, background .5s"});
            _defatulInputGroup.append($(_defaultGroupBtnTag).append(_editBtn));
            
            //RemoveButton
            var _removeIcon=$(ButtonHTML);
    	    _removeIcon.attr("id", "userList_removeBtn");
            _removeIcon.addClass(_glyphiconSchema.value("remove"));
            var _removeBtn=$(_defaultBtnTag);
            _removeBtn.css({"border-radius":"0px"});
            _removeBtn.css({"border-color":"transparent"});
            _removeBtn.css({"transition":"border-color .5s, background .5s"});
            _removeBtn.append(_removeIcon);
            _defatulInputGroup.append($(_defaultGroupBtnTag).append(_removeBtn));
            
    	    //RefreshButton
    	    var _refreshIcon=$(ButtonHTML);
    	    _refreshIcon.attr("id", "userList_refreshBtn");
            _refreshIcon.addClass(_glyphiconSchema.value("refresh"));
            var _refreshBtn=$(_defaultBtnTag);
            _refreshBtn.css({"border-color":"transparent"});
            _refreshBtn.css({"transition":"border-color .5s, background .5s"});
            _refreshBtn.append(_refreshIcon);
            _defatulInputGroup.append($(_defaultGroupBtnTag).append(_refreshBtn));
            
    	    var _content=$(ContentHTML).attr("id", this.option.el);
    	    _layOut.append(_head);
    	    _layOut.append(_defatulInputGroup);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.option));
    	    
    	    _defaultSearchInput.on('keyup',function(key){
    	        console.log(this.value);
    	         grid.search(this.value,false,true);          
    	    });
    	    
    	    //refresh event
    	    _refreshBtn.click(function(){
                _view.render();
            });
            
            //add Event
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
            
            //remove event
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