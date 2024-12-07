import mongoose from "mongoose";


async function connectDB(){
    try {
       await mongoose.connect(process.env.MONGO_DB);
       console.log('Connect Database successfully!!!')
    }
    catch(error){
        console.log('Connect Database failed!!!')
    }
}

export const db = {
    connectDB
}