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
  'i18n!nls/error',
  'text!templates/default/form.html',
  'text!templates/default/input.html',
  'text!templates/default/datepicker.html',
  'text!templates/default/datepicker.html',
  ], function($, _, Backbone, log, Dialog, Schemas, i18Common, i18nError, FormHTML, InputHTML, DatePickerHTML, ComboHTML){
    var LOG=log.getLogger('Form');
    var _formId=0;
    var _inputId=0;
    var _formName="form_";
    
    var _defaultInputType={
        input:{
            getElement:function(data){
                var _InputTemp=_.template(InputHTML);
                var _input=_.noop();
                _input=_InputTemp(data);
                return $(_input);
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
                return _datePicker; 
            }
        },
        combo:{
            getElement:function(data){
                var _comboTemp=_.template(ComboHTML);
                var _combo=_.noop();
                _combo=$(_comboTemp(data));
                
                var _select=_combo.find("select");
                //data.collection.
                return _combo;  
            }
          
        }
    };
    var Form = Backbone.View.extend({
        initialize:function(options){
            var _formSchema=Schemas.getSchema('form');
            this.options=_formSchema.getDefault(options);
            
            var _formTemp=_.template(FormHTML);
            this.formTemp=_formTemp;
            this.childs=this.options.childs;
            this.elements=[];
            
            if (_.isUndefined(this.options.form.id)){
                this.id = _formName+(_formId++);    
            }
            
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
                        _form.append(_childement);     
                    }
                } else {
                    Dialog.error(i18nError.NOT_SUPPORT_FORM_CHILD);
                    dfd.reject();
                }
            }
            _view.form=_form;
            $(_view.el).html(_form);
            dfd.resolve(_view);
            return dfd.promise();
        },
        getData: function() {
            var unindexed_array = this.form.serializeArray();
            var indexed_array= {};
            
            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });
            return indexed_array;
        }
   });
   return Form;
});