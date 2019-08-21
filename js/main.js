/*
Theme Name: Fresk
Description: Creative Coming Soon Template
Author: Erilisdesign
Theme URI: http://erilisdesign.com/preview/themeforest/html/fresk/
Author URI: http://themeforest.net/user/erilisdesign
Version: 1.0.1
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------------------
[Table of contents]

1. Preloader
3. Navigation
3. Animations
4. Reveal Animations
5. Backgrounds
6. Fullscreen Sections Fix
7. Portfolio
8. magnificPopup
9. Countdown
10. Map
11. Mailchimp
12. Contact Form
13. Photoswipe

-------------------------------------------------------------------*/

(function($) {
	"use strict";

	// Vars
	var body = $('body'),
		animated = $('.animated'),
		scrollTo = $('a.scrollto'),
		target,
		EDHomeBlock = $('div.ed-home-block'),
		EDSideBlock = $('div.ed-side-block'),
		preloader = $('.preloader'),
		preloaderDelay = 350,
		preloaderFadeOutTime = 800,
		BGImageHolder = $('.bg-image-holder'),
		countdown = $('.countdown[data-countdown]');

	// Mobile
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		body.addClass('mobile');
	}

	function detectIE() {
		if (navigator.userAgent.indexOf('MSIE') != -1)
			var detectIEregexp = /MSIE (\d+\.\d+);/
		else
			var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/

		if (detectIEregexp.test(navigator.userAgent)){
			var ieversion=new Number(RegExp.$1)
			if (ieversion >= 10) {
				return true;
			}
		}
		return false;
	}

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	function getWindowHeight() {
		return Math.max( $(window).height(), window.innerHeight);
	}


	// [1. Preloader]
	function init_ED_Preloader() {
		preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
	}


	// [2. Navigation]
	function init_ED_Navigation() {
		scrollTo.off('click');

		if(!( body.hasClass('mobile') || 992 >= getWindowWidth() )) {
			var scrollOffset = getWindowHeight() / 2;

			if(body.hasClass('mCS_destroyed') || !body.hasClass('mCustomScrollbar')){
				body.mCustomScrollbar({
					axis: 'y',
					scrollbarPosition: 'inside',
					scrollInertia: 100,
					mouseWheel:{
						enable: true,
						scrollAmount: 100,
						axis: 'y'
					},
					autoHideScrollbar: false,
					alwaysShowScrollbar: 1,
					callbacks:{
						whileScrolling: function(){
							if(body.hasClass('sideblock-active')){
								// Show 'back to top' button
								if(this.mcs.top <= -scrollOffset){
									$('a.backtotop').addClass('active');
								} else {
									$('a.backtotop').removeClass('active');
								};
							}
						},
						onScroll: function(){
							init_ED_Animations('waypoint');
							init_ED_Reveal('waypoint');
						}
					}
				});
				init_ED_VegasFix();
			}

			scrollTo.on('click', function(e) {
				e.preventDefault();

				var target = $(this).attr('href');

				if($(this).hasClass('backtotop')){
					// Back to Top
					body.mCustomScrollbar('scrollTo',['top',null],{
						scrollInertia: 800
					});
				} else {
					if($(target).parents('.ed-home-block').length > 0){
						body.removeClass('sideblock-active');
						setTimeout(function(){
							body.mCustomScrollbar('scrollTo',['top',null],{
								scrollInertia: 150
							});
						}, 1120);
					} else {
						if(!body.hasClass('sideblock-active')){
							body.addClass('sideblock-active');
						}
						body.mCustomScrollbar( 'scrollTo', body.find('.mCSB_container').find(target), {
							scrollInertia: 800
						});
					}
				}
			});
		} else {

			if(body.hasClass('mCustomScrollbar')){
				body.mCustomScrollbar('destroy');
			}

			// Smooth Scroll
			scrollTo.on('click', function(e) {
				e.preventDefault();

				var target = $(this).attr('href');

				$.smoothScroll({
					offset: 0,
					easing: 'swing',
					speed: 800,
					scrollTarget: target,
					preventDefault: false
				});
			});
		}

		// Video autoplay fix
		if(!body.hasClass('mobile') && document.querySelectorAll('video[autoplay]').length > 0){
			var video = document.querySelectorAll('.overlay-video video')[0],
				isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
	
			if (!isPlaying) {
				video.play();
			}
		}
	}

	// [3. Animations]
	function init_ED_Animations(init) {
		if( body.hasClass('mobile') || detectIE() ) {
			animated.css({
				'display':'block',
				'visibility':'visible'
			});
		} else {
			animated.each(function(){
				var aElement = $(this);
				if(init === 'onload' && aElement.hasClass('animated-onload')){
					if ( !aElement.hasClass('visible') ) {
						var animation = aElement.attr('data-animation') || 'fadeInUp',
							animationDelay = parseInt(aElement.attr('data-animation-delay'), 10) || 0;
						if ( animationDelay > 0) {
							setTimeout(function(){
								aElement.addClass(animation + ' visible');
							}, animationDelay);
						} else {
							aElement.addClass(animation + ' visible');
						}
					}
				} else if (init === 'waypoint'){
					new Waypoint({
						element: aElement,
						handler: function(direction) {

							var aElement = this.element;

							if ( !aElement.hasClass('visible') ) {
								var animation = aElement.attr('data-animation') || 'fadeInUp',
									animationDelay = parseInt(aElement.attr('data-animation-delay'), 10) || 0;
								if ( animationDelay ) {
									setTimeout(function(){
										aElement.addClass(animation + ' visible');
									}, animationDelay);
								} else {
									aElement.addClass(animation + ' visible');
								}
							}

							this.destroy();

						},
						offset: '90%'
					});
				}
			});
		}
	}


	// [4. Reveal Animations]
	function init_ED_RevealDetect() {
		if( body.hasClass('mobile') || detectIE() ) {
			body.removeClass('reveal');
			return true;
		} else {
			body.addClass('reveal');
		}
	}

	function init_ED_Reveal(init) {
		if( !body.hasClass('reveal') ) {
			return true;
		}

		$('.reveal-element').each(function(){
			var rElement = $(this);
			if(init === 'onload' && rElement.hasClass('reveal-onload')){
				revealElement(rElement);
			} else if (init === 'waypoint'){
				new Waypoint({
					element: rElement,
					handler: function(direction) {
						revealElement(this.element);
						this.destroy();
					},
					offset: '90%'
				});
			}
		});
	}

	function revealElement(rElement) {
		var rDuration = parseInt(rElement.attr('data-duration'), 10) || 400,
			rDelay = parseInt(rElement.attr('data-delay'), 10) || 0,
			rOffset = rDuration + rDelay,
			rDirection = rElement.attr('data-direction') || 'ltr',
			rEasing = rElement.attr('data-easing') || 'easeInOutQuad',
			rStyle = rElement.attr('data-style') || 'default',
			rContent = rElement.find('.reveal-content'),
			rHighlight = rElement.find('.reveal-highlight');

		if (rElement.hasClass('active')){
			return true;
		}

		if(rStyle === 'alt'){
			if(rDirection === 'ltr'){
				rHighlight.delay(rDelay).animate({
					easing: rEasing,
					width: '100%',
					left: '0'
				}, rDuration);
			} else if(rDirection === 'rtl'){
				rHighlight.delay(rDelay).animate({
					easing: rEasing,
					width: '100%',
					right: '0'
				}, rDuration);
			} else if(rDirection === 'ttb'){
				rHighlight.delay(rDelay).animate({
					easing: rEasing,
					height: '100%',
					top: '0'
				}, rDuration);
			} else if(rDirection === 'btt'){
				rHighlight.delay(rDelay).animate({
					easing: rEasing,
					height: '100%',
					bottom: '0'
				}, rDuration);
			}
		} else {
			if(rDirection === 'ltr'){
				rHighlight.delay(rDelay).animate({
					width: '100%',
					left: '0'
				}, {
					easing: rEasing,
					duration: rDuration,
					complete: function() {
						rHighlight.delay(rDelay).animate({
							width: '0',
							left: '100%'
						}, {
							easing: rEasing,
							duration: rDuration,
							queue: false,
							step: function(){
								rContent.css({'opacity': 1});
							}
						});
					}
				});
			} else if(rDirection === 'rtl'){
				rHighlight.delay(rDelay).animate({
					width: '100%',
					right: '0'
				}, {
					easing: rEasing,
					duration: rDuration,
					complete: function() {
						rHighlight.delay(rDelay).animate({
							width: '0',
							right: '100%'
						}, {
							easing: rEasing,
							duration: rDuration,
							queue: false,
							step: function(){
								rContent.css({'opacity': 1});
							}
						});
					}
				});
			} else if(rDirection === 'ttb'){
				rHighlight.delay(rDelay).animate({
					height: '100%',
					top: '0'
				}, {
					easing: rEasing,
					duration: rDuration,
					complete: function() {
						rHighlight.delay(rDelay).animate({
							height: '0',
							top: '100%'
						}, {
							easing: rEasing,
							duration: rDuration,
							queue: false,
							step: function(){
								rContent.css({'opacity': 1});
							}
						});
					}
				});
			} else if(rDirection === 'btt'){
				rHighlight.delay(rDelay).animate({
					height: '100%',
					bottom: '0'
				}, {
					easing: rEasing,
					duration: rDuration,
					complete: function() {
						rHighlight.delay(rDelay).animate({
							height: '0',
							bottom: '100%'
						}, {
							easing: rEasing,
							duration: rDuration,
							queue: false,
							step: function(){
								rContent.css({'opacity': 1});
							}
						});
					}
				});
			} else {
				rHighlight.delay(rDelay).animate({
					width: '100%',
					left: '0'
				}, {
					easing: rEasing,
					duration: rDuration,
					complete: function() {
						rHighlight.delay(rDelay).animate({
							width: '0',
							left: '100%'
						}, {
							easing: rEasing,
							duration: rDuration,
							queue: false,
							step: function(){
								rContent.css({'opacity': 1});
							}
						});
					}
				});
			}
		}
		rElement.addClass('active');
	}

	// [5. Backgrounds]
	function init_ED_PageBackground() {

		BGImageHolder.each(function(){
			var bg = $(this),
				bgSrc = $(this).children('img').attr('src');

			bg.css('background-image','url("'+bgSrc+'")');
		});

		// Slideshow
		if (body.hasClass('slideshow-background')) {
			body.vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-1.jpg' },
					{ src: 'demo/images/image-4.jpg' },
					{ src: 'demo/images/image-7.jpg' },
					{ src: 'demo/images/image-20.jpg' }
				]
			});
		}

		// Slideshow - ZoomOut
		if (body.hasClass('slideshow-zoom-background')) {
			body.vegas({
				preload: true,
				timer: false,
				delay: 7000,
				transition: 'zoomOut',
				transitionDuration: 4000,
				slides: [
					{ src: 'demo/images/image-1.jpg' },
					{ src: 'demo/images/image-4.jpg' },
					{ src: 'demo/images/image-7.jpg' },
					{ src: 'demo/images/image-20.jpg' }
				]
			});
		}

		// Slideshow with Video
		if (body.hasClass('slideshow-video-background')) {
			body.vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-2.jpg' },
					{ src: 'demo/video/marine.jpg',
						video: {
							src: [
								'demo/video/marine.mp4',
								'demo/video/marine.webm',
								'demo/video/marine.ogv'
							],
							loop: false,
							mute: true
						}
					},
					{ src: 'demo/images/image-1.jpg' },
					{ src: 'demo/images/image-4.jpg' },
					{ src: 'demo/images/image-7.jpg' }
				]
			});
		}

		// Kenburns
		if (body.hasClass('kenburns-background')) {

			var kenburnsDisplayBackdrops = false;
			var kenburnsBackgrounds = [
				{ src: 'demo/images/image-1.jpg', valign: 'top' },
				{ src: 'demo/images/image-4.jpg', valign: 'top' },
				{ src: 'demo/images/image-7.jpg', valign: 'top' },
				{ src: 'demo/images/image-20.jpg', valign: 'top' }
			];

			body.vegas({
				preload: true,
				transition: 'swirlLeft2',
				transitionDuration: 4000,
				timer: false,
				delay: 10000,
				slides: kenburnsBackgrounds,
				walk: function (nb) {
					if (kenburnsDisplayBackdrops === true) {
						var backdrop;

						backdrop = backdrops[nb];
						backdrop.animation = 'kenburns';
						backdrop.animationDuration = 20000;
						backdrop.transition = 'fade';
						backdrop.transitionDuration = 1000;

						body
							.vegas('options', 'slides', [ backdrop ])
							.vegas('next');
					}
				}
			});
		}

		// Youtube Video
		if ($('#youtube-background').length > 0) {
			var videos = [
				{videoURL: "iXkJmJa4NvE", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:true, showYTLogo:false, realfullscreen: true, addRaster:true}
			];

			$('.player').YTPlaylist(videos, true);
		}

		// Youtube Multiple Videos
		if ($('#youtube-multiple-background').length > 0) {

			var videos = [
				{videoURL: "CG20eBusRg0", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, showYTLogo:false, realfullscreen: true, addRaster:true},
				{videoURL: "iXkJmJa4NvE", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, showYTLogo:false, realfullscreen: true, addRaster:true}
			];

			$('.player').YTPlaylist(videos, true);

		}

		// Video
		if(body.hasClass('mobile')) {
			$('.video-wrapper, .player').css('display', 'none');
		}

		// Google Map
		if($('#gmap-background').length){

			var map = new GMaps({
				div: '#gmap-background',
				lat: 37.752797,
				lng: -122.409132,
				zoom: 14,
				scrollwheel: false
			});

			map.addMarker({
				lat: 37.752797,
				lng: -122.409132
			});

		}

	}

	function init_ED_VegasFix() {
		if(body.hasClass('vegas-container')){
			body.vegas('destroy');
			$('.mCSB_container').find('.vegas-slide').remove();
			init_ED_PageBackground();
		}
	}


	// [6. Fullscreen Sections Fix]
	function init_ED_FullscreenFix() {		
		if(!( body.hasClass('mobile') || 992 >= getWindowWidth() )) {
			$('section.fullscreen-element').each(function(){

				var elem = $(this),
					elemHeight = getWindowHeight(),
					elemContent = elem.find('.fe-container'),
					elemContentHeight = elemContent.outerHeight(),
					elemPaddingTop = parseInt(elem.css('padding-top'), 10),
					elemPaddingBottom = parseInt(elem.css('padding-bottom'), 10),
					elemTrueHeight = elemContentHeight + elemPaddingTop + elemPaddingBottom;

				if( elemHeight >= elemTrueHeight ){
					elem.css('height', '');
				} else if( elemHeight < elemTrueHeight ){
					elem.css('height', 'auto');
				}

			});
		} else {
			$('section.fullscreen-element').each(function(){
				$(this).css('height', 'auto');
			});
		}
	}


	// [7. Portfolio]
	function init_ED_MasonryLayout() {
		if(document.querySelectorAll('.isotope-container').length > 0){
			if(!$().isotope) {
				console.log('MasonryLayout: isotope not defined.');
				return true;
			}

			if ($('.isotope-container').length > 0) {
				var $isotopeContainer = $('.isotope-container');
				var $columnWidth = $isotopeContainer.attr('data-column-width');

				if($columnWidth === null){
					var $columnWidth = '.isotope-item';
				}

				$isotopeContainer.isotope({
					filter: '*',
					animationEngine: 'best-available',
					resizable: false,
					itemSelector : '.isotope-item',
					masonry: {
						columnWidth: $columnWidth
					},
					animationOptions: {
						duration: 750,
						easing: 'linear',
						queue: false
					}
				});
			}

			$('nav.isotope-filter ul a').on('click', function() {
				var selector = $(this).attr('data-filter');
				$isotopeContainer.isotope({ filter: selector });
				$('nav.isotope-filter ul a').removeClass('active');
				$(this).addClass('active');
				return false;
			});
		}
	}


	// [8. magnificPopup]
	function init_ED_MagnificPopup() {
		if(	document.querySelectorAll('.mfp-image').length > 0 ||
			document.querySelectorAll('.mfp-gallery').length > 0 ||
			document.querySelectorAll('.mfp-iframe').length > 0 ||
			document.querySelectorAll('.mfp-ajax').length > 0 ||
			document.querySelectorAll('.open-popup-link').length > 0 ){

			if(!$().magnificPopup) {
				console.log('MagnificPopup: magnificPopup not defined.');
				return true;
			}

			$('.mfp-image').magnificPopup({
				type:'image',
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});

			$('.mfp-gallery').each(function() {
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					gallery: {
						enabled: true
					},
					arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
					closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
					removalDelay: 300,
					mainClass: 'mfp-fade'
				});
			});

			$('.mfp-iframe').magnificPopup({
				type: 'iframe',
				iframe: {
					patterns: {
						youtube: {
							index: 'youtube.com/',
							id: 'v=',
							src: '//www.youtube.com/embed/%id%?autoplay=1'
						},
						vimeo: {
							index: 'vimeo.com/',
							id: '/',
							src: '//player.vimeo.com/video/%id%?autoplay=1'
						},
						gmaps: {
							index: '//maps.google.',
							src: '%id%&output=embed'
						}
					},
					srcAction: 'iframe_src'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});

			$('.mfp-ajax').magnificPopup({
				type: 'ajax',
				ajax: {
					settings: null,
					cursor: 'mfp-ajax-cur',
					tError: '<a href="%url%">The content</a> could not be loaded.'
				},
				midClick: true,
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade',
				callbacks: {
					ajaxContentAdded: function(mfpResponse) {
						init_ED_Slider();
					}
				}
			});

			$('.open-popup-link').magnificPopup({
				type: 'inline',
				midClick: true,
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-zoom-in'
			});
		}
	}


	// [9. Countdown]
	function init_ED_Countdown() {
		if(document.querySelectorAll('.countdown').length > 0){
			if(!$().countdown) {
				console.log('Countdown: countdown not defined.');
				return true;
			}

			if (countdown.length > 0) {			
				countdown.each(function() {
					var $countdown = $(this),
						finalDate = $countdown.attr('data-countdown');
					$countdown.countdown(finalDate, function(event) {
						$countdown.html(event.strftime(
							'<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div><div class="counter-box"><div class="number">%H</div><span>Hours</span></div><div class="counter-box"><div class="number">%M</div><span>Minutes</span></div><div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'
						));
					});
				});
			}
		}
	}


	function init_ED_Slider() {
		if(document.querySelectorAll('.ed-flexslider').length > 0){
			$('.ed-flexslider').each( function(){
				var $flexSlider = $(this),
					fs_effect = $flexSlider.attr('data-effect'),
					fs_easing = $flexSlider.attr('data-easing'),
					fs_direction = $flexSlider.attr('data-direction'),
					fs_loop = $flexSlider.attr('data-loop'),
					fs_smoothHeight = $flexSlider.attr('data-smooth-height'),
					fs_startAt = parseInt($flexSlider.attr('data-startat'), 10),
					fs_slideshowSpeed = parseInt($flexSlider.attr('data-slideshow-speed'), 10),
					fs_animationSpeed = parseInt($flexSlider.attr('data-animation-speed'), 10),
					fs_randomize = $flexSlider.attr('data-randomize'),
					fs_video = $flexSlider.attr('data-video'),
					fs_pagination = $flexSlider.attr('data-pagination'),
					fs_directionNav = $flexSlider.attr('data-directionnav'),
					fs_keyboard = $flexSlider.attr('data-keyboard'),
					fs_pausePlay = $flexSlider.attr('data-pause-play');

				if( !fs_effect ){ fs_effect = 'slide'; }
				if( !fs_easing ){ fs_easing = 'swing'; }
				if( !fs_direction ){ fs_direction = 'horizontal'; }
				if( fs_loop === 'false' ){ fs_loop = false; } else { fs_loop = true; }
				if( fs_smoothHeight === 'true' ){ fs_smoothHeight = true; } else { fs_smoothHeight = false; }
				if( !fs_startAt ){ fs_startAt = 0; }
				if( !fs_slideshowSpeed ){ fs_slideshowSpeed = 7000; }
				if( !fs_animationSpeed ){ fs_animationSpeed = 700; }
				if( fs_randomize === 'true' ){ fs_randomize = true; } else { fs_randomize = false; }	
				if( fs_video === 'true' ){ fs_video = true; } else { fs_video = false; }
				if( fs_pagination === 'false' ){ fs_pagination = false; } else { fs_pagination = true; }
				if( fs_directionNav === 'false' ){ fs_directionNav = false; } else { fs_directionNav = true; }
				if( fs_keyboard === 'true' ){ fs_keyboard = true; } else { fs_keyboard = false; }
				if( fs_pausePlay === 'true' ){ fs_pausePlay = true; } else { fs_pausePlay = false; }

				$flexSlider.flexslider({
					selector: ".slides > div.flex-slide",
					animation: ''+ fs_effect +'',
					easing: ''+ fs_easing +'',
					direction: ''+ fs_direction +'',
					animationLoop: fs_loop,
					smoothHeight: fs_smoothHeight,
					startAt: fs_startAt,
					slideshow: true,
					slideshowSpeed: fs_slideshowSpeed,
					animationSpeed: fs_animationSpeed,
					randomize: fs_randomize,
					pauseOnAction: true,
					pauseOnHover: false,
					video: fs_video,
					controlNav: fs_pagination,
					directionNav: fs_directionNav,
					prevText: "<i class='fa fa-angle-left'></i>",
					nextText: "<i class='fa fa-angle-right'></i>",
					keyboard: fs_keyboard,
					pausePlay: fs_pausePlay,
					pauseText: 'Pause',
					playText: 'Play'
				});
			});
		}		
	}

	// [10. Map]
	function init_ED_Maps() {
		var gmap = $('.gmap');
		
		if (gmap.length > 0) {
			gmap.each(function() {
				var map_height = parseInt($(this).attr('data-height'), 10);
				
				if (map_height){
					gmap.css('height',map_height);
				}
			});
		}
		
		// GMap Contact
		if($('#gmap-contact').length){
			
			var map = new GMaps({
				div: '#gmap-contact',
				lat: 37.752797,
				lng: -122.409132,
				zoom: 14,
				scrollwheel: false
			});
			
			map.addMarker({
				lat: 37.752797,
				lng: -122.409132,
				title: 'Lunar',
				infoWindow: {
					content: '<p class="mb-0">Cali Agency</p>'
				}
			});
			
		}
	}


	// [11. Mailchimp]
	function init_ED_Mailchimp() {
		var subscribeForm = $('.subscribe-form');
		if( subscribeForm.length < 1 ){ return true; }

		subscribeForm.each( function(){
			var el = $(this),
				elResult = el.find('.subscribe-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						resetForm: true,
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}


	// [12. Contact Form]
	function init_ED_ContactForm() {
		var contactForm = $('.contact-form');
		if( contactForm.length < 1 ){ return true; }

		contactForm.each( function(){
			var el = $(this),
				elResult = el.find('.contact-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}


	// [13. Photoswipe]
	function init_ED_PhotoSwipe() {

		var initPhotoSwipeFromDOM = function(gallerySelector) {

			var parseThumbnailElements = function(el) {
				var thumbElements = el.childNodes,
					numNodes = thumbElements.length,
					items = [],
					articleEl,
					childElements,
					linkEl,
					size,
					item;

				for(var i = 0; i < numNodes; i++) {

					articleEl = thumbElements[i];

					// include only element nodes 
					if(articleEl.nodeType !== 1) {
						continue;
					}

					linkEl = articleEl.children[0].children[0];
					size = linkEl.getAttribute('data-size').split('x');

					// create slide object
					item = {
						src: linkEl.getAttribute('href'),
						w: parseInt(size[0], 10),
						h: parseInt(size[1], 10)
					};

					item.title = true;			
					item.el = articleEl; // save link to element for getThumbBoundsFn

					if(articleEl.children[0].children.length > 1) {
						item.details = articleEl.children[0].children[1].outerHTML; // caption (contents of figure)
					}

					if(linkEl.children.length > 0) {
						item.msrc = linkEl.children[0].getAttribute('src'); // thumbnail url
					}

					// original image
					item.o = {
						src: item.src,
						w: item.w,
						h: item.h
					};

					items.push(item);
				}

				return items;
			};

			// find nearest parent element
			var closest = function closest(el, fn) {
				return el && ( fn(el) ? el : closest(el.parentNode, fn) );
			};

			var onThumbnailsClick = function(e) {
				e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;

				var eTarget = e.target || e.srcElement;

				var clickedListItem = closest(eTarget, function(el) {
					return el.tagName === 'ARTICLE';
				});

				if(!clickedListItem) {
					return;
				}

				var clickedGallery = clickedListItem.parentNode,
					childNodes = clickedListItem.parentNode.childNodes,
					numChildNodes = childNodes.length,
					nodeIndex = 0,
					index;

				for (var i = 0; i < numChildNodes; i++) {
					if(childNodes[i].nodeType !== 1) { 
					continue; 
				}

				if(childNodes[i] === clickedListItem) {
					index = nodeIndex;
						break;
					}
					nodeIndex++;
				}

				if(index >= 0) {
					openPhotoSwipe( index, clickedGallery );
				}
				return false;
			};

			var photoswipeParseHash = function() {
				var hash = window.location.hash.substring(1),
				params = {};

				if(hash.length < 5) { // pid=1
					return params;
				}

				var vars = hash.split('&');
				for (var i = 0; i < vars.length; i++) {
					if(!vars[i]) {
						continue;
					}
					var pair = vars[i].split('=');
					if(pair.length < 2) {
						continue;
					}
					params[pair[0]] = pair[1];
				}

				if(params.gid) {
					params.gid = parseInt(params.gid, 10);
				}

				return params;
			};

			var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
				var pswpElement = document.querySelectorAll('.pswp')[0],
					gallery,
					options,
					items;

				items = parseThumbnailElements(galleryElement);

				// Define options
				options = {

					// Core
					index: index,
					getThumbBoundsFn: function(index) {
						var thumbnail = items[index].el.children[0],
							pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
							rect = thumbnail.getBoundingClientRect(); 

						return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
					},
					bgOpacity: 0.87,
					loop: true,
					closeOnScroll: false,
					history: false,
					galleryUID: galleryElement.getAttribute('data-pswp-uid'),
					focus: false,
					modal: false,

					// UI
					addCaptionHTMLFn: function(item, captionEl, isFake) {
						if(!item.details) {
							captionEl.children[0].innerText = '';
							return false;
						}
						captionEl.children[0].innerHTML = item.details;
						return true;
					},

					// Buttons/elements
					closeEl: true,
					captionEl: true,
					fullscreenEl: true,
					zoomEl: true,
					shareEl: true,
					counterEl: true,
					arrowEl: true,
					preloaderEl: true
				};

				// Exit if index not found
				if( isNaN(options.index) ) {
					return;
				}

				if(disableAnimation) {
					options.showAnimationDuration = 0;
				}

				// Pass data to PhotoSwipe and initialize it
				gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

				// see: http://photoswipe.com/documentation/responsive-images.html
				var realViewportWidth,
					useLargeImages = false,
					firstResize = true,
					imageSrcWillChange;

				gallery.listen('beforeResize', function() {

					var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
					dpiRatio = Math.min(dpiRatio, 2.5);
					realViewportWidth = gallery.viewportSize.x * dpiRatio;

					if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
						if(!useLargeImages) {
							useLargeImages = true;
							imageSrcWillChange = true;
						}
					} else {
						if(useLargeImages) {
							useLargeImages = false;
							imageSrcWillChange = true;
						}
					}

					if(imageSrcWillChange && !firstResize) {
						gallery.invalidateCurrItems();
					}

					if(firstResize) {
						firstResize = false;
					}

					imageSrcWillChange = false;

				});

				gallery.listen('gettingData', function(index, item) {
					if( useLargeImages ) {
						item.src = item.o.src;
						item.w = item.o.w;
						item.h = item.o.h;
					} else {
						item.src = item.o.src;
						item.w = item.o.w;
						item.h = item.o.h;
					}
				});

				gallery.init();
			};

			// select all gallery elements
			var galleryElements = document.querySelectorAll( gallerySelector );
			for(var i = 0, l = galleryElements.length; i < l; i++) {
				galleryElements[i].setAttribute('data-pswp-uid', i+1);
				galleryElements[i].onclick = onThumbnailsClick;
			}

			// Parse URL and open gallery if it contains #&pid=3&gid=1
			var hashData = photoswipeParseHash();
			if(hashData.pid && hashData.gid) {
				openPhotoSwipe( hashData.pid, galleryElements[ hashData.gid - 1 ], true, true );
			}
		};

		initPhotoSwipeFromDOM('.portfolio-gallery');

	}


	// window load function
	$(window).on('load', function() {
		body.addClass('loaded');
		init_ED_FullscreenFix();
		init_ED_Preloader();
		init_ED_Animations('onload');
		init_ED_Reveal('onload');
		init_ED_MasonryLayout();
	});

	// document.ready function
	jQuery(document).ready(function($) {
		init_ED_RevealDetect();
		init_ED_Navigation();
		init_ED_PageBackground();
		init_ED_Animations('waypoint');
		init_ED_Reveal('waypoint');
		init_ED_MagnificPopup();
		init_ED_Countdown();
		init_ED_Slider();
		init_ED_Maps();
		init_ED_Mailchimp();
		init_ED_ContactForm();
		init_ED_PhotoSwipe();
	});

	// window.resize function
	$(window).on('resize', function () {
		init_ED_Navigation();
		init_ED_FullscreenFix();
		init_ED_MasonryLayout();
	});

})(jQuery);

//Google Tracking Code
