define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'core/BaseView',
  'dialog',
  'comboBox',
  'cmoment',
  'resulttimefactory',
  'text!templates/addReportTemplate.html',
  'collection/rm/ApprovalCollection',
  'collection/vacation/OutOfficeCollection',
  'collection/vacation/InOfficeCollection',
  'models/rm/ApprovalModel',
  'models/vacation/OutOfficeModel',
  'models/vacation/InOfficeModel',
], function($, _, Backbone, animator, BaseView, Dialog, ComboBox, Moment, ResultTimeFacoty, addReportTmp,
  ApprovalCollection, OutOfficeCollection, InOfficeCollection, ApprovalModel, OutOfficeModel, InOfficeModel
){
  var resultTimeFactory = ResultTimeFacoty.Builder;
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
      // select box data setting
      this.setDataDefaultValues(param);
      // display setting
      this.setDefaultDisplay();
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
      
      $(this.el).find('#start_date input').attr('readonly',true);
      $(this.el).find('#end_date input').attr('readonly',true);
      
      $(this.el).find('#start_date input').attr('disabled',true);
      $(this.el).find('#end_date input').attr('disabled',true);
      
      $(this.el).find('#start_time input').attr('readonly',true);
      $(this.el).find('#end_time input').attr('readonly',true);
      
      $(this.el).find('#start_time input').attr('disabled',true);
      $(this.el).find('#end_time input').attr('disabled',true);
      
      // 결재구분 :  
      var selGubun = $(this.el).find('#state');
      
      var arrGubunData = [];
      if(this.options.state == '취소요청'){
        arrGubunData.push({'code' : '취소완료', 'name' : '취소승인'});
      }else{
        arrGubunData.push({'code' : '결재완료', 'name' : '결재'});
      }
      arrGubunData.push({'code' : '반려', 'name' : '반려'});
      arrGubunData.push({'code' : '보류', 'name' : '보류'});
      
      // option setting
      for(var index=0; index < arrGubunData.length; index++){
        var optionHtml = "<option value='"+arrGubunData[index].code+"'>"+arrGubunData[index].name+"</option>";
        selGubun.append(optionHtml);
      }
      
      ComboBox.createCombo(selGubun);
    },
    
    setDataDefaultValues : function(param){
      var _this = $(this.el);
      if(param != undefined){
        _this.find('#submit_id').val(param.submit_name);
        _this.find('#start_date input').val(param.start_date);
        _this.find('#end_date input').val(param.end_date);
        _this.find('#start_time input').val(param.start_time);
        _this.find('#end_time input').val(param.end_time);
        _this.find('#office_code').html("<option>"+param.office_code_name+"</option>");
        _this.find('#submit_comment').val(param.submit_comment);
        if(param.decide_comment != null && param.decide_comment != ""){
          _this.find('#decide_comment').val(param.decide_comment);
        }
        _this.find('#manager_id').html("<option>"+param.manager_name+"</option>");
        _this.find('#state').val(param.state);
        
        var usable = (param.total_day > param.used_holiday)?param.total_day - param.used_holiday : 0;
        _this.find('#usableHoliday').val(usable + " 일");
        
        var holReq = "0";
        if(param.office_code == "B01"){
          // 휴일근무
          holReq = "0";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }else if(param.office_code == "V02" || param.office_code == "V03"){
          // 반차
          holReq = "0.5";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }else if(param.office_code == "W01"){
          // 외근
          holReq = "0";
          $(this.el).find('#end_date').css('display','none');
          $(this.el).find('#outsideOfficeTimeCon').css('display','block');
        }else {
          var arrInsertDate = this.getDatePariod();
          holReq = arrInsertDate.length + "";
          $(this.el).find('#end_date').css('display','table');
          $(this.el).find('#outsideOfficeTimeCon').css('display','none');
        }
        _this.find('#reqHoliday').val(holReq + " 일");
        
        // 휴일 근무, 외근, 출장, 장기외근 - 잔여 연차 일수 감추기 
        if (param.office_code == 'B01' || param.office_code == 'W01' || param.office_code == 'W02' || param.office_code == 'W03') {
        	$(this.el).find('#usableHolidayCon').hide();
        }else {
        	$(this.el).find('#usableHolidayCon').show();
        }        
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
      
      indexed_array["doc_num"] = this.options["doc_num"];
      
      if(indexed_array.state == '결재완료'){
        // black_mark 값 설정 1: 정상 , 2: 당일 결재 , 3: 익일결재
        var _today = new Date();
        var sToday = _today.getFullYear() + "-" + this.getzFormat(_today.getMonth()+1, 2) + "-" + _today.getDate();
        _today = new Date(sToday.substr(0,4),sToday.substr(5,2)-1,sToday.substr(8,2));
        var sStart = $(this.el).find('#start_date input').val();
        var start = new Date(sStart.substr(0,4),sStart.substr(5,2)-1,sStart.substr(8,2));
        
        if(start > _today){
          // 정상
          indexed_array["black_mark"] = '1';
        }else if(sStart == sToday){
          // 당일결재
          indexed_array["black_mark"] = '2';
        }else if(start < _today){
          // 익일결재
          indexed_array["black_mark"] = '3';
        }
        
      }
      
      return indexed_array;
  	},
  	
  	getChangeFormData : function(sendData){
        var arrData = this.options;
        arrData["decide_comment"] = sendData["decide_comment"];
        arrData["state"] = sendData["state"];
        arrData["black_mark"] = sendData["black_mark"];
        arrData["decide_date"] = new Date();
        return arrData;
    },
  	
  	onClickBtnSend : function(evt){
  	  var dfd = new $.Deferred();
  	  var _this = this;
      var formData = this.getFormData($(this.el).find('form'));
      
      var _approvalCollection = new ApprovalCollection(formData);
      
      var promiseArr = [];
      if(formData.state == '결재완료'){
        if(this.options.office_code != 'B01'){ // 외근 / 휴가 등등
          promiseArr.push(_this.addOutOfficeData(_approvalCollection));
        }else{                                  // 휴일 근무
          promiseArr.push(this.addInOfficeData(_approvalCollection));
        }
      }else if(formData.state == '취소완료'){
        
        if(this.options.office_code != 'B01'){ // 외근 / 휴가 등등
          promiseArr.push(this.delOutOfficeData(_approvalCollection, this.options["doc_num"]));
        }else{                                  // 휴일 근무
          promiseArr.push(this.delInOfficeData(_approvalCollection, this.options["doc_num"]));
        }
      } else{
        promiseArr.push(this.updateApprovalData(_approvalCollection));
      }
      
      $.when.apply($, promiseArr).then(function(){
        var resultModel = new ApprovalModel(_this.options);
        resultModel.set({state : _approvalCollection.models[0].get("state")});
        resultModel.set({decide_date : new Date()});
        
        // console.log(resultModel);
        dfd.resolve(resultModel.attributes);
      }, function(){
        dfd.reject();
      });
      return dfd.promise();
    },
    
    delOutOfficeData : function(_approvalCollection, docNum){
      var dfd = new $.Deferred();
      var userId = this.options["submit_id"];;
      var arrInsertDate = this.getDatePariod();
      var resultData = {};
      resultData.approval = _approvalCollection.toJSON();
      
      var outOfficeCollection = new OutOfficeCollection();
      
      outOfficeCollection.fetch(
        {
          data : {
            start : arrInsertDate[0],
            end : arrInsertDate[arrInsertDate.length -1]
          },
          success : function(result){
            var filterCollection = new OutOfficeCollection();
            for(var key in result.models){
              if(result.models[key].get("doc_num") !== docNum){
                if(result.models[key].get("id") == userId){
                  filterCollection.add(result.models[key]);
                }
              }
            }
            
            var results = [];     // commuteResult;
            var promiseArr = [];
            $.each(arrInsertDate, function(key){
              var today = arrInsertDate[key];
              var todayOutOfficeModels = filterCollection.where({date : today});
              promiseArr.push(
                resultTimeFactory.modifyByInOutOfficeType(arrInsertDate[key], userId, "out", todayOutOfficeModels).done(function(result){
                  results.push(result);
                }).fail(function(){
                  /// 수정할 내용 없음
                })
              );
            });
            
            $.when.apply($, promiseArr).always(function(){
              if(results.length >0){
                resultData.commute = results;  
              }
              outOfficeCollection.save(resultData, docNum).done(function(){
                dfd.resolve(resultData);   
              });     
            });
          },
        }
      );
      return dfd.promise();
    },
    
    delInOfficeData : function(_approvalCollection, docNum){
      var dfd = new $.Deferred();
      var userId = this.options["submit_id"];
      var arrInsertDate = [$(this.el).find('#start_date input').val()];
      var resultData = {};
      resultData.approval = _approvalCollection.toJSON();
      
      var inOfficeCollection = new InOfficeCollection();
      
      inOfficeCollection.fetch(
        {
          data : {
            start : arrInsertDate[0],
            end : arrInsertDate[arrInsertDate.length -1]
          },
          success : function(result){
            var filterCollection = new InOfficeCollection();
            for(var key  in result.models){
              if(result.models[key].get("doc_num") !== docNum){
                if(result.models[key].get("id") == userId){
                  filterCollection.add(result.models[key]);
                }
              }
            }
            
            var results = [];     // commuteResult;
            var promiseArr = [];
            $.each(arrInsertDate, function(key){
              var today = arrInsertDate[key];
              var todayInOfficeModels = filterCollection.where({date : today});
              promiseArr.push(
                resultTimeFactory.modifyByInOutOfficeType(arrInsertDate[key], userId, "in", todayInOfficeModels).done(function(result){
                  results.push(result);
                }).fail(function(){
                  /// 수정할 내용 없음
                })
              );
            });
            
            $.when.apply($, promiseArr).always(function(){
              if(results.length >0){
                resultData.commute = results;  
              }
              inOfficeCollection.save(resultData, docNum).done(function(){
                dfd.resolve(resultData);  
              });     
            });
          },
        }
      );
      return dfd.promise();
    },
    
    addOutOfficeData : function(_approvalCollection){
      var dfd = new $.Deferred();
      var arrInsertDate = this.getDatePariod();
      
      var resultData = {};
      // data 저장
      resultData.outOffice = this.getFormData($(this.el).find('form'));
      resultData.outOffice["arrInsertDate"] = arrInsertDate; // insert 에 필요한 데이터 저장
      resultData.outOffice["id"] = this.options["submit_id"];
      resultData.outOffice["doc_num"] = this.options["doc_num"];
      resultData.outOffice["memo"] = this.options["submit_comment"];
      resultData.outOffice["office_code"] = this.options["office_code"];
      resultData.outOffice["start_time"] = this.options["start_time"];
      resultData.outOffice["end_time"] = this.options["end_time"];
      
      var results = [];
      var promiseArr = [];
      $.each(arrInsertDate, function(key){
        promiseArr.push(
          resultTimeFactory.modifyByInOutOfficeType(arrInsertDate[key], resultData.outOffice.id, "out", resultData.outOffice).done(function(result){
            results.push(result);
          }).fail(function(){
            /// 수정할 내용 없음
          })
        );
      });
      
      $.when.apply($, promiseArr).always(function(){
        if(results.length >0){
          resultData.commute = results;  
        }
        _approvalCollection.save(resultData, resultData.outOffice.doc_num).done(function(){
          dfd.resolve(resultData);  
        });     
      });
      
      return dfd.promise();
    },
    
    addInOfficeData : function(_approvalCollection){
      var dfd = new $.Deferred();

      
      // 날짜 개수 이용하여 날짜 구하기
      var sStart = $(this.el).find('#start_date input').val();
      var arrInsertDate = [];
      arrInsertDate.push(sStart);
      
      var resultData = {};
            
      // data 저장
      resultData.inOffice = this.getFormData($(this.el).find('form'));
      resultData.inOffice["arrInsertDate"] = arrInsertDate; // insert 에 필요한 데이터 저장
      resultData.inOffice["id"] = this.options["submit_id"];
      resultData.inOffice["doc_num"] = this.options["doc_num"];
      
      var results = [];
      var promiseArr = [];
      
      $.each(arrInsertDate, function(key){
        promiseArr.push(
          resultTimeFactory.modifyByInOutOfficeType(arrInsertDate[key], resultData.inOffice.id, "in", resultData.inOffice).done(function(result){
            results.push(result);
          })
        );
      });
      
      $.when.apply($, promiseArr).always(function(){
        if(results.length >0){
          resultData.commute = results;  
        }
        _approvalCollection.save(resultData, resultData.inOffice.doc_num).done(function(){
          dfd.resolve(resultData);  
        });     
      });
      
      return dfd.promise();
    },
    updateApprovalData : function(_approvalCollection){
       var dfd = new $.Deferred();
       var resultData = this.getFormData($(this.el).find('form'));
      _approvalCollection.save(resultData, resultData.doc_num).done(function(){
          dfd.resolve(resultData);  
        }); 
        
        return dfd.promise();
    },
    getDatePariod : function(){
       // 날짜 개수 이용하여 날짜 구하기
      var sStart = $(this.el).find('#start_date input').val();
      var sEnd = $(this.el).find('#end_date input').val();
      
      var start = new Date(sStart.substr(0,4),sStart.substr(5,2)-1,sStart.substr(8,2));
      var end = new Date(sEnd.substr(0,4),sEnd.substr(5,2)-1,sEnd.substr(8,2));
      var day = 1000*60*60*24;
      
      var compareVal = parseInt((end - start)/day);
      var arrInsertDate = [];
      var holidayInfos = this.options.holidayInfos;
      if(compareVal > 0){
        // 차이
        for(var i=0; i<=compareVal; i++){
          var dt = start.valueOf() + (i*day);
          var resDate = new Date(dt);
          if(resDate.getDay() != 0 && resDate.getDay() != 6){
            // 주말이 아닌 날짜
            var isPush = true;
            for(var j=0; j<holidayInfos.length; j++){
              var sDate = this.getDateFormat(resDate);
              if(holidayInfos[j].date == sDate){
                isPush = false;
                break;
              }
            }
            if(isPush){
              arrInsertDate.push(sDate);
            }
          }
        }
       
      }else{
         if(start.getDay() != 0 && start.getDay() != 6){
            // 주말이 아닌 날짜
           for(var k=0; k<holidayInfos.length; k++){
              if(holidayInfos[k].date != sStart){
                arrInsertDate.push(sStart);
                break;
              }
           }
        }
      }
      
      return arrInsertDate;
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