$( window ).on( "orientationchange", function( event ) {
	/* reset any .CSS heights and force appHeight function to recalculate */
	$("#page-wrapper").css("min-height", "");

	initApp.calculateAppHeight();

	if (myapp_config.debugState)
		console.log("orientationchange event");
});