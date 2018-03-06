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
    $('.new-mon-view').show();
    $('#new-mon-form').on('submit', function (event) {
      let name = event.target.pokeSelect.vakue;
      $.get(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        .then( results => {
          let newMon = {
            user_id: JSON.parse(localStorage.user),
            mon_name: results.name,
            image_url: results.sprites.front_default,
            speed_stat: results.stats[0].base_stat,
            sdef_stat: results.stats[1].base_stat,
            satk_stat: results.stats[2].base_stat,
            def_stat: results.stats[3].base_stat,
            atk_stat: results.stats[4].base_stat,
            hp_stat: results.stats[5].base_stat
          };
          module.Mon.create(newMon, module.monView.initDetailView);
        });
    });
  };

  monView.initDetailView = (obj) => {
    monView.reset();
    $('.detail-view').show();
    let template = Handlebars.compile($('#poke-card-template').text());
    $('.detailView').append(template(obj));
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