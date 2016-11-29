Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

var Filters = {};

Filters.rotateLeft = function(args) {
  var imgData = args.imgData.data;
  var imgDataCopy = imgData.slice();
  var canvas = args.canvas;
  var context = args.context;
  var len = canvas.width * 4; // width == height

  for ( var i = 0; i < len; i++ )
    for ( var j = 0; j < len; j++ )
      imgData[(j * len) + i] = imgDataCopy[(i * len) + j]; 

  // for ( var j = 0; j < width; j++ )
  //   for ( var i = height-1, k = 0; i >= 0, k < height ; i--, k++ )
  //     imgDataCopy[(i * height) + j] = imgData[(j * width) + i];
  
  return args.imgData;
};

Filters.invertHorizontal = function(args) {
  var imgData = args.imgData.data;
  var imgDataCopy = imgData.slice();
  var len = canvas.width * 4; // width == height
  // * 4 because for each pixel, there are 4 layers: r, g, b, a

  for ( var i = 0; i < len; i++ )
    for ( var j = 0, k = len - 4; j < len; j += 4, k -= 4 ) {
      imgData[(i * len) + k]     = imgDataCopy[(i * len) + j]; 
      imgData[(i * len) + k + 1] = imgDataCopy[(i * len) + j + 1]; 
      imgData[(i * len) + k + 2] = imgDataCopy[(i * len) + j + 2]; 
      imgData[(i * len) + k + 3] = imgDataCopy[(i * len) + j + 3]; 
    }
 
  return args.imgData;
};

Filters.invertVertical = function(args) {
  var imgData = args.imgData.data;
  var imgDataCopy = imgData.slice();
  var len = canvas.width * 4; // width == height

  for ( var i = 0; i < len; i += 4 )
    for ( var j = 0, k = canvas.height - 1; j < canvas.height; j++, k-- ) {
      imgData[(k * len) + i]     = imgDataCopy[(j * len) + i]; 
      imgData[(k * len) + i + 1] = imgDataCopy[(j * len) + i + 1]; 
      imgData[(k * len) + i + 2] = imgDataCopy[(j * len) + i + 2]; 
      imgData[(k * len) + i + 3] = imgDataCopy[(j * len) + i + 3]; 
    }

  return args.imgData;
};

Filters.brightness = function(args) {
  var imageData = args.imgData.data;
  var value = args.data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] += value;
    imageData[i+1] += value;
    imageData[i+2] += value;
  }

  return args.imgData;
};

Filters.contrast = function(args) {
  var imageData = args.imgData.data;
  var value = args.data;
  var factor = (259 * (value + 255)) / (255 * (259 - value));

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] = factor * (imageData[i] - 128) + 128;
    imageData[i+1] = factor * (imageData[i+1] - 128) + 128;
    imageData[i+2] = factor * (imageData[i+2] - 128) + 128;
  }

  return args.imgData;
};

Filters.saturation = function(args) {
  /* http://alienryderflex.com/saturation.html */

  var imageData = args.imgData.data;
  var value = args.data;

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

  return args.imgData;
};

Filters.grayscale = function(args) {
  var imageData = args.imgData.data;

  for ( var i = 0; i< imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }

  return args.imgData;
};

Filters.threshold = function(args) {
  var imageData = args.imgData.data;
  var threshold = args.data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    
    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }
  
  return args.imgData;
};

Filters.invert = function(args) {
  var imageData = args.imgData.data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] = 255 - imageData[i];
    imageData[i+1] = 255 - imageData[i+1];
    imageData[i+2] = 255 - imageData[i+2];
  }
  
  return args.imgData;
};

Filters.sepia = function(args) {
  var imageData = args.imgData.data;

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];    
    imageData[i] = r * 0.393 + g * 0.769 + b * 0.189;
    imageData[i+1] = r * 0.349 + g * 0.686 + b * 0.168;
    imageData[i+2] = r * 0.272 + g * 0.534 + b * 0.131;
  }
  
  return args.imgData;
};

Filters.blur = function(args) {
  var imageData = args.imgData.data;

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