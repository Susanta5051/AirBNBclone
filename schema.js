const joi= require("joi");

let listSchema =joi.object({
    data:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        image:joi.object({
            url:joi.string().allow("",null),
            filename:joi.string().allow("",null),
        })
        
    }).required(),
});

let reviewSchema=joi.object({
    review:joi.object({
        comment:joi.string().required().min(3).max(500),
        rating:joi.number().min(1).max(5).required()
    }).required(),
    id:joi.string().required() 
    
})

module.exports={
    reviewSchema,
    listSchema
}