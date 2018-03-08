'use strict';
// if(window.location.pathname !== '/') {
page.base('/castr-client');
// }

page('/', ctx => app.monView.checkLocalStorage()); // main view logged in or not.
page('/mon/new', ctx => app.monView.initNewMon());  // create new pokemon.
page('/logout', ctx => app.monView.logout());
page('/mon/:mon_id/', ctx => app.monView.initDetailView()); // detail view after creating new.

page();

