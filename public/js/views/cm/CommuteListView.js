define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/commuteListTemplete.html',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, animator, BaseView, commuteListTmp, CommuteCollection){
  var commuteListView = BaseView.extend({
    el:$(".main-container"),
   
    events: {
        "click #btnCommuteSearch": "onClickBtnSearch",
        "click tr": "onClickListRow",
        "click td.editDateCol": "onClickListDateTime",
        "click #btnCommuteEdit" : "onClickEditPopOpen"
    },
   
  	initialize:function(){
  		this.collection = new CommuteCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(commuteListTmp);
      
      // list Element
      // var commuteTbl = $(this.el).find('#commuteManageTbl');
      if( $.fn.DataTable.isDataTable( $(this.el).find("#commuteManageTbl") ) )
   	        $(this.el).find("#commuteManageTbl").parent().replaceWith("<table id='commuteManageTbl'></table>");
   	    
 	    $(this.el).find("#commuteManageTbl").dataTable({
 	        "data" : this.collection.toJSON(),
 	        "columns" : [
 	            { data : "date", "title" : "일자" },
              { data : "team", "title" : "부서" },
              { data : "id", "title" : "ID" },
              { data : "name", "title" : "이름"},
              { data : "work_type", "title" : "근무타입"},
              { data : "over_work_bonus", "title" : "초과근무수당"},
              { data : "late_time", "title" : "지각시간"},
              { data : "over_work_time", "title" : "초과근무시간"},
              { data : "start_work_time", "title" : "출근시간"},
              { data : "end_work_time", "title" : "퇴근시간"},
              { data : "update_comment", "title" : "Comment"}
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
    },
    
    onClickEditPopOpen : function(event){
      
      return false;
    }
    
  });
  return commuteListView;
});