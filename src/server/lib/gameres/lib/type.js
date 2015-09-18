/* WOL field type interpreter */
module.exports = function _type(type, chunk) {
    var data = 'Unprocessed Type';

    switch (type) {
        case 1:
            // [15:39:10] <CCHyper> 1 = byte
            data = chunk.readInt8(0);
        break;

        case 2:
            // [15:39:24] <CCHyper> 2 = boolean
            data = chunk.readInt8(0) > 0 ? 1 : 0;
        break;

        case 3:
            // [15:38:14] <CCHyper> 3 = short
            data = chunk.readInt16BE(0);
        break;

        case 4:
            // [15:38:07] <CCHyper> 4 = unsigned short
            data = chunk.readUInt16BE(0);
        break;

        case 5:
            // [15:37:56] <CCHyper> 5 = long
            data = chunk.readInt32BE(0);
        break;

        case 6:
            // [15:37:49] <CCHyper> 6 = ulong/ unsigned long
            data = chunk.readUInt32BE(0);
        break;

        case 7:
            // [15:38:35] <CCHyper> 7= char
            data = chunk.toString('ascii').replace('\u0000', ''); // charCode(0) at end of string
            if (data == "ON") data = 1;
            else if (data == "OFF") data = 0;
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
    }

    return data;
}
