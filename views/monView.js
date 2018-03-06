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
    app.Mon.all.map(mon => $('.pokemon-list').append(mon.toHtml()));
  };

  monView.initNewMon = () => {
    monView.reset();
    console.log('inside initNewMon');
    $('.new-mon-view').show();
    $('#new-mon-form').on('submit', monView.handleRequestNew);
  };

  monView.initDetailView = () => {
    monView.reset();
    $('.detail-view').show();
    $('#nick-name-input').on('submit', function(event) {
      event.preventDefault();

      // let mon = {
      //   mon_nick: event.target.....,
      //   mon_name: ,
      //   image_url: ,
      //   user_id: ,
      // };

      // module.Mon.create(mon);

    });
  };

  monView.initPickFightView = () => {
    monView.reset();
    $('.pick-fight-view').show();

  };

  monView.initFightView = () => {
    monView.reset();
    $('.fight-view').show();

  };

  // this method is invoked when the form of select dropdowns is submitted. It will create an api request to gather possible pokemon characters to then be assigned to the user based on their selections.
  monView.handleRequestNew = event => {
    event.preventDefault();
    // api request to get possible pokemon back. Will this be the fetchOne?
    app.Mon.getMonStats(event.target.pokeSelect.vakue);
  };

  module.monView = monView;
})(app);