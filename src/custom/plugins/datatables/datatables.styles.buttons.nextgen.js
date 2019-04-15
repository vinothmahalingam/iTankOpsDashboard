//'use strict';
//var DataTable = $.fn.dataTable;

/* Set the defaults for DataTables buttons */
$.extend(true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons'
		},
		button: {
			className: 'btn'
		}
	}
});

/* auto fill button class on popup */
$.fn.dataTable.AutoFill.classes.btn = 'btn btn-primary';