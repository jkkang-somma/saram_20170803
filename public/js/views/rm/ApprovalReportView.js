define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'models/rm/ApprovalModel',
], function($, _, Backbone, animator, BaseView, Dialog, addReportTmp, ApprovalCollection, ApprovalModel){
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
  	  this.thisDfd = new $.Deferred();
      var formData = this.getFormData($(this.el).find('form'));
      formData["doc_num"] = this.options["doc_num"];
      // formData["idAttribute"] = "doc_num";
      console.log(formData);
      // "_id" : formData.doc_num
      formData["_id"] = this.options["doc_num"];
      
      
      var sStart = $(this.el).find('#start_date').val();
      var sEnd = $(this.el).find('#end_date').val();
      
      var start = new Date(sStart.substr(0,4),sStart.substr(5,2)-1,sStart.substr(8,2));
      var end = new Date(sEnd.substr(0,4),sEnd.substr(5,2)-1,sEnd.substr(8,2));
      var day = 1000*60*60*24;
      alert("end - start : " + (end - start) + "  // 기간 : " + (parseInt((end - start)/day)));
      
      var compareVal = parseInt((end - start)/day) + 2;
      formData["insertCnt"] = compareVal;
      var arrInsertDate = [];
      if(compareVal > 2){
        // 차이
        for(var i=0; i<=compareVal; i++){
          var dt = start+(i*day);
          var resDate = new Date(dt);
          console.log("dt : " + dt + ", resDate : " + this.getDateFormat(resDate));
          arrInsertDate.push(this.getDateFormat(resDate));
        }
      }else{
        arrInsertDate.push(sStart);
        arrInsertDate.push(sEnd);
      }
      
      console.log(arrInsertDate);
      // var _this = this;
      // var _approvalModel = new ApprovalModel(formData);
      // _approvalModel.idAttribute = "doc_num";
      // _approvalModel.save({},{
      // 	        success:function(model, xhr, options){
      // 	            Dialog.show("Complete Update Approval.");
      	            
      // 	            // insert
      // 	            console.log();
      // 	        },
      // 	        error:function(model, xhr, options){
      // 	            var respons=xhr.responseJSON;
      // 	            Dialog.error(respons.message);
      // 	            _this.thisDfd.reject();
      // 	        },
      // 	        wait:false
      // 	    }); 
	     //  return _this.thisDfd.promise();
    
      // // this.collection
    },
    
    getDateFormat : function(dateData){
      var sDateFormat = "";
      if (dateData == null){
        sDateFormat = "";
      }else {
        sDateFormat
        = dateData.getFullYear() + "-" + this.getzFormat(dateData.getMonth() + 1, 2) + "-" + this.getzFormat(dateData.getDate(), 2);
      }
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
    }
    
  });
  return approvalReportView;
});