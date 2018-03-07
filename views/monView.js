'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('#user-pokemon-list').empty();
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
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
    console.log('showing logged in view');
    app.Mon.all.map(mon => $('.pokemon-list').append(mon.toHtml()));
    console.log('after html template should be filled');
  };

  monView.initNewMon = () => {
    monView.reset();
    $('.new-mon-view').show();
    $('#new-mon-form').off('submit');
    $('#new-mon-form').on('submit', function (event) {
      event.preventDefault();
      let name = event.target.pokeSelect.value;
      $.get(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        .then( results => {
          let newMon = {
            user_name: JSON.parse(localStorage.user),
            mon_name: results.name,
            image_url: results.sprites.front_default,
            type_one: results.types[0].type.name,
            type_two: results.types[1] ? results.types[1].type.name : '',
            speed_stat: results.stats[0].base_stat,
            sdef_stat: results.stats[1].base_stat,
            satk_stat: results.stats[2].base_stat,
            def_stat: results.stats[3].base_stat,
            atk_stat: results.stats[4].base_stat,
            hp_stat: results.stats[5].base_stat
          };
          console.log(newMon);
          module.Mon.create(newMon, module.Mon.fetchLast(module.monView.initDetailView));
        });
    });
  };

  monView.initDetailView = (ctx) => {
    console.log(ctx);
    monView.reset();
    $('.detail-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.detail-view').append(template(ctx));
    $('#nick-update-form').off('submit');
    $('#nick-update-form').on('submit', function(event) {
      event.preventDefault();
      let newMon = ctx;
      newMon.mon_nick = event.target.nickInput.value;
      module.Mon.update(newMon);
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
      app.Mon.fetchAll(monView.initLoggedInView());
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