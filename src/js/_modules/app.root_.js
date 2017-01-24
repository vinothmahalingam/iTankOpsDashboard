/** 
 * global root point declaration;
 * NOTE: we define a root point here to save memory
 **/

$.root_ = $('body');

/**
 * detect if footerHeight exists
 * NOTE: we added the +1 because jquery was not detecting border-height
 **/	
if ( $('#nav-footer').is(":visible") ) {
	var navHeightGap = $('#nav-footer').height() + $('header').height() + 1;
} else {
	var navHeightGap = $('header').height() + 1;
}
