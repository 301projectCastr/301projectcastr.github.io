'use strict';

var app = app || {};

(function (module) {
  const errorView = {};

  errorView.initErrorPage = function(err) {
    $('.container').hide();
    $('.errorView').show();
    $('#errorMessage').empty();
    let template = Handlebars.compile($('#errTemplate').text());
    $('#errorMessage').append(template(err));
  };

  module.errorView = errorView;
})(app);