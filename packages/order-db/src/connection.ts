import mongoose from "mongoose";
let isConnected = false;
export const connectToOrderDB = async () => {
    if (isConnected) {
        console.log("Already connected to Order Database");
        return;
    }
    if(process.env.MONGODB_URI===undefined){
        throw new Error("MONGODB_URI is not defined");
    }
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("Connected to Order Database");
  } catch (error) {
    console.error("Error connecting to Order Database:", error);
    throw error;
  }};