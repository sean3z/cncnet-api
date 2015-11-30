'use strict';

// Champions controller
angular.module('Champions').controller('ChampionsController', ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {

        // Until we have game names in our response
        switch($stateParams.game) {
            case 'ts':
                $scope.abbr = 'ts';
                $scope.game = 'Tiberian Sun';
                break;
            case 'tsm':
                $scope.abbr = 'tsm';
                $scope.game = 'Tiberian Sun - (mod maps)';
                break;
            case 'ra':
                $scope.abbr = 'ra';
                $scope.game = 'Red Alert';
                break;
            case 'yr':
                $scope.abbr = 'yr';
                $scope.game = 'Yuri\'s Revenge';
                break;
            case 'fs':
                $scope.abbr = 'fs';
                $scope.game = 'Firestorm';
                break;
            case 'am':
                $scope.abbr = 'am';
                $scope.game = 'Aftermath';
                break;
            case 'ra2':
                $scope.abbr = 'ra2';
                $scope.game = 'Red Alert 2';
                break;
            case 'dta':
                $scope.abbr = 'dta';
                $scope.game = 'The Dawn of the Tiberium Age';
                break;
            default:
                $scope.game = 'Global';
        }

        $scope.champions = {};
        $scope.champions['ts'] = [
  {
    "_id": "563bca362273e407b4a8074c",
    "name": "kaizen",
    "uid": 7413,
    "avatar": "",
    "wins": 111,
    "losses": 3,
    "disconnects": 1,
    "points": 1449,
    "rank": 1
  },
  {
    "_id": "5633c0282273e407b4a800a5",
    "name": "sexpro",
    "uid": 9536,
    "avatar": "",
    "points": 1358,
    "wins": 78,
    "losses": 9,
    "disconnects": 0,
    "oos": 0,
    "rank": 2
  },
  {
    "_id": "5633bf692273e407b4a8007c",
    "name": "wolfhound",
    "uid": 9535,
    "avatar": "",
    "points": 1288,
    "wins": 87,
    "losses": 39,
    "disconnects": 5,
    "oos": 1,
    "activity": 1448788190,
    "rank": 3
  },
  {
    "_id": "563c4c892273e407b4a80820",
    "name": "`carnage^",
    "uid": 6235,
    "avatar": "",
    "wins": 37,
    "losses": 15,
    "disconnects": 3,
    "points": 1256,
    "oos": 0,
    "rank": 4
  },
  {
    "_id": "563813a82273e407b4a80665",
    "name": "jimmyjohns",
    "uid": 6210,
    "avatar": "Musicians/Bob_Marley.jpg",
    "wins": 18,
    "losses": 3,
    "disconnects": 0,
    "points": 1182,
    "oos": 0,
    "rank": 5
  },
  {
    "_id": "564382712273e407b4a814fb",
    "name": "alter3go",
    "uid": 9813,
    "avatar": "",
    "wins": 22,
    "losses": 7,
    "disconnects": 0,
    "points": 1160,
    "oos": 0,
    "rank": 6
  },
  {
    "_id": "563cef792273e407b4a8097f",
    "name": "xciting",
    "uid": 9619,
    "avatar": "",
    "wins": 19,
    "losses": 4,
    "disconnects": 0,
    "points": 1136,
    "rank": 7
  },
  {
    "_id": "56429b5d2273e407b4a81460",
    "name": "kapa371",
    "uid": 6141,
    "avatar": "",
    "wins": 8,
    "losses": 2,
    "disconnects": 0,
    "points": 1130,
    "oos": 0,
    "rank": 8
  },
  {
    "_id": "5634e0692273e407b4a805bd",
    "name": "mynodname",
    "uid": 6124,
    "avatar": "",
    "points": 1113,
    "wins": 8,
    "losses": 0,
    "disconnects": 0,
    "oos": 0,
    "rank": 9
  },
  {
    "_id": "5641216b2273e407b4a81233",
    "name": "jigsaw",
    "uid": 9366,
    "avatar": "",
    "wins": 13,
    "losses": 5,
    "disconnects": 1,
    "oos": 1,
    "points": 1112,
    "rank": 10
  }
];

        $scope.champions['ra'] = [
  {
    "_id": "5644434b2273e407b4a815cc",
    "name": "ehy",
    "uid": 836,
    "avatar": "",
    "wins": 41,
    "losses": 0,
    "disconnects": 0,
    "oos": 0,
    "points": 1477,
    "rank": 1
  },
  {
    "_id": "56344c8f2273e407b4a803fd",
    "name": "ninja[pro]",
    "uid": 9609,
    "avatar": "",
    "points": 1353,
    "wins": 94,
    "losses": 24,
    "disconnects": 1,
    "oos": 1,
    "rank": 2
  },
  {
    "_id": "563e19d32273e407b4a80c79",
    "name": "santaz",
    "uid": 9766,
    "avatar": "",
    "wins": 117,
    "losses": 46,
    "disconnects": 5,
    "points": 1330,
    "oos": 5,
    "activity": 1448660701,
    "rank": 3
  },
  {
    "_id": "56348a422273e407b4a8049d",
    "name": "rc_2g2g",
    "uid": 8061,
    "avatar": "",
    "points": 1327,
    "wins": 61,
    "losses": 37,
    "disconnects": 3,
    "oos": 0,
    "rank": 4
  },
  {
    "_id": "56348f6a2273e407b4a804b7",
    "name": "robskate",
    "uid": 4770,
    "avatar": "",
    "points": 1308,
    "wins": 116,
    "losses": 71,
    "disconnects": 0,
    "oos": 0,
    "activity": 1448874349,
    "rank": 5
  },
  {
    "_id": "563db34f2273e407b4a80b47",
    "name": "ora-ifucuup",
    "uid": 9746,
    "avatar": "",
    "wins": 101,
    "losses": 54,
    "disconnects": 1,
    "points": 1304,
    "oos": 1,
    "activity": 1448868344,
    "rank": 6
  },
  {
    "_id": "565067312273e407b4a81de1",
    "name": "zot",
    "uid": 10082,
    "avatar": "",
    "wins": 32,
    "losses": 5,
    "disconnects": 2,
    "oos": 0,
    "points": 1262,
    "rank": 7
  },
  {
    "_id": "5633cbfb2273e407b4a80139",
    "name": "ora-croboys",
    "uid": 9549,
    "avatar": "",
    "points": 1251,
    "wins": 129,
    "losses": 55,
    "disconnects": 5,
    "oos": 1,
    "activity": 1448852108,
    "rank": 8
  },
  {
    "_id": "5634d4f62273e407b4a805ac",
    "name": "fattynoob",
    "uid": 9639,
    "avatar": "",
    "wins": 61,
    "losses": 27,
    "disconnects": 0,
    "points": 1236,
    "rank": 9
  },
  {
    "_id": "564200882273e407b4a81352",
    "name": "[bat]hrvats",
    "uid": 9871,
    "avatar": "",
    "wins": 40,
    "losses": 12,
    "disconnects": 0,
    "points": 1225,
    "oos": 2,
    "activity": 1448663917,
    "rank": 10
  }
];

        $scope.champions['am'] = [
  {
    "_id": "5633d7be2273e407b4a8018a",
    "name": "giantxl",
    "uid": 9559,
    "avatar": "",
    "points": 1170,
    "wins": 29,
    "losses": 8,
    "disconnects": 0,
    "oss": 0,
    "oos": 1,
    "activity": 1448810044,
    "rank": 1
  },
  {
    "_id": "5634d4f62273e407b4a805a9",
    "name": "fattynoob",
    "uid": 9639,
    "avatar": "",
    "wins": 8,
    "losses": 2,
    "disconnects": 0,
    "points": 1090,
    "rank": 2
  },
  {
    "_id": "563e19d32273e407b4a80c7e",
    "name": "santaz",
    "uid": 9766,
    "avatar": "",
    "wins": 4,
    "losses": 0,
    "disconnects": 0,
    "points": 1066,
    "oos": 0,
    "activity": 1448620123,
    "rank": 3
  },
  {
    "_id": "564200882273e407b4a81350",
    "name": "[bat]hrvats",
    "uid": 9871,
    "avatar": "",
    "wins": 4,
    "losses": 0,
    "disconnects": 0,
    "points": 1065,
    "rank": 4
  },
  {
    "_id": "5633cbfb2273e407b4a8013a",
    "name": "ora-croboys",
    "uid": 9549,
    "avatar": "",
    "wins": 3,
    "losses": 0,
    "disconnects": 0,
    "points": 1051,
    "rank": 5
  },
  {
    "_id": "563dc4672273e407b4a80b78",
    "name": "[tb]-h3zb",
    "uid": 6147,
    "avatar": "",
    "wins": 3,
    "losses": 0,
    "disconnects": 0,
    "oos": 0,
    "points": 1042,
    "rank": 6
  },
  {
    "_id": "5633ff362273e407b4a802b0",
    "name": "el-cajon",
    "uid": 9580,
    "avatar": "",
    "wins": 2,
    "losses": 0,
    "disconnects": 0,
    "points": 1036,
    "rank": 7
  },
  {
    "_id": "56348a422273e407b4a8049c",
    "name": "rc_2g2g",
    "uid": 8061,
    "avatar": "",
    "wins": 2,
    "losses": 0,
    "disconnects": 0,
    "points": 1031,
    "rank": 8
  },
  {
    "_id": "563cdf1e2273e407b4a80955",
    "name": "supernoob",
    "uid": 9624,
    "avatar": "",
    "wins": 2,
    "losses": 0,
    "disconnects": 0,
    "points": 1029,
    "rank": 9
  },
  {
    "_id": "56344c8f2273e407b4a80402",
    "name": "ninja[pro]",
    "uid": 9609,
    "avatar": "",
    "wins": 2,
    "losses": 0,
    "disconnects": 0,
    "points": 1029,
    "rank": 10
  }
];

        $scope.champions['fs'] = [
  {
    "_id": "5633c0282273e407b4a800ab",
    "name": "sexpro",
    "uid": 9536,
    "avatar": "",
    "points": 1122,
    "wins": 9,
    "losses": 0,
    "disconnects": 0,
    "oos": 0,
    "rank": 1
  },
  {
    "_id": "56340bf92273e407b4a8030f",
    "name": "f0odli0n",
    "uid": 6278,
    "avatar": "",
    "wins": 2,
    "losses": 0,
    "disconnects": 0,
    "points": 1032,
    "oos": 0,
    "rank": 2
  },
  {
    "_id": "5633dd252273e407b4a801ab",
    "name": "puzzibaer",
    "uid": 9561,
    "avatar": "",
    "points": 1028,
    "wins": 3,
    "losses": 1,
    "disconnects": 0,
    "rank": 3
  },
  {
    "_id": "564018a82273e407b4a81090",
    "name": "y0simtsam",
    "uid": 9829,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 1,
    "oss": 0,
    "points": 994,
    "rank": 4
  },
  {
    "_id": "5646d56f2273e407b4a8181c",
    "name": "n3wb",
    "uid": 9947,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 1,
    "oss": 0,
    "points": 994,
    "rank": 5
  },
  {
    "_id": "563db9382273e407b4a80b53",
    "name": "nemesis",
    "uid": 6083,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 0,
    "oos": 0,
    "points": 989,
    "rank": 6
  },
  {
    "_id": "563d913c2273e407b4a80b03",
    "name": "ghostn1gga",
    "uid": 9698,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 0,
    "oos": 0,
    "points": 988,
    "rank": 7
  },
  {
    "_id": "5633bee02273e407b4a80077",
    "name": "hamster",
    "uid": 9442,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 1,
    "points": 987,
    "rank": 8
  },
  {
    "_id": "564bfd902273e407b4a81be5",
    "name": "bakidcrono",
    "uid": 10041,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 0,
    "oos": 0,
    "points": 985,
    "rank": 9
  },
  {
    "_id": "56346b012273e407b4a80458",
    "name": "chill",
    "uid": 9329,
    "avatar": "",
    "wins": 0,
    "losses": 1,
    "disconnects": 0,
    "points": 984,
    "rank": 10
  }
];
    }
]);

