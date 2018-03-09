'use strict';

var app = app || {};

(module => {
  const monView = {};

  monView.reset = () => {
    $('#user-pokemon-list').empty(); // Empty the pokemon list to prevent double appends.
    $('.container').hide(); // hide all containers
    $('.header').hide(); // hide stuff we don't want emptied as well
    $('.hidden').hide();
  };

  monView.initIndexPage = () => {
    monView.reset();
    $('#logout-button').hide();
    $('.logged-in-view').hide();
    $('.login-view').show();
    $('#login-form').on('submit', function(event) {
      localStorage.setItem('user', JSON.stringify((event.target.username.value).toLowerCase()));
      app.Mon.newUser(app.monView.checkLocalStorage);
    });
  };

  // monView.newUser = (callback) => {
  //   console.log(localStorage.user);
  //   $.post(`${__API_URL__}/${JSON.parse(localStorage.user)}`)
  //     .then(callback);
  //   // .catch(errorCallback);
  // };

  monView.initLoggedInView = () => {
    monView.reset();
    $('#logout-button').show();
    $('#user-pokemon-list').empty();
    $('.make-new-mon-button').show();
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
      $('#loading').show();
      let name = event.target.pokeSelect.value;
      if(name === 'random') name = Math.floor(Math.random() * Math.floor(800));
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
    let newMon = ctx;
    $('#detail-view-pokemon').empty();
    $('#nick-input').val('');
    $('.detail-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('#detail-view-pokemon').append(template(newMon));
    $('.view-mon-button').hide();
    $('.select-mon-button').on('click', function (event) { // add the listener
      event.preventDefault();
      //pass mon_id through the helper function and get an object out.
      module.monView.initPickFightView(monView.getMonById($(this).data('monid')));
    });
    if(newMon.wins > newMon.level - 1 )$('#levelup-button').show();
    $('#levelup-button').off('click');
    $('#levelup-button').on('click', function () {
      let statGainLimit = 10;
      console.log(newMon);
      console.log(Math.floor(Math.random() * Math.floor(statGainLimit)));
      newMon.hp_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.atk_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.def_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.satk_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.sdef_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.speed_stat += Math.floor(Math.random() * Math.floor(statGainLimit));
      newMon.levels ++;
      console.log(newMon);
      module.Mon.update(newMon);
    });
    $('#nick-update-form').off('submit');
    $('#nick-update-form').on('submit', function(event) {
      event.preventDefault();
      newMon.mon_nick = event.target.nickInput.value;
      module.Mon.update(newMon);
    });
    $('.delete-mon-button').off('click');
    $('.delete-mon-button').on('click', function () {
      module.Mon.retire($(this).data('monid'));
    });
  };

  monView.initPickFightView = monObj => {
    module.Mon.opponants = [];
    const pokeRange = 800;// 800 pokemon id range
    monView.reset();
    $('.opponents-list').empty();
    $('.pokemon-champ').empty();
    $('.pick-fight-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.pokemon-champ').append(template(monObj));
    $('.pokemon-champ .select-mon-button').hide();
    module.Mon.catchOne(Math.floor(Math.random() * Math.floor(pokeRange)), module.monView.populateOpp);
    module.Mon.catchOne(Math.floor(Math.random() * Math.floor(pokeRange)), module.monView.populateOpp);
    module.Mon.catchOne(Math.floor(Math.random() * Math.floor(pokeRange)), module.monView.populateOpp);
  };

  monView.initFightView = (champ, opponentName) => {
    let opponent = module.monView.getMonByName(opponentName);
    monView.reset();
    console.log(champ);
    console.log(opponent);
    $('.pokemon-challenger').empty();
    $('.opponent-view').empty();
    $('#fight-results').empty();
    $('.fight-view').show();
    $('#fight-button').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.pokemon-challenger').append(template(champ));

    $('.opponent-view').append(template(opponent));
    $('.fight-button-hide').hide();
    $('.opponent-view .poke-name').hide();
    $('#fight-button').off('click');
    $('#fight-button').on('click', function () {
      if(module.Mon.fight(champ, opponent) === champ) {
        $('#fight-results').text(`${champ.mon_nick} is the winner!`);
        $('#you-win-img').show();
        champ.wins ++;
      } else {
        $('#fight-results').text(`${opponent.mon_name} is the winner!`);
        // $('#they-win-img').show();
        champ.losses ++;
        console.log(champ);
      }
      $('#fight-button').hide();
    });
    $('#home-button').off('click');
    $('#home-button').on('click', function () {
      module.Mon.update(champ);
    });
  };

  monView.aboutUsPage = () => {
    monView.reset();
    $('.about-us').show();
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
    module.Mon.opponants.push(monObj);
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.opponents-list').append(template(monObj));
    $('.view-mon-button').hide();
    $('.delete-mon-button').hide();
    $('.opponents-list .poke-name').hide();
    $('.select-mon-button').off('click');
    $('.select-mon-button').on('click', function(event) {
      event.preventDefault();
      monView.initFightView(monView.getMonById($('.pokemon-champ .poke-card' ).data('monid')), $(this).data('name'));
    });
  };
  //Helper function to get a mon object from the mon id.
  monView.getMonById = mon_id => {
    let monObj;
    for(let i in module.Mon.all) {
      if(module.Mon.all[i].mon_id === mon_id) monObj = module.Mon.all[i];
    }
    return monObj;
  };
  //Helper function to grab a pokemon by name from the opp array.
  monView.getMonByName = mon_name => {
    let monObj;
    for(let i in module.Mon.opponants) {
      if(module.Mon.opponants[i].mon_name === mon_name) monObj = module.Mon.opponants[i];
    }
    return monObj;
  };

  module.monView = monView;
})(app);
