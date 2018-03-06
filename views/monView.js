'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('.container').empty(); // remove any content in existing containers
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
  };

  monView.initLoggedInView = () => {
    monView.reset();
    $('.loggedInView').show();
    // create pokemon list.
  };

  monView.initNewMon = () => {
    monView.reset();
    $('.new-mon-view').show();
    
  };

  monView.initPickFightView = () => {
    monView.reset();
    $('.pick-fight-view').show();

  };

  monView.initFightView = () => {
    monView.reset();
    $('.fight-view').show();

  };



  module.monView = monView;
})(app);