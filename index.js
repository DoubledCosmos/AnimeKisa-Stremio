'use strict';

const HOST = 'http://127.0.0.1';
const PORT = 7000;
const ADDRESS = HOST + ':' + PORT;

const {DUB, SUB, MOV} = require('./util/consts');
const express = require('express');
const app = express();
app.use(express.static(require('path').join(__dirname, './public')));


const SEARCH = [{ name: 'search', isRequired: false}];

function respond(res, data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
}

const MANIFEST = {
    id: 'org.skaianet.animekisa',
    version: '0.0.1',
    name: 'Anime Kisa Stremio Addon',
    description: 'Tries to provide all of AnimeKisa\'s animes',
    
    icon: ADDRESS + '/logo.png',
    background: ADDRESS + '/bg.png',

    types: ['movie', 'series'],
    resources: [
        'catalog',
        'stream'
    ],
    catalogs: [
        {type: 'movie', id: MOV, name: MOV, extra: SEARCH},
        {type: 'series', id: SUB, name: SUB, extra: SEARCH},
        {type: 'series', id: DUB, name: DUB, extra: SEARCH}
    ],
    idPrefixes: ['tt','agid']
};

const CATALOG = {
    movie: [
        {id: 'tt0032138', name: 'The Wizard of Oz', genres: ['Adventure', 'Family', 'Fantasy', 'Musical']}
    ],
    series: [
        {
            id: 'tt1748166',
            name: 'Pioneer One',
            genres: ['Drama'],
            videos: [
                {season: 1, episode: 1, id: 'tt1748166:1:1', title: 'Earthfall', released: '2010-06-16'}
            ]
        }
    ]
};

const STREAMS = {
    'movie': {
        'tt0032138': [
            {title: 'Torrent', infoHash: '24c8802e2624e17d46cd555f364debd949f2c81e', fileIdx: 0}
        ],
        'tt0017136': [
            {title: 'Torrent', infoHash: 'dca926c0328bb54d209d82dc8a2f391617b47d7a', fileIdx: 1}
        ],
        'tt0051744': [
            {title: 'Torrent', infoHash: '9f86563ce2ed86bbfedd5d3e9f4e55aedd660960'}
        ],
        'tt1254207': [
            {title: 'HTTP URL', url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'}
        ],
        'tt0031051': [
            {title: 'YouTube', ytId: 'm3BKVSpP80s'}
        ],
        'tt0137523': [
            {title: 'External URL', externalUrl: 'https://www.netflix.com/watch/26004747'}
        ]
    },

    'series': {
        'tt1748166:1:1': [
            {title: 'Torrent', infoHash: '07a9de9750158471c3302e4e95edb1107f980fa6'}
        ]
    }
};

app.param('type', (req, res, next, val) => {
    if(MANIFEST.types.includes(val)) {
        next();
    } else {
        next('Unsupported type ' + val);
    }
});

app.get('/manifest.json', (req, res) => {
    respond(res, MANIFEST);
});

app.get('/catalog/:type/:id/:extra.json', (req, res, next) => {
    const extra = req.params.extra;
    console.log(extra);
    next();
});

app.get('/catalog/:type/:id.json', (req, res) => {
    const metas = CATALOG[req.params.type];

    respond(res, {metas: metas});
});

app.get('/stream/:type/:id.json', (req, res) => {
    const streams = STREAMS[req.params.type][req.params.id] || [];

    respond(res, {streams: streams});
});

if(require.main !== module) module.exports = app;
else app.listen(PORT, () => console.log(`Add-on URL: ${ADDRESS}/manifest.json`));

