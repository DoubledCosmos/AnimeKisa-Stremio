'use strict';

const {DUB, SUB, MOV, MANIFEST, AK_ADDRESS} = require('../util/consts.js');
const services = require('../lib/services');
const router = require('express').Router();

function respond(res, data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
}

function notFound(res) {
    respond(res, {metas: []});
}


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

router.param('type', (req, res, next, val) => {
    if(MANIFEST.types.includes(val)) {
        next();
    } else {
        next('Unsupported type ' + val);
    }
});

router.get('/manifest.json', (req, res) => {
    respond(res, MANIFEST);
});

/**
 * Makes sure an anime object only has the required properties
 * @param {Anime} a
 * @return {{genres: (String[]|*), name, videos: *, id}}
 */
function normalizeAnime(a) {
    const poster = AK_ADDRESS + a.poster.replace('/', '').split('?')[0];
    console.log(a.videos);
    return {
        id: a.id,
        name: a.name,
        genres: a.genres,
        poster: poster,
        videos: a.videos
    };
}

/**
 * Makes sure an episode object only has the required properties
 * @param {Episode} e
 * @return {{genres: (String[]|*), name, videos: *, id}}
 */
function normalizeEpisode(e) {
    return {
        id: e.id,
        season: e.season,
        title: e.title,
        released: new Date(parseInt(e.released)),
        episode: parseInt(e.episode)
    };
}


/**
 * Produces a movie catalog from a provided Anime[]
 * @param {Anime[]} animes
 * @return {{movie: *}}
 */
function movieCatalog(animes) {
    return animes;
}

function seriesCatalog(animes) {
    return animes.map(a => {
        a.videos = a.episodes.map(e => {
            e.season = 1;
            e.id = a.id + ':' + e.season + ':' + e.episode;
            e.title = a.name + ' episode ' + e.episode;
            return normalizeEpisode(e);
        });
        return normalizeAnime(a);
    });
}

const SEARCH_PREFIX = 'search=';
router.get('/catalog/:type/:id/:extra.json', (req, res, next) => {
    const catalog = req.params.id;
    const extra = req.params.extra;
    if(!extra.startsWith(SEARCH_PREFIX)) return next();
    const searchTerm = extra.replace(SEARCH_PREFIX, '');

    services.search(searchTerm)
        .then(r => {
            if(!r) return notFound(res);
            const animes = r[catalog];
            if(!animes) return notFound(res);
            respond(res, {
                metas: catalog === MOV ? movieCatalog(animes) : seriesCatalog(animes)
            });
        })
        .catch(next);
});

router.get('/catalog/:type/:id.json', (req, res, next) => {
    const catalog = req.params.id;
    if(catalog === MOV) return notFound(res);
    services.getPopular({subbed: catalog === SUB, allTime: false})
        .then(animes => {
            if(!animes) return notFound(res);
            respond(res, {
                metas: seriesCatalog(animes)
            });
        })
        .catch(next);

});

router.get('/stream/:type/:id.json', (req, res) => {
    const streams = STREAMS[req.params.type][req.params.id] || [];

    respond(res, {streams: streams});
});

module.exports = router;