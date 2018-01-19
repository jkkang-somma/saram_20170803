define([
  'jquery',
  'underscore',
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
], function($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, 
	        OfficeItemModel, CodeCollection,UserCollection){
    var LOG= log.getLogger("AddOfficeItemView");
    var AddOfficeItemView = BaseView.extend({
    	initialize:function(){
    		$(this.el).html('');
    	    $(this.el).empty();
    	    
    	    this.model=new OfficeItemModel();
    	    _.bindAll(this, "submitAdd");
    	},
    	render:function(el){
    	    var dfd= new $.Deferred();
    	    var _view=this;
    	    if (!_.isUndefined(el)){
    	        this.el=el;
    	    }
		
	    var userCollection= new UserCollection();
    	var deptCodeCollection=Code.getCollection(Code.DEPARTMENT);
	    //var partCodeCollection=Code.getCollection(Code.DEPT);
	    var userCodeCollection= Code.getCollection("user");
		var positionCodeCollection= Code.getCollection(Code.POSITION);
		var officeItemCodeCollection = Code.getCollection("officeitem");

	    $.when(officeItemCodeCollection.fetch()).done(function(){
                var _model=_view.model.attributes;
        	    var _form = new Form({
        	        el:_view.el,
        	        form:undefined,
			childs:[{
							type:"combo",
							name:"_category_code",
							label:i18nCommon.OFFICEITEM.CODE.CATEGORY_CODE,
							collection:officeItemCodeCollection,
							value:_model.category_code,
							firstBlank:false,
							linkFieldValue:"category_code"
					},{
							type:"hidden",
							name:"category_code",
							value:_model.category_code,
							collection:officeItemCodeCollection,
							linkFieldValue:"true"
					},{
        	                type:"input",
        	                name:"serial_factory",
        	                label:i18nCommon.OFFICEITEM.CODE.SERIAL_FACTORY,
        	                value:_model.serial_factory,  
					},{
							type:"combo",
							name:"part_code",
							label:i18nCommon.USER.DEPT,
							value:_model.part_code,
							collection:deptCodeCollection,
							firstBlank:true,
							linkFieldValue:"use_dept"// text 값을 셋팅 해줌 type은 hidden
					},{
        	                type:"hidden",
        	                name:"use_dept",
        	                value:_model.part_code,
							collection:deptCodeCollection,
							firstBlank:true,
							linkFieldValue:"true"
					},{
							type:"hidden",
							name:"use_dept_name",
							value:_model.use_dept_name,
							collection:deptCodeCollection,
							firstBlank:true,
					},{
							type:"combo",
							name:"use_user_code",
							label:i18nCommon.USER.NAME,
							value:_model.use_user,
							collection:userCodeCollection,
							firstBlank:true,
							linkFieldValue:"use_user"
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
        	                name:"vendor",
        	                label:i18nCommon.OFFICEITEM.CODE.VENDOR,
        	                value:_model.vendor,
        	        },{
        	                type:"input",
        	                name:"model_no",
        	                label:i18nCommon.OFFICEITEM.CODE.MODEL_NO,
        	                value:_model.model_no,
					},{
        	                type:"price",
        	                name:"price_buy",
        	                label:i18nCommon.OFFICEITEM.CODE.PRICE_BUY,
							value:"0",
					},{
							type:"input",
							name:"price",
							label:i18nCommon.OFFICEITEM.CODE.PRICE,
							value:"0",
							disabled:"readonly",
					},{
							type:"input",
							name:"surtax",
							label:i18nCommon.OFFICEITEM.CODE.SURTAX,
							value:"0",  
							disabled:"readonly",
					},{
        	                type:"input",
        	                name:"location",
        	                label:i18nCommon.OFFICEITEM.CODE.LOCATION,
        	                value:_model.location,
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
        	                name:"buy_date",
        	                label:i18nCommon.OFFICEITEM.CODE.BUY_DATE,
        	                value:_model.buy_date,
        	                format:"YYYY-MM-DD",
        	        },{
        	                type:"date",
        	                name:"disposal_date",
        	                label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_DATE,
        	                value:_model.disposal_date,
        	                format:"YYYY-MM-DD",
        	        },{
        	                type:"date",
        	                name:"expiration_date",
        	                label:i18nCommon.OFFICEITEM.CODE.EXPIRATION_DATE,
        	                value:_model.expiration_date,
							format:"YYYY-MM-DD",
							
        	        },{
							type:"input",
							name:"disposal_account",
							label:i18nCommon.OFFICEITEM.CODE.DISPOSAL_ACCOUNT,
							value:_model.disposal_account,
							format:"YYYY-MM-DD",
							disabled:"readonly",
					},{
        	                type:"text",
        	                name:"memo",
        	                label:i18nCommon.OFFICEITEM.CODE.MEMO,
        	                value:_model.memo,
					}]
        	    });
        	    
        	    _form.render().done(function(){
					_view.form=_form;
					//var category_code = _form.getElement("category_code").find("input").val();

					var price_buy_input = _form.getElement("price_buy");
					price_buy_input.find("input")
						.focusout(function(){
							var val = $(this).val();
							var price = Math.floor(val/1.1)
							_form.getElement("price").find("input").val(price); // 금액
							_form.getElement("surtax").find("input").val(Math.floor(val-price)); // 부가세
						});
					
					var buy_date_value = _form.getElement("buy_date");
					buy_date_value.datetimepicker({
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

						});
					
					dfd.resolve();
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
    	
    	submitAdd : function(beforEvent, affterEvent){
    	    var view = this;
    	    var dfd= new $.Deferred();
    	    var _view=this,_form=this.form,_data=_form.getData();	    
			var _officeitemModel=new OfficeItemModel(_data);
			
            var _validate=_officeitemModel.validation(_data, {
				serial_yes:""},{disposal_date:""});
            
            if(!_.isUndefined(_validate)){
                Dialog.warning(_validate);
                dfd.reject();
            } else {
                
    	        beforEvent();
		    _officeitemModel.save({},{
        	        //success:function(model, xhr, options){
					success:function(model, xhr, options){

						var respons=xhr.responseJSON;
						_data = xhr.result;
						affterEvent();

						dfd.resolve(_data);
						//dfd.resolve(_.defaults(_data, _officeitemModel.default));
        	        },
        	        error:function(model, xhr, options){
        	            var respons=xhr.responseJSON;
        	            affterEvent();
        	            Dialog.error(respons.message);
        	            dfd.reject();
        	        },
        	        wait:false
        	    });    
            }
    	    
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
    return AddOfficeItemView;
});