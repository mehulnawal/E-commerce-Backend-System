import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCartItemsFun } from '../../../redux/slice/client/cart.slice';

const Cart = ({ theme = 'dark' }) => {
    const navigate = useNavigate();

    const { cart } = useSelector(state => state.clientCartState);
    const dispatch = useDispatch();
    console.log(cart);

    useEffect(() => {
        dispatch(getAllCartItemsFun());
    }, [dispatch])

    // --- LOGIC ---
    const updateQuantity = (id, type) => {
        // setCartItems(items => items.map(item => {
        //     if (item._id === id) {
        //         const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
        //         if (newQty > item.stock) {
        //             toast.error("Max stock reached!");
        //             return item;
        //         }
        //         if (newQty < 1) return item;
        //         return { ...item, quantity: newQty };
        //     }
        //     return item;
        // }));
    };

    const removeItem = (id) => {
        // setCartItems(items => items.filter(item => item._id !== id));
        // toast.success("Item removed");
    };

    // Calculations
    // const subTotal = cartItems.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);

    // const gstCharges = subTotal * 0.18; // 18% GST
    // const deliveryCharges = subTotal > 2999 ? 0 : 100;
    // const totalPrice = subTotal + gstCharges + deliveryCharges;

    return (
        // 1. Wrapper to apply the theme class ('dark' or 'light')
        <div className={theme}>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    <h1 className="text-3xl font-black tracking-tight mb-8">
                        Your Cart <span className="text-zinc-400 font-medium text-lg ml-2">({cart?.length} items)</span>
                    </h1>

                    {cart?.length === 0 ? (
                        // --- EMPTY STATE ---
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag size={32} className="text-zinc-400" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                            <p className="text-zinc-500 max-w-sm mb-8">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (

                        // --- CART GRID ---
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                            {/* Left: Cart Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                {cart && cart?.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        key={item._id}
                                        className="flex flex-col sm:flex-row gap-6 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                                    >
                                        {/* Image */}
                                        <div
                                            className="w-full sm:w-32 aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/product/${item.productId.slug}`)}
                                        >
                                            <img src={item?.productId?.productImages[0]} alt={item?.productId?.productName} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between" >
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3
                                                        className="font-bold text-lg leading-tight cursor-pointer hover:text-indigo-500 transition-colors"
                                                        onClick={() => navigate(`/product/${item.productId.slug}`)}
                                                    >
                                                        {item?.productId?.productName}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="text-zinc-400 hover:text-red-500 p-1"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-zinc-500 mt-1">Status: In Stock</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Control */}
                                                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 border border-zinc-200 dark:border-zinc-700">
                                                    <button
                                                        onClick={() => updateQuantity(item?._id, 'dec')}
                                                        className="p-1 hover:text-indigo-500 disabled:opacity-30"
                                                        disabled={item?.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm">{item?.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item?._id, 'inc')}
                                                        className="p-1 hover:text-indigo-500 disabled:opacity-30"
                                                    // disabled={item?.quantity >= item?.productId?.stock}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <span className="font-black text-lg">₹{(item?.productId?.productPrice * item?.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 sticky top-24 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                                    <h3 className="font-black text-xl mb-6">Order Summary</h3>

                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                                            <span>Subtotal</span>
                                            {/* <span className="text-zinc-900 dark:text-zinc-200 font-bold">₹{subTotal.toLocaleString()}</span> */}
                                        </div>
                                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                                            <span>GST (18%)</span>
                                            {/* <span className="text-zinc-900 dark:text-zinc-200 font-bold">₹{gstCharges.toFixed(0).toLocaleString()}</span> */}
                                        </div>
                                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                                            <span>Delivery Charges</span>
                                            {/* {deliveryCharges === 0 ? (
                                                <span className="text-green-500 font-bold uppercase text-xs bg-green-500/10 px-2 py-0.5 rounded">Free</span>
                                            ) : (
                                                <span className="text-zinc-900 dark:text-zinc-200 font-bold">₹{deliveryCharges}</span>
                                            )} */}
                                        </div>

                                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-4 pt-4 flex justify-between items-center">
                                            <span className="font-black text-lg">Total</span>
                                            {/* <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400">₹{totalPrice.toLocaleString()}</span> */}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/client/checkout')}
                                        className="w-full mt-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Proceed to Checkout <ArrowRight size={18} />
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
                                        <ShieldCheck size={14} />
                                        <span>Secure Checkout powered by Razorpay</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div >
        </div >
    );
};

export default Cart;