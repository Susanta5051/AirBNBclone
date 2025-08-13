const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listSchema } = require("../schema.js");
const list=require("../models/lists.js");
const {isLoggedIn , isOwner}=require("../middlewares.js");


router.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})





const validateData=(req,res,next)=>{
    console.log(req.body);
    console.log(listSchema);
      let {error}=listSchema.validate(req.body);
      console.log(error);
    //   let errMsg=error.details.map((el)=>el.message).join(",");
   if(error){
    throw new ExpressError(400,errMsg);
   }
    else{
     next();
    }
}


router.get("/",wrapAsync(async (req,res)=>{
    await list.find({})
    .then((data)=>{
        res.render("alldata.ejs",{data});
    })
}))
router.get("/new",isLoggedIn,(req,res)=>{
    
    
        res.render("new.ejs");
    
    
})

router.get("/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
  
   let data =  await list.findById(id).populate({path:"reviews",populate:{ path:"author" },}).populate("owner");

   if(!data){
        req.flash("error","Data not found");
        return res.redirect("/lists");
   }
    
      res.render("details.ejs",{data});

}));


router.post("/",isLoggedIn,validateData, wrapAsync(async (req,res,next)=>{

 
    const data=new list(req.body.data);
    data.owner=req.user.id;
    console.log(data);
    await data.save().then(()=>{
        console.log("Data saved successfully");
    })
    req.flash('success',"data added successfully");
    res.redirect("/lists");
}));
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const data=await list.findById(id);
    res.render("edit.ejs",{data});
}))

router.patch("/:id/edit",isLoggedIn,isOwner,validateData, wrapAsync(async (req,res)=>{
    console.log(isOwner);
    const {id}=req.params;
    console.log(req.body.data)
    await list.findByIdAndUpdate(id,req.body.data).then(()=>{
        console.log("Data updated successfully");
    })
        req.flash("success","Data updated successfully");

    res.redirect(`/lists/${id}`);
}))
router.get("/:id/delete",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await list.findByIdAndDelete(id).then((result)=>{
        console.log(result);
    })
    req.flash("success","Data deleted ");
    res.redirect("/lists");
}))

module.exports=router;