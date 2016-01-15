define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'text!templates/component/progressbar.html',
], function($, _, Backbone, BaseView,
ProgressbarHTML){
      var ProgressbarView = BaseView.extend({
      	initialize:function(){
      		
      	},
        render: function(){
          this.progressBar=$(_.template(ProgressbarHTML)({percent : 100}));
          return this.progressBar
        },
        disabledProgressbar : function(flag){
            var progressbar = this.progressBar;
            if(flag){
                progressbar.css("display","none");
            }else{
                progressbar.css("display","block");
            }
        },
        setPercent : function(percent){
            $(this.progressbar).css("width", percent+"%");
        }
      });
  return ProgressbarView;
});