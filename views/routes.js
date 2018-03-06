'use strict';

// page('/', ctx => ); // main view logged in or not.
page('/mon/new', ctx => app.monView.initNewMon(ctx));  // create new pokemon.
// page('/mon/:mon_id/', ctx => ); // detail view after creating new.
// page('/mon/:mon_id/delete', ctx => ); // delete pokemon from user profile/db.
// page('/pick_fight', ctx => ); // pick fight page.
// page('/fight', ctx => ); // fight page.

page('/', () => app.Mon.getMonStats('ralts'));
page('/mon', () => app.Mon.getMonStats('ralts'));
page();