'use strict';

page('/', ctx => app.monView.checkLocalStorage()); // main view logged in or not.
page('/mon/new', ctx => app.monView.initNewMon());  // create new pokemon.
page('/logout', ctx => app.monView.logout());
page('/mon/:mon_id/', ctx => app.monView.initDetailView()); // detail view after creating new.
page('/about_us', ctx => app.monView.aboutUsPage()); // about us page
page();
