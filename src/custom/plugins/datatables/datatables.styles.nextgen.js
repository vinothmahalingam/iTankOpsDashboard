'use strict';
var DataTable = $.fn.dataTable;

/* Set the defaults for DataTables extended classes */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sFilterInput": "form-control border-top-left-radius-0 border-bottom-left-radius-0 ml-0 width-lg shadow-inset-1",
	"sLengthSelect": "form-control custom-select"
});	

/* Set the defaults for DataTables initialisation */
$.extend(true, DataTable.defaults, {
	/*	--- Layout Structure 
		--- Options
		l	-	length changing input control
		f	-	filtering input
		t	-	The table!
		i	-	Table information summary
		p	-	pagination control
		r	-	processing display element
		B	-	buttons
		R	-	ColReorder
		S	-	Select

		--- Markup
		< and >				- div element
		<"class" and >		- div with a class
		<"#id" and >		- div with an ID
		<"#id.class" and >	- div with an ID and a class

		--- Further reading
		https://datatables.net/reference/option/dom
		--------------------------------------
	 */
	dom: "<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'l>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	language: {
		/* change the default text for 'next' and 'previous' with icons */
		paginate: {
			previous: "<i class='fal fa-chevron-left'></i>",
			next: "<i class='fal fa-chevron-right'></i>"
		},
		/* replace the default search lable text with a nice icon */
		search: '<div class="input-group-text d-inline-flex width-3 align-items-center justify-content-center border-bottom-right-radius-0 border-top-right-radius-0 border-right-0"><i class="fal fa-search"></i></div>',
		/* add search filter */
		searchPlaceholder: "Filter...",
		/* change text for zero records */
		zeroRecords: "No records to display"
	},
	initComplete: function(settings, json) {
		initApp.appForms('.dataTables_filter', 'has-length', 'has-disabled');
	}

});