const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const {loadplanetsdata} = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app);

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('close',()=>{
    console.log('MongoDB connection cloed!');
});

async function server_start(){
    await mongoose.connect(MONGO_URL);
    await loadLaunchData();
    await loadplanetsdata();

    server.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`)
    });
}

server_start();