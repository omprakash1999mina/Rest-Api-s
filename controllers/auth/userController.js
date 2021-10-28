import { User } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import Joi, { ref } from 'joi';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>  {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 2 } }).single('image') // 2mb


const userController = {
    async getUsersOne(req, res, next ) {
        //  use pagination here for big data library is mongoose pagination
        
                let document ;
                try{
                    document = await User.findOne({_id: req.params.id}).select('-updatedAt -__v -createdAt -password');
                }catch(err){
                    return next(CustomErrorHandler.serverError());
                }
                res.json(document);
    },

    async update(req, res, next){
        // console.log("req : " + req.body);        
        /// update Logic
        
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // validation
            const updateSchema = Joi.object({
                name: Joi.string().min(3).max(20).required(),
                gender: Joi.string().required(),
                age: Joi.string().required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                email: Joi.string().email().required(),
                image: Joi.string(),

            });

            const { error } = updateSchema.validate(req.body);
            let filePath;

            if(req.file){
                filePath = req.file.path;
                console.log("new file path : " + filePath);
            }

            if (error && req.file) {
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
                const user = await User.findOne( { email: req.body.email });
                // const exist = await User.exists({email: req.body.email });
                if(!user){
                    return next(CustomErrorHandler.wrongCredentials());
                }

                //password varification
                const match = await bcrypt.compare( req.body.password, user.password);
                if(!match){
                    // Delete the uploaded file
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                    return next(CustomErrorHandler.wrongCredentials());
                }

                // const { name, price, size } = req.body;
                const {name, email, age, gender} = req.body;
                let document;

                document = await User.findOneAndUpdate({_id: req.params.id},{
                // name: name,
                // email: email,
                    name,
                    age,
                    gender,
                    email,
                    ...(req.file && {image: filePath} )
                // }, {new: true}).select('-updatedAt -__v -createdAt');
                }).select('-updatedAt -__v -createdAt');
                // console.log(document);
                if(req.file){
                    // Delete the uploaded old file
                    // const User_data = await User.findOne({_id: req.params.id}).select('-updatedAt -__v -createdAt');
                    // console.log('this is image file deleting section ');
                    // let image_path = User_data.image;
                    let image_path = document.image;
                    console.log('old file path : ' + image_path)
                    let temp_path = image_path.split('http://localhost:5000/')[1];
                    // console.log(temp_path + ': old file path')
                    fs.unlink(`${appRoot}/${temp_path}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError("Error in deleting old file"));
                        }
                    });
                        // return next("error in deleting file on update");
                        console.log("successfully deleted old file")
                }
    
            }catch( err ){
                 // Delete the uploaded file
                 fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                console.log('catch section')
                return  next( CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team ! . '));
                // return next( err );
            }

            res.status(201).json({msg: "Updated Successfully !!!  ",});
            // res.json(document);
        });


    }
        
}

export default userController;
