/**
 * DOCUMENT LOADED EVENT
 * DOC: Fire when DOM is ready
 * Do not change order a, b, c, d...
 **/
jQuery(document).ready(function() {

	/**
	 * detect desktop or mobile 
	 **/
	initApp.addDeviceType();

	/**
	 * detect Webkit Browser 
	 **/
	initApp.detectBrowserType();

	/**
	 * a. check for mobile view width and add class .mobile-view-activated
	 **/
	initApp.mobileCheckActivation();

	/**
	 * b. assign window height on page load
	 **/	
 	initApp.getNewWindowHeight();

 	/**
	 * c. fix application height
	 **/	
  	initApp.fixAppHeight();	

 	/**
	 * d. build navigation
	 **/
	initApp.ngMenu(myapp_config.navHooks);

 	/**
	 * e. run DOM misc functions
	 **/
	initApp.domReadyMisc();

 	/**
	 * f. material form effects
	 **/
	initApp.materialFormEffects();

}); 
