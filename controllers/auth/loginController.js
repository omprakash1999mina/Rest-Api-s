import Joi from 'joi';
import { User , RefreshToken  } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import JwtService from '../../Services/JwtService';
import { REFRESH_SECRET } from '../../config';

const loginController = {

    async login(req, res, next) {
        //       validation 
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
    
        console.log(req.body);

        const { error } = loginSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try{
         const user = await User.findOne( { email: req.body.email });

         if(!user){
             return next(CustomErrorHandler.wrongCredentials());
         }

         const match = await bcrypt.compare( req.body.password, user.password);
         if(!match){
            return next(CustomErrorHandler.wrongCredentials());
         }
         //      Token 
         const id = user._id;
         const access_token = JwtService.sign({_id: user._id , role: user.role } );
         const refresh_token = JwtService.sign({_id: user._id , role: user.role },'1y', REFRESH_SECRET );
         //       database whitelist
         await RefreshToken.create({refresh_token: refresh_token});

        res.json({ id, access_token , refresh_token });

        }catch(err){
            return next(err);
        }


    },


        async logout(req, res, next) {
            // validation
            const refreshSchema = Joi.object({
                refresh_token: Joi.string().required(),
            });
            const { error } = refreshSchema.validate(req.body);
    
            if (error) {
                return next(error);
            }
    
            try {
                await RefreshToken.deleteOne({ refresh_token: req.body.refresh_token });
            } catch(err) {
                return next(new Error('Something went wrong in the database'));
            }
            res.json({ status: 1 });

    }
};

export default loginController;