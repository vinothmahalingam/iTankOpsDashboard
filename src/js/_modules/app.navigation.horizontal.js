/**
 * Menu Plugin
 **/
$.fn.extend({

    /**
     * pass the options variable to the function
     *
     *   $(id).navigation({ 
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
                hidWidth,
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



    },

    /**
     * DOC: $(id).destroy();
     **/
    destroy: function() {
        
        self = $(this);



        
    }
}); 

/*
var hidWidth,
	scrollBarWidths = 40;

var widthOfList = function(){
  var itemsWidth = 0;
  $('.item').each(function(){
    var itemWidth = $(this).outerWidth();
    itemsWidth+=itemWidth;
  });
  //alert(itemsWidth);
  return itemsWidth;
};

var widthOfHidden = function(){
  return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
};

var getLeftPosi = function(){
  return $('.list').position().left;
};

var reAdjust = function(){
  if (($('.wrapper').outerWidth()) < widthOfList()) {
    $('.scroller-right').show();
  }
  else {
    $('.scroller-right').hide();
  }
  
  if (getLeftPosi()<0) {
    $('.scroller-left').show();
  }
  else {
    $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
  	$('.scroller-left').hide();
  }
}

reAdjust();

$(window).on('resize',function(e){  
  	reAdjust();
});

$('.scroller-right').click(function() {
  
  $('.scroller-left').fadeIn('slow');
  $('.scroller-right').fadeOut('slow');
  	
});

$('.scroller-left').click(function() {
  
	$('.scroller-right').fadeIn('slow');
	$('.scroller-left').fadeOut('slow');
  
	
});    */