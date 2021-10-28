import Joi from 'joi';
import { Message } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';


const messagesController ={
    async message(req,res, next){
        const messageSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            message: Joi.string().required(),
        });

        const { error } = messageSchema.validate(req.body);
        if (error) {
            return next(error);
            // rootfolder/uploads/filename.png
        }
        
        const {name, email, message} = req.body;

            let document;
            
            try {
                document = await Message.create({
                // name: name,
                name,

                // email: email,
                email,
                message,
                });
                console.log(document);

            } catch(err) {
                return next(err);
            }

            // res.redirect('/user');
            res.status(201).json({msg: "Message posted Successfully !!!  "});

            // res.json(document);

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
    async getmessages(req, res, next) {
            
        //  use pagination here for big data library is mongoose pagination
        let document;

        try{
            // document = await Product.find().select('-updatedAt -__v -createdAt').sort({_id: -1});

            document = await Message.find().select('-__v -updatedAt');

        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);

    }
    
}
export default messagesController;




