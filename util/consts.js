'use strict';

/**
 * @typedef {Object} PopSet
 * @property {boolean} subbed
 * @property {boolean} allTime
 */

/**
 * @typedef {Object} Results
 * @property {Anime[]} Movies
 * @property {Anime[]} Dubbed
 * @property {Anime[]} Subbed
 */

/**
 * @typedef {Object} Anime
 * @property {String} ref
 * @property {String} poster
 * @property {String} id
 * @property {String} name
 * @property {String[]} genres
 * @property {Episode[]} episodes
 */

/**
 * @typedef {Object} Episode
 * @property {String} ref
 * @property {Date} released
 * @property {String} episode
 * @property {String} video
 */

const SUB = 'Subbed', DUB = 'Dubbed', MOV = 'Movies';
const HOST = 'http://127.0.0.1';
const PORT = 7000;
const ADDRESS = HOST + ':' + PORT;

const SEARCH = [{name: 'search', isRequired: false}];

const AK_ADDRESS = 'https://animekisa.tv/';
const ak = 'Anime Kisa';
const MANIFEST = {
    id: 'org.skaianet.animekisa',
    version: '0.0.1',
    name: ak + ' Stremio Addon',
    description: 'Tries to provide all of ' + ak + '\'s animes',

    icon: ADDRESS + '/logo.png',
    background: ADDRESS + '/bg.png',

    types: ['movie', 'series'],
    resources: [
        'catalog',
        'stream'
    ],
    catalogs: [
        {type: 'movie', id: MOV, extra: SEARCH},
        {type: 'series', id: SUB, name: ak + SUB, extra: SEARCH},
        {type: 'series', id: DUB, name: ak + DUB, extra: SEARCH}
    ],
    idPrefixes: ['tt', 'agid']
};

module.exports = {
    SUB, DUB, MOV,
    HOST, PORT, ADDRESS,
    MANIFEST,
    AK_ADDRESS
};