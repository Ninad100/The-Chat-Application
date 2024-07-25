import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

const baseUrl = process.env.URL || '0.0.0.0.27017';

export const connectToDatabase = async () =>{
    try{

        await mongoose.connect(`mongodb://${baseUrl}/chatterUp`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB is connected');
    }catch(err){
        console.log(err);
    }
}
