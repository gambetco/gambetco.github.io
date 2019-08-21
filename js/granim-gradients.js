(function($) {
	"use strict";

	if(typeof Granim == 'undefined') {
		console.log('Granim: Granim not defined.');
		return true;
	}

	var el = document.getElementsByClassName('granim-element');
	for (var i = 0; i < el.length; i++) {
		var gElement = el[i],
			canvas = gElement.children['0'],
			ed_gradient = [['#154afb', '#1597fb'],['#15fba2', '#fb8c15'],['#fb1515', '#fb15e8']];

		var granimInstance = new Granim({
			element: canvas,
			name: false,
			direction: 'top-bottom',
			opacity: [1, 1],
			states : {
				"default-state": {
					gradients: ed_gradient
				}
			}
		});
	}

})(jQuery);