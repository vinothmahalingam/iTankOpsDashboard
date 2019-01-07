 /*!
 * jQuery menuSlider v1.0.0
 *
 * Copyright 2019, 2020 NextGen WebApp
 * Released under Marketplace License (see your license details for usage)
 *
 * Publish Date: 2019-01-01T17:42Z
 */


;
(function($) {
    var pluginName = 'menuSlider';

    function Plugin(element, options) {

        var $el = $(element),
             el = element;
        options = $.extend({}, $.fn[pluginName].defaults, options);

        function init() {

            /* reset margin */
            $el.css('margin-left', '0px');

            /* add wrapper around navigation */
            $el.wrap( '<div id="'+options.wrapperId+'" class="nav-menu-wrapper d-flex flex-grow-1 flex-1 width-0 overflow-hidden"></div>' );

            /* add buttons for scroller */
            $('#' + options.wrapperId).before('<a href="#" class="d-flex align-items-center justify-content-center width-4 btn mt-1 mb-1 mr-2 ml-1 p-0 fs-xxl text-primary"><i class="fal fa-angle-left"></i></a>');
            $('#' + options.wrapperId).after('<a href="#" class="d-flex align-items-center justify-content-center width-4 btn mt-1 mb-1 mr-1 ml-2 p-0 fs-xxl text-primary"><i class="fal fa-angle-right"></i></a>');

            /* define variables */
            var navWrapper = $('#' + options.wrapperId),
                navWidth = navWrapper.outerWidth(),
                contentWidth = navWrapper.children(options.element).outerWidth(),
                currentMarginLeft = parseFloat(navWrapper.children(options.element).css('margin-left')),
                setMargin,
                maxMargin,


                /* update variables for margin calculations */
                _getValues = function() {
                    navWidth = navWrapper.outerWidth();
                    contentWidth = navWrapper.children(options.element).outerWidth();
                    currentMarginLeft = parseFloat(navWrapper.children(options.element).css('margin-left'));
                },

                _updateScrollBtnStatus = function() {

                    _getValues();

                    if (currentMarginLeft !== 0) {
                        console.log("disable left arrow");

                    } else if ( currentMarginLeft > 0 ) {

                    } else if ( currentMarginLeft > 0 ) {

                    }


                },

                /* scroll right */
                navMenuScrollRight = function() {

                    _getValues();

                    if (-currentMarginLeft + navWidth < contentWidth) {
                        setMargin = Math.max(currentMarginLeft - navWidth, -(contentWidth - navWidth) );
                    } else {
                        setMargin = currentMarginLeft;
                        console.log("right end");
                    }

                    navWrapper.children(options.element).css({
                        marginLeft: setMargin
                    });

                },

                /* scroll left */
                navMenuScrollLeft = function() {

                    _getValues();

                    if (currentMarginLeft < 0) {
                        setMargin = Math.min(currentMarginLeft + navWidth, 0);
                    } else {
                        setMargin = currentMarginLeft;
                        console.log("left end");
                    }

                    navWrapper.children(options.element).css({
                        marginLeft: setMargin
                    });

                };

            /* assign buttons for right*/
            navWrapper.next().click(function(e) {

                navMenuScrollRight();

                e.preventDefault();
            });

            /* assign buttons for left */
            navWrapper.prev().click(function(e) {

                navMenuScrollLeft();

                e.preventDefault();
            });

            hook('onInit');
        }

        function option(key, val) {
            if (val) {
                options[key] = val;
            } else {
                return options[key];
            }
        }

        function destroy(options) {
            $el.each(function() {
                var el = this;
                var $el = $(this);

                // Add code to restore the element to its original state...

                $el.css('margin-left', '0px');                           
                $el.unwrap(parent);
                $el.prev().off().remove();
                $el.next().off().remove();

                hook('onDestroy');
                $el.removeData('plugin_' + pluginName);
            });
        }

        function hook(hookName) {
            if (options[hookName] !== undefined) {
                options[hookName].call(el);
            }
        }

        init();

        return {
            option: option,
            destroy: destroy
        };
    }

    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

    $.fn[pluginName].defaults = {
        onInit: function() {},
        onDestroy: function() {},
        element: myapp_config.navHooks,
        wrapperId: myapp_config.navHorizontalWrapperId,
        buttonLeftId: myapp_config.navHorizontalLeftArrow,
        buttonRightId: myapp_config.navHorizontalRightArrow
    };


})(jQuery);