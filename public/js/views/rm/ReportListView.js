define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'animator',
  'core/BaseView',
  'text!templates/commuteListTemplete.html',
  'collection/rm/ApprovalCollection',
  'bootstrap-datepicker',
], function($, _, Backbone, Util, animator, BaseView, commuteListTmp, ApprovalCollection, datepicker){
  var reportListView = BaseView.extend({
    el:$(".main-container"),
    
    events: {
  	  "click #commuteManageTbl tbody tr": "onSelectRow",
  	  "click #btnCommuteSearch": "onClickSearchBtn"
  	},
   
  	initialize:function(){
  		this.collection = new ApprovalCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(commuteListTmp);
      
      // title setting
      this.setTitleTxt();
      // datePickerPop setting
      this.setDatePickerPop();
      // button Setting
      this.setBottomButtonCon();
      // table setting
      this.setReportTable(false);
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태보고 관리');
      
      return this;
    },
    
    setBottomButtonCon : function(){
      var _this = this;
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
      
      // reportmanager/add
      addReportBtn.click(function(){
        location.href = '#reportmanager/add';
      });
       // reportmanager/approval
      approvalBtn.click(function(){
        var table = $(_this.$el).find("#commuteManageTbl").DataTable();
     		var selectData = table.row('.selected').data();
     		
     		if ( Util.isNotNull(selectData) ) {
         		 location.href = '#reportmanager/approval';
     		} else {
     			alert("결재 항목을 선택해주세요");
     		}
       
      });
      
      return this;
    },
    
    setDatePickerPop : function(){
      var pickerView = $(this.el).find(".openDatePicker");
      pickerView.datepicker({
          format: "yyyy/mm/dd",
          language: "kr",
          todayHighlight: true
      });
    },
    
    setReportTable : function(val){
      var formData = this.getSearchData(val);
      var view = this;
      this.collection.fetch({
     			reset : true, 
     			data: formData,
     			error : function(result) {
     				alert("데이터 조회가 실패했습니다.");
     			}
     		})
      .done(function(result){
        // list Element
        // var commuteTbl = $(this.el).find('#commuteManageTbl');
        if( $.fn.DataTable.isDataTable( $(view.el).find("#commuteManageTbl") ) )
     	        $(view.el).find("#commuteManageTbl").parent().replaceWith("<table id='commuteManageTbl'></table>");
     	    
   	    $(view.el).find("#commuteManageTbl").dataTable({
   	        "data" : result,
   	        "columns" : [
   	            { "title" : "신청일자", "render": function(data, type, row){
                  var dataVal = view.getDateFormat(row.submit_date);
                  return dataVal;
                }},
                { data : "submit_id", "title" : "ID" },
                { data : "submit_name", "title" : "이름"},
                { data : "office_code_name", "title" : "구분"},
                { "title" : "근태기간", "render": function(data, type, row){
                  var dataVal = row.start_date +"</br>~ " + row.end_date;
                  return dataVal;
                }},
                { "title" : "처리일자", "render": function(data, type, row){
                  var dataVal = view.getDateFormat(row.decide_date);
                  return dataVal;
                }},
                { data : "state", "title" : "처리상태"}
   	        ]
   	    });
      });
      return this;
    },
    
    getDateFormat : function(dateData){
      var d = new Date(dateData);
      
      var sDateFormat
        = d.getFullYear() + "-" + this.getzFormat(d.getMonth() + 1, 2) + "-" + this.getzFormat(d.getDate(), 2)
         + " " + this.getzFormat(d.getHours(), 2) + ":" + this.getzFormat(d.getMinutes(), 2) + ":" + this.getzFormat(d.getSeconds(), 2);
      
      console.log(sDateFormat);
      return sDateFormat;
    },
    
    getzFormat: function(s, len){
      var sZero = "";
      s = s + "";
      if(s.length < len){
        for(var i = 0; i < (len-s.length); i++){
          sZero += "0";
        }
      }
      return sZero + s;
    },
    
    getSearchData : function(val){
      var data = {};
      
      var startDate = $(this.el).find("#beforeDate").val();
      var endDate = $(this.el).find("#afterDate").val();
      
      if(val && (startDate == "" || endDate == "")){
        data["msg"] = "기간을 모두 입력 해주세요.";
        return data;
      }else{
        var start= new Date(startDate);
        var end=new Date(endDate);
        
        if(val && (start > end)){
          data["msg"] = "기간을 잘못 입력 하였습니다.";
          return data;
        }else{
          data["startDate"] = startDate;
          data["endDate"] = endDate;
        }
      }
      
      return data;
    },
    
    onSelectRow : function(evt){
      var $currentTarget = $(evt.currentTarget);
      if ( $currentTarget.hasClass('selected') ) {
      	$currentTarget.removeClass('selected');
      }
      else {
      	$(this.el).find('#commuteManageTbl tr.selected').removeClass('selected');
      	$currentTarget.addClass('selected');
      }
    },
    
    onClickSearchBtn : function(evt){
      var data = this.getSearchData(true);
      
      if(data["msg"] != undefined && data["msg"] != "") {
        alert(data["msg"]);
      } else {
        this.setReportTable(true);
      }
    }
    
  });
  return reportListView;
});