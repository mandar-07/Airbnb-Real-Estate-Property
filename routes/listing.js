const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner}= require("../middleware.js")
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const validateListing=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
      
      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
}

const listingController=require("../controllers/listings.js");


// index and create routes are merged
router.route("/").get(wrapAsync(listingController.index))
    // .post(
    //     isLoggedIn,
    //     validateListing,
    //     wrapAsync(listingController.createListing)
    // );
    // .post(upload.single("image"),(req,res)=>{
    //   res.send(req.file);
    // });
       .post(
        isLoggedIn,
        upload.single("image"),   
        validateListing,
        wrapAsync(listingController.createListing)
        );

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// show route//update route//Delete  ROute
router.route("/:id")
   .get( wrapAsync(listingController.showListing))
   .put(isLoggedIn,isOwner,validateListing,
    upload.single("image"),wrapAsync(listingController.updateListing))
   .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));






//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports= router;