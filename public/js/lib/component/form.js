// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'schemas',
  'text!templates/default/form.html',
  'text!templates/default/input.html',
  ], function($, _, Backbone, log, Schemas, FormHTML, InputHTML){
    var LOG=log.getLogger('Form');
    var _formId=0;
    var _inputId=0;
    var _formName="form_";
    var _INPUT="input";
    var _defaultInputType={
       input:{
          getElement:function(data){
            var _InputTemp=_.template(InputHTML);
            var _input=_.noop();
            
            if (_.isString(data)||_.isUndefined(data)){
               _input=_InputTemp();   
            } else {
               _input=_InputTemp(data);   
            }
            return _input;
          }
       },
       date:{
          getElement:function(){
             
          }
       },
       combo:{
          getElement:function(){
             
          }
          
       }
    };
    var Form = Backbone.View.extend({
    	initialize:function(options){
    	   var _formSchema=Schemas.getSchema('form');
    	   this.options=_formSchema.getDefault(options);
    	   
         var _formTemp=_.template(FormHTML);
         var _form=_formTemp(this.options.form);
         
         this.formTemp=_formTemp;
         this.childs=this.options.childs;
         this.elements=[];
         
         if (_.isUndefined(_form.id)){
            this.id = _formName+(_formId++);    
         }
         
         var autoRender=this.options.autoRender;
         if (!_.isUndefined(autoRender) || autoRender){
            this.render();   
         }
         _.bindAll(this, 'render');
    	},
    	render:function(){
    	   var _form=this;
    	   var _childs=_form.childs;
    	   
    	   for (var index in _childs){// form child make
    	      var _child=_childs[index];
    	      
    	      //단순한 스트링일때 default make
    	      if (_.isString(_child)){
    	         _form._createDefaultInput(_child);  
    	      }
    	   }
    	   
    	   LOG.debug(_form.elements);
     	},
     	_createDefaultInput:function(childName){
     	   var _form=this;
     	   var _inputTypes=_.keys(_defaultInputType);
     	   var _index=_.indexOf(_inputTypes, childName);   
     	   if (-1 < _index){//default Input
     	      var _data={
     	         el:childName,
     	         label:childName,
     	         id:_form.id+"_input_"+(_inputId++)
     	      };
     	      var _inputTag=_defaultInputType[_INPUT].getElement(_data);
     	      var _inputElement=$(_inputTag);
     	      _form.elements.push(_inputElement);
     	   }
     	},
     	getData: function() {
         var unindexed_array = $("#"+this.options.id).serializeArray();
         var indexed_array= {};
    	    
         $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
         });
         return indexed_array;
    	}
    });
    return Form;
});