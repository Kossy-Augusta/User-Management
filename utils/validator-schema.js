const Joi = require('joi');

class ValidatorSchema{

    // Define create user validation schema
    createUserSchema= Joi.object({
            email: Joi.string()
                .email().lowercase().required(),
            first_name: Joi.string().alphanum().min(2).max(20).required(),
            last_name: Joi.string().alphanum().min(2).max(20).required(),
            password: Joi.string().pattern(new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)).required()
            .messages({
                'string.pattern.base': '"password" must be alphanumeric, must contain atleast 1 capital letter and must have min of 6 characters'
            }),
            refresh_token: Joi.string().optional()
    });

    // login Vaidation Schema
    loginUserSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required()
    })
}

module.exports = ValidatorSchema;