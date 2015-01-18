## Westwood Online (WOL) Ladder
This is an open source WOL Game Resolution emulator for legacy Command and Conquer games. Ideally, this app should work with any system sending WOLv1 or WOLv2 gameres packets - including Game Resolution UDP requests sent by the game clients. This app has several REST API endpoints to consume and post ladder data which are documented below.

### Games Supported
* Yuri's Revenge
* Red Alert 2
* Firestorm
* Tiberian Sun
* Red Alert 1
* Dune 2k
* Tiberian Dawn

### Usage
1. `npm install`
2. Install `_install/wol.sql`
3. Configure `src/config.js`
4. `npm start`

### API Endpoints
There's a few params listed below.

* `:game` can be any of the following `(td|d2k|ra|ts|fs|ra2|yr)`
* `:gameId` can only be numeric `(0-9)`
* `:player` can be alpha-numeric with some special characers `(\w\d\[\])`

##### General Endpoints
* GET `/ping` to ensure that the ladder is online

##### Game Endpoints
* GET `/ladder/:game` will return the top 250 ladder results for the supplied `:game`
* POST `/ladder/:game` accepts gameres packet (via POST body) for the supplied `:game`
* GET `/ladder/:game/games` will return the latest 250 games played for the given `:game`
* GET `/ladder/:game/games/:gameId` will return all data for a given `:gameId`

##### Player Endpoints
* PUT `/ladder/:game/player/:player` will create the given `:player`
* GET `/ladder/:game/player/:player` will return most data for given `:player` 
* DELETE `/ladder/:game/player/:player` will delete the given `:player`

##### Auth Endpoints
* GET `/auth/:game` basic HTTP authentication using credentials supplied during player creation

#### Player Creation
Player creation is optional as the ladder will accept results from players that are not authenticated. And although the database _will_ flag authenticated players, users can still impersonate one another (by playing as someone else). However, since the games are auth distingushed, it will be up to the API consumer to determine whether to display any games featuring unauthenticated players. 

Players can be created using the PUT `/ladder/:game/player/:player` endpoint. This endpoint expects a JSON request body containing at least `username`, `password` and `email` fields. Other fields to help uniquely identify players can be added but, are currently ignored.

After a player has been created, they can then proceed to login using the GET `/auth/:game` endpoint. This is accomplished over [basic HTTP authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). An example login request would look similar to the following

```shell
$ curl -isu Tahj:MySecretPassword http://localhost:4007/auth/ts
```