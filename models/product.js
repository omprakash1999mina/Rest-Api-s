import mongoose from 'mongoose';
import { APP_URL } from '../config';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true  },
    price: {type:Number, required: false  },
    size: {type:String, required: false   },
    image: { type: String, required: true , get: (image) =>{
        return `${APP_URL}/${image}`;
    }}
}, { timestamps: true , toJSON: {getters: true} , id: false });

export default mongoose.model('Product', productSchema , 'products');
