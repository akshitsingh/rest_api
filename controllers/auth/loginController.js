import Joi from "joi";
import {User} from '../../models'
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import bcrypt from 'bcrypt';

const loginController = {

   async login(req,res,next){
        //validation
        const loginSchema = Joi.object({
            email : Joi.string().email().required(),
            password : Joi.string().required(),
        })


        const {error} = loginSchema.validate(req.body)

        if(error){
            return next(error)
        }

        try{
            const user = await User.findOne({email : req.body.email})
            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }
            //compare the password
            const match = await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials())
            }

         const accessToken = JwtService.sign({_id:user._id,role:user.role}) 

         res.json({accessToken})
        }
        catch(err){
          return next(err)
        }

       

    },

    logout(req,res,next){
        try{
        
        }
        catch(err){
            return next(new Error('some thing went wrong in db'))
        }

    }

   
}


export default loginController