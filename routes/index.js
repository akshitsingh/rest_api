import express from 'express';
import {loginController, registerController,userController ,productController} from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/auth'; 
 
const router  = express.Router();

 router.post('/register',registerController.register);
 router.post('/login',loginController.login);
 router.get('/me',auth,userController.me);
//  router.get('/logout',auth.userController.logout);
 router.post('/products',[auth,admin],productController.store);
 router.put('/products/:id',[auth,admin],productController.update);
 router.delete('/products/:id',[auth,admin],productController.destroy);
 router.get('/products',productController.index);

 


export default router;