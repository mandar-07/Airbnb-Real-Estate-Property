const express=require("express");
const router =express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");


//For validating review
const validateReview=(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
      
      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
}


//Review Route
//post Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);

    
    // res.send("new review saved");
}));

//Delete  review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
   let {id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviewId}});
   await Review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`);
}
));

module.exports=router;