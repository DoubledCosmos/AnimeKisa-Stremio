'use strict';

/**
 * @typedef {Object} CacheResults
 * @property {String[]} dubbed
 * @property {String[]} subbed
 * @property {String[]} movies
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
 * @type {Map<String, CacheResults>}
 */
const search = new Map();


/**
 * Get a video link from a reference
 * @param {String} href
 * @return {String}
 */
export function getVid(href) {
    return video.get(href);
}

/**
 * Links a reference to a video link
 * @param {String} href
 * @param {String} vidLink
 */
export function addVid(href, vidLink) {
    if(!video.has(href)) video.set(href, vidLink);
}

/**
 * Get an anime from cache, including description and such
 * @param {String} id
 * @return {Anime}
 */
export function getAni(id) {
    return anime.get(id);
}

/**
 * Adds an anime, expects it to have Episodes and description
 * @param {Anime} ani
 */
export function addAni(ani) {
    if(!anime.has(ani.id)) anime.set(ani.id, ani);
}

/**
 * Get search results from cache
 * @param {String} term
 * @return {Results}
 */
export function getSearch(term) {
    const res = search.get(term);
    if(!res) return undefined;
    return {
        subbed: res.subbed.map(getAni),
        dubbed: res.dubbed.map(getAni),
        movies: res.movies.map(getAni)
    };
}

const resMapper = a => {
    addAni(a);
    return a.id;
};

/**
 * Adds search results and its animes to cache
 * @param {String} term
 * @param {Results} res
 */
export function addSearch(term, res) {
    if(search.has(term)) return;
    search.set(term, {
        subbed: res.subbed.map(resMapper),
        dubbed: res.dubbed.map(resMapper),
        movies: res.movies.map(resMapper)
    });
}
