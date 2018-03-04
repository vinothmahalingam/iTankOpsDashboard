//--------------------------------------------------------------------------
// HEADSUP!
// Please be sure to re-run gulp again if you do not see the config changes
//--------------------------------------------------------------------------
var myapp_config = {
    /*
       APP VERSION
     */
    VERSION: '1.0.0',
    /*
       SAVE INSTANCE REFERENCE
       Save a reference to the global object (window in the browser)
     */
    root_: $('body'), // used for core app reference
    root_wrapper: $('.page-wrapper'),
    root_logo: $('#left_panel > .logo'), // used for core app reference
    /*
       REFERENCE OBJ FOR WINDOW HEIGHT
       we are saving some memory and repeated calls for window height
       window height is only updated during window resize
     */
    windowHeight: $(window).height(),
    navHeightGap: ( $('#left_panel .nav-footer').height() || 0 ) + $('header').height() + 1,
    /*
       DELAY VAR FOR FIRING REPEATED EVENTS (eg., scroll & resize events)
       Lowering the variable makes faster response time but taxing on the CPU
       Reference: http://benalman.com/code/projects/jquery-throttle-debounce/examples/throttle/
     */
    throttleDelay: 450, // for window.scrolling
    filterDelay: 150,   // for keyup.functions 
    /*
       DETECT MOBILE DEVICES
       Description: Detects mobile device - if any of the listed device is 
       detected a class is inserted to $.root_ and the variable thisDevice 
       is decleard. (so far this is covering most hand held devices)
     */
    thisDevice: null, // desktop or mobile
    isMobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())), //popular device types available on the market
    mobileMenuTrigger: null, // used by pagescrolling and appHeight script, do not change!
    /*
      The overlay mesh that appears on top of content 
      Description: users can touch the mesh to close the menu 
    */
    mobileOverlayTrigger: '#content',
    /*
      DETECT IF WEBKIT
      Description: this variable is used to fire the custom scroll plugin. 
      If it is a non-webkit it will fire the plugin.
    */
    isWebkit: ((!!window.chrome && !!window.chrome.webstore) === true || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 === true),
    /*
      DETECT CHROME
      Description: this variable is used to fire the custom CSS hacks
    */
    isChrome: (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())),
    /*
      DETECT IE (it only detects the newer versions of IE)
      Description: this variable is used to fire the custom CSS hacks
    */
    isIE: ( (window.navigator.userAgent.indexOf('Trident/') ) > 0 === true ),
    /*
       DEBUGGING MODE
       debugState = true; will spit all debuging message inside browser console.
     */
    debugState: true, // outputs debug information on browser console
    /*
       Turn on ripple effect for buttons and touch events
       Dependency: 
     */
    rippleEffect: false, // material design effect that appears on all buttons
    /*
       Primary theme anchor point ID
       This anchor is created dynamically and CSS is loaded as an override theme
    */
    mythemeAnchor: '#mytheme',
    /*
       Primary menu anchor point #primary_nav
       This is the root anchor point where the menu script will begin its build
    */
    navAnchor: $('#primary_nav'), //changing this may implicate slimscroll plugin target
    navHooks: $('#primary_nav > ul.nav-menu'), //changing this may implicate CSS targets
    navInitalized: 'js-nav-built', //nav finished class
    navFilterInput: $('#nav_filter_input'), //changing this may implicate CSS targets
    /*
       The rate at which the menu expands revealing child elements on click
       Lower rate reels faster expansion of nav childs
     */
    navSpeed: 500, //ms
    /*
       Nav close and open signs
       This uses the fontawesome css class
     */
    navClosedSign: 'fal fa-angle-down',
    navOpenedSign: 'fal fa-angle-up',
    /*
       App date ID
       found inside the breadcrumb unit, displays current date to the app on pageload
    */
    appDateHook: $('#app-date'),
    /*
       Collapse current menu item as other menu items are expanded
       Careful when using this option, if you have a long menu it will
       keep expanding and may distrupt the user experience. This is best 
       used with Fixed Navigation for a better experience
     
    navAccordion: true, //if one menu item is opened, the other will close*/
    /*
     * SaveSettings to localStorage
     * DOC: to store settings to a DB instead of LocalStorage see below:
     *    initApp.pushSettings("className1 className2") //sets value
     *    var DB_string = initApp.getSettings(); //returns setting string
     */
    storeLocally: true,
    /*
     * Used with initApp.loadScripts
     * DOC: Please leave it blank
     */
    jsArray : []
};
