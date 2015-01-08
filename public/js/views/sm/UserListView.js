define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/default/right.html',
  'text!templates/default/button.html',
  'text!templates/layout/default.html',
  'collection/sm/UserCollection',
], function($, _, Backbone, BaseView, Grid, Schemas, HeadHTML, ContentHTML, RightBoxHTML, ButtonHTML, LayoutHTML,  UserCollection){
    var userListCount=0;
    var UserListView = BaseView.extend({
        el:".main-container",
    	initialize:function(){
    	    var userCollection= new UserCollection();
    	    var _id="userList_"+(userListCount++);
    		this.gridOption = {
    		    el:_id+"_content",
    		    column:["사번", "이름", "부서", "name_commute", "입사일", "퇴사일", "권한"],
    		    dataschema:["id", "name", "department", "name_commute", "join_company", "leave_company", "privilege"],
    		    collection:userCollection,
    		    buttons:[]
    		}
    	},
    	render:function(){
    	    //this.beforeRender();
    	    var _view=this;
    	    var _headSchema=Schemas.getSchema('headTemp');
    	    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    	    var _headTemp=_.template(HeadHTML);
    	    var _layOut=$(LayoutHTML);
    	    var _head=$(_headTemp(_headSchema.getDefault({title:"User Manager ", subTitle:"User list"})));
    	    _head.addClass("no-margin");
    	    _head.addClass("relative-layout");
    	    
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
            _btnBox.append(_addshBtn);
            _btnBox.append(_removeBtn);
            _btnBox.append(_refreshBtn);
            _head.append(_btnBox);
    	    
    	    var _content=$(ContentHTML).attr("id", this.gridOption.el);
    	    _layOut.append(_head);
    	    _layOut.append(_content);
    	    $(this.el).html(_layOut);

    	    var _gridSchema=Schemas.getSchema('grid');
    	    var grid= new Grid(_gridSchema.getDefault(this.gridOption));
    	    
    	     _refreshBtn.click(function(){
                _view.render();
            });
    	    _addshBtn.click(function(){
                var selectItem=grid.getSelectItem();
            });
            _removeBtn.click(function(){
               var selectItem=grid.getSelectItem();
            });
          //  this.affterRender();
     	}
    });
    
    return UserListView;
});