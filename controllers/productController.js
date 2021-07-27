import { Product } from '../models';
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import productSchema from '../validators/productValidation';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>  {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image') // 5mb


const productController = {
    async store(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            const filePath = req.file.path;
            // validation

            const { error } = productSchema.validate(req.body);
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

            const { name, price, size, currency } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    currency,
                    image: filePath
                });
            } catch(err) {
                return next(err);
            }
            res.status(201).json(document);
        });

    }, 
    update (req, res, next){
          // Multipart form data
          handleMultipartData(req, res, async (err) => {
            
            // const id = await Product.findOne({_id: req.params.id});
            // console.log(id);
              if(id){
                return next(new Error("No such data exist Please recheck your id again !!!  "))
            }
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            if(req.file){
                const filePath = req.file.path;

            }
            // validation
            const { error } = productSchema.validate(req.body);
            if(req.file){

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
        }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate({_id: req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image: filePath} )
                }, {new: true});
                console.log(document);
            } catch(err) {
                return next(err);
            }
            res.status(201).json(document);
        });

    },

    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({_id: req.params.id});
        if(!document){
            return next(new Error("No such data for Delete !!!   "));
        }
        const imagePath = document._doc.image;

        fs.unlink(`${appRoot}/${imagePath}` , (err) => {
            if(err){
                return  next(new Error('Error in Deleting image file !!! '));
            }
            return res.json("Resquested data successfully deleted  !!!" );
        });
    },

    async getProductslist(req, res, next) {

        //  use pagination here for big data library is mongoose pagination
        let document;

        try{
            // document = await Product.find().select('-updatedAt -__v -createdAt').sort({_id: -1});

            document = await Product.find().select('-updatedAt -__v -createdAt');

        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },
    async getProductsOne(req, res, next ) {
//  use pagination here for big data library is mongoose pagination

        let document ;
        try{
            document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v -createdAt');
        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}

export default productController;




// 
//     update(req, res, next) {
//         handleMultipartData(req, res, async (err) => {
//             if (err) {
//                 return next(CustomErrorHandler.serverError(err.message))
//             }
//             let filePath;
//             if (req.file) {
//                 filePath = req.file.path;
//             }

//             // validation
//             const { error } = productSchema.validate(req.body);
//             if (error) {
//                 // Delete the uploaded file
//                 if (req.file) {
//                     fs.unlink(`${appRoot}/${filePath}`, (err) => {
//                         if (err) {
//                             return next(CustomErrorHandler.serverError(err.message));
//                         }
//                     });
//                 }

//                 return next(error);
//                 // rootfolder/uploads/filename.png
//             }

//             const { name, price, size } = req.body;
//             let document;
//             try {
//                 document = await Product.findOneAndUpdate({ _id: req.params.id }, {
//                     name,
//                     price,
//                     size,
//                     ...(req.file && { image: filePath })
//                 }, { new: true });
//             } catch(err) {
//                 return next(err);
//             }
//             res.status(201).json(document);
//         });
//     },
//     async destroy(req, res, next) {
//         const document = await Product.findOneAndRemove({ _id: req.params.id });
//         if (!document) {
//             return next(new Error('Nothing to delete'));
//         }
//         // image delete
//         const imagePath = document._doc.image;
//         // http://localhost:5000/uploads/1616444052539-425006577.png
//         // approot/http://localhost:5000/uploads/1616444052539-425006577.png
//         fs.unlink(`${appRoot}/${imagePath}`, (err) => {
//             if (err) {
//                 return next(CustomErrorHandler.serverError());
//             }
//            return res.json(document);
//         });
//     },
//     async index(req, res, next) {
//         let documents;
//         // pagination mongoose-pagination
//         try {
//             documents = await Product.find().select('-updatedAt -__v').sort({ _id: -1 });
//         } catch(err) {
//             return next(CustomErrorHandler.serverError());
//         }
//         return res.json(documents);
//     },
//     async show(req, res, next) {
//         let document;
//         try {
//             document = await Product.findOne({ _id: req.params.id }).select('-updatedAt -__v');
//         } catch(err) {
//             return next(CustomErrorHandler.serverError());
//         }
//         return res.json(document);
//     }