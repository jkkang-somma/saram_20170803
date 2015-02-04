// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'dialog',
  'schemas',
  'i18n!nls/common',
  'text!templates/default/form.html',
  'text!templates/default/input.html',
  'text!templates/default/text.html',
  'text!templates/default/password.html',
  'text!templates/default/datepicker.html',
  'text!templates/default/combo.html',
  'text!templates/default/hidden.html',
  'text!templates/default/group.html',
  ], function($, _, Backbone, log, Dialog, Schemas, i18Common, FormHTML, InputHTML, TextHTML, PasswordHTML, DatePickerHTML, ComboHTML, HiddenHTML, GroupHTML){
    var LOG=log.getLogger('Form');
    var _formId=0;
    var _inputId=0;
    var _groupId=0;
    var _formName="form_";
    
    var _defaultInputType={
        input:{
            getElement:function(data){
                var _InputTemp=_.template(InputHTML);
                var _input=_.noop();
                _input=_InputTemp(data);
                
                if(!_.isUndefined(data.disabled)&&data.disabled){
                    var result=$(_input);
                    result.find("input").attr("readOnly", "readOnly");

                    return result;
                }
                return $(_input);
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
                    });
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
        hidden:{
            getElement:function(data){
                var _hiddenTemp=_.template(HiddenHTML);
                var _hidden=_.noop();
                if (_.isUndefined(data.value) || _.isEmpty(data.value)){
                    var _options=data.collection.models;
                    for (var index in _options){
                        var _option= _options[index].attributes;
                        var _text=_option[[data.textKey]];
                        if (index==0){ //초기값 설정
                            data.value=_text;
                        }
                    }
                }
                
                _hidden=$(_hiddenTemp(data));
                return _hidden;  
            }
        },
    };
    var Form = Backbone.View.extend({
        initialize:function(options){
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
            
            if (!_.isUndefined(_group)){//설정 그룹이 있을 경우.
              //  var _schema=Schemas.getSchema(_type);//default config
                for (var index in _group){
                    var group=_group[index];
                    group.id=_view.id+"_"+group.name+"_"+(_groupId++);
                    
                    var groupTemp=_.template(GroupHTML);
                    var groupTag=$(groupTemp(group));
                    
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
                    _config=_.extend(_config, {id:_view.id+"_"+_type+"_"+(_inputId++)}); //setting config
                    
                    _childement=_defaultInputType[_type].getElement(_config);
                    _view.elements.push(_childement);
                    
                    if (!_.isUndefined(_view.el)){
                        if (!_.isUndefined(_config.group)){//group 설정이 있을 경우 그룹에 append
                            var findIndex=_.indexOf(_.pluck(_view.group, "name"), _config.group);
                            if (findIndex > -1 ){
                                _view.groupElements[findIndex].find(".panel-body").append(_childement);
                            } else {
                                LOG.debug("Not find Group:" + _config.group + " => " + _config.name);
                            }
                        } else {
                            _form.append(_childement);     
                        }
                    }
                } else {
                    LOG.error("not support child type.");
                    dfd.reject();
                }
            }
            _view.form=_form;
            $(_view.el).html(_form);
            dfd.resolve(_view);
            return dfd.promise();
        },
        getData: function() {
            var disabled = this.form.find(':input:disabled').removeAttr('disabled');
            var unindexed_array = this.form.serializeArray();
            disabled.attr('disabled', 'disabled');
            
            var indexed_array= {};
            
            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            return indexed_array;
        }
   });
   return Form;
});