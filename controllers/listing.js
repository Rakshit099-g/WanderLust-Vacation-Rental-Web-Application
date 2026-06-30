const Listing = require("../models/Listing")

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({})
     res.render("listings/index.ejs", { allListing }); 
    
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
    console.log(newListing)
    req.flash("success","Listing is created successfully!")
    res.redirect("/listings")
}

module.exports.showListings = async (req,res)=>{
    const {id} = req.params
    /* const listing = await Listing.findById(id).populate("reviews").populate("owner")
    
    abhi tak hum kewal owner of listing ko populate kr rhe the lekin ab hum nested populate k through each reviews k author ko bhi populate krenge 
    */
   const listing = await Listing.findById(id)
   .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner")
    console.log(listing)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}


module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true})
    req.flash("success","Updated Successfully!")
    res.redirect(`/listings/${id}`)

}
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Deleted Successfully!")
    res.redirect("/listings")
}