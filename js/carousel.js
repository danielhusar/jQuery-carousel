/**
 * author: Daniel Husar
 */

(function (window, document, $, undefined) {
	'use strict';


	$.fn.extend({
		carousel: function (options) {

			var settings = $.extend( {
				'start'   : 1  //starting slide
			}, options); 


			return $(this).each(function(){
				var $that = $(this);

				//init carousel after frist image is loaded
				$that.find('li > img').first().load(function(){
					var $li    = $that.find('li').first(),
							$img   = $li.find('img').first(),
							width  = $img.width(),
							height = $img.height(),
							count  = $img.length;

					$that.wrap('<div class="carousel"/>').wrap('<div class="carousel-content" />');

					$('.carousel-content, .carousel').css({
						'width'  : width + 'px',
						'height' : height + 'px'
					});

					$('.carousel-content ul').css({
						'width'  : count * width + 'px',
						'height' : height + 'px'
					});

					$('.carousel').prepend('<a href="#" class="arrow next">></a>');
					$('.carousel').prepend('<a href="#" class="arrow prev"><</a>');
					$('.carousel').prepend('<div class="navigation"><a href="#" class="current"></a><a href="#"></a><a href="#"></a></div>');

				});

			});


		}
	});

}(this, this.document, this.jQuery));