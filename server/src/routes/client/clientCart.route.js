import Router from 'express';
import { addToCart, getAllCartItems } from '../../controllers/cart.controller.js';
const cartRouter = Router();

cartRouter.get('/getAllCartItems', getAllCartItems);

cartRouter.post('/addToCart', addToCart);

export default cartRouter;