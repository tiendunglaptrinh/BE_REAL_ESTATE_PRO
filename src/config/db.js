import mongoose from 'mongoose';
import "dotenv/config";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            ssl: true, 
          });
        console.log("Connect Database successfully!!!");
    } catch (error) {
        console.log("Connect Database failed!!!", error);
    }
}
export const db = {
  connectDB,
};
