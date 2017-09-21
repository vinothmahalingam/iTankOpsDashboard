/**
 * Mobile orientation change events
 * DOC: recalculates app height
 **/
$( window ).on( "orientationchange", function( event ) {
	/* reset any .CSS heights and force appHeight function to recalculate */
	myapp_config.root_.css("min-height", "");

	initApp.calculateAppHeight();

	if (myapp_config.debugState)
		console.log("orientationchange event");
});
