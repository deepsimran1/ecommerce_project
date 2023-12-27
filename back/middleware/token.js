const jwt=require("jsonwebtoken");
const token={}


token.verify=(req,res,next)=>{
    const token=req.header("Authorization") || " ";
    if(!token){
        res.status(401).json({message:'User not found'});
    }
  
   try{
    const decoded=jwt.verify(token.slice(7),"abc");
    if(!decoded || !decoded.email){
        return res.status(401).json({success:false,message:"Unauthorized"})
    }
    else{
        req.decoded=decoded;
        console.log("decoded>>>>>>>>>..")
        // console.log("decoded",decoded);
        // console.log("ID",decoded._id);
        // console.log("name",decoded.name);
        next();
    }
}catch(error){
        console.error('Token verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });   
    }
   };
module.exports=token

