import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {type: String},
    image: {type:String}
});

export const userModel = mongoose.model('User',userSchema);