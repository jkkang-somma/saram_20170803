// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'momentjs',
  'module'
], function($, moment, Module){
	moment.lang('kr');
    moment().format();
    return moment;    
});