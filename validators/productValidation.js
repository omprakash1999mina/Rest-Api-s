import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    size: Joi.string().required(),
    currency: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string()

});

export default productSchema;