/**
 * App Initialize
 * DOC: initializes the app with intApp();
 **/	
var initApp = (function(app) {

	/**
	 * List filter 
	 * DOC: searches list items, it could be UL or DIV elements
	 * usage: initApp.listFilter($('.list'), $('#intput-id'));
	 *        inside the .list you will need to insert 'data-filter-tags'
	 **/
	app.listFilter = function (list, input, anchor) {

		/* add class to filter hide/show */
		if (anchor) {
			$(anchor).addClass('js-list-filter')
		} else {
			$(list).addClass('js-list-filter');
		}

		/* on change keyboard */
		$(input).change( function () {

			var filter = $(this).val().toLowerCase(),
				listPrev = $(list).next().filter('.js-filter-message');
	
			/* when user types more than 1 letter start search filter */
			if(filter.length > 1) {

				/* this finds all data-filter-tags in a list that contain the input val,
				   hiding the ones not containing the input while showing the ones that do */
				
				/* (1) hide all that does not match */   
				$(list).find($("a:not([data-filter-tags*='" + filter + "'])"))
					.parentsUntil(list).removeClass('js-filter-show')
					.addClass('js-filter-hide');

				/* (2) hide all that does match */	
				$(list).find($("[data-filter-tags*='" + filter + "']"))
					.parentsUntil(list).removeClass('js-filter-hide')
					.addClass('js-filter-show');

				/* if element exists then print results */	
				if (listPrev){	
					listPrev.text("showing " + $(list).find('li.js-filter-show').length + " from " + $(list).find('[data-filter-tags]').length + " total");
				}

			} else {

				/* when filter length is blank reset the classes */
				$(list).find('[data-filter-tags]').parentsUntil(list).removeClass('js-filter-hide js-filter-show')	

				/* if element exists reset print results */
				if (listPrev){
					listPrev.text("");
				}
			} 

			return false;

		}).keyup( $.debounce( myapp_config.filterDelay, function (e) {

			/* fire the above change event after every letter is typed with a delay of 250ms */
		 	$(this).change()

		 	/*if(e.keyCode == 13) {
				console.log( $(list).find(".filter-show:not(.filter-hide) > a") );
			}*/

		}));
	}

	/**
	 * Load scripts using lazyload method 
	 * usage: initApp.loadScript("js/my_lovely_script.js", myFunction);
	 **/
	app.loadScript = function (scriptName, callback) {

		if (!myapp_config.jsArray[scriptName]) {	
			var promise = jQuery.Deferred();

			/* adding the script tag to the head as suggested before */
			var body = document.getElementsByTagName('body')[0],
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = scriptName;

			/* then bind the event to the callback function
			   there are several events for cross browser compatibility */
			script.onload = function() {
				promise.resolve();
			};

			/* fire the loading */
			body.appendChild(script);
			myapp_config.jsArray[scriptName] = promise.promise();
		}	

		else if (myapp_config.debugState)
			console.log("This script was already loaded: " + scriptName);

		myapp_config.jsArray[scriptName].then(function () {
			if(typeof callback === 'function') {
				callback();
			}
		});
	}

	/**
	 * Javascript Animation for save settings 
	 **/
	app.saveSettings = function () {

		/* if saveSettings function exists */		
		if (typeof saveSettings !== 'undefined' && $.isFunction(saveSettings) && myapp_config.storeLocally) {

			/* call accessIndicator animation */
			initApp.accessIndicator();

			/* call saveSettings function from myapp_config.root_ (HTML) */
			saveSettings();

			if (myapp_config.debugState)
				console.log('Theme settings: ' + '\n' +localStorage.getItem('themeSettings'));

		} else {
			console.log("save function does not exist")
		}
		
	}

	/**
	 * Reset settings 
	 * DOC: removes all classes from root_ then saves
	 **/
	app.resetSettings = function () {

		/* remove all setting classes nav|header|mod|display */
		myapp_config.root_.removeClass (function (index, className) {
			return (className.match (/(^|\s)(nav-|header-|mod-|display-)\S+/g) || []).join(' ');
		});

		/* detach custom css skin */
		$(myapp_config.mythemeAnchor).attr('href', "");

		/* check non-conflicting plugins */
		initApp.checkSettingConditions();

		/* adjust app height */
		initApp.calculateAppHeight();

		/* save settings if "storeLocally == true" */
		initApp.saveSettings();

		if (myapp_config.debugState)
			console.log("App reset successful");
	}

	/**
	 * Access Indicator
	 * DOC: spinning icon that appears whenever you
	 * access localstorage or change settings
	 **/
	app.accessIndicator = function () {

		myapp_config.root_.addClass('saving').delay(600).queue(function(){
			$(this).removeClass('saving').dequeue();
			return true;
		});

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

		/* destroy or enable slimscroll */
		initApp.checkSettingConditions();

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

	/*
	 * Checks and sets active settings selections
	 *DOC: ?
	 */
	/*app.indicateSelections = function () {

		var classNames = initApp.getSettings()
			.split(' ')
			.map(function(c) {
				return '[data-class="' +  c + '"].js-indicateSelections';
			})
			.join(',');

		$('[data-class].active.js-indicateSelections').removeClass('active');
		$(classNames).addClass('active');

		if (myapp_config.debugState)
			console.log(classNames);
	}*/

	/**
	 * Assign new height to 'var'
	 * DOC: this will be used later for other calculations, we only call this funtion during screen resize 
	 **/
	app.getNewWindowHeight = function () {

		myapp_config.windowHeight = $(window).height();
		
		if (myapp_config.debugState)
			console.log("app height updated: " + myapp_config.windowHeight);		

		return myapp_config.windowHeight;
	}

	/**
	 * detect browser type
	 * DOC: detect if browser supports webkit CSS
	 **/	
	app.detectBrowserType = function () {

		/* safari, chrome or IE detect */	
		if(myapp_config.isChrome){

			myapp_config.root_.addClass('chrome webkit');
			return 'chrome webkit';

		} else if (myapp_config.isWebkit) {

			myapp_config.root_.addClass('webkit');
			return 'webkit';

		} else if (myapp_config.isIE) {

			myapp_config.root_.addClass('ie');
			return 'ie';
		}

	};

	/**
	 * Add device type
	 * DOC: Detect if mobile or desktop
	 **/		
	app.addDeviceType = function() {
		
		if (!myapp_config.isMobile) {

			/* desktop */	
			myapp_config.root_.addClass('desktop');
			myapp_config.thisDevice = 'desktop';

		} else {

			/* mobile */
			myapp_config.root_.addClass('mobile');
			myapp_config.thisDevice = 'mobile';
			 
		}

		return myapp_config.thisDevice;
		
	};
	
	/**
	 * Fix app height
	 * DOC: Calculates a bunch of condition to fix the CSS height issue
	 **/	
	app.fixAppHeight = function () {

		app.calculateAppHeight = function (){

			var primaryNavHeight = myapp_config.navAnchor.height() + myapp_config.navHeightGap,

				/* sort next new height, get max value */
				newHeight =  Math.max(primaryNavHeight, myapp_config.windowHeight); 

			switch ( true ) {

				case ( primaryNavHeight < myapp_config.windowHeight ):

					/* nav is higher than wrapper */
					myapp_config.root_wrapper.css("min-height",  newHeight + "px");

					if (myapp_config.debugState)
						console.log("nav height : " +  newHeight);

					break;

				case ( primaryNavHeight > myapp_config.windowHeight ):

					/* wrapper is higher than nav */
					myapp_config.root_wrapper.css("min-height",  newHeight + "px");

					if (myapp_config.debugState)
						console.log("body height : " +  newHeight);

					break;

				case ( myapp_config.root_.hasClass('nav-function-fixed') ):

					/* if navigation is fixed */
					myapp_config.root_wrapper.css("min-height",  primaryNavHeight + "px");

					if (myapp_config.debugState)
						console.log("nav-function-fixed new height : " +  primaryNavHeight);

					break;

			}	
		}

		/* HINT! alternative way to save ROM for mobile:
		   if ( myapp_config.thisDevice === 'desktop' && !myapp_config.root_.is('.nav-function-top, .nav-function-fixed') ) { */
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
		if ( myapp_config.root_.is('.nav-function-hidden.header-function-fixed:not(.nav-function-top)') &&  myapp_config.thisDevice === 'desktop') {
			myapp_config.root_logo.css({
				'top': $(window).scrollTop()
			})
		} else if ( myapp_config.root_.is('.header-function-fixed:not(.nav-function-top):not(.nav-function-hidden)') &&  myapp_config.thisDevice === 'desktop') {
			myapp_config.root_logo.attr("style", "");
		}
	 }

	/**
	 * checkSettingConditions by checking layout conditions
	 * DOC: sometimes settings can trigger certain plugins; so we check this condition and activate accordingly
	 * E.g: the fixed navigation activates custom scroll plugin for the navigation, but this only happens when
	 *		it detects desktop browser and destroys the plugin when navigation is on top or if its not fixed.
	 **/
	 app.checkSettingConditions = function() {

	 	/**
	 	 * DOC: add the plugin with the following rules: fixed navigation is selected, top navigation is not active, minify nav is not active, 
	 	 * and the device is desktop. We do not need to activate the plugin when loading from a mobile phone as it is not needed for touch screens.
		 **/
		switch ( true ) {

			case ( myapp_config.root_.hasClass('nav-function-fixed') && !myapp_config.root_.is('.nav-function-top, .nav-function-minify, .mod-main-boxed') && myapp_config.thisDevice === 'desktop' ):

				/* start slimscroll on nav */
				if ( typeof $.fn.slimScroll !== 'undefined' ) {
					myapp_config.navAnchor.slimScroll({
						height: '100%',
						color: '#fff',
						size: '4px',
						distance: '4px',
						railOpacity: 0.4,
						wheelStep: 10
					});

					if (myapp_config.debugState)
					console.log("slimScroll Enabled");

				} else {
					console.log("$.fn.slimScroll...NOT FOUND");
				}

				/* fix app height (only needs to be called once) */
				initApp.calculateAppHeight();

				break;

			case ( myapp_config.navAnchor.parent().hasClass('slimScrollDiv') && myapp_config.thisDevice === 'desktop' && typeof $.fn.slimScroll !== 'undefined' ):

				/* destroy the plugin if it is in violation of rules above */
	    		myapp_config.navAnchor.slimScroll({ destroy: true });
	    		myapp_config.navAnchor.attr('style', '');

				/* clear event listners (IE bug) */
				events = jQuery._data( myapp_config.navAnchor[0], "events" );

				if (events) 
					jQuery._removeData( myapp_config.navAnchor[0], "events" );

				if (myapp_config.debugState)
					console.log("slimScroll destroyed");

				break;
		}

	};
	
	/**
	 * Activate Nav
	 * DOC: activation will not take place if top navigation is on
	 **/
	app.buildNavigation = function(id) {
		
		/**
		 * start left nav
		 * app.navigation.js
		 **/
		if ($.fn.navigation) {

			$(id).navigation({ 

				accordion : $(id).data('nav-accordion'),
				speed : myapp_config.navSpeed,
				closedSign : '<em class="' + myapp_config.navClosedSign + '"></em>',
				openedSign : '<em class="' + myapp_config.navOpenedSign + '"></em>'

			});

			return (id);
		} else {

			if (myapp_config.debugState)
			console.log( "WARN: navigation plugin missing" );

		}
	};

	/**
	 * App Forms
	 * DOC: detects if input is selected or blured
	 **/
	app.appForms = function(parentClass,focusClass,disabledClass){

		/* go through each .form-control */
		/*$('.form-control').each(function () {
			checkLength(this);
		});*/

		/* if input has 'some value' add class .has-length to .form-group */
		/*function checkLength(e) {
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
		}*/

		function setClass(e, parentClass, focusClass) {
			$(e).parents(parentClass).addClass(focusClass);
		}

		function deleteClass(e, parentClass, focusClass) {
			/*if(e.value.length) {

			} else {*/
				$(e).parents(parentClass).removeClass(focusClass);
			/*}*/
		}

		$(parentClass).each(function () {
			var input = $(this).find('.form-control');
			input.on('focus', function(){
				setClass(this, parentClass, focusClass);
			});
			input.on('blur', function(){
				deleteClass(this, parentClass, focusClass);
			});
		});
	} 
	
	/**
	 * Mobile Check Activate
	 * DOC: check on window resize if screen width is less than [value]
	 */
	app.mobileCheckActivation = function(){
		
		if ( window.innerWidth < 992 ) {

			myapp_config.root_.addClass('mobile-view-activated');
			myapp_config.mobileMenuTrigger = true;

		} else {

			myapp_config.root_.removeClass('mobile-view-activated');
			myapp_config.mobileMenuTrigger = false;

		}

		if (myapp_config.debugState)
			console.log( "mobileCheckActivation on " + $(window).width() + " | activated: " + myapp_config.mobileMenuTrigger);

		return myapp_config.mobileMenuTrigger;
	} 

	/**
	 *  Toggle visibility
	 * 	DOC: show and hide content with a button action
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

		/* Give modal backdrop an extra class to make it customizable */
		$('.modal-backdrop-transparent').on('show.bs.modal', function (e) {
			setTimeout(function(){
				$('.modal-backdrop').addClass('modal-backdrop-transparent');
			});
		});
		
		/* Add app date to breadcrumb-right-placeholder */
		if ( myapp_config.appDateHook.length ) {
			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				now = new Date(),
				formatted = day[now.getDay()] + ', ' +  
							months[now.getMonth()] + ' ' +  
							now.getDate() + ', ' +
							now.getFullYear();
			myapp_config.appDateHook.text(formatted);				
		}

		/* Check conflicting classes to build/destroy slimscroll */
		initApp.checkSettingConditions();

		/* Activate the last tab clicked using localStorage */
		var lastTab = localStorage.getItem('lastTab');
		 
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			localStorage.setItem('lastTab', $(this).attr('href'));
		});
		
		if (lastTab) {
			$('[href="' + lastTab + '"]').tab('show');
		} 

		/**
		 * all options:
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
				height: $(this).data('scrollHeight') || '100%',
				size: $(this).data('scrollSize') || '4px',
				position: $(this).data('scrollPosition') || 'right',
				color: $(this).data('scrollColor') || '#b3b3b3',
				alwaysVisible: $(this).data('scrollAlwaysVisible') || false,
				distance: $(this).data('scrollDistance') || '4px',
				railVisible: $(this).data('scrollRailVisible') || false,
				railColor: $(this).data('scrollRailColor') || '#fafafa',
				allowPageScroll: false,
				disableFadeOut: false
			});

			if (myapp_config.debugState)
				console.log( 'slimscroll plugin active' );

		} else {
			console.log("WARN! $.fn.slimScroll not loaded or user is on desktop");
			myapp_config.root_.addClass("no-slimscroll");
		}

		/**
		 * Activate listFilters
		 * usage: <input id="inputID" data-listfilter="listFilter" />
		 **/
		if( typeof initApp.listFilter !== 'undefined' && $.isFunction(initApp.listFilter) && $('[data-listfilter]').length ) {


			var inputID = $('[data-listfilter]').attr('id'),
				listFilter = $('[data-listfilter]').attr("data-listfilter");

			/* initApp.listFilter($('.list'), $('#intput-id')); */
			initApp.listFilter(listFilter, '#' + inputID);
		}

		/**
		 * Start bootstrap tooltips
		 * doc: only fires for desktop
		 **/
		if( typeof($.fn.tooltip) !== 'undefined' && myapp_config.thisDevice === 'desktop' && $('[data-toggle="tooltip"]').length ){
			$('[data-toggle="tooltip"]').tooltip()
		} else {
			console.log("ERROR! bs.tooltip is not loaded");
		}

		/**
		 * Start bootstrap popovers
		 **/
		if( typeof($.fn.popover) !== 'undefined' && $('[data-toggle="popover"]').length ){
			$('[data-toggle="popover"]').popover();
		} else {
			console.log("ERROR! bs.popover is not loaded");
		}

		/* 
         * Disable popper.js's forced hardware accelaration styles
		 */
		if( typeof($.fn.dropdown) !== 'undefined'){ 
			Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;
		} else {
			console.log("bs.popover is not loaded");
		} 

		/**
		 * Lazyload images
		 * doc: lazy load images to optimize performance
		 * DEV NOTES: way too long; Please shorten it!!!
		 */

		if ( typeof $.fn.lazy !== 'undefined' && typeof $.fn.slimScroll !== 'undefined') {
			$('.custom-scroll img').lazy({
				effect: "fadeIn",
				effectTime: 200,
				threshold: 10,
				enableThrottle: true,
				throttle: 500,
				visibleOnly: true,
				combined: true,
				appendScroll: $('.slimScrollDiv > :first-child')
			});
			$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
				$('.slimScrollDiv > :first-child').trigger('scroll');
			})
			myapp_config.root_.on('show.bs.dropdown', function () {
				$('.slimScrollDiv > :first-child').trigger('scroll');
			})
		} else {
			$('.custom-scroll img').lazy({
				effect: "fadeIn",
				effectTime: 200,
				threshold: 10,
				visibleOnly: true,
				combined: true,
				appendScroll: $('.custom-scroll')
			});
			$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
				$('.custom-scroll').trigger('scroll');
			})
			myapp_config.root_.on('show.bs.dropdown', function () {
				$('.custom-scroll').trigger('scroll');
			})
		}

		/**
		 * Dropdowns will not close on click
		 * doc: only close dropdowns on click outside hit area
		 **/
		$(document).on('click', '.dropdown-menu', function (e) {
			e.stopPropagation();
		});

		/**
		 * Ripple effect (plugin has issues with IE9)
		 * Note: 'window.atob' detects if IE9+ 
		 * ref: http://tanalin.com/en/articles/ie-version-js/
		 **/
		if ($.fn.ripple && myapp_config.rippleEffect /*&& window.atob &&  !myapp_config.isMobile*/) {

			$('.nav-menu a:not(.no-ripple), .btn:not(.no-ripple)').ripple({
				scaleMode: false
			});

			if (myapp_config.debugState)
				console.log("rippler active");
			
		} else {
			if (myapp_config.debugState)
				console.log("%crippler inactive! ", "color: #ed1c24");

		}

		/**
		 * Action buttons
		 **/		
		myapp_config.root_
			.on('mousedown', '[data-action]', function(e) {

				var actiontype = $(this).data('action');

				switch ( true ) {

					/**
					 * toggle trigger
					 * Usage 1 (body): <a href="#" data-action="toggle" data-class="add-this-class-to-body">...</a>
					 * Usage 2 (target): <a href="#" data-action="toggle" data-class="add-this-class-to-target" data-target="target">...</a>
					 **/
					case ( actiontype === 'toggle' ):

						var target = $(this).attr('data-target') || myapp_config.root_,
							dataClass = $(this).attr('data-class'),
							inputFocus = $(this).attr('data-focus');

						/* remove previous background image if alternate is selected */
						if ( dataClass.indexOf('mod-bg-') !== -1 ) {
							$(target).removeClass (function (index, css) {
								return (css.match (/(^|\s)mod-bg-\S+/g) || []).join(' ');
							});
						}

						/* trigger class change */
						$(target).toggleClass( dataClass );

						/* focus input if available 
						   FAQ: We had to put a delay timer to slow it down for chrome
						*/
						if(inputFocus != undefined) {
							setTimeout(function(){ $('#' + inputFocus).focus(); }, 200);
						}

						/* save settings */
						if ( typeof classHolder != 'undefined' || classHolder != null ) {

							/* NOTE: saveSettings function is located right after <body> tag */
							initApp.checkSettingConditions();
							initApp.saveSettings();
						}

						/* fix app height when switching nav from top, side, minify and takes care of some ipad bugs */
						if ( dataClass === 'nav-function-top' || 
							 dataClass === 'nav-function-minify' && myapp_config.root_.hasClass('mod-main-boxed') || 
							 dataClass === 'nav-function-fixed' ) {

							initApp.calculateAppHeight();
						}

						break;

					/**
					 * toggle swap trigger
					 * Usage (target): <a href="#" data-action="toggle-swap" data-class=".add-this-class-to-target .another-class" data-target="#id">...</a>
					 **/
					case ( actiontype === 'toggle-swap' ):

						var target = $(this).attr('data-target'),
							dataClass = $(this).attr('data-class');

						/* trigger class change */
						$(target).removeClass().addClass( dataClass );

						break;

					/**
					 * panel 'collapse' trigger
					 **/
					case ( actiontype === 'panel-collapse' ):

						var selectedPanel = $(this).closest('.panel');

						selectedPanel.toggleClass("panel-collapse");
						
						if (myapp_config.debugState)
						console.log( "panel id:" + selectedPanel.attr('id') + " | action: collapse" );

						/* return ID of panel */
						//return selectedPanel.attr('id');

						break;

					/**
					 * panel 'fullscreen' trigger
					 **/
					case ( actiontype === 'panel-fullscreen' ):

						var selectedPanel = $(this).closest('.panel');

						selectedPanel.toggleClass('panel-fullscreen');
						myapp_config.root_.toggleClass('panel-fullscreen');

						if (myapp_config.debugState)
						console.log( "panel id:" + selectedPanel.attr('id') + " | action: fullscreen" );

						/* return ID of panel */
						//return selectedPanel.attr('id');

						break;

					/**
					 * panel 'close' trigger
					 **/
					case ( actiontype === 'panel-close' ):

						var selectedPanel = $(this).closest('.panel');

						selectedPanel.fadeOut(500,function(){
						
							/* remove panel */
							$(this).remove();

							if (myapp_config.debugState)
							console.log( "panel id:" + selectedPanel.attr('id') + " | action: removed" );

							/* return ID of panel */
							//return selectedPanel.attr('id');

						});

						break;

					/**
					 * update header css, 'theme-update' trigger
					 * eg:  data-action = "theme-update" 
					 *      data-theme = "css/cust-theme-1.css"
					 **/
					case ( actiontype === 'theme-update' ):

						if ( $(myapp_config.mythemeAnchor).length) {
							$(myapp_config.mythemeAnchor).attr('href', $(this).attr('data-theme') );
						} else {
							var mytheme = $("<link>", {id: myapp_config.mythemeAnchor.replace('#', ''), "rel": "stylesheet", "href" : $(this).attr('data-theme') });
							$('head').append(mytheme);
						}

						initApp.saveSettings();

						break;

					/**
					 * theme 'app-reset' trigger
					 **/
					case ( actiontype === 'app-reset' ):

						initApp.resetSettings();

						break;

					/**
					 * app print
					 * starts print priview for browser
					 **/
					case ( actiontype === 'app-print' ):

						window.print();

						break;

					/**
					 * ondemand
					 * load onDemand scripts
					 **/
					case ( actiontype === 'app-loadscript' ):

						var loadurl = $(this).attr('data-loadurl'),
							loadfunction = $(this).attr('data-loadfunction');

						initApp.loadScript(loadurl,loadfunction);

						break;	

					/**
					 * app language selection
					 * lazyloads i18n plugin and activates selected language
					 **/
					case ( actiontype === 'lang' ):

						var applang = $(this).attr('data-lang').toString();

						if (!$.i18n) {
						//jQuery.getScript('http://url/to/the/script');

							initApp.loadScript("js/i18next.min.js", 

								function activateLang () {
									
									$.i18n.init({
										resGetPath: 'lang/__lng__.json',
										load: 'unspecific',
										fallbackLng: false,
										lng: applang
									}, function (t){
										$('[data-i18n]').i18n();
									});								
									
								}
							)

						} else {

							i18n.setLng(applang, function(){
								$('[data-i18n]').i18n();
								$('[data-lang]').removeClass('active');
								$(this).addClass('active');
							});

						}

						break;	

					/**
					 * app 'fullscreen' trigger
					 **/
					case ( actiontype === 'app-fullscreen' ):

						/* NOTE: this may not work for all browsers if the browser security does not permit it 
					 	   IE issues: http://stackoverflow.com/questions/33732805/fullscreen-not-working-in-ie */

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
								console.log("%capp fullscreen toggle inactive! ", "color: #ed1c24");
						}

						break; 
				}

				/* hide tooltip if any present */
				$(this).tooltip('hide');

				if (myapp_config.debugState)
					console.log("data-action clicked: " + actiontype);

				/* stop default link action */				
				e.stopPropagation(); 
				e.preventDefault();		
		}); 


		/**
		 * Mobile menu action for screen tap or click to close menu (-)
		 **/

		$(document)
			.on('touchend mousedown', '.mobile-nav-on' + ' ' + myapp_config.mobileOverlayTrigger, function(e) {
				myapp_config.root_.removeClass('mobile-nav-on');

				if (myapp_config.debugState)
					console.log(JSON.stringify(myapp_config.mobileOverlayTrigger) + " : was clicked to close mobile menu");

				/* stops default action */
				e.preventDefault();
		});

		/**
		 * Windows mobile 8 fix ~
		 * DOC: bootstrap related
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

		/**
		 * Display APP version
		 * DOC: only show this if debug state tree
		 **/
		 if (myapp_config.debugState)
		 	console.log("%c✔ Finished app.init() v" + myapp_config.VERSION + '\n' + "---------------------------", "color: #148f32");	
	};

	return app;
	
})({});
