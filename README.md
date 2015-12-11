# CnCNet Leaderboard
[![Build Status](https://travis-ci.org/sean3z/wol-ladder.svg?branch=develop)](https://travis-ci.org/sean3z/wol-ladder) [![PayPal donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5PWNYVG8W7UFS&lc=US&item_name=CnCNet%20leaderboard&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

This is an open source WOL leaderboard emulator for legacy [Westwood Studios](http://en.wikipedia.org/wiki/Westwood_Studios) games; specifically, those hosted by [CnCNet](http://cncnet.org). Ideally though, this application should work with any client sending WOLv1 or WOLv2 Game Resolution packets. This application serves several REST API endpoints (documented below) to consume and post leaderboard data.

### Games Supported
* [Red Alert](http://cncnet.org/leaderboard/#/ra)
* [Red Alert: The Aftermath](http://cncnet.org/leaderboard/#/am)
* [Tiberian Sun](http://cncnet.org/leaderboard/#/ts)
* [Tiberian Sun: Firestorm](http://cncnet.org/leaderboard/#/fs)
* [Red Alert 2](http://cncnet.org/leaderboard/#/ra2)
* [Yuri's Revenge](http://cncnet.org/leaderboard/#/yr)
* [Tiberian Dawn](http://cncnet.org/leaderboard/#/td)
* Dune 2000

### Usage
1. `npm install --production`
2. `grunt serve`

## REST API Endpoints
There's a few params listed below.

* `:game` can be any of the following `^(td|d2k?|ra2?|ts|dta|fs|yr|am)$`
* `:gameId` can only be numeric `(\d+)`
* `:player` and `:clan` can be alpha-numeric with some special characters `(\w\d\[\])`

###### General Endpoints
* GET `/ping` to ensure that the leaderboard is online

###### Leaderboard Endpoints
* POST `/ladder/:game` accepts gameres packet (via POST body) for the supplied `:game`
* GET `/ladder/:game` will return the top 150 leaderboard players for the supplied `:game`
* GET `/ladder/:game/game/:gameId` will return all data for a given `:gameId`
* GET `/ladder/:game/player/:player` will return most data for given `:player`

###### Clan Endpoints
URL `/ladder/:game/clan/:clan` is used for the following methods. Most of these endpoints require authorization similar to Player Authentication.
* `GET`  will return most data for the given `:clan` (does not require Auth)
* `PUT` create the given `:clan`
* `POST` will `join`, `part` or `modify` (supplied to `method` query) the given `:clan`
* `DELETE` permanently delete the given `:clan`

###### Player Authentication
* GET `/auth/:player` HTTP authentication using player credentials

Accounts can be created using the [CnCNet forum](http://cnc-comm.com/community/index.php?action=register). After an account has been created, users can then proceed to login using the GET `/auth/:player` endpoint. This is accomplished over [basic HTTP authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). An example login request would look similar to the following

_example player auth request_
```shell
curl -isu Tahj:MyPassword http://localhost:4007/auth/tahj3z
```

## Contributing
The below subjects outline how to extend the functionality of this project. Any help is warmly accepted and greatly appreciated! :)

#### Extending the Leaderboard UI
The web interface is primarily built in javascript using [Angular](https://angularjs.org/) and [Angular UI router](http://angular-ui.github.io/ui-router/site).

Development requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html) installed. If you're on OS X or Linux you probably already have Ruby installed; test with `ruby -v` in your terminal. When you've confirmed you have Ruby installed, run `gem install sass` to install Sass.

Afterwards, run `npm install` again to ensure you've installed all the devDependencies within package.json. Once all dependencies have been installed, run `grunt serve` and visit [http://localhost:4007/](http://localhost:4007/). The serve-app-dev task initiates watchers on the leaderboard apis and web ui, so any changes will trigger automatic restart or compile.

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
