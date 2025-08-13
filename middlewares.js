const list=require("./models/lists");
const review =require("./models/reviews");

const flash=require("connect-flash");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log ("isAuthnticated");
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must login to do this!");
        res.redirect("/user/login");
    }else{
        next();
    }
    
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
        next();
}

module.exports.isOwner=async (req,res,next)=>{
    console.log("isowner");
    let {id}=req.params;
    console.log(res.locals.currUser);
    let data= await list.findById(id);
   
    if( !data.owner.equals(res.locals.currUser._id)){
        console.log("not found");
        req.flash("error","You are not the Owner");
        return res.redirect(`/lists/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    console.log("isowner");
    let { id, reviewID}=req.params;
     console.log(id);
      console.log(reviewID);
    console.log(res.locals.currUser);
    let reviewdata= await review.findById(reviewID);
    console.log(reviewdata);
   
    if( !reviewdata.author.equals(res.locals.currUser._id)){
        console.log("not found");
        req.flash("error","You are not the author");
        return res.redirect(`/lists/${id}`);
    }
    next();
}
