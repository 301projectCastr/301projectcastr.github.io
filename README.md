# Pokemon Fight Club
## http://pokemonfight.club/ 

## Overview
This app is a fun Pokemon game, created as a final project for Code Fellows Code301 course.
The user creates a login name, then catches Pokemon, collects a list of them, and chooses individual Pokemon to battle against opponent Pokemon. The game tracks wins and losses, and allows the player to level up their Pokemon to increase their stats and their chances of winning future battles.

## Authors
* Jennifer Piper
* Carl Olson
* Kevin Farrow
* Ramon Mendoza
* Jose Flores

## Architecture
This is a single-page web app using Model-View-Controller architecture. The server and client concerns are separated into two different repositories. 

On the server side:
 * The server.js file coordinates Controller functionality, and uses:
   * *express.js* to handle client requests and responses
   * *CORS* for cross-origin resource sharing
   * *postgres* to handle database queries
   * *body-parser* to help parse the data for POST and PUT requests.
 
On the client side: 
 * Methods in the mon.js file send requests to the server and the Pokemon API, create and manipulate objects containing pokemon and user data, and compile Handlebars templates. 
 * Methods in the monView.js file coordinate showing the correct view to the user. 
 * routes.js handles client-side routing with Page.js.

## Getting Started
Follow these steps to set up this app locally:

Fork these two Git repositories:
* Client: https://github.com/301projectCastr/301projectcastr.github.io
* Server: 
https://github.com/301projectCastr/castr-server

In the same directory as server.js:
```
export PORT=3000
export CLIENT_URL=http://localhost:8080
export DATABASE_URL=postgres://localhost:5432/castr
```

Create a database named 'castr', and set it up with the following commands:

```
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE);

CREATE TABLE pokemon (mon_id SERIAL PRIMARY KEY, user_name VARCHAR(255) REFERENCES users(user_name), mon_nick VARCHAR(255), mon_name VARCHAR(255), type_one VARCHAR(255), type_two VARCHAR(255), image_url VARCHAR(255), wins INTEGER, losses INTEGER, levels INTEGER, hp_stat INTEGER, atk_stat INTEGER, def_stat INTEGER, satk_stat INTEGER, sdef_stat INTEGER, speed_stat INTEGER);
```

The local machine must have an installation of Node.js. In the directory containing package.json, install dependencies with:
```
npm install
```

## Resources

* jQuery: https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
* Handlebars.js: https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.min.js
* Page.js: https://cdn.rawgit.com/visionmedia/page.js/master/page.js
* CSS reset: http://meyerweb.com/eric/tools/css/reset/ 