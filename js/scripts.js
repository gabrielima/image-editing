$(document).ready(function() {
	$('button').attr('disabled', true);

	var canvas = document.getElementById('canvas'),
		context = canvas.getContext("2d"),
		image, imageOriginal;
		
	$('#canvas').on("dragover", function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$('#canvas').on("dragenter", function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$('#canvas').on("drop", function (event) {		
		var files = event.originalEvent.dataTransfer.files;
		
		if (files.length > 0) {
			var file = files[0];
			
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				event.preventDefault();
				event.stopPropagation();	

				var reader = new FileReader();

				reader.onload = function (event) {
					image = new Image();
					image.src = event.target.result;
					image.width = canvas.width;
					image.height = canvas.height;

					image.onload = function(){
						//drawImageScaled(image, context);
						context.drawImage(image, 0, 0, 100, 100 * (image.height / image.width));
					};					

					imageOriginal = new Image();
					imageOriginal.src = event.target.result;
					imageOriginal.id = "imageOrigial";
				};

				reader.readAsDataURL(file);
			}
		}

		$('button').attr('disabled', false);
		$('.jumbotron').addClass('loaded');
	});

	$('#save').click(function (event) {
		//window.open(canvas.toDataURL("image/png"));
		event.preventDefault();
	});	

	$('#normal').click(function (event) {
		drawImageScaled(imageOriginal, context);
		event.preventDefault();
	});

	$('#grayscale').click(function (event) {
		//console.log($('#image'));
		console.log(context.getImageData(0,0,image.width,image.height));
		grayscale(context.getImageData(0,0,image.width,image.height));
		event.preventDefault();
	});

	function grayscale(image) {
		console.log(image);
	  var d = image.data;
	  for (var i=0; i<d.length; i+=4) {
	    var r = d[i];
	    var g = d[i+1];
	    var b = d[i+2];
	    var v = 0.2126*r + 0.7152*g + 0.0722*b;
	    d[i] = d[i+1] = d[i+2] = v
	  }
	  return image;
	}

function drawImageScaled(img, ctx) {
   var canvas = ctx.canvas;
   var hRatio = canvas.width  / img.width;
   var vRatio =  canvas.height / img.height;
   var ratio  = Math.min ( hRatio, vRatio );
   var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
   var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
   ctx.clearRect(0,0,canvas.width, canvas.height);
   ctx.drawImage(img, 0,0, img.width, img.height,
                      centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
		console.log(img, 0,0, img.width, img.height,centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
}	
});