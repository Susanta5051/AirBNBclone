const joi= require("joi");

module.exports.validSchema =joi.object({
    data:joi.object({
        title:joi.string().required(),
        desc:joi.string().required(),
        price:joi.number().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        image:joi.object({
            url:joi.string().allow("",null),
            filename:joi.string().allow("",null),
        })
        
    }).required(),
});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        comment:joi.string().required().min(3).max(500),
        rating:joi.number().min(1).max(5).required()
    }).required(),
    id:joi.string().required() 
    
})