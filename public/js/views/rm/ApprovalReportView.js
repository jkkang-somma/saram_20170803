define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'text!templates/addReportTemplate.html',
  'collection/cm/CommuteCollection',
], function($, _, Backbone, animator, BaseView, addReportTmp, CommuteCollection){
  var addReportView = BaseView.extend({
    el:$(".main-container"),
   
  	events: {
  	  "click #btnConfirmReport": "onClickBtnSend"
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
      smallTitleTxt.text('결재');
      
      return this;
    },
    
    setAddReportDisplay : function(){
      // table Setting
      this.setTableDisplay();
      // select box data setting
      this.setDataDefaultValues();
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
      
      var tableTdMemo = $(this.el).find('#addReportFormTable textarea');
      tableTdMemo.css('width','80%');
      tableTdMemo.css('height','100%');
      
      var tableTr = $(this.el).find('#addReportFormTable tr.apployReportNone');
      tableTr.css('display','none');
    },
    
    setDataDefaultValues : function(){
      
      var disableValues = ['writeName', 'beforeDate', 'afterDate', 'selGubun', 'memo'];
      
      for(var dvI=0; dvI<disableValues.length; dvI++){
        $(this.el).find('#' + disableValues[dvI]).attr('readonly',true);
        $(this.el).find('#' + disableValues[dvI]).attr('disabled',true);
      }
      $(this.el).find('#selGubun').css('width', '35%');
      
      // 결재구분 :  
      var selGubun = $(this.el).find('#addApployGubun');
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
    },
    
    setBottomButtonCon : function(){
      var bottomBtnCon = $(this.el).find('#bottomBtnCon');
      bottomBtnCon.css('float','right');
      bottomBtnCon.empty();
      
      // 확인 Button
      var addReportBtn = $('<button class="btn btn-default">확인</button>');
      addReportBtn.attr('id','btnConfirmReport');
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