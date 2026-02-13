import Router from 'express';
import { productsView, singleProductView } from '../../controllers/products.controller.js';
const clientProductRouter = Router();

clientProductRouter.get('/getAllProducts', productsView);

clientProductRouter.get('/singleProduct/:id', singleProductView);

export default clientProductRouter;
