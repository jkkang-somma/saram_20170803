define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'css!tool/monthpicker/bootstrap-monthpicker.css',
  'js/tool/monthpicker/bootstrap-monthpicker.js',
  ], function($, _, Backbone, log, monthpickerTemp){
    var LOG=log.getLogger('MonthPicker');
    var monthArr=0;
    var MonthPicker = Backbone.View.extend({
        events:{
    		  //"click #loginbtn":"submitLogin",
    		  //"click #passwordCommit" : "commitPassword"
    	},
    	initialize:function(option){
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'onSelect');
    		_.bindAll(this, 'onClick');
    		this.monthpicker_id="monthpicker_"+(monthArr++);
    		this.callBack=option.callBack;
    		this.el=option.el;
    		this.render();
    	},
    	
    	render:function(){
    	    var view=this;
    	    var defaultData=["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    	    
    	    var btn= $("<button class='btn btn-default btn-success'>변경</button>");
    	    btn.click(function(){
                view.onClick();  
    	    });
    	    
          $(this.el).html(btn);
    	    $(".main-container").append("<input type='hidden' id='"+this.monthpicker_id+"'/>");
    	    $("#"+this.monthpicker_id).val(new Date().getFullYear()+"-"+(new Date().getMonth(+1)));
    	    $("#"+this.monthpicker_id).bootstrapMonthpicker({
    	        onSelect:function(value){
    	            // 변형하여 셋팅
    	            view.onSelect(value);
    	        }    
    	    });
     	},
     	onSelect:function(value){
     	    this.callBack(value);
     	},
     	onClick:function(){
     	    $("#"+this.monthpicker_id).click();
     	}
    });
    return MonthPicker;
});