import { User } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";

const userController = {
    // async me(req, res, next) {
    //     try{
    //         const user = await User.findOne({_id: req.user._id }).select('-_id -password -createdAt -updatedAt -__v');
    //         if(!user){
    //             return next(CustomErrorHandler.notfound());
    //         }

    //         res.json(user);

    //     }catch(err) {
    //         return next(err);
    //     }
    // },
    async getUsersOne(req, res, next ) {
        //  use pagination here for big data library is mongoose pagination
        
                let document ;
                try{
                    document = await User.findOne({_id: req.params.id}).select('-updatedAt -__v -createdAt');
                }catch(err){
                    return next(CustomErrorHandler.serverError());
                }
                res.json(document);
            }
        
}

export default userController;
