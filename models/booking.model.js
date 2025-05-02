const mongoose=require("mongoose");
const bookingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name should be required."]
    },
    userId:{
        type:String,
        required:[true,"name should be required."]
    },
    tripId:{
        type:String,
        required:[true,"name should be required."]
    },
    to:{
        type:String,
        required:[true,"username shold be required."]
    },
    from:{
        type:String,
        required:[true,"password should be required."]
    },
    seatNumber:{
        type:Number
    },
    bookingDateTime:{
        type:String
    },
    status:{
        type:String
    },
});

const Booking=mongoose.model("Booking",bookingSchema);
module.exports=Booking;