define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/commuteListTemplete.html',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, animator, BaseView, commuteListTmp, CommuteCollection){
  var commuteCommentView = BaseView.extend({
    el:$(".main-container"),
   
    events: {
        "click #btnCommuteSearch": "onClickBtnSearch",
        "click tr": "onClickListRow",
        "click td.editDateCol": "onClickListDateTime"
    },
   
  	initialize:function(){
  		this.collection = new CommuteCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(commuteListTmp);
      
      // small title change
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('Comment 관리');
      
      // list Element
      // var commuteTbl = $(this.el).find('#commuteManageTbl');
      if( $.fn.DataTable.isDataTable( $(this.el).find("#commuteManageTbl") ) )
   	        $(this.el).find("#commuteManageTbl").parent().replaceWith("<table id='commuteManageTbl'></table>");
   	    
 	    $(this.el).find("#commuteManageTbl").dataTable({
 	        "data" : this.collection.toJSON(),
 	        "columns" : [
 	            { data : "date", "title" : "일자" },
              { data : "id", "title" : "ID" },
              { data : "name", "title" : "이름"},
              { data : "work_type", "title" : "접수내용"},
              { data : "over_work_bonus", "title" : "처리내용"},
              { data : "late_time", "title" : "신청일자"},
              { data : "over_work_time", "title" : "업데이트일자"},
              { data : "start_work_time", "title" : "처리상태"}
 	        ]
 	    });
    },
    
    onClickBtnSearch :  function(event){
      // search button
 	    console.log(event);
 	    return false;
    },
    
    onClickListRow : function(event){
      // row Select
      console.log(event);
      
      return false;
    },
    
    onClickListDateTime : function(event){
      // date or time edit
      console.log(event);
      
      return false;
    }
  });
  return commuteCommentView;
});