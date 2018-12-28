/**
 * Menu Plugin
 **/
$.fn.extend({

    /**
     * pass the options variable to the function
     *
     *   $(id).navigationHorizontal({ 
     *       accordion: true,
     *       animate: 'easeOutExpo',
     *       speed: 200,
     *       closedSign: '[+]',
     *       openedSign: '[-]'
     *   });
     *
     **/
    navigationHorizontal: function(options) {

        var defaults = {
                scrollBarWidths: 40
            },

            /**
             * extend our default options with those provided.
             **/
            opts = $.extend(defaults, options),

            /**
             * assign current element to variable, in this case is UL element
             **/
            self = $(this);

            console.log("create top nav");

    }//,

    /**
     * DOC: $(id).destroy();
     **/
    /*destroy: function() {
        
        self = $(this);


        console.log("destroy top nav");
        
    }*/
}); 

