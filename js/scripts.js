$(document).ready(function() {
	var image = {};
	var canvas = get('canvas');
	var context = canvas.getContext("2d");

	$('.option').attr('disabled', true);
		
	$('#canvas').on("dragover dragenter", function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$('#canvas').on("drop", function (event) {		
		var files = event.originalEvent.dataTransfer.files;
		
		if (files.length > 0) {
			var file = files[0];
			/* save original name */
			image.name = file.name;
			
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				event.preventDefault();
				event.stopPropagation();	

				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function (event) {
					image.original = new Image();
					image.withoutFilter = new Image();
					image.current = new Image();
					
					image.original.src = event.target.result;
					image.withoutFilter.src = event.target.result;
					image.current.src = event.target.result;

					image.current.onload = function(){
						drawImageScaled(image.current);
					};	

					/* save original values */
					image.width = image.original.width;				
					image.height = image.original.height;				
				};
			}
		}

		$('.option').attr('disabled', false);
		$('.canvas-wrapper').addClass('loaded');
	});

	$('#save').click(function (event) {
		/* insert '-modified' right before the image extension */
		var newImageName = image.name.substring(0, image.name.lastIndexOf(".")) + 
			"-modified" + 
			image.name.substring(image.name.lastIndexOf("."));

		// var defaultWidth = get('canvas').width;
		// var defaultHeight = get('canvas').height;

		// get('canvas').width = image.width;
		// get('canvas').height = image.height;

		var link = get('save');
		link.href = get('canvas').toDataURL();
		link.download = newImageName; 

		// get('canvas').width = defaultWidth;
		// get('canvas').height = defaultHeight;
	});	

	$('#reset').click(function (event) {
		image.current = image.original;
		drawImageScaled(image.current);
	});	

	$('#normal').click(function(event) {
		image.current = image.withoutFilter;
		drawImageScaled(image.current);		
	});

	$('.option').click(function(event) {
		event.preventDefault();

		if($(this).data('filter')) {
			var filter = $(this).data('filter');
			var args = $(this).data('args') || null;
			
			applyFilter(Filters[filter], [args]);
		}
	});

	function applyFilter(filter, args) {
		var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
		
		var filterArgs = args || [];
		filterArgs.unshift(imgData);
				
		context.putImageData(filter(filterArgs), 0, 0);
	}

	function get(id) {
		return document.getElementById(id);
	}

	/**
	 *	Scales image to fit inside canvas.
	 *  For images with greater width and/or height than canvas' width and/or height
	 */
	function drawImageScaled(img) {
		var canvas = context.canvas;
		var hRatio = canvas.width /img.width;
		var vRatio =  canvas.height / img.height;
		var ratio  = Math.min ( hRatio, vRatio );
		var centerX = ( canvas.width - ( img.width * ratio ) ) / 2;
		var centerY = ( canvas.height - ( img.height * ratio ) ) / 2;  
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, 0, 0, img.width, img.height, 
			centerX, centerY, ( img.width * ratio ), ( img.height * ratio ));
	}	
});