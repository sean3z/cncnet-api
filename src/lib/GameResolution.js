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

// WOL Game Resolution interpreter
var GameResolution = {
	parse: function(packet) {

		var buffer = packet;
		if (typeof packet == 'string') {
			// remove any unnessiccary whitespace
			packet = packet.replace(/(\r|\n|\r\n|\s+)/gm, '');
			buffer = new Buffer(packet, 'hex');
		}

		var slice = buffer.slice(0, 4), 
			bufferLength = slice.readUInt16BE(0) - 4,
			flat = {}, i = 4;

		while (i < bufferLength) {
			var chunk = buffer.slice(i,  i + 4),
				field = chunk.toString();

			i += 4;

			chunk = buffer.slice(i, i + 8);
				
			var type = chunk.readUInt16BE(0),
				length = chunk.readUInt16BE(2),
				data = '';

			i += 4;

			if (length > 0) {

				var end = i + length >= bufferLength ? bufferLength : i + length;
				if (i < end) {
					data = this.type(type, buffer.slice(i, end));
				}
				
				length = Math.ceil(length / 4) * 4;
				i += length;
			}
			
			flat[field] = data;
		}

		return this.consolidate(flat);
	},

	consolidate: function(flat) {
		var consolidated = {players: {}};
		
		if (flat.NAM0 || flat.NAM1) {
			for (var key in flat) {
				var val = flat[key], index = parseInt(key.slice(-1));

				if (index > -1) {
					if (!consolidated.players[index]) consolidated.players[index] = {};
					consolidated.players[index][key.slice(0, -1)] = val;
				} else {
					consolidated[key] = val;
				}
			}
		}

		return consolidated;
	},

	// WOL field type interpretter
	type: function (type, chunk) {
		var data = 'Unprocessed';
		/***
			[15:37:56] <CCHyper> 5 = long
			[15:38:07] <CCHyper> 4 = unsigned short
			[15:38:14] <CCHyper> 3 = short
			[15:39:10] <CCHyper> 1 = byte
		*/

		switch (type) {
			case 2:
				// [15:39:24] <CCHyper> 2 = boolean
				data = chunk.readInt8(0) > 0 ? 1 : 0;
			break;

			case 5:
			case 6:
				// [15:37:49] <CCHyper> 6 = ulong/ unsigned long
				data = chunk.readUInt32BE(0);
			break;

			case 20:
				// [15:39:34] <CCHyper> 20 is a string
				// [15:40:28] <CCHyper> 0x14 is qword
				var _data = 0, x = -1;
				for (var i = 0; i < chunk.length; i += 4) {
					var end = i + 4 >= chunk.length ? chunk.length : i + 4;
					var slice = chunk.slice(i, end);
					_data += slice.readUInt32BE(0);
				}
				data = _data;
			break;

			case 7:
				// [15:38:35] <CCHyper> 7= char
				data = chunk.toString('ascii').replace('\u0000', ''); // charCode(0) at end of string
				if (data == "ON") data = 1;
				else if (data == "OFF") data = 0;
			break;
		}

		return data;
	},
};

module.exports = GameResolution;