'use strict';

const animeAPI = require('../api/ak-api');
const cache = require('../util/cacher');

/**
 * Searches for anime
 * @param {String} term
 * @return {Promise<Results>}
 */
function search(term) {
    const c = cache.getSearch(term);
    console.log('result is ' + (c ? '' : 'not ') + 'cached');
    if(c) return c;
    return cache.addSearch(term, animeAPI.search(term));
}

/**
 * Obtains most popular animes
 * @param {PopSet} set
 * @return {Promise<Anime[]>}
 */
function getPopular(set) {
    const c = cache.getPop(set);
    if(c) return Promise.resolve(c);
    return animeAPI.getPopular(set).then(res => {
        cache.addPop(set, res);
        return res;
    });
}

module.exports = {
    search,
    getPopular
};


