import { User } from "../models"
import CustomErrorHandler from "../services/CustomErrorHandler"

const admin =(req,res,next)=>{
  
  try{
    const user = await User.findOne({_id : req.user._id})
   console.log(user)
    if(user.role=='admin'){
        next()
    }

    return next(CustomErrorHandler.unAuthorized())
    
  }
  catch(err){
      return next(CustomErrorHandler.serverError(err))
  }

}

export default admin