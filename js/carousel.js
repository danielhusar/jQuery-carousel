/**
 * author: Daniel Husar
 */

(function (window, document, $, undefined) {
	'use strict';


	$.fn.extend({
		carousel: function (options) {

			var settings = $.extend( {
				'width'   : '600',  //width of the carousel
				'height'  : '300'   //height of the carousel
				'start'   : 1       //starting slide
			}, options); 

			//show lightbox
			return $(this).each(function(){

				var $li = $(this).find('li');

				$(this).wrap('<div class="carousel" />');

				$('.carousel').css({
					'width'  : settings.width + 'px',
					'height' : settings.height + 'px'
				});
				
				$('.carousel ul').css({
					'width'  : $li.length * settings.width + 'px',
					'height' : settings.height + 'px'
				});


			});


		}
	});

}(this, this.document, this.jQuery));