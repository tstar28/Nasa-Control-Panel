const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planets.mongo');


const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadplanetsdata(){
  return new Promise((resolve,reject)=>{
    fs.createReadStream(path.join(__dirname,'.','kepler-data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (data) => {
      if (isHabitablePlanet(data)){
          await saveplanets(data);
      }
    })
    .on('error', (err) => {
      console.log(err);
      console.log('oops!!!!!');
      reject(err);
    })
    .on('end', async () => {
      const planetsFound = (await getAllPlanets()).length;
      console.log(`${planetsFound} habitable planets found!`);
      resolve();
    });

  });
}

async function saveplanets(planet){
  try{
    await planets.updateOne({
      keplerName: planet.kepler_name,
    },{
      keplerName: planet.kepler_name,
    },{
      upsert: true,
    });
   // console.log(planet);
  }
  catch(err){
    return new Error("Planet not saved !!");
  }
  
}

async function getAllPlanets(){
  return await planets.find({},{
    '_id':0, '__v':0,
  });
}
  module.exports={
    loadplanetsdata,
    getAllPlanets,
  };