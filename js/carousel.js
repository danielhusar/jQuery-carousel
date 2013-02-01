/**
 * author: Daniel Husar
 */

(function (window, document, $, undefined) {
	'use strict';


	$.fn.extend({
		carousel: function (options) {

			//settings
			var settings = $.extend({
				'arrows'     			: true,           			//display navigation arrows
				'navigation' 			: true,           			//display navigation
				'pause'      			: 5000,           			//pause between slides
				'speed'      			: 2000,           			//speed for animation
				'wrapClass'				: 'carousel',
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


			//main carousel class
			var carousel = {
				width 					: 0,
				height 					: 0,
				interval 				: 0,
				currentSlide 		: 0,
				$carousel 		  : {},
				cssTransforms   : helpers.css3transformations(),
				count           : 0,

				init : function ($carousel){
					
					//init properties
					this.$carousel = $carousel.addClass(settings.wrapClass);
					this.count = $carousel.find('.' + settings.slideClass).length;
					
				},

				start : function(){
					var that = this;
					//wrappers
					this.$carousel.wrapInner('<div class="'+ settings.slidesClass +'"/>').wrapInner('<div class="'+ settings.contentClass +'"/>');

					//css3 transformations
					if(this.cssTransforms){
						this.enableTransitions();
					}

					//carousel sizes
					this.sizes();

					//arrows
					if(settings.arrows){
						this.$carousel.prepend('<a href="#" class="'+ settings.arrowsClass +' '+ settings.nextArrowClass +'">></a>');
						this.$carousel.prepend('<a href="#" class="'+ settings.arrowsClass +' '+ settings.prevArrowClass +'"><</a>');
					}

					//navigation is always appended, and just hided when not needed
					var navItems = '',
							navClass,
							style = (!settings.navigation) ? 'style="display:none"' : '';
					for(var i = 0; i < this.count; i++){
						navClass = ( i === 0) ? settings.currentNavClass : '';
						navItems = navItems + '<a href="#' + i + '" class="' + navClass + '"></a>';
					};
					this.$carousel.prepend('<div class="'+ settings.navigationClass +'" ' + style + '>' + navItems + '</div>');

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
					this.$carousel.find('.'+ settings.slidesClass).css({
						'-webkit-transform'   				: 'translate3d(0, 0, 0)',
						'-webkit-backface-visibility' : 'hidden',
  					'-webkit-perspective' 				: 0,
						'-webkit-transition'					: 'left ' + settings.speed/1000 + 's',
						'-moz-transition' 						: 'left ' + settings.speed/1000 + 's',
						'-o-transition' 							: 'left ' + settings.speed/1000 + 's',
						'transition' 									: 'left ' + settings.speed/1000 + 's'
					});
				},

				disableTransitions : function(){
					this.$carousel.find('.'+ settings.slidesClass).css({
						'-moz-transition' 		: 'none',
						'-webkit-transition'  : 'none',
						'-o-transition' 			: 'color 0 ease-in',
						'transition' 					: 'none'
					});
				},

				sizes : function(){
					this.width 		= this.$carousel.width();
					this.height 	= this.$carousel.height();

					//basic styles
					this.$carousel.find('.'+ settings.contentClass +', .'+ settings.wrapClass +', .'+ settings.slideClass).css({
						'width'  : this.width + 'px',
						'height' : this.height + 'px'
					});

					this.$carousel.find('.'+ settings.slidesClass).css({
						'width'  : this.count * this.width + 'px',
						'height' : this.height  + 'px'
					});

				},

				exist : function(){
					return !!this.$carousel.find('.' + settings.slidesClass).length;
				},

				getPosition : function(){
					return -Math.round(Number((this.$carousel.find('.' + settings.slidesClass).css('left')).replace('px', ''))/this.width) || 0;
				},

				goToSlide : function (slide){
					this.updateNav(slide);
					this.animate(slide);
				},

				slideContent : function(direction){
					var currentPos 		 = this.getPosition(),
							prevPos    		 = (currentPos >= 1) ? currentPos - 1  : this.count - 1,
							nextPos    		 = (currentPos < (this.count - 1)) ? currentPos + 1  : 0,
							goTo           = (direction === 'left') ? nextPos : prevPos;

					this.updateNav(goTo);
					this.animate(goTo);
				},

				animate   : function(slide){
					this.currentSlide = slide;
					var position = -slide * this.width;
					if(this.cssTransforms){
						this.$carousel.find('.' + settings.slidesClass).css({'left': position + 'px'});
					}else{
						this.$carousel.find('.' + settings.slidesClass).clearQueue().animate({'left': position + 'px'}, settings.speed);
					}
				},

				updateNav : function(currentSlide){
					this.$carousel.find('.'+ settings.navigationClass +' a').removeClass(settings.currentNavClass);
					this.$carousel.find('.'+ settings.navigationClass +' a[href="#' + currentSlide + '"]').addClass(settings.currentNavClass);
				},

				bindEvents: function(){
					var that = this;

					//arrows left and right click events
					that.$carousel.on('click.carousel', '.' + settings.arrowsClass, function(event){
						clearInterval(that.interval);
						if($(this).hasClass(settings.prevArrowClass)){
							that.slideContent('right');
						} else {
							that.slideContent('left');
						}
						event.preventDefault();
					});

					//carousel navigation click events
					that.$carousel.on('click.carousel', '.'+ settings.navigationClass +' a', function(event){
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
								that.$carousel.find('.' + settings.slidesClass).css({'left': position + 'px'});
								that.enableTransitions();
							}, 300);
					});

					that.$carousel.swipeEvents()
						.bind("swipeLeft",  function(){ 
							clearInterval(that.interval);
							that.slideContent('left');
						})
						.bind("swipeRight", function(){ 
							clearInterval(that.interval);
							that.slideContent('right');
						});

				},

				destroy : function(elem){
					if(this.exist()){
						this.$carousel.unbind('.carousel');
						clearInterval(this.interval);
						this.$carousel.find('.' + settings.navigationClass+ ', .' + settings.arrowsClass).remove();
						this.$carousel.find('.' + settings.slideClass).attr('style', '');
						this.$carousel.html($('.' + settings.slidesClass).html()).removeClass(settings.wrapClass);
					}
				}
			};


			return $(this).each(function(){

				//init carousel
				carousel.init($(this));

				//destroy or start the carousel
				if(options === 'destroy'){
					carousel.destroy();
				} else {
					carousel.start();
				}

			});

		}
	});



	//swipe plugin
	$.fn.swipeEvents = function() {
		return this.each(function() {
			
			var startX,
					startY,
					$this = $(this);
			
			$this.bind('touchstart', touchstart);
			
			function touchstart(event) {
				var touches = event.originalEvent.touches;
				if (touches && touches.length) {
					startX = touches[0].pageX;
					startY = touches[0].pageY;
					$this.bind('touchmove', touchmove);
				}
				event.preventDefault();
			}
			
			function touchmove(event) {
				var touches = event.originalEvent.touches;
				if (touches && touches.length) {
					var deltaX = startX - touches[0].pageX;
					var deltaY = startY - touches[0].pageY;
					
					if (deltaX >= 50) {
						$this.trigger("swipeLeft");
					}
					if (deltaX <= -50) {
						$this.trigger("swipeRight");
					}
					if (deltaY >= 50) {
						$this.trigger("swipeUp");
					}
					if (deltaY <= -50) {
						$this.trigger("swipeDown");
					}
					if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
						$this.unbind('touchmove', touchmove);
					}
				}
				event.preventDefault();
			}
			
		});
	};

}(this, this.document, this.jQuery));