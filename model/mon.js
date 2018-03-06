'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Mon(rawMonObj) {
    Object.keys(rawMonObj).forEach(key => this[key] = rawMonObj[key]);
  }

  Mon.all = [];

  Mon.loadAll = rows => Mon.all = rows.sort((a, b) => b.mon_id - a.mon_id).map(mon => new Mon(mon));

  Mon.fetchAll = callback =>
    $.get(`${__API_URL__}/`)
      .then(Mon.loadAll)
      .then(callback)
      .catch(errorCallback);






  module.Mon = Mon;
})(app)