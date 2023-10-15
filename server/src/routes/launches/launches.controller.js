const {getAllLaunches,existLaunchwithId, abortLaunchById, scheduleNewLaunch} = require('../../models/launches.model')
const {pagination} = require('../../services/query');
async function httpGetAllLaunches(req,res){
    const {skip, limit} = pagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
}
async function httpAddNewLaunches(req,res){
    let launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: "Incomplete data send by the user",
        })
    }
    // if(isNaN(launch.launchDate)){
    //     return res.status(400).json({
    //         error: "invalid date",
    //     })
    // }
    launch.launchDate = new Date(launch.launchDate);
    
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunches(req,res){
    const launchId = Number(req.params.id);
   if(!existLaunchwithId(launchId)){
    return res.status(400).json({
        error: "launch not found",
    })
}
  
    const aborted = abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: "Launch not aborted",
        });
    }
    return res.status(200).json({
        ok: true,
    });
}
module.exports={
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunches,
}