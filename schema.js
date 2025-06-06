const joi= require("joi");

const validSchema =joi.object({
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

module.exports=validSchema;