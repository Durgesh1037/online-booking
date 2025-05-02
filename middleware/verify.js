const jwt=require("jsonwebtoken");

const verify=async(req,res,next)=>{
      const token=req.headers.authorization;
      if(token){
        jwt.verify(token,function(decode){
            req.userId=decode.payload.username;
            next();
        })
      }
      return res.status(401).send({message:"token not found",status:true});
}

module.exports=verify;