/**
 * Material Forms effects activation
 * DOC: starts listeners
 **/
var parentClass 	= '.app-forms',
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
});