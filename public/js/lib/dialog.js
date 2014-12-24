// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'util',
  'log4javascript',
  'bootstrap-dialog',
  'i18n!nls/common',
  'i18n!nls/error'
], function($, _, Backbone, Util, log4javascript, BootstrapDialog, i18nCommon){
    
    var types = [BootstrapDialog.TYPE_DEFAULT, 
                     BootstrapDialog.TYPE_INFO, 
                     BootstrapDialog.TYPE_PRIMARY, 
                     BootstrapDialog.TYPE_SUCCESS, 
                     BootstrapDialog.TYPE_WARNING, 
                     BootstrapDialog.TYPE_DANGER];
                     
    var error=function(msg, callback){
        BootstrapDialog.show({
            title: i18nCommon.DIALOG.TITLE.ERROR,
            message:msg,
            type: BootstrapDialog.TYPE_DANGER,
            closable: true, 
            buttons: [{
                label: i18nCommon.DIALOG.BUTTON.OK,
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                    dialogRef.close();
                    if (Util.isNotNull(callback)){
                        callback();
                    }
                }
            }] 
        });
    }
    
    var info=function(msg, callback){
        BootstrapDialog.show({
            title: i18nCommon.DIALOG.TITLE.INFO,
            message:msg,
            type: BootstrapDialog.TYPE_DEFAULT,
            closable: true, 
            buttons: [{
                label: i18nCommon.DIALOG.BUTTON.OK,
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                    dialogRef.close();
                    if (Util.isNotNull(callback)){
                        callback();
                    }
                }
            }] 
        });
    }
    
    var show=function(msg, callback){
        BootstrapDialog.show({
            title: i18nCommon.DIALOG.TITLE.DEFAULT,
            message:msg,
            type: BootstrapDialog.TYPE_INFO,
            closable: true, 
            buttons: [{
                label: i18nCommon.DIALOG.BUTTON.OK,
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                    dialogRef.close();
                    if (Util.isNotNull(callback)){
                        callback();
                    }
                }
            }] 
        });    
    }
    return {
        info:info,
        error:error,
        show:show
    }
});