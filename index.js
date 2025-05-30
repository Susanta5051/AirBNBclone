const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const list=require("../models/lists.js");
const { data }=require("../alldata.js");
// const alldata = require("./alldata.js");
const methodOverride=require("method-override");
const ejsMate=require('ejs-Mate');

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set("includes",path.join(__dirname,"/views/includes"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

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

// const data=new list({
//     title:"High towers",
//     description:"A beautiful place to visit",
//     image:"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
// })
// data.save()
// .then (()=>{
//     console.log("Data saved successfully");
// })

// list.insertMany(data);




app.get("/",(req,res)=>{
    res.render("home.ejs");
})

app.get("/lists",async (req,res)=>{
    await list.find({})
    .then((data)=>{
        res.render("alldata.ejs",{data});
    })
})
app.get("/lists/new",(req,res)=>{
    
    res.render("new.ejs");
})
app.get("/lists/:id",async (req,res)=>{
    const {id}=req.params;
    await list.findById(id).then((data)=>{
        res.render("details.ejs",{data});
    })

})

app.post("/lists",async (req,res)=>{
    const data=new list(req.body.data);
    console.log(data);
    await data.save().then(()=>{
        console.log("Data saved successfully");
    })
    res.redirect("/lists");
    
});

app.get("/lists/:id/edit",async (req,res)=>{
    const {id}=req.params;
    const data=await list.findById(id);
    res.render("edit.ejs",{data});
})

app.patch("/lists/:id/edit",async (req,res)=>{
    const {id}=req.params;
    console.log(req.body.data)
    await list.findByIdAndUpdate(id,req.body.data).then(()=>{
        console.log("Data updated successfully");
    })
    res.redirect(`/lists/${id}`);
})
app.get("/lists/:id/delete",async (req,res)=>{
    const {id}=req.params;
    await list.findByIdAndDelete(id).then((result)=>{
        console.log(result);
    })
    res.redirect("/lists");
})

app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})