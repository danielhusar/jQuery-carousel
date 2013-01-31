/**
 * author: Daniel Husar
 */

(function (window, document, $, undefined) {
	'use strict';


	$.fn.extend({
		carousel: function (options) {

			//settings
			var settings = $.extend( {
				'arrows'     : true,           //display navigation arrows
				'navigation' : true,           //display navigation
				'pause'      : 5000,           //pause between slides
				'speed'      : 2000,           //speed for animation
				'easing'     : 'easeOutExpo'   //easing type
			}, options); 

			//helpers
			var helpers = {
				css3transformations : function () {
		    	var $elem = $('<div />').css({
		        'webkitTransform': 'matrix(1,1,1,1,1,1)',
		        'MozTransform': 'matrix(1,1,1,1,1,1)',
		        'transform': 'matrix(1,1,1,1,1,1)'
		      });
		      
		      if($elem.attr('style') === '') {
		        return false;
		      } else if($elem.attr('style') !== undefined) {
		        return true;
		      }
		      return false;
				}
			};

			//main interval
			var interval;


			return $(this).each(function(){
				var $carousel = $(this);

				//init carousel after frist image is loaded
				$carousel.find('li > img').first().load(function(){

					var $li    				= $carousel.find('li'),
							$img   				= $carousel.find('img').first(),
							width  				= $img.width(),
							height 				= $img.height(),
							cssTransforms = helpers.css3transformations(),
							count         = $li.length;

					//wrappers
					$carousel.wrap('<div class="carousel"/>').wrap('<div class="carousel-content" />');

					//basic styles
					$('.carousel-content, .carousel').css({
						'width'  : width + 'px',
						'height' : height + 'px'
					});

					$('.carousel-content ul').css({
						'width'  							: count * width + 'px',
						'height' 							: height + 'px'
					});

					if(cssTransforms){
						$('.carousel-content ul').css({
						'-webkit-transition'	: settings.speed/1000 + 's ease-in-out',
  					'-moz-transition' 		: settings.speed/1000 + 's ease-in-out',
  				  '-o-transition' 			: settings.speed/1000 + 's ease-in-out',
  					'transition' 					: settings.speed/1000 + 's ease-in-out'
					});
					}

					//arrows
					if(settings.arrows){
						$('.carousel').prepend('<a href="#" class="arrow next">></a>');
						$('.carousel').prepend('<a href="#" class="arrow prev"><</a>');
					}

					//navigation
					if(settings.navigation){
						var navItems = '',
								navClass;
						for(var i = 0; i < count; i++){
							navClass = ( i === 0) ? 'current' : '';
							navItems = navItems + '<a href="#' + i + '" class="' + navClass + '"></a>';
						};
						$('.carousel').prepend('<div class="navigation">' + navItems + '</div>');
					}


					//slide content
					function slideContent(){
						var currentPos = -Math.round(Number(($carousel.css('left')).replace('px', ''))/width) || 0,
						    nextPos    = (currentPos < (count - 1)) ? currentPos + 1  : 0,
								position   = -nextPos * width;


						$('.navigation a').removeClass('current');
						$('.navigation a[href="#' + nextPos + '"]').addClass('current');

						if(cssTransforms){
							$carousel.css({'left': position + 'px'});
						}else{
							$carousel.animate({'left': position + 'px'}, settings.speed);
						}
						
					}

					//run the interval
					setInterval(function(){
						slideContent();
					}, settings.pause);

				});

			});


		}
	});

}(this, this.document, this.jQuery));