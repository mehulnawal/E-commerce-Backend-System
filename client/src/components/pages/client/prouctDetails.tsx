import React, { useEffect, useState } from 'react';
import {
    Star,
    Minus,
    Plus,
    ShoppingCart,
    ChevronRight,
    Truck,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clientGetSingleProducts } from '../../../redux/slice/client/shop.slice';
import { addToCartFun } from '../../../redux/slice/client/cart.slice';

const ProductDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { singleProduct, loading } = useSelector(
        (state: any) => state.clientShopState
    );

    // ✅ Safe Product
    const PRODUCT = singleProduct?.data || null;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch product
    useEffect(() => {
        if (id) {
            dispatch(clientGetSingleProducts(id));
        }
    }, [dispatch, id]);

    // Set first image safely
    useEffect(() => {
        if (PRODUCT && Array.isArray(PRODUCT.productImages) && PRODUCT.productImages.length > 0) {
            setSelectedImage(PRODUCT.productImages[0]);
        }
    }, [PRODUCT]);

    const handleQuantity = (type: string) => {
        const stockLimit = Number(PRODUCT?.stock) || 100;

        if (type === 'inc') {
            if (quantity < stockLimit) {
                setQuantity(prev => prev + 1);
            } else {
                toast.error("Maximum stock reached");
            }
        }

        if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {

        if (!PRODUCT) return;

        const productDetails = {
            id: PRODUCT._id,
            quantity
        };

        dispatch(addToCartFun(productDetails))
            .unwrap()
            .then(() => {
                toast.success(() => (
                    <div className="flex items-center gap-3">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                className="w-10 h-10 rounded bg-zinc-100 object-cover"
                                alt=""
                            />
                        )}
                        <div>
                            <p className="text-sm font-bold dark:text-white">Added to Cart</p>
                            <p className="text-xs text-zinc-500">Qty: {quantity}</p>
                        </div>
                    </div>
                ), {
                    style: {
                        borderRadius: '12px',
                        background: '#18181b',
                        color: '#fff'
                    }
                });
            })
            .catch((error) => {
                toast.error(`${error}`);
            });
    };

    // ✅ Strong Loading Guard (prevents crash completely)
    if (
        loading ||
        !PRODUCT ||
        !Array.isArray(PRODUCT.productImages)
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading product...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-zinc-500 mb-8">
                    <span
                        className="hover:text-zinc-600 cursor-pointer"
                        onClick={() => navigate('/client/')}
                    >
                        Home
                    </span>
                    <ChevronRight size={14} className="mx-2" />
                    <span
                        className="hover:text-zinc-600 cursor-pointer"
                        onClick={() => navigate('/client/shop')}
                    >
                        Shop
                    </span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="font-bold text-zinc-300 truncate max-w-50">
                        {PRODUCT.productName}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="flex flex-row gap-4 w-full lg:max-w-2xl">

                        {/* Thumbnails */}
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] no-scrollbar pr-1">
                            {PRODUCT.productImages.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === img
                                        ? 'border-indigo-600 ring-1 ring-indigo-600'
                                        : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 min-w-0">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={selectedImage}
                                className="h-[400px] w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center"
                            >
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt={PRODUCT.productName}
                                        className="max-w-full max-h-full object-contain p-6"
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="flex flex-col">

                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 uppercase">
                            {PRODUCT.productName}
                        </h1>

                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                                <Star size={16} className="text-zinc-300" fill="currentColor" />
                            </div>
                            <span>(128 Reviews)</span>
                        </div>

                        <div className="mb-6 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 w-fit">
                            <span className="text-3xl font-bold text-indigo-600">
                                ₹{PRODUCT.productPrice?.toLocaleString()}
                            </span>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-md mb-8">
                            {PRODUCT.productDescription}
                        </p>

                        {/* Quantity + Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">

                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg px-2 py-1 border border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => handleQuantity('dec')}
                                    disabled={quantity <= 1}
                                    className="p-2 text-zinc-500 hover:text-zinc-600 disabled:opacity-20"
                                >
                                    <Minus size={18} />
                                </button>

                                <span className="w-10 text-center font-bold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() => handleQuantity('inc')}
                                    className="p-2 text-zinc-500 hover:text-zinc-600"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-3.5 bg-zinc-900 dark:bg-indigo-600 hover:opacity-90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                <Truck size={18} className="text-indigo-500" />
                                <span className="text-xs font-bold">Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                <ShieldCheck size={18} className="text-indigo-500" />
                                <span className="text-xs font-bold">1 Year Warranty</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;