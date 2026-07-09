const mongoose = require("mongoose");
const Review = require("./Review.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                    : v
        }
    },

    price: {
        type: Number,
        min: 1,
        required: true
    },

    location: String,
    country: String,
// in mongodb the location coordinates stores in geojson format
//GeoJSON format
    geometery:{
        type:{
            type:String,
            enum:['Point'],
            required:true

        },
        coordinates:{//[longitude, latitude]
            type:[Number],
            required:true
        }
    },
    reviews:[//hum reviews enter krenge directly from show page aur ye review database m particular listing k saath store hoga due to one to many relationship
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category: {
    type: String,
    enum: [
        "cabins",
        "rooms",
        "omg",
        "farms",
        "amazing views",
        "iconic cities",
        "surfing",
        "pools",
        "beach",
        "lakefront"
    ],
    required: true
}
});
//Post middleware hai jab hum listing ko hi delete kr de tab reviews bhi delete ho jana chaiye
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;