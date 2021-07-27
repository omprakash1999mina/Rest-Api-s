import mongoose from 'mongoose';
import { APP_URL } from '../config';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    age: {type:String, required: false },
    gender: {type:String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    image: { type: String, required: true , get: (image) =>{
        return `${APP_URL}/${image}`;
    }}

}, { timestamps: true , toJSON: {getters: true} , id: false });

export default mongoose.model('User', userSchema, 'users');




