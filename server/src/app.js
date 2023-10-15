const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const planetrouter = require('./routes/planets/planets.router');
const launchesrouter = require('./routes/launches/launches.router');
const app = express();
const api = require('./routes/api')

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/v1',api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;