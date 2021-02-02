'use strict';

const {MANIFEST} = require('../util/consts');
const nameToImdb = require('name-to-imdb');
let auto = 0;

/**
 * Obtains IMDB ID from a name, or one of our own IDs
 * @param {String} name
 * @return {Promise<String>}
 */
function nameToID(name) {
    return new Promise((resolve) => {
        nameToImdb(name, (err, res, inf) => {
            const id = inf?.meta?.id;
            if(id) return resolve(id);
            return resolve(MANIFEST.idPrefixes[1] + auto++);
            //TODO: Kitsu IDs
        });
    });
}

module.exports = nameToID;



