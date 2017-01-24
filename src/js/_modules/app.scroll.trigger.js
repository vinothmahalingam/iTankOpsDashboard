/**
 * Bind the throttled handler to the scroll event.
 * NOTE: Please do not change the order displayed (e.g. 1a, 1b, 2a, 2b...etc)
 **/

 $(window).scroll(

 	$.throttle( myapp_config.throttleDelay, function (e) {

		 /**
		  * FIX APP HEIGHT
		  * Compare the height of nav and content;
		  * If one is longer/shorter than the other, measure them to be equal.
		  * This event is only fired on desktop.
		  **/
		  initApp.fixAppHeight();

		  /** -- insert your other resize codes below this line -- **/

	})

 );

$(window).on('scroll', initApp.windowScrollEvents);