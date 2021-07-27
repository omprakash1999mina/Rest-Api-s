import Joi from 'joi';
import { User ,RefreshToken } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import JwtService from '../../Services/JwtService';
import { REFRESH_SECRET } from '../../config';



const refreshController = {

     async refresh(req, res, next){
        
        ///      refresh  Logic

        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()

        });

        const { error } = refreshSchema.validate(req.body);

        if(error){

            return next(error);
        }
        //   DataBasse   


        let refreshtoken;
        
        try{
            refreshtoken = await RefreshToken.findOne({refresh_token: req.body.refresh_token });
            console.log(refreshtoken);
            if(!refreshtoken){
                return  next( CustomErrorHandler.unAuthorized(' Invailed refresh token 1'));
            }    

            let userId;
            console.log(refreshtoken.refresh_token);
            try{
                const { _id } = JwtService.verify(refreshtoken.refresh_token , REFRESH_SECRET);
                userId = _id;
            }catch(err){
                return next(CustomErrorHandler.unAuthorized('  Invalid refresh token  2'));
            }

            const user = await User.findOne({_id: userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized('  No user found  !!!  '));
            }


                //       Tokens
            const access_token = JwtService.sign({_id: user._id, role: user.role });
            const refresh_token = JwtService.sign({_id: user._id, role: user.role },'1y',REFRESH_SECRET);
    
                //       Database Whitelilst 
                
            RefreshToken.create({refres_htoken: refresh_token});
            res.json({access_token , refresh_token});


        }catch(err){
            return next(new Error("Somthing went wrong  !!! " + err.message));
        }

    }
}

export default refreshController;
