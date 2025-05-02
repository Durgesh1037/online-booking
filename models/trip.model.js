const mongoose=require("mongoose");
const tripSchema=new mongoose.Schema({
    name:{
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
    seats:{
        type:Number
    },
    status:{
        type:String
    },
    price:{
        type:Number
    }
});

const Trip=mongoose.model("Trip",tripSchema);
module.exports=Trip;

