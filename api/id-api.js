'use strict';

const nameToImdb = require('name-to-imdb');
let auto = 0;

module.exports = function nameToID(name) {
    nameToImdb(name, (err, res, inf) => {
        let id = inf?.meta?.id;
        if(id) return id;
        return 'agid' + auto++;
        //TODO: Kitsu IDs
    });
};

