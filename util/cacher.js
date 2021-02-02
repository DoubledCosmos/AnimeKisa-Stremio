'use strict';

/**
 * @typedef {Object} CacheResults
 * @property {String[]} Dubbed
 * @property {String[]} Subbed
 * @property {String[]} Movies
 */

/**
 * @type {Map<String, String>}
 */
const video = new Map();
/**
 * @type {Map<String, Anime>}
 */
const anime = new Map();
/**
 * @type {Map<PopSet, String[]>}
 */
const popular = new Map();
/**
 * @type {Map<String, Promise<CacheResults>>}
 */
const search = new Map();


/**
 * Get a video link from a reference
 * @param {String} href
 * @return {String}
 */
function getVid(href) {
    return video.get(href);
}

/**
 * Links a reference to a video link
 * @param {String} href
 * @param {String} vidLink
 */
function addVid(href, vidLink) {
    if(!video.has(href)) video.set(href, vidLink);
}

/**
 * Get an anime from cache, including description and such
 * @param {String} id
 * @return {Anime}
 */
function getAni(id) {
    return anime.get(id);
}

/**
 * Adds an anime, expects it to have Episodes and description
 * @param {Anime} ani
 */
function addAni(ani) {
    if(!anime.has(ani.id)) anime.set(ani.id, ani);
}

/**
 * Get search results from cache
 * @param {String} term
 * @return {Promise<Results>}
 */
function getSearch(term) {
    const promise = search.get(term);
    if(!promise) return undefined;
    return promise.then(res => ({
        Subbed: res.Subbed.map(getAni),
        Dubbed: res.Dubbed.map(getAni),
        Movies: res.Movies.map(getAni)
    }));
}

const resMapper = a => {
    addAni(a);
    return a.id;
};

/**
 * Adds search results and its animes to cache
 * @param {String} term
 * @param {Promise<Results>} promise
 */
function addSearch(term, promise) {
    if(search.has(term)) return getSearch(term);
    console.log('Adding results from search "' + term + '" to cache');
    search.set(term, promise.then(res => ({
        Subbed: res.Subbed.map(resMapper),
        Dubbed: res.Dubbed.map(resMapper),
        Movies: res.Movies.map(resMapper)
    })));
    return promise;
}

/**
 * Get popular animes from cache
 * @param {PopSet} id
 * @return {Anime[]}
 */
function getPop(id) {
    return popular.get(id)?.map(getAni);
}

/**
 * Adds popular animes to cache
 * @param {PopSet} id
 * @param {Anime[]} animes
 */
function addPop(id, animes) {
    console.log('Adding results from popular to cache');
    if(!popular.has(id)) popular.set(id, animes.map(resMapper));
}

module.exports = {
    addVid,
    addAni,
    addPop,
    addSearch,
    getSearch,
    getPop,
    getAni,
    getVid
};
