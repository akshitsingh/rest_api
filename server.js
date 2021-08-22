import express from 'express';
import  mongoose  from 'mongoose';
import errorHandler from './middlewares/errorHandlers';
// import {APP_PORT} from './config';
import { DB_URL } from './config';
import routes from './routes';
import path from 'path';
const app = express();


//database connection

 const db = mongoose.connect('mongodb://localhost:27017/rest-api',{useNewUrlParser: true,useUnifiedTopology:true,
 useCreateIndex:true,useFindAndModify:false});
 console.log(db)
 mongoose.connection.on('error',(err)=>console.log(err))
 mongoose.connection.once('open',()=>{
    console.log('db connected')
  })


 global.appRoot = path.resolve(__dirname);
 app.use(express.urlencoded({extended : false}));
 app.use(express.json());

 
 

const APP_PORT = 3000;

app.use('/api',routes);

app.use(errorHandler);

app.use('/uploads',express.static('uploads'))

app.listen(APP_PORT,()=>{
    console.log("app runing on port" + APP_PORT);
})
