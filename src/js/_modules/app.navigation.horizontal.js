/**
 * A jQuery plugin boilerplate.
 * Author: Sunnyat Ahmmed @myplaneticket
 * $('#js-nav-menu-wrapper').navigationHorizontal();
 */



;
(function($) {
    var pluginName = 'navigationHorizontal';

    function Plugin(element, options) {

        var el = element;
        var $el = $(element);

        options = $.extend({}, $.fn[pluginName].defaults, options);

        function init() {

            console.log(options);

            $el.css('margin-left', '0px');
            //$el.wrap( "<div id='js-nav-menu-wrapper' class='nav-menu-wrapper'></div>" );

            var navWrapper = $('#' + options.wrapperId),
                sliderWidth = navWrapper.outerWidth(),
                contentWidth = navWrapper.children(options.elementClass).outerWidth(),
                currentMarginLeft = parseFloat(navWrapper.children(options.elementClass).css('margin-left')),
                setMargin,
                maxMargin,


                _updateSlider = function() {
                    sliderWidth = navWrapper.outerWidth();
                    contentWidth = navWrapper.children(options.elementClass).outerWidth();
                    currentMarginLeft = parseFloat(navWrapper.children(options.elementClass).css('margin-left'));
                },

                navMenuScrollRight = function() {

                    _updateSlider();

                    if (-currentMarginLeft + sliderWidth < contentWidth) {
                        setMargin = Math.max(currentMarginLeft - sliderWidth, -(contentWidth - sliderWidth) );
                    } else {
                        setMargin = currentMarginLeft;
                    }

                    navWrapper.children(options.elementClass).css({
                        marginLeft: setMargin
                    });

                },

                navMenuScrollLeft = function() {

                    _updateSlider();

                    if (currentMarginLeft < 0) {
                        setMargin = Math.min(currentMarginLeft + sliderWidth, 0);
                    } else {
                        setMargin = currentMarginLeft;
                    }

                    navWrapper.children(options.elementClass).css({
                        marginLeft: setMargin
                    });

                };


            $('#' + options.buttonRightId).click(function(e) {

                navMenuScrollRight();

                e.preventDefault();
            });

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

        function destroy() {
            $el.each(function() {
                var el = this;
                var $el = $(this);

                // Add code to restore the element to its original state...

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
        element: $(".nav-menu"),
        elementClass: '.nav-menu',
        wrapperId: 'js-nav-menu-wrapper',
        buttonLeftId: 'js-scroll-left',
        buttonRightId: 'js-scroll-right'
    };


})(jQuery);