const Listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    
    const allListings =await Listing.find({});
    res.render("listings/index",{allListings});

};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("reviews")
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // ✅ FIX
    }

    console.log("Listing:", listing);
    console.log("Owner field:", listing.owner);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    // 👇 ADD THIS (IMPORTANT)
    if (req.file) {
        newListing.image = {
            url: req.file.path,        // Cloudinary URL
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); //  return added
    }

    let originalImageUrl = "";

    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace(
            "/upload",
            "/upload/h_300,w_250"
        );
    }

    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // get updated listing
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true } // returns updated doc
    );

    //  handle image update
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let{id}=req.params;
    let delListing=await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
};