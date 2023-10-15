const express = require('express');

const { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunches } = require('./launches.controller');
const launchesrouter = express.Router();
console.log('router.js');
launchesrouter.get('/',httpGetAllLaunches);
launchesrouter.post('/',httpAddNewLaunches);
launchesrouter.delete('/:id',httpAbortLaunches);
module.exports = launchesrouter;
