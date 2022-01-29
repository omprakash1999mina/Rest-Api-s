import Joi from 'joi';
import { Order, User } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';


const orderController = {
    async store(req,res, next){
        // console.log(req.body);
        // console.log(req.user);
        const orderSchema = Joi.object({
            // customerId: Joi.string().required(),
            name : Joi.string().required(),
            items: Joi.object().required(),
            phone: Joi.string().required(),
            totalgrand: Joi.number().required(),
            address: Joi.string().required(),
            paymentType: Joi.string(),
            status: Joi.string()
        });

        const { error } = orderSchema.validate(req.body);
        if (error) {
            return next(error);
            // rootfolder/uploads/filename.png
        }
        try{
            const {name, items,  phone, address, paymentType, status, totalgrand,} = req.body;
            const {_id } = req.user;
            const exist = await User.exists({_id: _id});

            if(exist){
                let document;
                try {
                        document = await Order.create({
                        // name: name,
                        customerId: _id,
                        name,
                        items,
                        phone,
                        totalgrand,
                        address,
                        paymentType,
                        status,
                    });
                    // console.log(document);
    
                } catch(err) {
                    return next(err);
                }
                res.status(201).json({msg: "Order Palaced Successfully !!!  "});
                // res.json(document);
            }
        }catch( err ){
                return  next( CustomErrorHandler.alreadyExist('User not loged in. '));
                // return next( err );
        }
    

    },
    async destroy(req, res, next) {
        try{
            const document = await Message.findOneAndRemove({_id: req.params.id});
            if(!document){
                return next(new Error("No such data for Delete !!!   "));
            }
            res.status(200).json("Successfully deleted");
        }catch(err){
            return next(CustomErrorHandler.serverError());
        }

    },
    async getorders(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        let document;

        try{
            // document = await Order.findOne({_id: req.params.id}).select('-__v -updatedAt -customerId');
            document = await Order.find({customerId: req.params.id}).select('-__v -updatedAt -customerId');

        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);

    }

}
export default orderController;
