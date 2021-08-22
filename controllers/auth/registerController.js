import Joi from "joi";
import { User } from '../../models'
import bcrypt from 'bcrypt';
import jwt from '../../services/JwtService';
import CustomErrorHandler from "../../services/CustomErrorHandler";


const registerController = {

   async register(req,res,next){ 
        const registerSchema = Joi.object({
            name : Joi.string().min(3).max(30),
            email : Joi.string().email().required(),
            role : Joi.string(),
            password : Joi.string().required(),
            repeatPassword : Joi.ref('password')
        })

        // console.log(req.body)

        const {error} = registerSchema.validate(req.body)

        if(error){
           return next(error) 
        }

        try{
          const exist = await User.exists({email : req.body.email})
  
          if(exist){
              return next(CustomErrorHandler.alreadyExists('Email is already exist'))
          }
        }
        catch(err){
          return next(err)
        }

     //hash password 
      const hashPassword = await bcrypt.hash(req.body.password,10); 
      const user = new User({
        name : req.body.name,
        email : req.body.email,
        role : req.body.role ,
        password : hashPassword
      })

     let accessToken;

      try{
        const result = await user.save();
        accessToken = jwt.sign({_id:result._id,role : result.role})
      }
      catch(err){
        return next(err)
      }
 
        res.json({accessaccessToken})
    }


}

export default registerController