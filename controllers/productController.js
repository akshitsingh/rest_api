 import { Product } from '../models';
 import multer from 'multer';
 import path from 'path';
 import fs from 'fs';
 import CustomErrorHandler from '../services/CustomErrorHandler';
import Joi from 'joi';
import productSchema from '../validation/productValidator';


 const storage= multer.diskStorage({
     destination : (req,file,cb)=>cb(null,'uploads/'),
     filename : (req,file,cb)=> {
         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
         cb(null,uniqueName)
     }
 })

const handleMultipartData = multer({storage,limits : {fileSize:1000000 * 5}}).single('image');

const productController = {

    /**
     * Add product
     */
     async store(req,res,next){
       handleMultipartData(req,res,async(err)=>{
           if(err){
               return next(CustomErrorHandler.serverError(err.message))
           }

        const filePath = req.file.path;

       const { error } = productSchema.validate(req.body)
       if(error){
           fs.unlink(`${appRoot}/${filePath}`,(err)=>{
               if(err){
                return next(CustomErrorHandler.serverError(err.message));
               } 
           })
           return next(error);
       }

       const { name ,price ,size } = req.body;
       let document ;

       try{
         document = await Product.create({
             name,
             size,
             price,
             image: filePath
         })


       }
       catch(err){
           return next(err)
       }

       res.status(201).json(document)
         
       })
    },

    /**
     * Update Product
     */

    update(req,res,next){
        
            handleMultipartData(req,res,async(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))
                }
     
               let filePath ;

              if(req.file){
                 filePath = req.file.path;
              }  
            
      
     
            const { error } = productSchema.validate(req.body)
            if(error){
               if(req.file){
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                     return next(CustomErrorHandler.serverError(err.message));
                    } 
                })
               }
                return next(error);
            }
     
            const { name ,price ,size } = req.body;
            let document ;
     
            try{
              document = await Product.findOneAndUpdate({_id: req.params.id},{
                  name,
                  size,
                  price,
                 ...(req.file && {image: filePath})
              },{new:true})
     
     
            }
            catch(err){
                return next(err)
            }
     
            res.status(201).json(document)
              
            })
         },

         /**
          * Delete product
          */
       async  destroy(req,res,next){
           try{
            let document = await Product.findOneAndRemove({_id:req.params.id});
            if(!document){
                return next(new Error('Nothing to delete'));
            }

            
            //image delete
            const imagePath = document._doc.image
            fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
                if(err){
                    return next(new Error(CustomErrorHandler.serverError))
                }
            })

            res.json(document)

            if(!document){
                return next(CustomErrorHandler.notFound())
            }
           }
           catch(err){
               return next(err)
           }

           res.json(document)

         },

         /**
          * Get all product
          */
        async index(req,res,next){
             let documents;
            
             try{
                documents = await Product.find().select('-updatedAt -__v').sort({_id : -1})

                
             }catch(err){
                 return next(CustomErrorHandler.serverError())
             }

             res.json(documents)
         }
}

export default productController;