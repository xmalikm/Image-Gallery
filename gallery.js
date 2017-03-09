/*
 *  MalikWeb Image Gallery javascript
 */
$(document).ready(function(){

	var current_image,		// aktualne zobrazeny obrazok
		image_index,		// poradie - index obrazku
		li = $('ul li');	// itemy zoznamu obrazkov

	/*
	 *  funkcia vypocita vhodnu sirku a vysku obrazku vzhladom k viewportu prehliadaca
	 */
	function imgResize(image){
		var maxWidth = window.innerWidth,		// max mozna sirka
		 	maxHeight = window.innerHeight,		// max mozna vyska
		 	ratio = 0,							// aspect ratio
		 	width = image[0].width,				// aktualna sirka obrazku
		 	height = image[0].height;			// aktualna vyska obrazku

		 	//  sirka je vacsia ako viewport - dopocitaj vhodnu vysku
		 	if(width > maxWidth){
	            ratio = maxWidth / width;
	            image.css("width", maxWidth);
	            image.css("height", height * ratio);
	            // height = height * ratio;
	            // width = width * ratio;
     		}
     		//  vyska je vacsia ako viewport - dopocitaj vhodnu sirku
     		else if(height > maxHeight){
	            ratio = maxHeight / height;
	            image.css("height", maxHeight);
	            image.css("width", width * ratio);
	            // width = width * ratio;
     		}
     		else {
     			image.css("height", image[0].height);
	            image.css("width",image[0].width);
     		}
	}

	/*
	 *  nastavenie rozmerov wrapperu pre obrazok
	 */
	function imgWrapperResize(image){
		$('#image_form').css({
			'width': image.width(),
			'height': image.height(),
			'margin-top': -image.height()/2		//	vertikalne vycentrovanie na stred
		});
	}

	/*
	 *  Zatvorenie zobrazeneho obrazku
	 */
	function close(event){
		event.stopPropagation();

		$('#cover_div').fadeOut(200, function(){
			// vymaz naklonovany obrazok z image wrapperu
			current_image.remove();
			
			$('body').css({
				'overflow': 'visible'
			});
		});
	};

	/*
	 *  Zmiznutie povodneho a zobrazenie dalsieho obrazku
	 *  kliknutim alebo stlacenim sipky
	 */
	function moove(event){
		event.stopPropagation();

		//	kliknutie alebo stlacenie sipky
		//	dozadu
		if(event.target.id == 'prev' || event.which == 37) {
			image_index = (--image_index >= 0) ? image_index : li.length-1;
		}
		//	dopredu
		else if(event.target.id == 'next'|| event.which == 39)	{
			image_index = (++image_index < li.length) ? image_index : 0;
		}
		else {
			return false;
		}

		//	zmiznutie povodne zobrazeneho a zobrazenie dalsieho obrazka
		$('#image_form img:last-child, #prev, #next, #close').fadeOut(200, function(){
			current_image.remove();

			current_image = $('ul img[data-index="'+ image_index +'"]').clone();
			current_image.attr('id', 'current_image');

			//	aby sa dal obrazok neskor fadeIn-nut
			current_image.css({
				'display': 'none',
			});

			imgResize(current_image);
			imgWrapperResize(current_image);

			$('#image_form').append(current_image);

			// nechaj zobrazit naspat obrazok, spiky a krizik
			$('#image_form img:last-child, #prev, #next, #close').fadeIn(400);
		});
	}

	/*
	 *  handler click eventu na konkretny obrazok zo zoznamu
	 */
	$('ul img').click(function(){
		current_image = $(this).clone();
		current_image.attr('id', 'current_image')

		//	index aktualneho obrazku
		image_index = current_image.data('index');

		//	resiznutie obrazku 
		imgResize(current_image);
		// nastavenie rozmerov wrapperu pre obrazok
		imgWrapperResize(current_image);
		
		//	css navigacnych sipok
		$('.arrows').css({
			'top': '50%',
			'margin-top': -$('#prev').height()/2	//	vertikalne vycentrovanie sipky
		});

		//	appendnutie aktualneho obrazka do wrapperu
		$('#image_form').append(current_image);

		// aby sa nedalo scrolovat na stranke
		$('body').css({
			'overflow': 'hidden'
		});

		// vyska a sirka overlayu na celu obrazovku
		$('#cover_div').css({
			'width': window.innerWidth,
			'height': window.innerHeight
		}).fadeIn(400);
	});

	/*
	 *  handler click eventu na aktualne zobrazeny obrazok
	 */
	$('#image_form').click(function(event){
		moove(event);
	});
	
	/*
	 *  event handler stlacenia sipky alebo esc
	 */
	$(window).keydown(function(event){
		// je prave zobrazeny nejaky obrazok
		if($('#image_form').children().length == 4){
			// esc
			if(event.which == 27) {
				close(event);
			}
			// sipka
			else if(event.which == 37 || event.which == 39) {
				moove(event);
			}
			else {
				return false;
			}
		}
		else
			return;
	});

	/*
	 *  Pri kliknuti na close button alebo mimo obrazku - zatvor obrazok
	 */
	$('#cover_div, #close').click(function(event){
		close(event);
	});

});