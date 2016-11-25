var Filters = {};

Filters.rotateLeft = function(args) {
  var imageData = args[0];
  var canvas = args[1];
  var context = args[2];

  canvas.width = img.width;
  canvas.height = img.height;
  context.save();
  context.translate(img.width / 2, img.height / 2);
  context.rotate(Math.PI/2);
  context.drawImage(
    img.current, -(img.width / 2), -(img.height / 2)
  );
  context.restore();

  return true;
};

Filters.brightness = function(args) {
  var imageData = args[0].data;
  var value = args[1];
  console.log(args);

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] += value;
    imageData[i+1] += value;
    imageData[i+2] += value;
  }

  return args[0];
};

Filters.contrast = function(args) {
  var imageData = args[0].data;
  var value = args[1];
  var factor = (259 * (value + 255)) / (255 * (259 - value));

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] = factor * (imageData[i] - 128) + 128;
    imageData[i+1] = factor * (imageData[i+1] - 128) + 128;
    imageData[i+2] = factor * (imageData[i+2] - 128) + 128;
  }

  return args[0];
};

Filters.saturation = function(args) {
  /* http://alienryderflex.com/saturation.html */

  var imageData = args[0].data;
  var value = args[1];

  var Pr = .299;
  var Pg = .587;
  var Pb = .114;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];

    var p = Math.sqrt(
      (r * r * Pr) +
      (g * g * Pg) +
      (b * b * Pb) 
    );

    imageData[i] = p + (r - p) * value;
    imageData[i+1] = p + (g - p) * value;
    imageData[i+2] = p + (b - p) * value;
  }

  return args[0];
};

Filters.grayscale = function(args) {
  var imageData = args[0].data;

  for ( var i = 0; i< imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }

  return args[0];
};

Filters.threshold = function(args) {
  var imageData = args[0].data;
  var threshold = args[1];

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    
    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }
  
  return args[0];
};

Filters.invert = function(args) {
  var imageData = args[0].data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] = 255 - imageData[i];
    imageData[i+1] = 255 - imageData[i+1];
    imageData[i+2] = 255 - imageData[i+2];
  }
  
  return args[0];
};

Filters.sepia = function(args) {
  var imageData = args[0].data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];    
    imageData[i] = r * 0.393 + g * 0.769 + b * 0.189;
    imageData[i+1] = r * 0.349 + g * 0.686 + b * 0.168;
    imageData[i+2] = r * 0.272 + g * 0.534 + b * 0.131;
  }
  
  return args[0];
};

Filters.blur = function(args) {
  var imageData = args[0].data;

  var filterMatrix = [
   [0.0, 0.2,  0.0],
   [0.2, 0.2,  0.2],
   [0.0, 0.2,  0.0]
  ];

  var factor = 1.0;
  var bias = 0.0;
  var filterWidth = 3, filterHeight = 3;
  
  return Filters.convolution(imageData, filterMatrix, filterWidth, filterHeight, factor, bias);
};

Filters.convolution = function(imageData, filterMatrix, filterWidth, filterHeight, factor, bias) {
  for ( var i = 0; i < imageData.length; i += 4 ) {
    var red = 0.0, green = 0.0, blue = 0.0;

    //multiply every value of the filter with corresponding image pixel
    for( var filterY = 0; filterY < filterHeight; filterY++ )
    for( var filterX = 0; filterX < filterWidth; filterX++ ) {
      var imageX = (x - filterWidth / 2 + filterX + w) % w;
      var imageY = (y - filterHeight / 2 + filterY + h) % h;
      red += imageData[i] * filterMatrix[filterY][filterX];
      green += imageData[i+1] * filterMatrix[filterY][filterX];
      blue += imageData[i+2] * filterMatrix[filterY][filterX];
    }

    //truncate values smaller than zero and larger than 255
    imageData[i] = min(max((factor * red + bias), 0), 255);
    imageData[i+1] = min(max((factor * green + bias), 0), 255);
    imageData[i+2] = min(max((factor * blue + bias), 0), 255);
  }

  return imageData;
};