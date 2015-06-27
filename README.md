# Westwood Online (WOL) Leaderboard
[![Build Status](https://travis-ci.org/sean3z/wol-ladder.svg?branch=develop)](https://travis-ci.org/sean3z/wol-ladder) [![PayPal donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5PWNYVG8W7UFS&lc=US&item_name=Westwood%20Online%20leaderboard&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

This is an open source WOL leaderboard emulator for legacy [Westwood Studios](http://en.wikipedia.org/wiki/Westwood_Studios) games; specifically, those hosted by [CnCNet](http://cncnet.org). Ideally though, this application should work with any client sending WOLv1 or WOLv2 Game Resolution packets. This application serves several REST API endpoints (documented below) to consume and post leaderboard data.

### Games Supported
* [Red Alert 2](http://en.wikipedia.org/wiki/Command_%26_Conquer:_Red_Alert_2)
* [Yuri's Revenge](http://en.wikipedia.org/wiki/Command_%26_Conquer:_Yuri%27s_Revenge)
* [Tiberian Sun](http://en.wikipedia.org/wiki/Command_%26_Conquer:_Tiberian_Sun)
* [Firestorm](http://en.wikipedia.org/wiki/Command_%26_Conquer:_Tiberian_Sun#Firestorm)
* [Red Alert 1](http://en.wikipedia.org/wiki/Command_%26_Conquer:_Red_Alert)
* [Dune 2000](http://en.wikipedia.org/wiki/Dune_2000)
* [Tiberian Dawn](http://en.wikipedia.org/wiki/Command_%26_Conquer)

### Usage
1. `npm install --production`
2. `grunt serve`

## REST API Endpoints
There's a few params listed below.

* `:game` can be any of the following `(td|d2k?|ra2?|ts|fs|yr)`
* `:gameId` can only be numeric `(\d+)`
* `:player` can be alpha-numeric with some special characers `(\w\d\[\])`

###### General Endpoints
* GET `/ping` to ensure that the leaderboard is online

###### Leaderboard Endpoints
* POST `/ladder/:game` accepts gameres packet (via POST body) for the supplied `:game`
* GET `/ladder/:game` will return the top 150 leaderboard players for the supplied `:game`
* GET `/ladder/:game/game/:gameId` will return all data for a given `:gameId`
* GET `/ladder/:game/player/:player` will return most data for given `:player`

###### Player Creation
* PUT `/auth/:game/:player` player creation

Player creation is optional as the leaderboard will accept results from players that are not authenticated. And although the database _will_ flag authenticated players, users can still impersonate one another (by playing as someone else). However, since the games are auth distingushed, it will be up to the API consumer to determine whether to display any games featuring unauthenticated players.

Players can be created using the PUT `/auth/:game/:player` endpoint. This endpoint expects a `form-data` request containing at least `username`, `password` and `email` (_not_ URL encoded) fields to establish an account. Other fields to help uniquely identify accounts will eventually be added but, are currently ignored.

_example player creation request_
```shell
curl -X PUT -H "Content-Type: multipart/form-data" -F "username=Tahj" -F "password=MyPassword" -F "email=tahj.kirk@gmail.com" http://localhost:4007/auth/ts/tahj3z
```

If this is the first player registration for the user, the account will be stored using the credentials provided. If the account has been previously registered, the new `:player` will be associated with the account as long as the credentials provided are correct.

###### Player Authentication
* GET `/auth/:game/:player` HTTP authentication using player credentials

After a player has been created, they can then proceed to login using the GET `/auth/:game/:player` endpoint. This is accomplished over [basic HTTP authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). An example login request would look similar to the following

_example player auth request_
```shell
curl -isu Tahj:MyPassword http://localhost:4007/auth/ts/tahj3z
```

## Contributing
The below subjects outline how to extend the functionality of this project. Any help is warmly accepted and greatly appreciated! :)

#### Extending the Leaderboard UI
The web interface is primarily built in javascript using [Angular](https://angularjs.org/) and [Angular UI router](http://angular-ui.github.io/ui-router/site).

Development requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html) installed. If you're on OS X or Linux you probably already have Ruby installed; test with `ruby -v` in your terminal. When you've confirmed you have Ruby installed, run `gem install sass` to install Sass.

Afterwards, run `npm install` again to ensure you've installed all the devDependancies within package.json. Once all dependencies have been installed, run `grunt serve-app-dev` and visit [http://localhost:4007/](http://localhost:4007/). The serve-app-dev task initiates watchers on the leaderboard apis and web ui, so any changes will trigger automatic restart or compile.

#### Debugging
_Windows_
```shell
set DEBUG=wol:leaderboard,-not-this
grunt serve
```

_Mac_
```shell
DEBUG=wol:leaderboard grunt serve
```

#### MongoDB
Leaderboard stats are stored via [MongoDB](https://www.mongodb.org/). You'll need this installed for local development. You can start Mongo using the following command.
```shell
mongod --dbpath data/db
```
