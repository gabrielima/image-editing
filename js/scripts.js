$(document).ready(function() {
	var image = {}, draw = false, isDrawing = false;
	var canvas = get('canvas');
	var context = canvas.getContext("2d");

	$('.option').attr('disabled', true);
	$('.form-group').hide();
		
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
					image.current = new Image();
					
					image.original.src = event.target.result;
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

		var link = get('save');
		link.href = get('canvas').toDataURL();
		link.download = newImageName; 
	});	

	$('#reset').click(function (event) {
		image.current = image.original;
		drawImageScaled(image.current);
	});	

	$('#write').click(function(event) {
		$('.form-group').show();
	});

	$('#writeForm').submit(function(event) {
		event.preventDefault();
		
		context.fillStyle = "black";
	  context.font = "bold 20px Arial";
	  context.fillText($('#writeInput').val(), 150, 400);	
	  $('#writeInput').val("");
	  $('.form-group').hide();
	});

	$('.option').click(function(event) {
		event.preventDefault();
		var args = {};

		if($(this).data('filter')) {
			var filter = $(this).data('filter');
			args.data = $(this).data('args');
			
			applyFilter(Filters[filter], args);
		}
	});

	// $('#draw').click(function(event) {
	// 	draw = !draw;
	// });

	// $('canvas').on('mousemove', function(e) {
	// 	if(draw) {
	//  		if (!isDrawing)
	// 	     return;
		  
	// 	  var x = e.pageX - context.offsetLeft;
	// 	  var y = e.pageY - context.offsetTop;
	// 	  var radius = 10; // or whatever
	// 	  var fillColor = '#ff0000';

	// 		context.fillCircle = function(x, y, radius, fillColor) {
	//       context.moveTo(x,0);
	//       context.lineTo(x,canvas.height);
	//       context.moveTo(0,y);
	//       context.lineTo(canvas.width,y);
	//       context.stroke();
 //      };
      

 //      context.fillCircle(x, y, radius, fillColor);
	// 	};
	// });

	// $('canvas').on('mousedown', function(e) {
	// 	if(draw)
	//   	isDrawing = true;
	// });

	// $('canvas').on('mouseup', function(e) {
	// 	if(draw)
	// 	  isDrawing = false;
	// });

	function applyFilter(filter, args) {		
		args.imgData = context.getImageData(0, 0, canvas.width, canvas.height);;
		args.canvas = get('canvas');
		args.context = context;
				
		context.putImageData(filter(args), 0, 0);
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