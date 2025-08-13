const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const list=require("./models/lists.js");


app.set("views",path.join(__dirname,"views"));
app.set("includes",path.join(__dirname,"/views/includes"));
main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    conesole.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const alldata = require("./alldata.js");
const init= async()=>{
    await list.deleteMany({});
    console.log ("data deleted");
    
    alldata.data = alldata.data.map((obj) => ({...obj, owner: '689898679f9cd13859409727'}));

    await list.insertMany(alldata.data);
    console.log(alldata.data);
    console.log("datasaved successfully");
}
let res=init();
console.log(res);
