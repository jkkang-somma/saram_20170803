define([
  'jquery',
  'spin',
  'log',
  ], function($, Spin, log){
     var opts = {
        lines: 7, // The number of lines to draw
        length: 1, // The length of each line
        width: 4, // The line thickness
        radius: 4, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '10px', // Top position relative to parent
        left: '5px' // Left position relative to parent
    }; 
    
    return {
      createSpin:function(target){
        var spin= new Spin(opts).spin(target);
        return spin;
      }
    };
});