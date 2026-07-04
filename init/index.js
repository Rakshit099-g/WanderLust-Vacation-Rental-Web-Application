const mongoose = require("mongoose") 
const initData = require("./data")
const Listing = require("../models/Listing")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"


main().then(()=>{
    console.log("CONNECTED TO DB")
}).catch(err=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

async function initDB(){
        /*  
        //  await Listing.deleteMany({})
     
    // initData.data = initData.data.map((obj)=>({...obj,owner:"6a426073f43ceee280165b00"}))
     // await Listing.insertMany(initData.data)*/
    let results = await Listing.updateMany({},{$set:{category:"rooms"}})
   
    console.log(results)
}

initDB()