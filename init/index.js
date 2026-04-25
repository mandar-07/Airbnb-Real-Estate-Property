const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/Airbnb";

// calling main function
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

//connecting to database
async function main() {
    await mongoose.connect(MONGO_URL)   
}


const initDB=async () =>{
    await Listing.deleteMany({});
    const newData=initData.data.map((obj)=>({...obj,owner:new mongoose.Types.ObjectId("69e0f3a68e0ced4be20145de")}));
    await Listing.insertMany(newData);
    console.log("data was initialized");
};

initDB();