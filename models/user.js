import mongoose from 'mongoose';
import { WEB_URL } from '../config';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    age: {type:String, required: false },
    gender: {type:String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    image: { type: String, get: (image) =>{
        return `${WEB_URL}/${image}`;
    }}

}, { timestamps: true , toJSON: {getters: true} , id: false });

export default mongoose.model('User', userSchema, 'users');




