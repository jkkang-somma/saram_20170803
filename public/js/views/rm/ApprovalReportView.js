define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
], function($, _, Backbone, animator, BaseView, Dialog, addReportTmp, ApprovalCollection){
  var approvalReportView = BaseView.extend({
    options : {},
   
  	events: {
  	},
  	
  	initialize:function(){
  		this.collection = new ApprovalCollection();
  		  
  		$(this.el).html();
	    $(this.el).empty();
	    
	   _.bindAll(this, "onClickBtnSend");
  	},
  	
    render: function(el){
  	    var dfd= new $.Deferred();
  	        
        if (!_.isUndefined(el)){
	        this.el=el;
  	    }
        $(this.el).append(addReportTmp);
	    
  	     // title setting
        this.setTitleTxt();
        // default display setting
        this.setAddReportDisplay(this.options);
        dfd.resolve();
  	    
  	    return dfd.promise();
    },
    
    setTitleTxt : function(){
      // small title 
      var smallTitleTxt = $(this.el).find('#smallTitleTxt');
      smallTitleTxt.empty();
      smallTitleTxt.text('결재');
      
      return this;
    },
    
    setAddReportDisplay : function(param){
      // table Setting
      this.setTableDisplay();
      // display setting
      this.setDefaultDisplay();
      // select box data setting
      this.setDataDefaultValues(param);
    },
    
    setTableDisplay : function() {
      var tableTr = $(this.el).find('.apployReportNone');
      tableTr.css('display','none');
    },
    setDefaultDisplay : function() {
      
      var disableValues = ['submit_id', 'start_date', 'end_date', 'office_code', 'submit_comment', 'manager_id'];
      
      for(var dvI=0; dvI<disableValues.length; dvI++){
        $(this.el).find('#' + disableValues[dvI]).attr('readonly',true);
        $(this.el).find('#' + disableValues[dvI]).attr('disabled',true);
      }
      
      // $(this.el).find('#submit_id').css('width', '35%');
      
      $(this.el).find('.openDatePicker').css('display', 'inline-block');
      $(this.el).find('.openDatePicker').css('width', '48%');
      
      // 결재구분 :  
      var selGubun = $(this.el).find('#state');
      
      var arrGubunData = [];
      arrGubunData.push({'code' : '결재완료', 'name' : '결재'});
      arrGubunData.push({'code' : '반려', 'name' : '반려'});
      arrGubunData.push({'code' : '보류', 'name' : '보류'});
      
      // option setting
      for(var index=0; index < arrGubunData.length; index++){
        var optionHtml = "<option value='"+arrGubunData[index].code+"'>"+arrGubunData[index].name+"</option>";
        selGubun.append(optionHtml);
      }
    
    },
    
    setDataDefaultValues : function(param){
      console.log(param);
      var _this = $(this.el);
      if(param != undefined){
        _this.find('#submit_id').val(param.submit_name);
        _this.find('#start_date').val(param.start_date);
        _this.find('#end_date').val(param.end_date);
        _this.find('#office_code').html("<option>"+param.office_code_name+"</option>");
        _this.find('#submit_comment').val(param.submit_comment);
        // _this.find('#decide_comment').val(param.decide_comment);
        
        _this.find('#manager_id').html("<option>"+param.manager_name+"</option>");
        _this.find('#state').val(param.state);
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
      var formData = this.getFormData($(this.el).find('form'));
      formData["doc_num"] = this.options["doc_num"];
      formData["_id"] = this.options["update"];
      console.log(formData);
      
      // this.collection
    }
    
  });
  return approvalReportView;
});