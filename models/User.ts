
import mongoose, { Schema, model, Model} from "mongoose";
import { IUser } from "../interfaces";

//Definicion del esquema
const userSchema = new Schema({
    name    : { type: String, required: true },
    email   : { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: {
        type: String,
        enum:{
            values: ['admin', 'client', 'colaborator', 'SEO'],
            message: '{VALUE} no es un rol valido',
            default: 'client',
            required: true
        }
    }
},{
    timestamps: true,
})

//Definicion modelo
const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;