import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'GmailCloneDB', // <-- This line ensures data goes into this specific database
        });
        console.log('Mongodb connected successfully.');
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;