const express = require("express")
const router =  express.Router()
const Listing = require("../models/Listing")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")






//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({})
     res.render("listings/index.ejs", { allListing }); 
    
}))

//Create route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})

router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
    console.log(newListing)
    req.flash("success","Listing is created successfully!")
    res.redirect("/listings")
}))



//show route
router.get("/:id",wrapAsync(async (req,res)=>{
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
}))

//Update 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}))

router.patch("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true})
    req.flash("success","Updated Successfully!")
    res.redirect(`/listings/${id}`)

}))

//DELETE  (baad m humne relationship with database wala bhi kaam kiya ki jab listing delete ho toh uske corresponding review m se uss listing ki data bhi delete ho jo ki post middleware handle kiya hai in Listing.js m)
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync(async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Deleted Successfully!")
    res.redirect("/listings")
}))

module.exports = router