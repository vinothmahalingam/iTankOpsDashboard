 /*!
 * jQuery menuSlider v1.0.0
 *
 * Copyright 2019, 2020 NextGen WebApp
 * Released under Marketplace License (see your license details for usage)
 *
 * Publish Date: 2018-01-01T17:42Z
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
            $el.wrap( '<div id="'+options.wrapperId+'" class="nav-menu-wrapper"></div>' );

            /* add buttons for scroller */
            $('#' + options.wrapperId).before('<a id="'+options.buttonLeftId+'" href="#" class="nav-padel-left"></a>');
            $('#' + options.wrapperId).after('<a id="'+options.buttonRightId+'" href="#" class="nav-padel-right"></a>');

            /* define variables */
            var navWrapper = $('#' + options.wrapperId),
                sliderWidth = navWrapper.outerWidth(),
                contentWidth = navWrapper.children(options.element).outerWidth(),
                currentMarginLeft = parseFloat(navWrapper.children(options.element).css('margin-left')),
                setMargin,
                maxMargin,


                /* update variables for margin calculations */
                _updateSlider = function() {
                    sliderWidth = navWrapper.outerWidth();
                    contentWidth = navWrapper.children(options.element).outerWidth();
                    currentMarginLeft = parseFloat(navWrapper.children(options.element).css('margin-left'));
                },

                /* scroll right */
                navMenuScrollRight = function() {

                    _updateSlider();

                    if (-currentMarginLeft + sliderWidth < contentWidth) {
                        setMargin = Math.max(currentMarginLeft - sliderWidth, -(contentWidth - sliderWidth) );
                    } else {
                        setMargin = currentMarginLeft;
                    }

                    navWrapper.children(options.element).css({
                        marginLeft: setMargin
                    });

                },

                /* scroll left */
                navMenuScrollLeft = function() {

                    _updateSlider();

                    if (currentMarginLeft < 0) {
                        setMargin = Math.min(currentMarginLeft + sliderWidth, 0);
                    } else {
                        setMargin = currentMarginLeft;
                    }

                    navWrapper.children(options.element).css({
                        marginLeft: setMargin
                    });

                };

            /* assign buttons for right*/
            $('#' + options.buttonRightId).click(function(e) {

                navMenuScrollRight();

                e.preventDefault();
            });

            /* assign buttons for left */
            $('#' + options.buttonLeftId).click(function(e) {

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
        element: $("#js-nav-menu"),
        wrapperId: 'js-nav-menu-wrapper',
        buttonLeftId: 'js-scroll-left',
        buttonRightId: 'js-scroll-right'
    };


})(jQuery);