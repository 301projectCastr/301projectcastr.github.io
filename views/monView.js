'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('#user-pokemon-list').empty(); // Empty the pokemon list to prevent double appends.
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
  };

  monView.initIndexPage = () => {
    monView.reset();
    $('.logged-in-view').hide();
    $('.login-view').show();
    $('#login-form').on('submit', function(event) {
      event.preventDefault();
      localStorage.setItem('user', JSON.stringify((event.target.username.value).toLowerCase()));
      monView.newUser(monView.checkLocalStorage);
    });
  };

  monView.newUser = (callback) => {
    console.log(localStorage.user);
    $.post(`${__API_URL__}/${JSON.parse(localStorage.user)}`)
      .then(callback);
    // .catch(errorCallback);
  };

  monView.initLoggedInView = () => {
    monView.reset();
    $('#user-pokemon-list').empty();
    $('.pokemon-list').show();
    app.Mon.all.map(mon => $('.pokemon-list').append(mon.toHtml()));
    $('.select-mon-button').off('click'); // Remove any listeners on the object
    $('.select-mon-button').on('click', function (event) { // add the listener
      event.preventDefault();
      module.monView.initPickFightView(monView.getMonById($(this).data('monid'))); //pass mon_id through the helper function and get an object out. 
    });
    $('.view-mon-button').on('click', function (event) {
      event.preventDefault();
      module.monView.initDetailView(monView.getMonById($(this).data('monid'))); //pass mon_id through the helper function and get an object out. 
    });
    $('.delete-mon-button').off('click');
    $('.delete-mon-button').on('click', function () {
      module.Mon.retire($(this).data('monid'));
    });
  };

  monView.initNewMon = () => {
    monView.reset();
    $('.make-new-mon-button').hide();
    $('.pokemon-list').hide();
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
          module.Mon.create(newMon, module.Mon.fetchLast, module.monView.initDetailView);
        });
    });
  };

  monView.initDetailView = (ctx) => {
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

  monView.initPickFightView = monObj => {
    monView.reset();
    $('.pick-fight-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.pokemon-champ').append(template(monObj));
    $('.pokemon-champ .select-mon-button').hide();
    $('.view-mon-button').hide();
    $('.delete-mon-button').hide();
    module.Mon.catchOne('pikachu', module.monView.populateOpp);
    $('.view-mon-button').hide(); // Repeated because the api calls happen after the inital hide
    $('.delete-mon-button').hide(); // Dosen't work
    module.Mon.catchOne('axew', module.monView.populateOpp);
    $('.view-mon-button').hide(); // Repeated because the api calls happen after the inital hide
    $('.delete-mon-button').hide();
    module.Mon.catchOne('mew', module.monView.populateOpp);
    $('.view-mon-button').hide(); // Repeated because the api calls happen after the inital hide
    $('.delete-mon-button').hide();
    $('.select-mon-button').off('click');
    $('.select-mon-button').on('click', function(event) {
      event.preventDefault();
      monView.initFightView(monObj, monView.getMonById($(this).data('monid')));
    });
  };

  monView.initFightView = (champ, opponent) => {
    monView.reset();
    $('.fight-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.pokemon-challenger').append(template(champ));
    template = Handlebars.compile($('#poke-card-template').text());
    $('.opponent-view').append(template(opponent));
  };

  monView.checkLocalStorage = () => {
    if (localStorage.user) {
      console.log('local storage - yes');
      app.Mon.fetchAll(monView.initLoggedInView);
    } else {
      console.log('local storage - no');
      monView.initIndexPage();
    }
  };

  monView.logout = () => {
    localStorage.clear();
    window.location = '../';
  };

  monView.populateOpp = monObj => {
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.opponents-list').append(template(monObj));
  };
  //Helper function to get a mon object from the mon id.
  monView.getMonById = mon_id => {
    let monObj;
    for(let i in module.Mon.all) {
      if(module.Mon.all[i].mon_id === mon_id) monObj = module.Mon.all[i];
    }
    return monObj;
  };

  module.monView = monView;
})(app);