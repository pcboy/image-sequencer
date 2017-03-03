/*
 * NDVI with red filter (blue channel is infrared)
 */
module.exports = function NdviRed(options) {

  options = options || {};

  //function setup() {} // optional

  function draw(image) {
    function changePixel(r, g, b, a) {
      var ndvi = 255 * (b - r) / (1.00 * b + r);
      return [ndvi, ndvi, ndvi, a];
    }
    return require('./PixelManipulation.js')(image, {
      output: options.output,
      changePixel: changePixel
    });
  }

  return {
    title: "NDVI for red-filtered cameras (blue is infrared)",
    options: options,
    //setup: setup, // optional
    draw: draw
  }
}
