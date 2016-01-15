// Author: sanghee park <novles@naver.com>
// Create Date: 2014.02.04
// Value Validation Util
define([
  'jquery',
  'underscore', 
  'log'
], function($, _, log){
    var LOG=log.getLogger('Validator');
    
    var _isValidation=function(value, regex){
        var result=false;
        if (!_.isUndefined(value)){
            result = regex.test(value);
        }
        return result;
    }
    var _isEmail=function(value){
        //xxxx@xxxxx.xxx.xxx or xxxx@xxx.xxx
        var regex=/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}(\.[a-z]{2,3})?$/;
        return _isValidation(value, regex);
    }
    var _isNumber=function(value){
        //-1,  11, 11.11, -11.11
        var regex=/^[-]?([0-9])+\.([0-9])+|([0-9])+$/;
        return _isValidation(value, regex);
    }
    
    var _isPhoneNumber=function(value){
        //0xx-xxxx-xxxx
        var regex=/^[0]([0-9]{2})+-([0-9]{3,4})+-([0-9]{4})+$/;
        return _isValidation(value, regex);
    }
    
    var _isTime=function(value){
        //h24:min:ss
        var regex=/^(([0-1][0-9])|([2][0-3])):([0-5][0-9]):([0-5][0-9])$/
        return _isValidation(value, regex);
    }
    
    var _isDate=function(value){
        //yyyy-mm-dd
        var regex=/^([0-9]{4})-(([0][1-9])|([1][0-2]))-(([0][1-9])|(([1-2][0-9])|([3][0-1])))$/
        return _isValidation(value, regex);
    }
    
    var _validate=function(validObjectArr){
        var result ={
            isValid:true,
            message:""
        };
        for (var index in validObjectArr){
            var validObject=validObjectArr[index];
            if (!validObject.validator.validation(validObject.value)){
                result.message=validObject.message;
                result.isValid=false;
                
                return result;
            }
        }
        return result;
    }
    
    return {
        validate:_validate,
        email:{
            type:"email",
            validation:_isEmail
        },
        number:{
            type:"number",
            validation:_isNumber
        },
        phoneNumber:{
            type:"phoneNumber",
            validation:_isPhoneNumber
        },
        time:{
            type:"time",
            validation:_isTime
        },
        isTime:_isTime,
        isEmail:_isEmail,
        isNumber:_isNumber,
        isPhoneNumber:_isPhoneNumber,
        iscustom:{
            
        }
    }
});