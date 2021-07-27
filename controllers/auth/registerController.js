import Joi, { ref } from 'joi';
import { User , RefreshToken } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import JwtService from '../../Services/JwtService';
import { REFRESH_SECRET } from '../../config';



const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>  {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image') // 5mb



const registerController = {

     async register(req, res, next){
         console.log("req : " + req.body);
        
        /// register Logic

        
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            const filePath = req.file.path;
            // validation
            const registerSchema = Joi.object({
                name: Joi.string().min(3).max(20).required(),
                gender: Joi.string().required(),
                age: Joi.string().required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                repeat_password: Joi.ref('password'),
                email: Joi.string().email().required(),
                image: Joi.string(),

            });

            const { error } = registerSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });

                return next(error);
                // rootfolder/uploads/filename.png
            }
            try{
                const exist = await User.exists({email: req.body.email });
                if(exist){
                    return  next( CustomErrorHandler.alreadyExist('This email is already taken . '));
                }
            }catch( err ){
                return next( err );
            }


            // const { name, price, size } = req.body;
            const {name, email, password, age, gender, image} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            let document;
            
            let access_token;
            let refresh_token;

            try {
                document = await User.create({
                // name: name,
                name,

                // email: email,
                email,
                age,
                gender,
                image: filePath,
                password: hashedPassword
                });
                console.log(document);

                access_token = JwtService.sign({_id: document._id, role: document.role });
                refresh_token = JwtService.sign({_id: document._id, role: document.role });

            } catch(err) {
                return next(err);
            }

        

            // res.redirect('/user');
            res.status(201).json({msg: "User Registered Successfully !!!  ", access_token: access_token ,refresh_token: refresh_token});

            // res.json(document);
        });








        // const registerSchema = Joi.object({
        //     name: Joi.string().min(3).max(20).required(),
        //     gender: Joi.string().required(),
        //     age: Joi.string().required(),
        //     password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        //     repeat_password: Joi.ref('password'),
        //     email: Joi.string().email().required(),
        //     image: Joi.string()

        // });
        // // console.log(req.body);

        // const { error } = registerSchema.validate(req.body);

        // if(error){
        //     // Delete the uploaded file
            
        //     fs.unlink(`${appRoot}/${filePath}`, (err) => {
        //     if (err) {
        //         return next(CustomErrorHandler.serverError(err.message));
        //     }

        // });
        // // rootfolder/uploads/filename.png

        // return next(error);

        //     // return next(error);
        // }
        // try{
        //     const exist = await User.exists({email: req.body.email });
        //     if(exist){
        //         return  next( CustomErrorHandler.alreadyExist('This email is already taken . '));
        //     }
        // }catch( err ){
        //     return next( err );
        // }
        // const {name, email, password, age, gender, image} = req.body;

        // const hashedPassword = await bcrypt.hash(password, 10);

        // // prepare the model 

        // const user = new User({
        //     // name: name,
        //     name,

        //     // email: email,
        //     email,
        //     age,
        //     gender,
        //     image: filePath,
        //     password: hashedPassword
        // });

        // let access_token;
        // let refresh_token;
        // try{
        //     const result = await user.save();
        //     console.log(result);
        //     // token 
        //     access_token = JwtService.sign({_id: result._id, role: result.role });
        //     refresh_token = JwtService.sign({_id: result._id, role: result.role });

        // }catch(err){
        //     return next(err);
        // }

        // // res.redirect('/user');
        // res.json({msg: "Singing in successfully !!!  ", access_token: access_token ,refresh_token: refresh_token});
    }
};

export default registerController;
