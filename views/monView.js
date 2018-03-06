'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('.container').empty(); // remove any content in existing containers
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
  };

  monView.initLogedInView = function() {
    monView.reset();
    $('.loggedInView').show();
    // create pokemon list.
  };

  monView.initPickFIghtView = function() {
    monView.reset();
    
  };

  module.monView = monView;
});