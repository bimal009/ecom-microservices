import mongoose from "mongoose";

const {Schema}=mongoose;

export const orderStatus=["failed","success"] as const;

const orderSchema=new Schema({
    userId:{type:String,required:true},
    email:{type:String,required:true},
    amount:{type:Number,required:true},
    status:{type:String,required:true,enum:orderStatus},
    products:{type:[{
        name:{type:String,required:true},
        quantity:{type:Number,required:true},
        price:{type:Number,required:true}
    }],required:true}
},{timestamps:true});
export type orderSchemaType=mongoose.InferSchemaType<typeof orderSchema>;

export const Order=mongoose.model<orderSchemaType>("Order",orderSchema);