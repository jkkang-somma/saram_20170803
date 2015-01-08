define([
  'jquery',
  'underscore',
  'core/BaseView',
  'log',
  'text!templates/layout/top-center-90.html',
  'text!templates/dashboardTemplate.html',
  'monthpicker'
  ], function($, _, BaseView, log, top_center_layout, dashboardTemp, Monthpicker){
    var LOG=log.getLogger('DashBoardView');
    
    var DashBoardView = BaseView.extend({
      events:{
    		  //"click #loginbtn":"submitLogin",
    		  //"click #passwordCommit" : "commitPassword"
    	},
    	
    	initialize:function(){
    	  var view = this;
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'close');
    	},
    	
    	render:function(){
    	    var view=this;
    	    var _layoutTmp=_.template(top_center_layout);
    	    var layout=$(_layoutTmp({title_label:"2014년 12월 ",sub_title:""}));
    	    
    	    var _dashboardTemp=_.template(dashboardTemp);
    	    var defaultData={
    	      top_date:"(2014/12/01 ~ 2014/12/31)", 
    	      total_working_date:"총 근무 일수 : 10일",
    	      a:"6일",
    	      b:"1일",
    	      c:"0일",
    	      d:"1일",
    	      e:"1일",
    	      f:"1일",
    	      g:"1일"
    	    };
    	    
    	    var dashboard=$(_dashboardTemp(defaultData));
    	    layout.append(dashboard);
    	    $(this.el).html(layout); 
    	    
  	      var monthpicker=new Monthpicker({
  	        el:".btn-group", 
  	        callBack:function(value){
  	            view.render();
  	        }
    	    });
     	}
    });
    return DashBoardView;
});