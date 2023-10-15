const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

// const launches = new Map();

let  Default_Flight_Number = 100;

// launches.set(launch.flightNumber, launch);
const spaceXURL = "https://api.spacexdata.com/v5/launches/query";

async function populateLaunces(){
    const response = await axios.post(spaceXURL,{
        query:{},
        options:{
            pagination: false,
            populate:[
                {
                    path: 'rocket',
                    select:{
                        name: 1,
                    }
                },
                {
                    path: 'payloads',
                    select:{
                        customers: 1
                    }
                }
            ]
        }
    });

    if(response.status != 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        customers,
        };
        
        saveLaunch(launch);
    }
   
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    
    if(firstLaunch){
        console.log('Launch data already loaded');
    }
    else{
    await populateLaunces();
    }  
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function getAllLaunches(skip,limit){
    
    return await launchesDatabase
    .find({},{ '_id':0, '__v':0, })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}

async function getFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

    if(!latestLaunch)
    return Default_Flight_Number;

    return latestLaunch.flightNumber;
}


// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch,{
//         flightNumber: latestFlightNumber,
//         customer:["ZTM","NASA"],
//         upcoming:true,
//         success:true,
//     }))
// }
async function saveLaunch(launch){
    await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if(!planet){
        throw new Error("No Matching Planet Found!");
    }

    const newFlightNumber = (await getFlightNumber()) + 1;
    const newLaunch = Object.assign(launch,{
             success: true,
             upcoming: true,
             customer: ["ZTM","NASA"],
             flightNumber: newFlightNumber,
    })
    await saveLaunch(newLaunch);
}

async function existLaunchwithId(id){
   // return launches.has(id); 
   return await saveLaunch({
    flightNumber: id,
   });
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    },{
        success: false,
        upcoming: false,
    });

    return aborted.modifiedCount===1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}
module.exports = {
    getAllLaunches,
    loadLaunchData,
    scheduleNewLaunch,
    existLaunchwithId,
    abortLaunchById,
    saveLaunch,
};