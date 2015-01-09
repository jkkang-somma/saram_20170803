define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/commuteListTemplete.html',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, animator, BaseView, commuteListTmp, CommuteCollection){
  var reportListView = BaseView.extend({
    el:$(".main-container"),
   
  	initialize:function(){
  		this.collection = new CommuteCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(commuteListTmp);
      // title setting
      this.setTitleTxt();
      // button Setting
      this.setBottomButtonCon();
      // table setting
      this.setReportTable();
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태보고 관리');
      
      return this;
    },
    
    setBottomButtonCon : function(){
      var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      bottomBtnCon.css('float','right');
      bottomBtnCon.empty();
      
      // approval Button
      var approvalBtn = $('<button class="btn btn-default">결재</button>');
      approvalBtn.attr('id','btnApprovalPop');
      bottomBtnCon.append(approvalBtn);
      
      // add new report button
      var addReportBtn = $('<button class="btn btn-default">신규 상신</button>');
      addReportBtn.attr('id','btnAddReport');
      addReportBtn.css('margin-left','10px');
      bottomBtnCon.append(addReportBtn);
      
      return this;
    },
    
    setReportTable : function(){
      // list Element
      // var commuteTbl = $(this.el).find('#commuteManageTbl');
      if( $.fn.DataTable.isDataTable( $(this.el).find("#commuteManageTbl") ) )
   	        $(this.el).find("#commuteManageTbl").parent().replaceWith("<table id='commuteManageTbl'></table>");
   	    
 	    $(this.el).find("#commuteManageTbl").dataTable({
 	        "data" : this.collection.toJSON(),
 	        "columns" : [
 	            { data : "request-date", "title" : "일자" },
              { data : "id", "title" : "ID" },
              { data : "name", "title" : "이름"},
              { data : "work_type", "title" : "구분"},
              { data : "over_work_bonus", "title" : "처리내용"},
              { data : "late_time", "title" : "신청일자"},
              { data : "over_work_time", "title" : "업데이트일자"},
              { data : "start_work_time", "title" : "처리상태"}
 	        ]
 	    });
 	    
      return this;
    }
    
  });
  return reportListView;
});