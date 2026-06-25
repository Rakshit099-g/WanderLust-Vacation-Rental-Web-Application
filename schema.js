/* # JOI Validation Notes (Wanderlust Project)

## JOI Kya Hai?

JOI ek validation library hai jo incoming data ko validate karti hai.

Iska kaam:

* User se aane wale data ko check karna
* Invalid data ko database me save hone se rokna
* Server-side validation provide karna

Example:

```js
{
    title:"",
    price:-100
}
```

Agar validation na ho to ye galat data database me save ho sakta hai.

JOI ise reject kar dega.

---

# Installation

```bash
npm install joi
```

Import:

```js
const Joi = require("joi");
```

---

# Listing Validation Schema

```js
module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().min(1).required(),
        image:Joi.string().allow("",null),
    }).required()
})
```

Expected Request Body:

```js
{
    listing:{
        title:"Villa",
        description:"Beautiful Villa",
        location:"Goa",
        country:"India",
        price:5000,
        image:"image_url"
    }
}
```

---

## Joi.object()

Object structure define karta hai.

```js
Joi.object({
    ...
})
```

Matlab:

"Data object ke form me aana chahiye."

---

## Joi.string()

String data allow karta hai.

```js
title:Joi.string()
```

Valid:

```js
title:"Villa"
```

Invalid:

```js
title:123
```

---

## Joi.required()

Field mandatory bana deta hai.

```js
title:Joi.string().required()
```

Valid:

```js
title:"Villa"
```

Invalid:

```js
{}
```

Error:

```txt
"title" is required
```

---

## Joi.number()

Number accept karta hai.

```js
price:Joi.number()
```

Valid:

```js
price:500
```

Invalid:

```js
price:"500"
```

---

## Joi.min()

Minimum value set karta hai.

```js
price:Joi.number().min(1)
```

Valid:

```js
price:100
```

Invalid:

```js
price:-10
```

Error:

```txt
"price" must be greater than or equal to 1
```

---

## Joi.allow("", null)

Empty string aur null allow karta hai.

```js
image:Joi.string().allow("",null)
```

Valid:

```js
image:""
```

```js
image:null
```

```js
image:"https://abc.com/image.jpg"
```

---

# Review Validation Schema

```js
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})
```

Expected Request:

```js
{
    review:{
        comment:"Amazing Place",
        rating:5
    }
}
```

---

## Joi.max()

Maximum value define karta hai.

```js
rating:Joi.number().max(5)
```

Valid:

```js
rating:4
```

Invalid:

```js
rating:10
```

Error:

```txt
"rating" must be less than or equal to 5
```

---

# Validation Middleware

Listing Validation:

```js
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }

    next();
}
```

Review Validation:

```js
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }

    next();
}
```

---

# Flow

User Form Submit

↓

req.body

↓

Joi Validation

↓

Valid?

YES → next()

NO → Error Throw

↓

Error Middleware

↓

Error Page

---

# Server-Side Validation vs Client-Side Validation

## Client-Side Validation

Browser me hoti hai.

Example:

```html
<input
    type="number"
    min="1"
    required
>
```

Ya Bootstrap Validation:

```html
<form class="needs-validation" novalidate>
```

Advantages:

* Fast feedback
* Better UX
* Server request bachti hai

Disadvantage:

* User bypass kar sakta hai
* Postman/Hoppscotch se request bhej sakta hai

---

## Server-Side Validation

JOI validation

```js
listingSchema.validate(req.body)
```

Advantages:

* Secure
* Bypass nahi ki ja sakti
* Database ko protect karta hai

Disadvantage:

* Request server tak jati hai

---

# Important Interview Point

Client-side validation is for user experience.

Server-side validation is for security.

Never rely only on client-side validation.

Always perform validation on the server before saving data to the database.

---

# Wanderlust Project Flow

Form

↓

Bootstrap Validation (Client Side)

↓

POST Request

↓

Joi Validation (Server Side)

↓

Mongoose Validation

↓

MongoDB Save

This is called Multi-Level Validation.
*/
const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().min(1).required(),
        image:Joi.object({
            filename:Joi.string().allow("",null),
            url:Joi.string().allow("",null)
        }).required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})