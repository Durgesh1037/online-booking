const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name should be required."]
    },
    username:{
        type:String,
        required:[true,"username shold be required."]
    },
    password:{
        type:String,
        required:[true,"password should be required."]
    },
    status:{
        type:String
    },
    role:{
        type:String
    },
    token:{
        type:String
    }

});

const User=mongoose.model("User",userSchema);
module.exports=User;

