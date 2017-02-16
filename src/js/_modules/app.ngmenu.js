/**
 * Menu Plugin
 **/
$.fn.extend({

    /**
     * pass the options variable to the function
     **/
    ngmenu: function(options) {

        var defaults = {
                accordion: 'true',
                animate: 'easeOutExpo',
                speed: 200,
                closedSign: '[+]',
                openedSign: '[-]'
            },

            /**
             * Extend our default options with those provided.
             **/
            opts = $.extend(defaults, options),

            /**
             * Assign current element to variable, in this case is UL element
             **/
            $this = $(this);

        /**
         * add a mark [+] to a multilevel menu
         **/
        $this.find("li").each(function() {
            if ($(this).find("ul").length !== 0) {

                /**
                 * add the multilevel sign next to the link
                 **/
                $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

                /**
                 * avoid jumping to the top of the page when the href is an #
                 **/
                if ($(this).find("a:first").attr('href') == "#") {
                    $(this).find("a:first").click(function() {
                        return false;
                    });
                }
            }
        });

        //add open sign to all active lists
        $this.find("li.active").each(function() {
            $(this).parents("ul")
            	.parent("li")
            	.find("a:first")
            	.attr('aria-expanded', true)
            	.find("b:first")
            	.html(opts.openedSign);
        });

        $this.find("li a").on('mousedown', function(e) {

            if ($(this).parent().find("ul").length !== 0) {

                if (opts.accordion) {

                    /**
                     * Do nothing when the list is open
                     **/
                    if (!$(this).parent().find("ul").is(':visible')) {

                        parents = $(this).parent().parents("ul");
                        visible = $this.find("ul:visible");
                        visible.each(function(visibleIndex) {
                            var close = true;
                            parents.each(function(parentIndex) {

                                if (parents[parentIndex] == visible[visibleIndex]) {

                                    close = false;
                                    return false;
                                }
                            });
                            if (close) {

                                if ($(this).parent().find("ul") != visible[visibleIndex]) {

                                    $(visible[visibleIndex]).slideUp(opts.speed + 300, opts.animate, function() {
                                        $(this).parent("li")
                                        	.removeClass("open")
                                        	.find("a:first")
                                        	.attr('aria-expanded', false)
                                        	.find("b:first")
                                        	.html(opts.closedSign);
                                    });
                                }
                            }
                        });
                    }
                }

                /**
                 * Add active class to open element
                 **/
                if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {

                    $(this).parent().find("ul:first").slideUp(opts.speed + 100, opts.animate, function() {
                        $(this).parent("li")
                        	.removeClass("open")
                        	.find("a:first")
                        	.attr('aria-expanded', false)
                        	.find("b:first").delay(opts.speed)
                        	.html(opts.closedSign);
                    });
                } else {
                    $(this).parent().find("ul:first").slideDown(opts.speed, opts.animate, function() {

                        $(this).parent("li")
                        	.addClass("open")
                        	.find("a:first")
                        	.attr('aria-expanded', true)
                        	.find("b:first").delay(opts.speed)
                        	.html(opts.openedSign);

                        /*bug fixed: addresses the .mod-main-boxed class bug, when nav exceeds content height*/
                        if (myapp_config.root_.hasClass("mod-main-boxed")) {
                            initApp.fixAppHeight();
                        }
                    });
                }
            }
        });
    },

    destroy: function() {
        $this = $(this);
        console.log("destroy ngmenu");
        $this._destroy(); //or this.delete; depends on jQuery version

    }
});