import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from './slice/theme.slice'
import authSliceReducer from './slice/auth.slice'
import categorySliceReducer from './slice/category.slice'
import subCategorySliceReducer from './slice/subCategory.slice'
import productSliceReducer from './slice/products.slice'
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import usersReducer from './slice/users.slice';
import trashReducer from './slice/trash.slice';
import shopReducer from './slice/client/shop.slice';
import cartReducer from './slice/client/cart.slice';

const rootReducer = combineReducers({
    themeState: themeReducer,
    authState: authSliceReducer,
    categoryState: categorySliceReducer,
    subCategoryState: subCategorySliceReducer,
    productState: productSliceReducer,
    usersState: usersReducer,
    trashState: trashReducer,
    clientShopState: shopReducer,
    clientCartState: cartReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store)
export default store;