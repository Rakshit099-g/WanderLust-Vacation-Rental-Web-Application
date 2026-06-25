//"Async function ko call karo. Agar sab kuch sahi chalta hai to function khud response bhej dega. Agar koi error aata hai aur Promise reject hota hai, to us error ko next(err) ke through Express ke error-handling middleware tak bhej do."
//yha jo fn hai wo hi async actual function jo route wala hai
// wrapAsync
// wrapAsync → Async code me aane wale errors ko pakadkar error middleware tak pahuchata hai.

// Async route handlers ke errors catch karta hai.
// Har route me try-catch likhne se bachata hai.
// Internally fn(...).catch(next) use karta hai.
// Error ko Express ke error-handling middleware tak bhej deta hai.

module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next)

    }

}