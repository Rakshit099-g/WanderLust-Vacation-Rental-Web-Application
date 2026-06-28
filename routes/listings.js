const express = require("express")
const router =  express.Router()
const Listing = require("../models/Listing")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const {listingSchema} = require("../schema.js")



//validation Middleware
//For server side validation of Listing
const validateListing = (req,res,next)=>{
    //joi ne individual fields k upar validation apply kar diya
    let {error} = listingSchema.validate(req.body)//iska mtlb ye hai ki hum check kr rhe listingSchema k andar jo bhi schema define kiye kya wo define schema ko satisfy kr rhi hai (server side validation)
    console.log(error)//joi ka provided result
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}


//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({})
     res.render("listings/index.ejs", { allListing }); 
    
}))

//Create route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    console.log(newListing)
    req.flash("success","Listing is created successfully!")
    res.redirect("/listings")
}))



//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}))

//Update 
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}))

router.patch("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true})
    req.flash("success","Updated Successfully!")
    res.redirect(`/listings/${id}`)

}))

//DELETE  (baad m humne relationship with database wala bhi kaam kiya ki jab listing delete ho toh uske corresponding review m se uss listing ki data bhi delete ho jo ki post middleware handle kiya hai in Listing.js m)
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Deleted Successfully!")
    res.redirect("/listings")
}))

module.exports = router