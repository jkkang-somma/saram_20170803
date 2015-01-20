define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/navigation.html',
  'data/menu',
  'models/sm/SessionModel',
], function($, _, Backbone, animator, BaseView, navigation, Menu, SessionModel){
  
    
        // <li class="dropdown">
        //   <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">일반 관리<span class="caret"></span></a>
        //   <ul class="dropdown-menu" role="menu">
        //     <li><a href="#usermanager">사원 관리</a></li>
        //     <li><a href="#holidaymanager">휴일 관리</a></li>
        //     <li><a href="#vacation">연차 관리</a></li>
        //     <!--li class="divider"></li-->
        //   </ul>
        // </li>
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
        
        $("#userConifg").html('<span class="glyphicon glyphicon-user"></span> ' + SessionModel.getUserInfo().name);
        animator.animate(this.el, animator.FADE_IN_DOWN);
    },
    show:function(){
      var _view=this;
      $(_view.el).fadeIn();
    },
    hide:function(callback){
      var _view=this;
      $(_view.el).fadeOut();
    }
  });
  return NavigationView;
});