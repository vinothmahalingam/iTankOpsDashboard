
/**
 * App Initialize
 * DOC: Initializes the app with intApp();
 **/	
var initApp = (function(app) {

	/**
	 * Javascript Animation for save settings 
	 * DOC: Spinning icon that appears whenever you
	 * access localstorage or change settings
	 **/
	app.saveSettings = function () {

		/**
		 * if saveSettings function exists
		 **/		
		if (typeof saveSettings !== 'undefined' && $.isFunction(saveSettings) && myapp_config.storeLocally) {

			myapp_config.root_.addClass("saved").delay(600).queue(function(){
				$(this).removeClass("saved").dequeue();
			});

			/**
			 * call saveSettings function from myapp_config.root_ (HTML)	
			 **/
			saveSettings();

			if (myapp_config.debugState)
				console.log( (localStorage.getItem('themeSettings')) ? JSON.parse(localStorage.getItem('themeSettings')) : {} );

		} else {
			console.log("save function does not exist")
		}
	}

	/*
	 * usage: initApp.pushSettings("className1 className2")
	 * DOC: pushSettings will also auto save to localStorage if "storeLocally == true" 
	 * we will use this "pushSettings" when loading settings from a database
	 */
	app.pushSettings = function (DB_string) {

		/* clear localstorage variable 'themeSettings' */
		localStorage.setItem("themeSettings", "");
		/* replace classes from <body> with fetched DB string */
		myapp_config.root_.removeClass().addClass(DB_string);

		/* save settings if "storeLocally == true" */
		initApp.saveSettings();

		/* return string */
		return DB_string;
	}

	/*
	 * usage: var DB_string = initApp.getSettings();
	 * we will use this "getSettings" when storing settings to a database
	 */
	app.getSettings = function () {
		return myapp_config.root_.attr('class').split(/[^\w-]+/).filter(function(item) {
			return /^(nav|header|mod|display)-/i.test(item);
		}).join(' ');
	}

	/**
	 * Assign new height to 'var'
	 * DOC: This will be used later for other calculations
	 * we only call this funtion during screen resize 
	 **/
	app.getNewWindowHeight = function () {

		myapp_config.windowHeight = $(window).height();
		
		if (myapp_config.debugState)
			console.log("app height updated " + myapp_config.windowHeight + " | app.getNewWindowHeight()");		
	}

	/**
	 * Add browser type
	 * DOC: Detect if browser supports webkit CSS
	 **/	
	app.detectBrowserType = function () {

		/**
		 * start script based on safari or chrome detect	
		 **/	

		if(myapp_config.isChrome){

			myapp_config.root_.addClass("chrome webkit");

		} else if (myapp_config.isWebkit) {

			myapp_config.root_.addClass("webkit");

		}

	};

	/**
	 * Add device type
	 * DOC: Detect if mobile or desktop
	 **/		
	app.addDeviceType = function() {
		
		if (!myapp_config.isMobile) {

			/**
			 * desktop
			 **/	
			myapp_config.root_.addClass('desktop');
			myapp_config.thisDevice = 'desktop';

		} else {

			/**
			 * mobile
			 **/
			myapp_config.root_.addClass('mobile');
			myapp_config.thisDevice = 'mobile';
			
			if (myapp_config.fastClick) {

				/**
				 * removes the tap delay in idevices
				 * dependency: js/plugin/fastclick/fastclick.js
				 **/
				myapp_config.root_.addClass('needsclick');
				FastClick.attach(document.body); 
			}
			
		}
		
	};
	
	/**
	 * Fix app height
	 * DOC: Calculates a bunch of condition to fix the CSS height issue
	 **/	
	app.fixAppHeight = function () {

		app.calculateAppHeight = function (){

			var primaryNavHeight = $('#primary-nav').height() + myapp_config.navHeightGap,
				/**
				 * DOC: sort next new height, get max value
				 **/
				newHeight =  Math.max(primaryNavHeight, myapp_config.windowHeight); 

			switch ( true ) {

				case ( primaryNavHeight < myapp_config.windowHeight ):

					/**
					* nav is higher than wrapper
					**/
					myapp_config.root_.css("min-height",  newHeight + "px");

					if (myapp_config.debugState)
						console.log("nav height : " +  newHeight + " | app.fixAppHeight()");

					break;

				case ( primaryNavHeight > myapp_config.windowHeight ):

					/**
					* wrapper is higher than nav
					**/
					myapp_config.root_.css("min-height",  newHeight + "px");

					if (myapp_config.debugState)
						console.log("body height : " +  newHeight + " | app.fixAppHeight()");

					break;

				case ( myapp_config.root_.hasClass('nav-function-fixed') ):

					/**
					 * if navigation is fixed
					 **/
					myapp_config.root_.css("min-height",  primaryNavHeight + "px");

					if (myapp_config.debugState)
						console.log("nav-function-fixed new height : " +  primaryNavHeight + " | app.fixAppHeight()");

					break;

			}	
		}

		/* HINT! alternative way to save ROM for mobile: */
		/* if ( myapp_config.thisDevice === 'desktop' && !myapp_config.root_.is('.nav-function-top, .nav-function-fixed') ) { */
		if ( !myapp_config.root_.is('.nav-function-top, .nav-function-fixed') ) {

			initApp.calculateAppHeight();
				
		}

	}

	/**
	 * Fix logo position on .header-function-fixed & .nav-function-hidden
	 * DOC: Counters browser bug for fixed position and overflow:hidden for the logo (firefox/IE/Safari)
	 *      Will not fire for webkit devices or Chrome as its not needed
	 **/
	 app.windowScrollEvents = function () {
		if ( myapp_config.root_.is(".nav-function-hidden.header-function-fixed:not(.nav-function-top)") &&  myapp_config.thisDevice === 'desktop') {
			$('#logo').css({
				'top': $(window).scrollTop()
			})
		} else if ( myapp_config.root_.is(".header-function-fixed:not(.nav-function-top):not(.nav-function-hidden)") &&  myapp_config.thisDevice === 'desktop') {
			$('#logo').attr("style", "");
		}
	 }

	/**
	 * Check setting conditions
	 * DOC: Sometimes settings can trigger certain plugins; so we check this condition and activate accordingly
	 * E.g: The fixed navigation activates slimScroll plugin for the navigation, but this only happens when
	 *		it detects desktop browser and destroys the plugin when navigation is on top or if its not fixed.
	 **/
	 app.checkSettingConditions = function() {

	 	/**
	 	 * DOC: add the plugin with the following rules: fixed navigation is selected, top navigation is not active, minify nav is not active, 
	 	 * and the device is desktop. We do not need to activate the plugin when loading from a mobile phone as it is not needed for touch screens.
		 **/
		switch ( true ) {

			case ( myapp_config.root_.hasClass('nav-function-fixed') && !myapp_config.root_.is('.nav-function-top, .nav-function-minify, .mod-main-boxed') && myapp_config.thisDevice === 'desktop' ):

				/**
				 * start slimscroll on nav
				 **/
				if ( typeof $.fn.slimScroll !== 'undefined' ) {
					$(myapp_config.navAnchor).slimScroll({
						height: '100%',
						railOpacity: 0.4,
						wheelStep: 10
					});

					if (myapp_config.debugState)
					console.log("slimScroll Enabled");

				} else {
					console.log("$.fn.slimScroll...NOT FOUND");
				}

				/**
				 * fix app height (only needs to be called once)
				 **/
				initApp.calculateAppHeight();

				break;

			case ( $(myapp_config.navAnchor).parent().hasClass('slimScrollDiv') && myapp_config.thisDevice === 'desktop' && typeof $.fn.slimScroll !== 'undefined' ):

				/**
				 * destroy the plugin if it is in violation of the above rules
				 **/
	    		$(myapp_config.navAnchor).slimScroll({ destroy: true });
	    		$(myapp_config.navAnchor).attr('style', '');

	 			/**
				 * remove DOM object
				 * dev note: guessing they fixed this now?
				 **/   		
	    		//$(myapp_config.navAnchor).find( $(".slimScrollBar") ).remove();
	    		//$(myapp_config.navAnchor).find( $(".slimScrollRail") ).remove();

				/**
				 * clear event listners (IE bug)
				 **/
				events = jQuery._data( $(myapp_config.navAnchor)[0], "events" );

				if (events) 
					jQuery._removeData( $(myapp_config.navAnchor)[0], "events" );

				if (myapp_config.debugState)
					console.log("slimScroll destroyed");

				break;
		}

	 };
	
	/**
	 * Activate Nav
	 * DOC: activation will not take place if top navigation is on
	 **/
	app.leftNav = function() {
		
		/**
		 * start left nav
		 * app.ngmenu.js
		 **/
		$(myapp_config.navAnchor + ' ul').ngmenu({ 

			accordion : myapp_config.navAccordion,
			speed : myapp_config.navSpeed,
			closedSign : '<em class="' + myapp_config.navClosedSign + '"></em>',
			openedSign : '<em class="' + myapp_config.navOpenedSign + '"></em>'

		});
	};
	
	/**
	 * Mobile Check Activate
	 * DOC: Check on window resize if screen width is less than [value]
	 */
	app.mobileCheckActivation = function(){
		
		if ( $(window).width() < 993 ) {

			myapp_config.root_.addClass('mobile-view-activated');
			myapp_config.mobileMenuTrigger = true;

		} else if ( myapp_config.root_.hasClass('mobile-view-activated') ) {

			myapp_config.root_.removeClass('mobile-view-activated');
			myapp_config.mobileMenuTrigger = false;

		}

		if (myapp_config.debugState)
			console.log("mobileCheckActivation on " + $(window).width() + "px" + " | mobileMenuTrigger :" + myapp_config.mobileMenuTrigger + " | app.mobileCheckActivation()");

	} 

	/**
	 *  Toggle visibility
	 * 	DOC: Show and hide content with a button action
	 *  Usage: onclick="initApp.toggleVisibility('foo');"
	 **/
	app.toggleVisibility = function (id) {
		var e = document.getElementById(id);
		if (e.style.display == 'block')
			e.style.display = 'none';
		else
			e.style.display = 'block';
	}

	/**
	 * Miscelaneous DOM ready functions
	 * DOC: start jQuery(document).ready calls
	 **/
	app.domReadyMisc = function() {
	
		/**
		 * Check conflicting classes to build/destroy slimscroll
		 **/
		initApp.checkSettingConditions();

		/**
		 * Activate the last tab clicked using localStorage
		 **/
		var lastTab = localStorage.getItem('lastTab');
		 
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			localStorage.setItem('lastTab', $(this).attr('href'));
		});
		if (lastTab) {
			$('[href="' + lastTab + '"]').tab('show');
		} 

		/**
		 * NOTE! fix this to look proper and target properly
		 * Other options:
		 * --------------
			width: '300px',
			height: '500px',
			size: '10px',
			position: 'left',
			color: '#ffcc00',
			alwaysVisible: true,
			distance: '20px',
			start: $('#child_image_element'),
			railVisible: true,
			railColor: '#222',
			railOpacity: 0.3,
			wheelStep: 10,
			allowPageScroll: false,
			disableFadeOut: false
		 **/
		if ( typeof $.fn.slimScroll !== 'undefined' && myapp_config.thisDevice === 'desktop') {
			$('.custom-scroll >:first-child').slimscroll({
				height: '100%',
				distance: '0'
			})
		} else {
			console.log("warning: $.fn.slimScroll not or user is on desktop");
		}

		/**
		 * Start bootstrap tooltips
		 * doc: only fires for desktop
		 **/
		if( typeof($.fn.tooltip) !== 'undefined' && myapp_config.thisDevice === 'desktop' && $('[data-toggle="tooltip"]').length ){
			$('[data-toggle="tooltip"]').tooltip()
		}

		/**
		 * Dropdowns will not close on click
		 * doc: only close dropdowns on click outside
		 **/
		$(document).on('click', '.dropdown-menu', function (e) {
			e.stopPropagation();
		});

		/**
		 * Ripple effect (plugin has issues with IE9)
		 * Note: 'window.atob' detects if IE9+ 
		 * ref: http://tanalin.com/en/articles/ie-version-js/
		 **/
		if ($.fn.ripple && !myapp_config.disableRippleEffect && window.atob &&  !myapp_config.isMobile) {

			$(myapp_config.navAnchor + ' ' + 'a:not(.no-ripple)').ripple({
				scaleMode: false
			});

			$('.btn:not(.no-ripple)').ripple({
				scaleMode: false
			});

			if (myapp_config.debugState)
				console.log("rippler active" + " | myapp_config.rippleEffect : " + myapp_config.rippleEffect);
			
		} else {
			if (myapp_config.debugState)
				console.log("rippler inactive" + " | myapp_config.rippleEffect : " + myapp_config.rippleEffect);
		}

		/**
		 * Action buttons
		 **/		
		myapp_config.root_
			.on('mousedown', '[data-action]', function(e) {

				console.log("data-action clicked");

				var actiontype = $(this).data('action');
				
				switch ( true ) {

					/**
					 * toggle trigger
					 * Usage 1 (body): <a href="#" data-action="toggle" data-class="add-this-class-to-body">...</a>
					 * Usage 2 (target): <a href="#" data-action="toggle" data-class="add-this-class-to-target" data-target="target">...</a>
					 **/

					case ( actiontype === 'toggle' ):

						var target = $(this).attr('data-target') || myapp_config.root_,
							dataClass = $(this).attr('data-class');

						/**
						 * remove previous background image if alternate is selected
						 **/
						if ( dataClass.indexOf('mod-bg-') !== -1 ) {
							$(target).removeClass (function (index, css) {
								return (css.match (/(^|\s)mod-bg-\S+/g) || []).join(' ');
							});
						}

						/**
						 * trigger class change
						 **/
						$(target).toggleClass( dataClass );

						/**
						 * save settings
						 **/
						if ( typeof classHolder != 'undefined' || classHolder != null ) {

							/**
						 	 * NOTE: saveSettings function is located in the *.html page right after <body> tag 
						 	 **/
							initApp.checkSettingConditions();
							initApp.saveSettings();
						}

						/**
						 * fix app height when switching nav from top, side, minify and takes care of some ipad bugs 
						 **/
						if ( dataClass === 'nav-function-top' || 
							 dataClass === 'nav-function-minify' && myapp_config.root_.hasClass('mod-main-boxed') || 
							 dataClass === 'nav-function-fixed' ) {

							initApp.calculateAppHeight();
						}

					break;

					/**
					 * widget 'collapse' trigger
					 **/
					case ( actiontype === 'widget-collapse' ):

						$(this).closest('.widget').toggleClass("widget-collapse");
						
						if (myapp_config.debugState)
								console.log( "widget collapse toggle" );

					break;

					/**
					 * widget 'fullscreen' trigger
					 **/
					case ( actiontype === 'widget-fullscreen' ):

						$(this).closest('.widget').toggleClass("widget-fullscreen");
						myapp_config.root_.toggleClass("widget-fullscreen");

						if (myapp_config.debugState)
								console.log( "widget fullscreen toggle" );

					break;

					/**
					 * widget 'close' trigger
					 **/
					case ( actiontype === 'widget-close' ):

						$(this).closest('.widget').fadeOut(500,function(){
							$(this).remove();
							//console.log("widget removed")
						});
						
						if (myapp_config.debugState)
								console.log( "widget collapse removed" );

					break;

					/**
					 * update header css, 'theme-update' trigger
					 * eg:  data-action = "theme-update" 
					 *      data-theme = "css/cust-theme-1.min.css"
					 **/
					case ( actiontype === 'theme-update' ):

						if ( $('#mytheme').length) {
							$('#mytheme').attr('href', $(this).attr('data-theme') );
						} else {
							$("head").append('<link rel="stylesheet" id="mytheme" href="' + $(this).attr('data-theme') + '">');
						}

						initApp.saveSettings();

					break;

					/**
					 * app 'fullscreen' trigger
					 **/
					case ( actiontype === 'app-fullscreen' ):

						/**
					 	 * NOTE: this may not work for all browsers if the browser security does not permit it 
					 	 * IE issues: http://stackoverflow.com/questions/33732805/fullscreen-not-working-in-ie
					 	 **/
						if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {

							if (document.documentElement.requestFullscreen) {
								/* Standard browsers */
								document.documentElement.requestFullscreen();
							} else if (document.documentElement.msRequestFullscreen) {
								/* Internet Explorer */
								document.documentElement.msRequestFullscreen();
							} else if (document.documentElement.mozRequestFullScreen) {
								/* Firefox */
								document.documentElement.mozRequestFullScreen();
							} else if (document.documentElement.webkitRequestFullscreen) {
								/* Chrome */
								document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
							}

							if (myapp_config.debugState)
								console.log( "app fullscreen toggle active" );

						} else {

							if (document.exitFullscreen) {
								document.exitFullscreen();
							} else if (document.msExitFullscreen) {
								document.msExitFullscreen();
							} else if (document.mozCancelFullScreen) {
								document.mozCancelFullScreen();
							} else if (document.webkitExitFullscreen) {
								document.webkitExitFullscreen();
							}

							if (myapp_config.debugState)
								console.log( "app fullscreen toggle inactive" );
						}

					break; 
				}

				/**
				 * hide tooltip if any present
				 **/
				$(this).tooltip('hide');

				/**
				 * stop default link action
				 **/				
				e.stopPropagation(); 
				e.preventDefault();		
		}); 


		/**
		 * Mobile menu action for screen tap or click to close menu (-)
		 **/
		$(document)
			.on('touchend mousedown', '.mobile-nav-on #content', function(e) {
				myapp_config.root_.removeClass("mobile-nav-on");

				if (myapp_config.debugState)
					console.log(this + " : was clicked to close mobile menu");

				//e.stopPropagation();
				e.preventDefault();
		});


		/**
		 * Mobile menu action for screen swipe to open menu (+)
		 *
		$(document).on( "swiperight", ':not(.mobile-nav-on) body', function( e ) {
		    if ( e.swipestart.coords[0] <50) {
		    	myapp_config.root_.addClass("mobile-nav-on");
		    }
		});
		*/

		/**
		 * windows mobile 8 fix ~
		 * doc: bootstrap related
		 **/
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement('style')
			msViewportStyle.appendChild(
				document.createTextNode(
					'@-ms-viewport{width:auto!important}'
				)
			)
			document.head.appendChild(msViewportStyle)
		}
	};

	/**
	 * Material Forms effects activation
	 * DOC: starts listeners
	 **/
	app.materialFormEffects = function() {

		var parentClass 	= '.my-app-forms',
			focusClass 		= 'has-length',
			disabledClass	= 'has-disabled';

		$('.form-control').each(function () {
			checkLength(this);
		});

		function checkLength(e) {
			if (e.value.length > 0 ) {
				$(e).parents(parentClass).addClass(focusClass);
				if($(e).is('[readonly]') || $(e).is('[disabled]')) {
					$(e).parents(parentClass).addClass(disabledClass);
				}
			} else {
				$(e).parents(parentClass).removeClass(focusClass);
				if($(e).is('[readonly]') || $(e).is('[disabled]')) {
					$(e).parents(parentClass).removeClass(disabledClass);
				}
			}
		}

		function setClass(e, parentClass, focusClass) {
			$(e).parents(parentClass).addClass(focusClass);
		}

		function deleteClass(e, parentClass, focusClass) {
			if(e.value.length) {

			} else {
				$(e).parents(parentClass).removeClass(focusClass);
			}
		}

		$(parentClass).each(function () {
			var input = $(this).find('.form-control');
			input.on('focus', function(){
				setClass(this, parentClass, focusClass);
			});
			input.on('blur', function(){
				deleteClass(this, parentClass, focusClass);
			});
		})

	}

	return app;
	
})({});

initApp.addDeviceType();