import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: {type:String},
    text: {type: String},
    time: {type:Date}
});

export const messageModel = mongoose.model('Message',messageSchema);