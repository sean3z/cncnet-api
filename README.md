# CnCNet Leaderboard
![Coverage Status](https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_90.svg) [![PayPal donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5PWNYVG8W7UFS&lc=US&item_name=CnCNet%20leaderboard&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

This is an open source WOL leaderboard emulator for legacy [Westwood Studios](http://en.wikipedia.org/wiki/Westwood_Studios) games; specifically, those hosted by [CnCNet](http://cncnet.org). Ideally though, this application should work with any client sending WOLv1 or WOLv2 Game Resolution packets. This application serves several REST API endpoints (documented below) to consume and post leaderboard data.

### Games Supported
* [Red Alert](http://ladder.cncnet.org/#/ra)
* [Red Alert: The Aftermath](http://ladder.cncnet.org/#/am)
* [Tiberian Sun](http://ladder.cncnet.org/#/ts)
* [Tiberian Sun: Firestorm](http://ladder.cncnet.org/#/fs)
* [Red Alert 2](http://ladder.cncnet.org/#/ra2)
* [Yuri's Revenge](http://ladder.cncnet.org/#/yr)
* [Tiberian Dawn](http://ladder.cncnet.org/#/td)
* Dune 2000

### Usage
1. `npm install --production`
2. `npm start`

## REST API Endpoints
There's a few params listed below.

* `:game` can be any of the following `^(td|d2k?|ra2?|ts|dta|fs|yr|am)$`
* `:gameId` can only be numeric `(\d+)`
* `:player` and `:clan` can be alpha-numeric with some special characters `(\w\d\[\])`

###### General Endpoints
* GET `/ping` to ensure that the server is online

###### Leaderboard Endpoints
* POST `/ladder/:game` accepts gameres packet (via POST body) for the supplied `:game`
* GET `/ladder/:game` will return the top 150 leaderboard players for the supplied `:game`
* GET `/ladder/:game/game/:gameId` will return all data for a given `:gameId`
* GET `/ladder/:game/player/:player` will return most data for given `:player`

###### Clan Endpoints
URL `/ladder/:game/clan/:clan` is used for the following methods. Most of these endpoints require authorization similar to Player Authentication.
* `GET`  will return most data for the given `:clan` (does not require auth)
* `PUT` create the given `:clan`
* `POST` will `join`, `part` or `modify` (supplied to `action` query) the given `:clan`
* `DELETE` permanently delete the given `:clan`

###### Player Authentication
* GET `/auth/:player` HTTP authentication using Account credentials

Successful authentication of this endpoint will return an [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) which can be used to call subsequent endpoints which require auth. This endpoint uses [basic HTTP authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). 

_example player auth request_
```shell
curl -isu Tahj:MyPassword http://localhost:4007/auth/tahj3z
```

###### Account Creation
* PUT `/auth/:player` using HTTP authentication

Accounts can be created using this endpoint. After an account has been created, users can then proceed to login using the [Player Authentication]() endpoint above. Future iterations will allow consumers to additionally update Account information using this endpoint.

## Contributing
The below subjects outline how to extend the functionality of this project. Any help is warmly accepted and greatly appreciated! :)

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
