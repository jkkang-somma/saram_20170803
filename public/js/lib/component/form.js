// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'jquery.ui',
  'underscore',
  'backbone',
  'log',
  'dialog',
  'schemas',
  'i18n!nls/common',
  'text!templates/default/form.html',
  'text!templates/default/input.html',
  'text!templates/default/price.html',
  'text!templates/default/auto_input.html',
  'text!templates/default/text.html',
  'text!templates/default/password.html',
  'text!templates/default/datepicker.html',
  'text!templates/default/combo.html',
  'text!templates/default/hidden.html',
  'text!templates/default/group.html',
  'text!templates/default/checkBox.html'
  ], function($, jui, _, Backbone, log, Dialog, Schemas, i18Common, FormHTML, InputHTML, PriceHTML, Auto_InputHTML, TextHTML, PasswordHTML, DatePickerHTML, ComboHTML, HiddenHTML, GroupHTML,
		  CheckBoxHTML){
    var LOG=log.getLogger('Form');
    var _formId=0;
    var _inputId=0;
    var _groupId=0;
    var  auto_id  = "";
    var _formName="form_";
    var availableTags = [];
 
    var _defaultInputType={
        input:{
            getElement:function(data){
                var _InputTemp=_.template(InputHTML);
                var _input=_.noop();
                _input=_InputTemp(data);
                var result=$(_input);
                if(!_.isUndefined(data.full)&&data.full){
                    result.removeClass('form-group-harf');
                }

                if(!_.isUndefined(data.disabled)&&data.disabled){
                    result.find("input").attr("readOnly", "readOnly");

                    return result;
                }
                return result;
            }
        },

        price:{
            getElement:function(data){
                var _InputTemp=_.template(PriceHTML);
                var _input=_.noop();
                _input=_InputTemp(data);
                var result=$(_input);
                if(!_.isUndefined(data.full)&&data.full){
                    result.removeClass('form-group-harf');
                }

                if(!_.isUndefined(data.disabled)&&data.disabled){
                    result.find("input").attr("readOnly", "readOnly");

                    return result;
                }
                return result;
            }
        },

        text:{
            getElement:function(data){
                var _TextTemp=_.template(TextHTML);
                var _text=_.noop();
                _text=_TextTemp(data);
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    var result=$(_text);
                    result.find("textarea").attr("readOnly", "readOnly");
                    return result;
                }
                return $(_text);
            }
        },
        password:{
            getElement:function(data){
                var _PasswordTemp=_.template(PasswordHTML);
                var _password=_.noop();
                _password=_PasswordTemp(data);
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    var result=$(_password);
                    result.find("input").attr("readOnly", "readOnly");
                    return result;
                }
                return $(_password);
            }
        },
        date:{
            getElement:function(data){
                var _dateTemp=_.template(DatePickerHTML);
                var _datePicker=_.noop();
                _datePicker=$(_dateTemp(data));
                
                _datePicker.find("#"+data.id).datetimepicker({
                   pickTime: false,
                   format: data.format
                });
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    $(_datePicker).find("input").attr("disabled", "true");
                }
                
                 
                return _datePicker; 
            }
        },
        datetime:{
            getElement:function(data){
                var _dateTemp=_.template(DatePickerHTML);
                var _datePicker=_.noop();
                _datePicker=$(_dateTemp(data));
                
                _datePicker.find("#"+data.id).datetimepicker({
                   pickTime: true,
                   format: data.format
                });
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    $(_datePicker).find("input").attr("disabled", "true");
                }
                
                 
                return _datePicker; 
            }
        },
        combo:{
            getElement:function(data){
                var _comboTemp=_.template(ComboHTML);
                var _combo=_.noop();
                _combo=$(_comboTemp(data));
                
                var _select=_combo.find("select");
                var _options=data.collection.models;
                var _option,_code,_text;
                
                if (_.isArray(data.collection)){ // 콤보 데이터가 array 일경우
                
                    if (data.firstBlank){
                        _select.append("<option value=''></option>");
                    }
                    for (var index in data.collection){
                        _option= data.collection[index];
                        _code=_option.key;
                        _text=_option.value;
                        if (_code==data.value || (_.isEmpty(data.value)&&index==0) ){
                            _select.append("<option selected='selected' value='"+_code+"'>"+_text+"</option>");
                        } else {
                            _select.append("<option value='"+_code+"'>"+_text+"</option>");
                        }
                    }
                } else { // 콤보 데이터가 collection 일경우 
                    
                    if (data.firstBlank){
                        if (_.isUndefined(data.value)){
                            _select.append("<option selected='selected' value=''>-</option>");
                        } else {
                            _select.append("<option value=''>-</option>");
                        }
                    }
                    
                    for (var index in _options){
                        _option= _options[index].attributes;
                        _code=_option[data.codeKey];
                        _text=_option[[data.textKey]];
                        if (_code==data.value || (_.isEmpty(data.value)&&index==0&&!data.firstBlank)){ //초기값 설정
                            _select.append("<option selected='selected' value='"+_code+"'>"+_text+"</option>");
                        } else {
                            _select.append("<option value='"+_code+"'>"+_text+"</option>");
                        }
                    }
                
                    _select.on('change', function(e){// 콤보박스 선택시 히든값 셋팅
                        var _text=$(this).find("option:selected").text();
                        if (!_.isUndefined(data.linkField)){
                            $('[data-hidden="'+data.linkField+'"]').val(_text);
                        }

                        if (!_.isUndefined(data.linkFieldValue)){
                            var _value=$(this).find("option:selected").val();
                            $('[data-hidden="'+data.linkFieldValue+'"]').val(_value);
                        }
                    });
                }
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    _select.attr("disabled", "true");
                }
                
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {//모바일 처리.
                    _select.selectpicker('mobile');
                } else {
                    _select.selectpicker({
                        style: 'btn-primary'
                    });
                }
                
                return _combo;  
            }
        },
        empty:{
            getElement:function(){
                var empty = $('<input type="hidden" class="form-control"/>');
                return empty;
            }
        },
        hidden:{
            getElement:function(data){
                var _hiddenTemp=_.template(HiddenHTML);
                var _hidden=_.noop();
                if (_.isUndefined(data.value) || _.isEmpty(data.value)){
                    if(!_.isUndefined(data.isValueInput)){
                        data.value=data.value;
                    }else{
                        var _options=data.collection.models;
                        for (var index in _options){
                            var _option= _options[index].attributes;
                            var _text=_option[[data.textKey]];
                            var _code=_option["code"];
                            if (data.firstBlank){
                                data.value="";
                            } else {
                                if (index==0){ //초기값 설정

                                    if (!_.isUndefined(data.linkFieldValue)){
                                        data.value=_code;
                                    }else{
                                        data.value=_text;
                                    }
                                }
                            }
                            
                        }
                    }
                }
                
                _hidden=$(_hiddenTemp(data));
                return _hidden;  
            }
        },
        checkBox:{
            getElement:function(data){
                var _CheckBoxTemp=_.template(CheckBoxHTML);
                var _checkBox=_.noop();
                _checkBox=_CheckBoxTemp(data);
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    var result=$(_checkBox);
                    result.find("input").attr("readOnly", "readOnly");

                    return result;
                }
                return $(_checkBox);
            }
        },
        auto_input:{
             getElement:function(data){
                // for( var index = 0; index < data.input_data.models.length; index++) {
                //      availableTags[index] = data.input_data.models[index].attributes.name + "(" + data.input_data.models[index].attributes.code + ")";
                //      console.log(availableTags[index]);
                // }
                
                // for( var index = 0; index < data.user_data.models.length; index++) {
                //     availableTags[index] = data.user_data.models[index].attributes.name + "(" + data.user_data.models[index].attributes.code + ")";
                //     console.log(availableTags[index]);
                // }
                //availableTags = data.input_data;
                var _InputTemp=_.template(Auto_InputHTML);
                var _input=_.noop();
                _input=_InputTemp(data);
                return $(_input);
            }
        },
    };
    var Form = Backbone.View.extend({
        initialize:function(options){
            this.elementsMap = {};
            this.groupMap = {};
            
            var _formSchema=Schemas.getSchema('form');
            this.options=_formSchema.getDefault(options);
            
            //for
            var _formTemp=_.template(FormHTML);
            this.formTemp=_formTemp;
            
            
            this.childs=this.options.childs;
            
            //그룹 초기화 및 설정 정보가 있으면 셋팅
            this.group=_.noop();
            if (!_.isUndefined(this.options.group)){
                this.group=this.options.group;
            }
            
            this.elements=[];
            this.groupElements=[];
            if (_.isUndefined(this.options.form.id)){
                this.id = _formName+(_formId++);    
            }
            
            //옵션중 자동 랜더 일경우 
            var autoRender=this.options.autoRender;
            if (autoRender){
                this.render();   
            }
            _.bindAll(this, 'render');
            _.bindAll(this, 'getData');
        },
        render:function(){
            var dfd= new $.Deferred();
            
            var _view=this;
            var _form=$(_view.formTemp(this.options.form));
            var _childs=_view.childs;
            var _group=_view.group;
            var _formType = (_.isUndefined(_view.options.type))? 'default' : _view.options.type;
            
            if (!_.isUndefined(_group)){//설정 그룹이 있을 경우.
              //  var _schema=Schemas.getSchema(_type);//default config
                for (var index in _group){
                    var group=_group[index];
                    group.id=_view.id+"_"+group.name+"_"+(_groupId++);
                    group.titleVisible = (_.isUndefined(group.titleVisible))? true: group.titleVisible;
                    var groupTemp=_.template(GroupHTML);
                    var groupTag=$(groupTemp(group));

                    if(!group.titleVisible){
                        groupTag.find('.panel-heading').hide();
                    }

                    if(group.type == 'detail'){
                        console.log(_formType)
                        groupTag.addClass('detail-content');
                    }
                    
                    _view.groupElements.push(groupTag);
                    _form.append(groupTag);
                }
            }
            
            for (var i=0; i < _childs.length; i++){// form child make
                var _child=_childs[i];
                if (_.isObject(_child)){
                    var _childement,_type,_config;
                    
                    //child Type check
                    if (_.isUndefined(_child.type)){
                        LOG.error("Input Component type is null.");
                        dfd.reject();
                        return dfd.promise();
                    }
                 
                    _type=_child.type;
                    var _schema=Schemas.getSchema(_type);//default config
                    _config=_schema.getDefault(_child);
                    if (_.isUndefined(_child.id)){
                        _config=_.extend(_config, {id:_view.id+"_"+_type+"_"+(_inputId++)}); //setting config
                    }
                    else {
                        auto_id = _child.id;
                        _config=_.extend(_config, {id:_child.id}); //setting config
                    }
                    
                    _childement=_defaultInputType[_type].getElement(_config);
                    
                    _view.elements.push(_childement);
                    _view.elementsMap[_config.name] = _childement;
                    if (!_.isUndefined(_view.el)){
                        if (!_.isUndefined(_config.group)){//group 설정이 있을 경우 그룹에 append
                            var findIndex=_.indexOf(_.pluck(_view.group, "name"), _config.group);
                            if (findIndex > -1 ){
                                if(_.isUndefined(this.groupMap[_config.group])){
                                    this.groupMap[_config.group] = [];
                                }
                                this.groupMap[_config.group].push(_childement);
                                // _view.groupElements[findIndex].find(".panel-body").append(_childement);
                            } else {
                                LOG.debug("Not find Group:" + _config.group + " => " + _config.name);
                            }
                        } else {
                            
                            if(_.isUndefined(this.groupMap["default"])){
                                this.groupMap["default"] = [];
                            }
                            this.groupMap["default"].push(_childement);
                            // _form.append(_childement);     
                        }
                    }
                    
                } else {
                    LOG.error("not support child type.");
                    dfd.reject();
                }
            }
            if (!_.isUndefined(_view.el)){
                var keys= _.keys(this.groupMap);
            
                if(keys.length == 1 && keys[0] == "default"){
                    var formRow = $("<div class='form-row'></div>");
                    var formCount = 0;
                    for(var j=0; j<this.groupMap.default.length; j++){
                        var element = this.groupMap.default[j];
                        if(element.hasClass("form-group-harf")){
                            formCount += 1;
                            formRow.append(element);
                            if(formCount == 2){
                                _form.append(formRow);
                                formRow = $("<div class='form-row'></div>");
                                formCount =0;
                            }
                        }else{
                            if(formCount == 1){
                                dest.append(formRow);
                                formCount = 0;
                            }
                            _form.append(element);        
                        }
                        if(formCount == 1){
                            _form.append(formRow);
                            formCount = 0;
                        }
                    }
                } else {
                    for(var key in this.groupMap){
                        var group = this.groupMap[key];
                        
                        var findIndex=_.indexOf(_.pluck(_view.group, "name"), key);
                        if (findIndex > -1 ){
                            var formRow = $("<div class='form-row'></div>");
                            var formCount =0;
                            var dest = _view.groupElements[findIndex].find(".panel-body");
                            
                            for(var k=0; k<group.length; k++){
                                var element = group[k];
                                if(element.hasClass("form-group-harf")){
                                    formCount += 1;
                                    formRow.append(element);
                                    if(formCount == 2){
                                        dest.append(formRow);
                                        formRow = $("<div class='form-row'></div>");
                                        formCount =0;
                                    }
                                }else{
                                    if(formCount == 1){
                                        dest.append(formRow);
                                        formCount = 0;
                                    }
                                    dest.append(element);        
                                }
                            }
                            if(formCount == 1){
                                dest.append(formRow);
                                formCount = 0;
                            }
                        } else {
                            LOG.debug("Not find Group:" + _config.group + " => " + _config.name);
                            continue;
                        }
                    }
                }
            }
            _view.form=_form;
            $(_view.el).html(_form);
            dfd.resolve(_view);
            return dfd.promise();
        },
        getElement : function(name){
            return this.elementsMap[name];
        },
        getData: function() {
            var disabled = this.form.find(':input:disabled').removeAttr('disabled');
            var unindexed_array = this.form.serializeArray();
            disabled.attr('disabled', 'disabled');
            
            var indexed_array= {};
            
            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            
            this.form.find(":checkbox").each(function() {
            	indexed_array[this.name] = this.checked;
            });
            
            return indexed_array;
        }
   });
   return Form;
});