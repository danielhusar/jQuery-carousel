/**
 * author: Daniel Husar
 */

(function (window, document, $, undefined) {
	'use strict';


	$.fn.extend({
		carousel: function (options) {

			//settings
			var settings = $.extend({
				'arrows'     			: true,           		//display navigation arrows
				'navigation' 			: true,           		//display navigation
				'pause'      			: 5000,           		//pause between slides
				'speed'      			: 2000,           		//speed for animation
				'contentClass'    : 'carousel-content',
				'slidesClass'     : 'carousel-slides',
				'slideClass'      : 'slide',
				'arrowsClass'     : 'arrow',
				'prevArrowClass'  : 'prev',
				'nextArrowClass'  : 'next',
				'navigationClass' : 'navigation',
				'currentNavClass' : 'current'
			}, options); 

			//helpers
			var helpers = {
				css3transformations : function () {
					var $elem = $('<div />').css({
						'webkitTransform': 'matrix(1,1,1,1,1,1)',
						'MozTransform': 'matrix(1,1,1,1,1,1)',
						'OTransform': 'matrix(1,1,1,1,1,1)',
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


			return $(this).each(function(){

				//main properties
				var $carousel 		  = $(this).addClass('carousel'),
						$slides    		  = $carousel.find('.slide'),
						cssTransforms   = helpers.css3transformations(),
						count           = $slides.length,
						interval;

   			//main carousel class
   			var carousel = {
   				width : 0,
   				height : 0,
   				interval : 0,
   				currentSlide : 0,

   				init : function (){
   					var that = this;

   					//wrappers
						$carousel.wrapInner('<div class="carousel-slides"/>').wrapInner('<div class="carousel-content"/>');

						//css3 transformations
						if(cssTransforms){
							this.enableTransitions();
						}

						//carousel sizes
						this.sizes();

						//arrows
						if(settings.arrows){
							$carousel.prepend('<a href="#" class="arrow next">></a>');
							$carousel.prepend('<a href="#" class="arrow prev"><</a>');
						}

						//navigation is always appended, and just hided when not needed
						var navItems = '',
								navClass,
								style = (!settings.navigation) ? 'style="display:none"' : '';
						for(var i = 0; i < count; i++){
							navClass = ( i === 0) ? 'current' : '';
							navItems = navItems + '<a href="#' + i + '" class="' + navClass + '"></a>';
						};
						$carousel.prepend('<div class="navigation" ' + style + '>' + navItems + '</div>');

						//run the interval
						this.interval = setInterval(function(){
							if(that.exist()){
								that.slideContent('left');
							}
						}, settings.pause);

						//bind all events
						this.bindEvents();
   				},

   				enableTransitions : function(){
   					$carousel.find('.carousel-slides').css({
							'-webkit-transition'	: settings.speed/1000 + 's',
							'-moz-transition' 		: settings.speed/1000 + 's',
							'-o-transition' 			: settings.speed/1000 + 's',
							'transition' 					: settings.speed/1000 + 's'
						});
   				},

   				disableTransitions : function(){
   					$carousel.find('.carousel-slides').css({
							'-moz-transition' 		: 'none',
					    '-webkit-transition'  : 'none',
					    '-o-transition' 			: 'color 0 ease-in',
					    'transition' 					: 'none'
						});
   				},

   				sizes : function(){
   					this.width 		= $carousel.width();
						this.height 	= $carousel.height();

						//basic styles
						$carousel.find('.carousel-content, .carousel, .slide').css({
							'width'  : this.width + 'px',
							'height' : this.height + 'px'
						});

						$carousel.find('.carousel-slides').css({
							'width'  							: count * this.width + 'px',
							'height' 							: this.height  + 'px'
						});

   				},
   				exist : function(){
   					return !!$carousel.find('.carousel-slides').length;
   				},
   				getPosition : function(){
   					return -Math.round(Number(($carousel.find('.carousel-slides').css('left')).replace('px', ''))/this.width) || 0;
   				},
   				goToSlide : function (slide){
   					this.updateNav(slide);
   					this.animate(slide);
   				},
   				slideContent : function(direction){
						var currentPos 		 = this.getPosition(),
								prevPos    		 = (currentPos >= 1) ? currentPos - 1  : count - 1,
								nextPos    		 = (currentPos < (count - 1)) ? currentPos + 1  : 0,
								goTo           = (direction === 'left') ? nextPos : prevPos;

						this.updateNav(goTo);
						this.animate(goTo);
					},
   				animate   : function(slide){
   					this.currentSlide = slide;
   					var position = -slide * this.width;
   					if(cssTransforms){
							$carousel.find('.carousel-slides').css({'left': position + 'px'});
						}else{
							$carousel.find('.carousel-slides').clearQueue().animate({'left': position + 'px'}, settings.speed);
						}
					},
					updateNav : function(currentSlide){
						$carousel.find('.navigation a').removeClass('current');
						$carousel.find('.navigation a[href="#' + currentSlide + '"]').addClass('current');
					},
					bindEvents: function(){
						var that = this;

						//arrows left and right click events
						$carousel.on('click.carousel', '.arrow', function(event){
							clearInterval(that.interval);
							if($(this).hasClass('prev')){
								that.slideContent('right');
							} else {
								that.slideContent('left');
							}
							event.preventDefault();
						});

						//carousel navigation click events
						$carousel.on('click.carousel', '.navigation a', function(event){
							clearInterval(that.interval);
							var slide = $(this).attr('href').replace('#', '');
							that.goToSlide(slide);
							event.preventDefault();
						});

						//window resized events
						$(window).bind('resize.carousel', function(){
							var resizeTimeout;
							clearTimeout(resizeTimeout);
		          resizeTimeout = setTimeout(
		          	function(){
		             	that.sizes();
									that.disableTransitions();
									var position = -that.currentSlide * that.width;
									$carousel.find('.carousel-slides').css({'left': position + 'px'});
									that.enableTransitions();
		           	}, 300);
						});

					},

					destroy : function(){
						if(carousel.exist()){
							$carousel.unbind('.carousel');
							clearInterval(this.interval);
							$carousel.find('.navigation, .arrow').remove();
							$carousel.find('.slide').attr('style', '');
							$carousel.html($('.carousel-slides').html()).removeClass('carousel');
						}
					}
   			}

   			//destroy or init the carousel
				if(options === 'destroy'){
					carousel.destroy();
				} else {
					carousel.init();
				}

			});

		}
	});

}(this, this.document, this.jQuery));