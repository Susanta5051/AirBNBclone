const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listSchema } = require("../schema.js");
const User=require("../models/user.js");
const passport=require ("passport");
const { saveRedirectUrl } = require("../middlewares");


router.get("/user/signup",(req,res)=>{
    res.render("user.ejs");
})

router.post("/user/signup",async(req,res)=>{
    try{
        let {username:name,email:mail,password:pass}=req.body;

    const newuser=User({ email:mail , username:name });
    let reguser=await User.register(newuser,pass);
    console.log(reguser);
    req.login(reguser,(err)=>{
        if(err)return next(err);
        req.flash("success","User registered");
        res.redirect("/lists");
    })
    
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }
})

router.get("/user/login",(req,res)=>{
    res.render("login.ejs");
});

router.post("/user/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/user/login",
    failureFlash:true
}) ,async(req,res)=>{
    req.flash("success","Logged in successfully");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/lists");
    
    
})

router.get("/user/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        next(err);
        }
        else{
        req.flash("success","Logged out successfully!");
        res.redirect("/lists");
        }
    });
    
})



module.exports=router;