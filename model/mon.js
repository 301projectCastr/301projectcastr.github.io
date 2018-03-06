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

  Mon.create = mon =>
    $.post(`${__API_URL__}/api/v1/mon`, mon)
      .then(() => page('/'))
      .catch(errorCallback);

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