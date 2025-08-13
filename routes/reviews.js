const express=require("express");
const router = express.Router({mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const validSchema =require("../schema.js");
const list=require("../models/lists.js");
const { reviewSchema }=require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middlewares");


const validateReview=(req,res,next)=>{
      let {error}=reviewSchema.validate(req.body);
      
   if(error){
    
    throw new ExpressError(400,errMsg);
   }
    else{
     next();
    }
}



router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res,next)=>{
    
    const data= await list.findById(req.params.id);
    const reviewData = new Review(req.body.review);
        reviewData.author=req.user._id;
        console.log(reviewData);
    data.reviews.push(reviewData);
    
await reviewData.save();
await data.save().then(()=>{
    console.log("Review added successfully");
    req.flash("success","review added ");
    res.redirect(`/lists/${data._id}`);
})
    
}))
router.delete("/:reviewID",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res,next)=>{
    const {id,reviewID}=req.params;
    await list.findByIdAndUpdate(id,{$pull:{ reviews: reviewID }});
   
    await Review.findByIdAndDelete(reviewID).then(()=>{
        console.log("Review deleted successfully");
    })
    req.flash("success","Review deleted ");
    res.redirect(`/lists/${id}`);
}))

module.exports = router;