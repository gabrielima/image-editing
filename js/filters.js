var Filters = {};

Filters.rotateRight = function(args) {
  transpose(args);
  Filters.invertHorizontal(args);
  return args.imgData;
};

Filters.rotateLeft = function(args) {
  transpose(args);
  Filters.invertVertical(args);

  return args.imgData;
};

Filters.invertHorizontal = function(args) {
  var imgData = args.imgData.data;
  var imgDataCopy = imgData.slice();
  var canvas = args.canvas;
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
  var canvas = args.canvas;  
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


Filters.crop = function(args) {
  var imgData = args.imgData.data;
  var canvas = args.canvas;
  var len = canvas.width * 4; // width == height
  // * 4 because for each pixel, there are 4 layers: r, g, b, a

  for ( var i = 0; i < len / 4; i++ )
    for ( var j = 0; j < len; j += 4 ) {
      if(  i <= args.cropData.y1 
        || j <= (args.cropData.x1 * 4)
        || i > args.cropData.y2
        || j > (args.cropData.x2 * 4)) {
        imgData[(i * len) + j]     = 0;
        imgData[(i * len) + j + 1] = 0;
        imgData[(i * len) + j + 2] = 0;
        imgData[(i * len) + j + 3] = 0;
      }
    }
 
  return args.imgData;  
}

Filters.box = function(args) {
  var imgData = args.imgData.data;
  var canvas = args.canvas;
  var len = canvas.width * 4; // width == height
  // * 4 because for each pixel, there are 4 layers: r, g, b, a

  for ( var i = 0; i < len / 4; i++ )
    for ( var j = 0; j < len; j += 4 ) {
      if((  i > args.boxData.y1 
        && j >= (args.boxData.x1 * 4)) 
        && (i <= args.boxData.y2
        && j < (args.boxData.x2 * 4))) {
        imgData[(i * len) + j]     = args.r;
        imgData[(i * len) + j + 1] = args.g;
        imgData[(i * len) + j + 2] = args.b;
        imgData[(i * len) + j + 3] = 255;
      }
    }
 
  return args.imgData;  
}

function transpose(args) {
  var imgData = args.imgData.data;
  var imgDataCopy = imgData.slice();
  var canvas = args.canvas;
  var context = args.context;  
  var len = canvas.width * 4; // width == height

  for ( var i = 0, x = 0; i < len; i++, x+=4 )
    for ( var j = 0, y = 0; j < len; j+=4, y++ ) {
      imgData[(i * len) + j]     = imgDataCopy[(y * len) + x]; 
      imgData[(i * len) + j + 1] = imgDataCopy[(y * len) + x + 1]; 
      imgData[(i * len) + j + 2] = imgDataCopy[(y * len) + x + 2]; 
      imgData[(i * len) + j + 3] = imgDataCopy[(y * len) + x + 3]; 
    }
}