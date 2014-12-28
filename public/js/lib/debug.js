// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'util',
  'log4javascript'
], function($, Util, log4javascript){
    var DEBUG=0,INFO=1,ERROR=2;
    var app={
        level:DEBUG
    };
    var defaultConfig={
        level:DEBUG
    };
    var modules={
        "DEFAULT":defaultConfig,
        "APP":app    
    };
    
    var log = log4javascript.getLogger();
    var appender=new log4javascript.BrowserConsoleAppender();
    var layout = new log4javascript.PatternLayout("%m");
    appender.setLayout(layout)
    log.addAppender(appender);
    
    var print_r=function(printthis) {
        var output = '';
    
        if($.isArray(printthis) || typeof(printthis) == 'object') {
            for(var i in printthis) {
                output += i + ' : ' + print_r(printthis[i], true) + '\n';
            }
        }else {
            output += printthis;
        }
        return printthis;
    } 
    
    var getLogger=function(module){
        var moduleName="DEFAULT";
        if (Util.inObject(module, modules)){
            moduleName=module;
        } 
        return {
            debug:function(msg){
                if (modules[moduleName].level>=DEBUG){
                    log.debug("["+module+"]:"+print_r(msg));    
                }
            },
            info:function(msg){
                if (modules[moduleName].level>=INFO){
                    log.info("["+module+"]:"+print_r(msg));    
                }
            },
            error:function(msg){
                if (modules[moduleName].level>=ERROR){
                    log.error("["+module+"]:"+print_r(msg));    
                }
            }
        };  
    };
    return {
        getLogger:getLogger
    };
});