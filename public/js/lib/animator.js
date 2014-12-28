// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'log',
  'util'
], function($, _, Backbone, log, Util){
    var tags=[
        'shake',
        'bounce','bounceIn','bounceInDown','bounceInLeft', 'bounceInLeft', 'bounceInRight','bounceInUp',
        'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp',
        'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp',
        'fadeIn', 'fadeInDown', 'fadeInUp',
        'fadeOut', 'fadeOutDown', 'fadeOutUp'
    ];
    var animate= function(el, tag, callback){
        if (Util.isNotNull(tag)) {
            if (Util.inArray(tag, tags)){
                var className = tag + ' animated';
                $(el).addClass(className).bind(
                    'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function(event){
                        console.log(className);
                        $(this).removeClass(className);
                    }
                );
            } else {
                log.debug("No have Animation tag:"+tag);
            }
        } else {
            log.debug("No have Animation tag:"+tag);
        }
    }
    return {
        animate:animate,
        SHAKE:'shake',
        BOUNCE:'bounce',BOUNCE_IN:'bounceIn',BOUNCE_IN_DOWN:'bounceInDown',BOUNCE_IN_LEFT:'bounceInLeft', BOUNCE_IN_RIGHT:'bounceInRight',BOUNCE_IN_UP:'bounceInUp',
        ZOOM_IN:'zoomIn', ZOOM_IN_DOWN:'zoomInDown', ZOOM_IN_LEFT:'zoomInLeft', ZOOM_IN_RIGHT:'zoomInRight', ZOOM_IN_UP:'zoomInUp',
        ZOOM_OUT:'zoomOut', ZOOM_OUT_DOWN:'zoomOutDown', ZOOM_OUT_LEFT:'zoomOutLeft', ZOOM_OUT_RIGHT:'zoomOutRight', ZOOM_OUT_UP:'zoomOutUp',
        FADE_IN:'fadeIn', FADE_IN_DOWN:'fadeInDown', FADE_IN_UP:'fadeInUp',
        FADE_OUT:'fadeOut', FADE_OUT_DOWN:'fadeOutDown', FADE_OUT_UP:'fadeOutUp'
    };
});