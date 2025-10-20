const Listing=require("../models/listing");
module.exports.index=async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm=(req, res) => {
    
    res.render("listings/new.ejs");
};
module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

};
module.exports.createListing=async (req, res) => {
     
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditFrom=async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings){
        req.flash("error","Listing does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/Edit.ejs", { listings });
};
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error","Please enter the location !!");
    res.redirect("/listings");
};

module.exports.searchByDestionation=async(req,res)=>{
let destination=req.query.destination;
console.log(destination);
if (!destination) {
    req.flash("error","Listing deleted!");
    return res.redirect("/listings");
}

// Search listings by destination/location (case-insensitive)
const allListings = await Listing.find({
    location: { $regex: new RegExp(destination, "i") }
}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
//   console.log(allListings);

  res.render("listings/index.ejs", { allListings });
}