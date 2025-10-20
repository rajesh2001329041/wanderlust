const mongoose= require("mongoose");
const Listing =require("../models/listing.js");
const initData=require("./data.js")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main() 
.then((res)=>{
console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDb=async ()=>{

    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
...obj,owner:"67f7d13d0e6e75fdc60eb004"
    }));
    await Listing.insertMany(initData.data);
}
initDb();
