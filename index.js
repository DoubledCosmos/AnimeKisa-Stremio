'use strict';

const express = require('express');
const app = express();
const {PORT, ADDRESS} = require('./util/consts.js');
app.use(express.static(require('path').join(__dirname, './public')));

app.use(require('./routes/stremio'));

if(require.main !== module) module.exports = app;
else app.listen(PORT, () => console.log(`Add-on URL: ${ADDRESS}/manifest.json`));

