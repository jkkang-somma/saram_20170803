define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'bootstrap-datepicker',
], function($, _, Backbone, animator, BaseView, addReportTmp, CommuteCollection, datepicker){
  var addReportView = BaseView.extend({
    el:$(".main-container"),
   
  	events: {
  	  "click #btnAddReport": "onClickBtnSend"
  	},
  	
  	initialize:function(){
  		this.collection = new CommuteCollection();
  		
  		$(this.el).html('');
	    $(this.el).empty();
  	},
  	
    render: function(){
      $(this.el).append(addReportTmp);
      
      // title setting
      this.setTitleTxt();
      // default display setting
      this.setAddReportDisplay();
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('근태 상신 등록');
      
      return this;
    },
    
    setAddReportDisplay : function(){
      // table Setting
      this.setTableDisplay();
      // datePicker setting
      this.setDatePickerPop();
      // select box data setting
      this.setSelectBoxData();
      // button Setting
      this.setBottomButtonCon();
    },
    
    setTableDisplay : function() {
      var table = $(this.el).find('#addReportFormTable');
      table.css('width','100%');
      
      var tableTh = $(this.el).find('#addReportFormTable th');
      tableTh.css('width','30%');
      tableTh.css('height','50px');
      tableTh.css('text-align','center');
      
      var tableTdMemo = $(this.el).find('#addReportFormTable #memo');
      tableTdMemo.css('width','80%');
      tableTdMemo.css('height','100%');
      
      var tableTr = $(this.el).find('#addReportFormTable tr.addReportNone');
      tableTr.css('display','none');
    },
    
    setDatePickerPop : function(){
      var pickerView = $(this.el).find(".openDatePicker");
      pickerView.css('width', '30%');
      pickerView.css('display', 'inline-block');
      
      pickerView.datepicker({
          format: "yyyy/mm/dd",
          language: "kr",
          todayHighlight: true
      });
    },
    
    setSelectBoxData : function(){
      // 구분 :  office_code_tbl
      var selGubun = $(this.el).find('#selGubun');
      selGubun.css('width', '35%');
      
      var arrGubunData = [];
      // test Data
      for(var i = 0; i < 10 ; i++){
        var testData = {'code' : 'V'+i, 'name' : '구분값'+i, 'day_count' : '0.1'+i};
        arrGubunData[i] = testData;
      }
      
      // option setting
      for(var index=0; index < arrGubunData.length; index++){
        var optionHtml = "<option value='"+arrGubunData[index].code+"'>"+arrGubunData[index].name+"</option>";
        selGubun.append(optionHtml);
      }
      
      // 결재자
      var approvalMem = $(this.el).find('#selAddApprovalName');
      approvalMem.css('width', '35%');
      
      var arrApprovalMemData = [];
      for(var j = 0; j < 2; j++){
         var testData2 = {'id' : '1501'+j, 'name' : 'name'+j};
        arrApprovalMemData[j] = testData2;
      }
      
      // option setting
      for(var k=0; k < arrApprovalMemData.length; k++){
        var approvalOptionHtml = "<option value='"+arrApprovalMemData[k].id+"'>"+arrApprovalMemData[k].name+"</option>";
        approvalMem.append(approvalOptionHtml);
      }
    },
    
    setBottomButtonCon : function(){
      var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      bottomBtnCon.css('float','right');
      bottomBtnCon.empty();
      
      // 상신 Button
      var addReportBtn = $('<button class="btn btn-default">상신</button>');
      addReportBtn.attr('id','btnAddReport');
      bottomBtnCon.append(addReportBtn);
      
      return this;
    },
    
  	getFormData: function(form) {
  	  // input value
      var unindexed_array = form.serializeArray();
      var indexed_array= {};
      
      $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
      });
      
      return indexed_array;
  	},
  	
  	onClickBtnSend : function(evt){
      var formData = this.getFormData( this.$el.find('form'));
      
      console.log(formData);
      // 완료 후
      // location.href = '#reportmanager';
    }
    
  });
  return addReportView;
});