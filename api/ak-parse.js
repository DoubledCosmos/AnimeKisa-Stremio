'use strict';

const {JSDOM} = require('jsdom');

const replaceRgx = /<div class="lisbg">(.*)<\/div>\n(<div class=")similarboxmain(">)+/g;
const {DUB, SUB, MOV} = require('../util/consts.js');

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
        ?.querySelectorAll('.an:not(.hidemobile)') || [])
        .map(elem => {
            return {
                ref: elem.href,
                name: elem.querySelector('.similardd')?.textContent,
                id: '',
                poster: elem.querySelector('img')?.src,
                genres: elem.querySelector('.similardd-categories')?.textContent?.split(', ') || [],
                episodes: []
            };
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
        Dubbed: getAllFrom(DUB, doc),
        Subbed: getAllFrom(SUB, doc),
        Movies: getAllFrom(MOV, doc)
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
    anime.episodes = Array.from(doc.querySelectorAll('.infovan'))
        .map(ep => {
            return {
                ref: ep.href,
                video: '',
                released: ep.querySelector('.infoept3 .centerv').getAttribute('time'),
                episode: ep.querySelector('.infoept2 .centerv')
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
    return Array.from(doc.querySelectorAll('.listAnimes .an'))
        .map(elem => {
            const img = elem.querySelector('img');
            return {
                ref: elem.href,
                name: img?.alt,
                id: '',
                poster: img?.src,
                genres: elem.querySelector('.similardd-categories')?.textContent?.split(', ') || [],
                episodes: []
            };
        });
}

module.exports = {
    getAnimeInfo,
    getSearchResults,
    getTopResults
};