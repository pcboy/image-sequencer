if (typeof window !== 'undefined') window.$ = window.jQuery = require('jquery');

ImageSequencer = function ImageSequencer(options) {

  options = options || {};
  options.inBrowser = options.inBrowser || typeof window !== 'undefined';
  options.ui = options.ui || require('./UserInterface');

  var image,
      steps = [],
      modules = require('./Modules');

  // if in browser, prompt for an image
  if (options.imageSelect || options.inBrowser) addStep('image-select', { selector: "#drop" });
  else if (options.imageUrl) loadImage(imageUrl);

  // soon, detect local or URL?
  function addStep(name, o) {
    console.log('adding step "' + name + '"');

    o = o || {};
    o.name = o.name || name;
    o.selector = o.selector || 'ismod-' + name;
    o.container = o.container || options.selector;

    var module = modules[name](o);

    steps.push(module);

    if (module.name !== "image-select") {

      // add a default UI, unless the module has one specified
      if (module.hasOwnProperty('setup')) module.setup();
      else {
        setup.apply(module); // run default setup() in scope of module (is this right?)
        function setup() {
          module.options.ui = options.ui({
            selector: o.selector
          });
        }
      }

      var previousStep = steps[steps.length - 2];

      if (previousStep) {
        // connect output of last step to input of this step
        previousStep.options.output = function output(image) {
          log('running module "' + name + '"');
          // display the image in any available ui
          if (previousStep.options.ui && previousStep.options.ui.display) previousStep.options.ui.display(image);
          module.draw(image);
        }
      }

    } else {

      module.setup(); // just set up initial ImageSelect

    }

    // Pre-set the initial output behavior of the final step, 
    // which will be changed if an additional step is added.
    module.options.output = function output(image) {
      if (module.options.ui && module.options.ui.display) module.options.ui.display(image);
    }

  }

  // passed image is optional but you can pass a 
  // non-stored image through the whole steps chain
  function run(image) {
    if (image) steps[1].draw(image);
    else steps[0].draw();
  }

  function log(msg) {
    $('.log').append(msg + ' at ' + new Date());
    console.log(msg);
  }

  // load default starting image
  // i.e. from parameter
  // this could send the image to ImageSelect, or something?
// not currently working
  function loadImage(src, callback) {
    image = new Image();
    image.onload = function() {
      run(image);
      if (callback) callback(image);
    }
    image.src = src;
  }

  return {
    loadImage: loadImage,
    addStep: addStep,
    run: run,
    modules: modules,
    steps: steps,
    ui: options.ui
  }

}

module.exports = ImageSequencer;
