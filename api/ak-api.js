'use strict';

const ul = require('urllib');
const parser = require('./ak-parse');
const cache = require('../util/cacher');
const getID = require('./id-api');

const {AK_ADDRESS} = require('../util/consts');
const SEARCH = AK_ADDRESS + 'search?q=';
const POPULAR = AK_ADDRESS + 'popular';
const ALLTIME = POPULAR + '-alltime';
const DUBBED = '/dubbed';

/**
 * Search for anime
 * @param {String} name - Name of the anime to search for
 * @return {Promise<Results>}
 */
function search(name) {
    return ul.request(SEARCH + name)
        .then(res => {
            const ret = parser.getSearchResults(res?.data?.toString() || '');
            return Promise.all([
                Promise.all(ret.Dubbed?.map(getInfo)),
                Promise.all(ret.Subbed?.map(getInfo)),
                Promise.all(ret.Movies?.map(getInfo))
            ]);
        })
        .then(([dub, sub, mov]) => {
            return {
                Dubbed: dub,
                Subbed: sub,
                Movies: mov
            };
        });
}

/**
 * Obtains the top 20(?) most popular anime
 * @param {PopSet} set
 * @return {Promise<Anime[]>}
 */
function getPopular(set) {
    return ul.request((set.allTime ? ALLTIME : POPULAR) + (set.subbed ? '' : DUBBED))
        .then(res => Promise.all(parser.getTopResults(res?.data?.toString()).map(getInfo)));
}

/**
 * Fills in episode links and anime id
 * @param {Anime} anime
 * @return {Promise<Anime>}
 */
function getInfo(anime) {
    return getID(anime.name).then(id => anime.id = id)
        .then(id => cache.getAni(id))
        .then(c => {
            if(c) return c;
            return ul.request(AK_ADDRESS + anime.ref)
                .then(res => parser.getAnimeInfo(anime, res?.data?.toString() || ''));
        });
}

module.exports = {
    getPopular,
    search
};
