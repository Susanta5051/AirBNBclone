const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const list=require("./models/lists.js");
// const { data }=require("./alldata.js");
const alldata = require("./alldata.js");
const methodOverride=require("method-override");
const ejsMate=require('ejs-Mate');
// const validSchema =require("./schema.js");
// const Review = require("./models/reviews.js");
const session = require("express-session");
const flash=require("connect-flash");



const { log } = require("console");
const listsRouter=require("./routes/lists.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter= require("./routes/user.js");

const passport= require("passport");
const strategy=require("passport-local");
const User=require("./models/user.js");


app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set("includes",path.join(__dirname,"/views/includes"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.use(session(
   {secret:"mysuperSecrete",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }}
));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/",(req,res)=>{
    res.render("home.ejs");
})
// app.get("/demo",async (req,res)=>{
//     let fakeuser=new User(
//         {email:"dem",
//         username:"Sosanta"
//     })

//     let resisterUser=await User.register(fakeuser,"1234");
//     res.send(resisterUser);
// })



app.use("/lists",listsRouter);
app.use("/lists/:id/reviews",reviewsRouter);
app.use("/",userRouter);





app.all( /.*/,(req,res,next)=>{
    next( new ExpressError(404,"Page not found") );
})

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="Something went wrong"}=err;
//     console.log(err.message);
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("error.ejs",{err}); 
// })

app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})

