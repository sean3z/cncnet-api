/***
*   Copyright 2014 Sean Wragg <seanwragg@gmail.com>
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*	   http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

var _database = require(__dirname +'/Database.js'),
	_player = require(__dirname +'/Player.js'),
	Q = require('q');

var Authentication = {
	/*** 
	 * username doesn't mean nick. players can auth using their credentials
	 * the ladder will track players via IP and add uid from wol_auth into wol_game_stats.uid
	 */
	identify: function(attempt) {
		this.deferred = Q.defer();
		var $this = this;

		if (!attempt.username || !attempt.password) {
			this.deferred.resolve({status: 401});
			return this.deferred.promise;
		}

		var query = _database.format(
			'SELECT uid FROM wol_auth WHERE username = ? and password = ?', 
			[attempt.username, attempt.password]
		);

		_database.query(query, function(err, data) {
			if (data.length < 1) {
				$this.deferred.resolve({status: 401});
			} else {
				$this.deferred.resolve({status: 200});
			}
		});


		return this.deferred.promise;
	},

	session: function() {

	}
};

module.exports = Authentication;