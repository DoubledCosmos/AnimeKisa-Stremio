'use strict';

const {JSDOM} = require('jsdom');
const getID = require('./id-api');

const replaceRgx = /<div class="lisbg">(.*)<\/div>\n(<div class=")similarboxmain(">)+/g;
const {DUB, SUB, MOV} = require('../util/consts');

/**
 * @typedef {Object} Results
 * @property {Anime[]} movies
 * @property {Anime[]} dubbed
 * @property {Anime[]} subbed
 */

/**
 * @typedef {Object} Anime
 * @property {String} ref
 * @property {String} picture
 * @property {String} id
 * @property {String} name
 * @property {String[]} genres
 * @property {String} description
 * @property {Episode[]} episodes
 */

/**
 * @typedef {Object} Episode
 * @property {String} ref
 * @property {String} number
 * @property {String} video
 */

/**
 * Converts raw HTML to a queryable Document object
 * @param {String} stringHTML
 * @return {Document}
 */
function parseRaw(stringHTML) {
    return new JSDOM(stringHTML).window.document;
}

/**
 *
 * @param type
 * @param doc
 * @return {Anime[]}
 */
function getAllFrom(type, doc) {
    return Array.from(doc.querySelector('.' + type)
        ?.querySelectorAll('.an:not(.hidemobile)'))
        .map(elem => {
            const anime = {
                ref: elem.href,
                name: elem.querySelector('.similardd')?.textContent,
                id: '',
                picture: elem.querySelector('img')?.src,
                categories: elem.querySelector('.similardd-categories')?.textContent?.split(', ') || [],
                episodes: [],
                description: ''
            };
            anime.id = getID(anime.name);
            return anime;
        });
}

/**
 * Gets all of the necessary data for a search list
 * @param {String} stringHTML
 * @return {Results}
 */
function getSearchResults(stringHTML) {
    const doc = parseRaw(stringHTML.replace(replaceRgx, (match, p1, p2, p3) => p2 + p1 + p3));
    return {
        dubbed: getAllFrom(DUB, doc),
        subbed: getAllFrom(SUB, doc),
        movies: getAllFrom(MOV, doc)
    };
}

/**
 * Gets all of the episodes from the listing page
 * @param {Anime} anime
 * @param {String} stringHTML
 * @return {Anime}
 */
function getAnimeInfo(anime, stringHTML) {
    const doc = parseRaw(stringHTML);
    anime.description = doc.querySelector('.infodes2');
    anime.episodes = Array.from(doc.querySelectorAll('.infovan'))
        .map(ep => {
            return {
                ref: ep.href,
                video: '',
                number: ep.querySelector('.infoept2')
                    ?.querySelector('.centerv')
                    ?.textContent

            };
        });
    return anime;
}

/**
 *
 * @param {String} stringHTML
 * @return {Anime[]}
 */
function getTopResults(stringHTML) {
    const doc = parseRaw(stringHTML);
    return Array.from(doc.querySelectorAll('.an'))
        .map(elem => {
            const img = elem.querySelector('img');
            const anime = {
                ref: elem.href,
                name: img?.alt,
                id: '',
                picture: img?.src,
                categories: elem.querySelector('.similardd-categories')?.textContent?.split(', ') || [],
                episodes: [],
                description: ''
            };
            anime.id = getID(anime.name);
            return anime;
        });
}

module.exports = {
    getAnimeInfo,
    getSearchResults,
    getTopResults
};