'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
    if (localStorage.user) {

    }
  };

  monView.initIndexPage = () => {
    monView.reset();
    $('.login-view').show();
    $('#login-form').on('submit', function(event) {
      console.log('button submitted');
      event.preventDefault();
      localStorage.setItem('user', JSON.stringify(event.target.username.value));
      monView.newUser();
    });
  };


  monView.newUser = () => {
    console.log(localStorage.user);
    $.post(`${__API_URL__}/${JSON.parse(localStorage.user)}`)
      .then(() => page('/'));
      // .catch(errorCallback);
  };


  monView.initLoggedInView = () => {
    monView.reset();
    $('.loggedInView').show();

    // create pokemon list.
    app.Mon.all.map(mon => $('.pokemon-list').append(mon.toHtml()));
  };

  monView.initNewMon = () => {
    monView.reset();
    $('.new-mon-view').show();
    $('#new-mon-form').on('submit', monView.handleRequestNew); // It's possible this handler could be replaced with fetchOne?
  };

  monView.initDetailView = () => {
    monView.reset();
    $('.detail-view').show();
    $('#nick-name-input').on('submit', function(event) {
      event.preventDefault();

      app.Mon.update();

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
    app.Mon.fetchOne(ctx, callback)
    // run logic on the full results to filter based on the val()s from the dropdowns. Does this happen in the fetchOne method?
    // once a specific character has been chosen, go to the detail page to choose nick...page('/mon/:mon_id/'));
  };

  monView.checkLocalStorage = () => {
    if (localStorage.user) {
      console.log('local storage - yes');
      monView.initLoggedInView();
    } else {
      console.log('no local storage');
      monView.initIndexPage();
    }
  };

  monView.logout = () => {
    localStorage.clear();
    window.location = '../';
  };


  module.monView = monView;
})(app);