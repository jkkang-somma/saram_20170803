define([
'jquery',
], function($, _, Backbone, log){
    var ComboBox={
        createCombo:function(select){
            
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {//모바일 처리.
                select.selectpicker('mobile');
            } else {
                select.selectpicker({
                    style: 'btn-primary'
                });
            }  
        }
    }
    return ComboBox;
});