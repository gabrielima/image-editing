var Filters = {};

Filters.grayscale = function(args) {
  var imageData = args[0];

  for ( var i = 0; i< imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }

  return imageData;
};

Filters.brightness = function(args) {
  var imageData = args[0];
  var value = args[1];

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] += value;
    imageData[i+1] += value;
    imageData[i+2] += value;
  }

  return imageData;
};

Filters.threshold = function(args) {
  var imageData = args[0];
  var threshold = args[1];

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    
    imageData[i] = imageData[i+1] = imageData[i+2] = v;
  }
  
  return imageData;
};

Filters.invert = function(args) {
  var imageData = args[0];

  for ( var i = 0; i < imageData.length; i += 4 ) {
    imageData[i] = 255 - imageData[i];
    imageData[i+1] = 255 - imageData[i+1];
    imageData[i+2] = 255 - imageData[i+2];
  }
  
  return imageData;
};

Filters.sepia = function(args) {
  var imageData = args[0];

  for ( var i = 0; i < imageData.length; i += 4 ) {
    var r = imageData[i];
    var g = imageData[i+1];
    var b = imageData[i+2];    
    imageData[i] = r * 0.393 + g * 0.769 + b * 0.189;
    imageData[i+1] = r * 0.349 + g * 0.686 + b * 0.168;
    imageData[i+2] = r * 0.272 + g * 0.534 + b * 0.131;
  }
  
  return imageData;
};

