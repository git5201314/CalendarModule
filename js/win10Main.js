requirejs.config({
	paths: {
		'jquery': 'jquery-1.8.3.min'
	}
});

requirejs(['jquery', 'win10Datepicker'], function($, picker){
	$('.ui-win10-datepicker').datepicker();
});
