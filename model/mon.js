'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';
var __POKE_API__= 'http://pokeapi.co/api/v2/';

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
    return template(this);
  };

  Mon.all = [];

  Mon.loadAll = rows => Mon.all = rows.sort((a, b) => b.mon_id - a.mon_id).map(mon => new Mon(mon));

  Mon.catchOne = name =>
    $.get(`${__POKE_API__}pokemon/${name}/`)
      .then(results => {
        let mon_name = results.name;
        let image_url = results.sprites.front_default;
        let hp_stat = results.stats[5].base_stat;
        let atk_stat = results.stats[4].base_stat;
        let def_stat = results.stats[3].base_stat;
        let satk_stat = results.stats[2].base_stat;
        let sdef_stat = results.stats[1].base_stat;
        let speed_stat = results.stats[0].base_stat;
      });

  Mon.fetchAll = callback =>
    $.get(`${__API_URL__}/api/v1/mon`)
      .then(Mon.loadAll)
      .then(callback)
      .catch(errorCallback);

  Mon.fetchOne = (ctx, callback) =>
    $.get(`${__API_URL__}/api/v1/mon/${ctx.params.mon_id}`)
      .then(results => ctx.mon = results[0])
      .then(callback)
      .catch(errorCallback);

  Mon.create = (obj, callback) => {
    let mon = {
      user_id: user_id, 
      mon_nick: obj.mon_nick ? obj.mon_nick : '', 
      mon_name: obj.mon_name, 
      image_url: obj.image_url,
      wins: wins ? obj.wins : 0, 
      losses: losses ? obj.losses : 0, 
      levels: levels ? obj.levels : 1, 
      hp_stat: obj.hp_stat, 
      atk_stat: obj.atk_stat, 
      def_stat: obj.def_stat, 
      satk_stat: obj.satk_stat, 
      sdef_stat: obj.sdef_stat, 
      speed_stat: obj.speed_stat
    }
    $.post(`${__API_URL__}/mon`, mon)
      .then(callback)
      .catch(errorCallback);
  }

  Mon.update = (mon, monId) =>
    $.ajax({
      url: `${__API_URL__}/api/v1/mon/${monId}`,
      method: 'PUT',
      data: mon
    })
      .then(() => page(`/mon/${monId}`))
      .catch(errorCallback);

  Mon.retire = id =>
    $.ajax({
      url: `${__API_URL__}/api/v1/mon/${id}`,
      method: 'DELETE',
    })
      .then(() => page('/'))
      .catch(errorCallback);
  module.Mon = Mon;

})(app);