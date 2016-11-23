var Processing = {};

Processing.rotateLeft = function(canvas, context, img) {
  canvas.width = img.width;
  canvas.height = img.height;
  context.save();
  context.translate(img.width / 2, img.height / 2);
  context.rotate(Math.PI/2);
  context.drawImage(
    img.current, -(img.width / 2), -(img.height / 2)
  );
  context.restore();
}