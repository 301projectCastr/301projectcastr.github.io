'use strict';

var app = app || {};
// var __API_URL__ = 'http://localhost:3000';
var __API_URL__ = 'https://code301-project-castr.herokuapp.com';
var __POKE_API__= 'https://pokeapi.co/api/v2/';


(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Mon(rawMonObj) {
    Object.keys(rawMonObj).forEach(key => this[key] = rawMonObj[key]);
  }

  Mon.prototype.toHtml = function() {
    let template = Handlebars.compile($('#poke-card-template').text());
    $('#user-pokemon-list').append(template(this));
  };

  Mon.all = [];
  Mon.opponants = [];

  Mon.loadAll = rows => Mon.all = rows.sort((a, b) => b.mon_id - a.mon_id).map(mon => new Mon(mon));

  Mon.catchOne = (name, callback) =>
    $.get(`${__POKE_API__}pokemon/${name}/`)
      .then(results => results = {
        mon_name: results.name,
        image_url: results.sprites.front_default,
        type_one: results.types[0].type,
        type_two: results.types[1] ? results.types[1].type.name : '',
        hp_stat: results.stats[5].base_stat,
        atk_stat: results.stats[4].base_stat,
        def_stat: results.stats[3].base_stat,
        satk_stat: results.stats[2].base_stat,
        sdef_stat: results.stats[1].base_stat,
        speed_stat: results.stats[0].base_stat
      })
      .then(callback)
      .catch(errorCallback);

  Mon.fetchAll = callback =>
    $.get(`${__API_URL__}/api/v1/mon/${JSON.parse(localStorage.user)}`)
      .then(Mon.loadAll)
      // .then(console.log(Mon.all))
      .then(callback)
      .catch(errorCallback);
  
  Mon.fetchLast = callback => {
    console.log('in fetchLast');
    $.get(`${__API_URL__}/fetchLast`)
      .then(callback);
  };

  Mon.create = (obj, callback, callback2) => {
    console.log('in create');
    let mon = {
      user_name: obj.user_name,
      mon_nick: obj.mon_nick ? obj.mon_nick : '',
      mon_name: obj.mon_name,
      image_url: obj.image_url,
      type_one: obj.type_one,
      type_two: obj.type_two ? obj.type_two : '',
      wins: obj.wins ? obj.wins : 0,
      losses: obj.losses ? obj.losses : 0,
      levels: obj.levels ? obj.levels : 1,
      hp_stat: obj.hp_stat,
      atk_stat: obj.atk_stat,
      def_stat: obj.def_stat,
      satk_stat: obj.satk_stat,
      sdef_stat: obj.sdef_stat,
      speed_stat: obj.speed_stat
    };
    console.log(mon);
    $.post(`${__API_URL__}/mon`, mon)
      .then(callback(callback2))
      .catch(errorCallback);
  };

  Mon.update = mon =>
    $.ajax({
      url: `${__API_URL__}/update/`,
      method: 'PUT',
      data: mon
    })
      .then(() => page(`/`))
      .catch(errorCallback);

  Mon.retire = monid =>
    $.ajax({
      url: `${__API_URL__}/api/v1/mon/delete/${monid}`,
      method: 'DELETE'
    })
      .then(() => page('/'))
      .catch(errorCallback);

  module.Mon = Mon;

})(app);