const express = require('express');
const planetrouter = require('./planets/planets.router');
const launchesrouter = require('./launches/launches.router');
const api = express.Router();
console.log('api.js')

api.use('/planets',planetrouter);
api.use('/launches',launchesrouter);

module.exports = api;