const router = express.Router();
import express from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import {orderController, messagesController, registerController, loginController , userController, refreshController, productController} from '../controllers';

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/message',messagesController.message);
// router.get('/me', auth ,userController.me);
router.post('/refresh',refreshController.refresh);
router.post('/logout',loginController.logout);
router.post('/product',[auth , admin], productController.store);
router.post('/orders',[auth], orderController.store );

router.put('/product/:id',[auth , admin], productController.update);
router.put('/update/:id',[ auth ], userController.update);

router.delete('/product/:id',[auth , admin], productController.destroy);
router.delete('/message/:id',[auth , admin], messagesController.destroy);
router.get('/products', productController.getProductslist);
router.get('/products/:id', productController.getProductsOne);
router.get('/users/:id',[ auth ], userController.getUsersOne);
router.get('/messages',[auth , admin], messagesController.getmessages);
router.get('/orders/:id',[auth ], orderController.getorders);
// router.get('/user/:id', productController.getProductsOne);
router.post('/products/cart-items',productController.getProducts);
router.post('/user',loginController.logout);
 
router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/noaccess', (req,res)=>{
    res.render('noaccess');
});
router.get('/user', (req,res)=>{
    
    res.render('welcomeLogin');
});

export default router;

