// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'momentjs'
], function($, moment){
	  moment.lang('kr');
    moment().format();
    return moment;    
});