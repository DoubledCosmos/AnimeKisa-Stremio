'use strict';

const ul = require('urllib');
const parser = require('./ak-parse');

const AK_ADDRESS = 'https://animekisa.tv/';
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
            ret.dubbed?.map(getInfo);
            ret.subbed?.map(getInfo);
            ret.movies?.map(getInfo);
            return ret;
        });
}

function getPopular(subbed = true, allTime = false) {
    return ul.request(allTime ? ALLTIME : POPULAR + subbed ? '' : DUBBED)
        .then(res => parser.getTopResults(res?.data?.toString()).map(getInfo));
}

/**
 * Fills in episode links and anime description
 * @param {Anime} anime
 * @return {Promise<Anime>}
 */
function getInfo(anime) {
    return ul.request(AK_ADDRESS + anime.ref)
        .then(res => parser.getAnimeInfo(anime, res?.data?.toString() || ''));
}

module.exports = {
    search,
    getInfo,
    getPopular
}