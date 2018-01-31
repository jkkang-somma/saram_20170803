define([
	'jquery',
	'underscore',
	'util',
	'backbone',
	'core/BaseView',
	'log',
	'dialog',
	'i18n!nls/common',
	'lib/component/form',
	'code',
	'models/officeitem/OfficeItemModel',
	'collection/common/CodeCollection',
	'collection/sm/UserCollection',
  ], function($, _,Util,  Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, OfficeItemModel, CodeCollection,UserCollection){
	  var LOG= log.getLogger("EditOfficeItemView");
	  var availableTags = [];
	  var availableTagsUser = [];
  
	  var EditOfficeItemView = BaseView.extend({
		  initialize:function(date){
			  $(this.el).html('');
			  $(this.el).empty();
			  
			  this.model=new OfficeItemModel(date);
			  _.bindAll(this, "submitSave");
		  },
		  render:function(el){
			  var dfd= new $.Deferred();
			  var _view=this;
			  if (!_.isUndefined(el)){
				  this.el=el;
			  }
  
		  var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
		  var userCodeCollection= Code.getCollection("user");
		  var officeItemCodeCollection = Code.getCollection("officeitem");
  
		  for( var index = 0; index < deptCodeCollection.models.length; index++) {
			  availableTags[index] = deptCodeCollection.models[index].attributes.name+"("+deptCodeCollection.models[index].attributes.code+")";
		  }
  
		  for( var index = 0; index < userCodeCollection.models.length; index++) {
			  availableTagsUser[index] = userCodeCollection.models[index].attributes.name+"("+userCodeCollection.models[index].attributes.code+")";
		  }

		  $.when(officeItemCodeCollection.fetch()).done(function(){
				  var _model=_view.model.attributes;

				  var use_flag_info =  "";
				  var _input_data = availableTags;

				  if(_model.use_user !=null && _model.use_user != ""){
						use_flag_info = _model.use_user_name+"("+_model.use_user+")" ;
						_input_data = availableTagsUser;

				  }else if(_model.use_dept !=null && _model.use_dept != ""){
						use_flag_info=_model.use_dept_name+"("+_model.use_dept+")" ;
				  }

				  var _form = new Form({
					  el:_view.el,
					  form:undefined,
					  childs:[{
								type:"hidden",
								name:"serial_yes",
								label:i18nCommon.OFFICEITEM.CODE.SERIAL_YES,
								value:_model.serial_yes,
								disabled:"readonly",
							},{
								type:"input",
								name:"category_name",
								label:i18nCommon.OFFICEITEM.CODE.CATEGORY_NAME,
								value:_model.category_name,
								disabled:"readonly",
							},{
								type:"hidden",
								name:"category_code",
								value:_model.category_code,
								collection:officeItemCodeCollection,
							},{
								type:"combo",
								name:"use_flag",
								label:i18nCommon.OFFICEITEM.CODE.USE_FLAG,
								value:((_model.use_user != "")?"selectUser":"selectDept"),
								collection:[
									{key:"selectDept",value:"부서"},
									{key:"selectUser",value:"직원"}],
							},{
								type:"input",
								name:"vendor",
								label:i18nCommon.OFFICEITEM.CODE.VENDOR,
								value:_model.vendor, 
							},{
								type:"auto_input",
								name:"use_flag_info",
								id:"autocomplete",
								label:i18nCommon.OFFICEITEM.CODE.USE_USER_NAME,
								value:use_flag_info,
								input_data: _input_data

						 	 },{
								type:"hidden",
								name:"category_index",
								value:_model.category_index,
								collection:officeItemCodeCollection,
						  	},{
								type:"hidden",
								name:"category_type",
								value:_model.category_type,
								collection:officeItemCodeCollection,
						  	},{
								type:"hidden",
								name:"use_dept",
								value:_model.use_dept,
								isValueInput:true
							},{
								type:"hidden",
								name:"use_user",
								value:_model.use_user,							
								isValueInput:true
							},{
								type:"hidden",
								name:"use_dept_name",
								value:_model.use_dept_name,
								collection:deptCodeCollection,
								firstBlank:true,
							},{
								type:"hidden",
								name:"use_user",
								value:_model.use_user,
								collection:userCodeCollection,
								firstBlank:true,
								linkFieldValue:"true"
							},{
								type:"hidden",
								name:"use_user_name",
								value:_model.use_user_name,
								collection:userCodeCollection,
								firstBlank:true,
							},{
								type:"input",
								name:"model_no",
								label:i18nCommon.OFFICEITEM.CODE.MODEL_NO,
								value:_model.model_no,
							},{
								type:"input",
								name:"location",
								label:i18nCommon.OFFICEITEM.CODE.LOCATION,
								value:_model.location,
							},{
								type:"input",
								name:"serial_factory",
								label:i18nCommon.OFFICEITEM.CODE.SERIAL_FACTORY,
								value:_model.serial_factory, 
							},{
								type:"date",
								name:"buy_date",
								id:"buy_date",
								label:i18nCommon.OFFICEITEM.CODE.BUY_DATE,
								value:_model.buy_date,
								format:"YYYY-MM-DD",
							},{
								type:"price",
								name:"price",
								label:i18nCommon.OFFICEITEM.CODE.PRICE,
								value:_model.price,
								disabled:"readonly",
							},{
								type:"input",
								name:"disposal_account",
								label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_ACCOUNT,
								value:_model.disposal_account,
								format:"YYYY-MM-DD",
								disabled:"readonly",
							},{
								type:"price",
								name:"surtax",
								label:i18nCommon.OFFICEITEM.CODE.SURTAX,
								value:_model.surtax,
								disabled:"readonly",
							},{
								type:"date",
								name:"expiration_date",
								label:i18nCommon.OFFICEITEM.CODE.EXPIRATION_DATE,
								value:_model.expiration_date,
								format:"YYYY-MM-DD",
							  },{
								type:"price",
								name:"price_buy",
								label:i18nCommon.OFFICEITEM.CODE.PRICE_BUY,
								value:_model.price_buy,
							},{
								type:"date",
								name:"disposal_date",
								id:"disposal_date",
								label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_DATE,
								value:_model.disposal_date,
								format:"YYYY-MM-DD",
							},{
								type:"combo",
								name:"state",
								label:i18nCommon.OFFICEITEM.CODE.STATE,
								value:_model.state,
								collection:[{key:i18nCommon.OFFICEITEM.STATE.NORMAL,value:i18nCommon.OFFICEITEM.STATE.NORMAL}
											,{key:i18nCommon.OFFICEITEM.STATE.BREAK,value:i18nCommon.OFFICEITEM.STATE.BREAK}
											,{key:i18nCommon.OFFICEITEM.STATE.DISUSE,value:i18nCommon.OFFICEITEM.STATE.DISUSE}
											,{key:i18nCommon.OFFICEITEM.STATE.STANDBY,value:i18nCommon.OFFICEITEM.STATE.STANDBY}]
							},{
								type:"date",
								name:"history_date",
								id:"history_date",
								label:i18nCommon.OFFICEITEM.CODE.HISTORY_DATE,
								value:new Date().toISOString().slice(0,10),
								isDefaultValue:true,
								format:"YYYY-MM-DD",
							},{
								type:"text",
								name:"memo",
								label:i18nCommon.OFFICEITEM.CODE.MEMO,
								value:_model.memo,
						}]
				  });
				  
				  _form.render().done(function(){
					  	_view.form=_form;
					  	var price_buy_input = _form.getElement("price_buy");
						price_buy_input.find("input").focusout(function(){

							var val = $(this).val();
							if(val != "")
							{						
								var price = Math.floor(val/1.1)
								_form.getElement("price").find("input").val(price); // 금액
								_form.getElement("surtax").find("input").val(Math.floor(val-price)); // 부가세
							}else{
								_form.getElement("price").find("input").val(""); // 금액
								_form.getElement("surtax").find("input").val(""); // 부가세
							}
						});

						var _buy_date_value = _form.getElement("buy_date");	
						_buy_date_value.find("#buy_date").on('dp.change', function(e){
							var val = _buy_date_value.find("input").val()
	  
							var e_date = new Date(val);
							e_date = e_date.setFullYear(e_date.getFullYear()+6)
							e_date = new Date(e_date).toISOString().slice(0,10);
							_form.getElement("expiration_date").find("input").val(e_date); // 사용 만료일
							_form.getElement("expiration_date").find("input").addClass("inserted");
	
							var d_date = new Date(val);
							d_date = d_date.setFullYear(d_date.getFullYear()+5)
							d_date = new Date(d_date).toISOString().slice(0,10);
							_form.getElement("disposal_account").find("input").val(d_date); // 회계상 폐기일
						});	

						_buy_date_value.find("#buy_date").find(".close-icon").click(function(e) {//reset button click
							_form.getElement("expiration_date").find("input").removeClass("inserted");
							_form.getElement("expiration_date").find("input").val("");
							_form.getElement("disposal_account").find("input").val(""); 
							
						});
						/*buy_date_value.datetimepicker({
							pickTime: false,
							format: "YYYY-MM-DD"
							}).on("change",function(){		
								var val = buy_date_value.find("input").val()
		
								var e_date = new Date(val);
								e_date = e_date.setFullYear(e_date.getFullYear()+6)
								e_date = new Date(e_date).toISOString().slice(0,10);
								_form.getElement("expiration_date").find("input").val(e_date); // 사용 만료일
		
								var d_date = new Date(val);
								d_date = d_date.setFullYear(d_date.getFullYear()+5)
								d_date = new Date(d_date).toISOString().slice(0,10);
								_form.getElement("disposal_account").find("input").val(d_date); // 회계상 폐기일
						});	*/	
						
						var _disposal_date = _form.getElement("disposal_date");
						_disposal_date.find("#disposal_date").on('dp.change', function(e){
							var val = $(this).val();
							_form.getElement("state").find("option:eq(2)").prop("selected",true);
							_form.getElement("state").find('select').trigger('change');
						});
						/*_disposal_date.datetimepicker({
							pickTime: false,
							format: "YYYY-MM-DD"
							}).on("change",function(){
						
							_form.getElement("state").find("option:eq(2)").prop("selected",true);
							_form.getElement("state").find('select').trigger('change');
						});*/

						_form.getElement("state").find("select").on("change",function(){
							var val = $(this).val();
							if(val != "폐기") {	
								_disposal_date.find("input").val("");
							}
						 });

					  dfd.resolve(_view);
				  }).fail(function(){
					  dfd.reject();
				  });  
			  }).fail(function(e){
				  Dialog.error(i18nCommon.ERROR.USER_EDIT_VIEW.FAIL_RENDER);
				  LOG.error(e.responseJSON.message);
				  dfd.reject();    	      
			  });
			  return dfd.promise();
		   },
		   afterRender: function(){
			  var _view=this, _form=this.form;
			   $(document).ready(function() {
  
				   _form.getElement("use_flag").find("select").on("change",function(){
					  var val = $(this).val();
					   if(val == "selectUser") {	
						  $('#autocomplete').val("");
						  $('#autocomplete').autocomplete("option", { source: availableTagsUser });
					   }
					   else{		
						  $('#autocomplete').val("");
						  $('#autocomplete').autocomplete("option", { source: availableTags });
					   }
				   });
			   });
		  },   	
		  submitSave : function(e){
			  var dfd= new $.Deferred();
			  var _view=this,_form=this.form;
  
			  var use_flag_info = $('#autocomplete').val();
			  var use_flag = _form.getElement("use_flag").find("select").val();
			  
			  var _state = _form.getElement("state").find("select").val();
			  var _disposal_date = _form.getElement("disposal_date").find("input").val();
			  
			  if( _state == i18nCommon.OFFICEITEM.STATE.DISUSE
				  && Util.isNull(_disposal_date)){
				  Dialog.warning("폐기 상태가 선택 되었습니다. 폐기일을 입력해 주세요! ");
				  dfd.reject();	
				  return dfd.promise();		
			  }

			  var _location = _form.getElement("location").find("input").val();
			  _location = _location.replace(/(\s*)/g,"");
	  
			  if( _location == "창고" && !Util.isNull(use_flag_info)){
				  Dialog.warning("장소 정보에 '창고'가 등록 되었습니다. 사용자를 등록 할 수 없습니다.");
				  dfd.reject();	
				  return dfd.promise();		
			  }

			  if(use_flag_info != "")
			  {
				if(_.indexOf(use_flag_info, "(") > -1){
	
					use_flag_info=use_flag_info.replace(")", '');
	
					var use_flag_info_arr = use_flag_info.split("(");
					var use_name = use_flag_info_arr[0];
					var use_code =(use_flag_info_arr[1]);
	
					if(use_flag == "selectUser") {  //직원
						_form.getElement("use_user").val(use_code);
						_form.getElement("use_user_name").val(use_name);
						_form.getElement("use_dept").val("");
						_form.getElement("use_dept_name").val("");
						
					}else{//부서
						_form.getElement("use_user").val("");
						_form.getElement("use_user_name").val("");
						_form.getElement("use_dept").val(use_code);
						_form.getElement("use_dept_name").val(use_name);
					}
					
				}else{				
					Dialog.warning("사용자 정보를 다시 입력해 주세요! ");
					$('#autocomplete').val("");
					dfd.reject();	
					return dfd.promise();			
				}
			}else{
				_form.getElement("use_user").val("");
				_form.getElement("use_user_name").val("");
				_form.getElement("use_dept").val("");
				_form.getElement("use_dept_name").val("");
			}
			  var _data=_form.getData();
			  var _officeitemModel= new OfficeItemModel(_data);
			  _officeitemModel.attributes._id="-2";
			  var _validate=_officeitemModel.validation(_data, {
				serial_yes:""},{disposal_date:""},{price_buy:""},{price:""},{surtax:""}, 
				{buy_date:""},{disposal_date:""},{expiration_date:""},{disposal_account:""});
  
			  var _validate=_officeitemModel.validation(_data);
			  _officeitemModel.save({},{
				  success:function(model, xhr, options){
					    
					var respons=xhr.responseJSON;
					_data = xhr.result;
					dfd.resolve(_data);
				  },
				  error:function(model, xhr, options){
					  var respons=xhr.responseJSON;
					  Dialog.error(respons.message);
					  dfd.reject();
				  },
				  wait:false
			  });
			  
			  return dfd.promise();
		  },
		  
		  getFormData: function(form) {
			  var unindexed_array = form.serializeArray();
			  var indexed_array= {};
			  
			  $.map(unindexed_array, function(n, i){
				  indexed_array[n['name']] = n['value'];
			  });
			  
			  return indexed_array;
		  }
	  });
	  return EditOfficeItemView;
  });