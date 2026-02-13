import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Search, ShoppingCart, Star, LayoutGrid,
    List, ChevronDown, Filter, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clientGetAllProducts } from '../../../redux/slice/client/shop.slice';

const Shop = () => {
    // Redux Theme Integration
    const theme = useSelector((state) => state.themeStore);

    const currentTheme = {
        bg: theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#FDFCF9]',
        card: theme === 'dark' ? 'bg-[#161616]' : 'bg-white',
        text: theme === 'dark' ? 'text-white' : 'text-[#3D2B1F]',
        border: theme === 'dark' ? 'border-zinc-800' : 'border-[#E5E1DA]',
        input: theme === 'dark' ? 'bg-zinc-900' : 'bg-white',
        subText: theme === 'dark' ? 'text-zinc-500' : 'text-[#8C7E6A]',
    };
    const dispatch = useDispatch();

    const { products } = useSelector(state => state.clientShopState);
    console.log(products);

    useEffect(() => {
        dispatch(clientGetAllProducts())
    }, [dispatch])

    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [selectedCat, setSelectedCat] = useState('All Products');

    const categories = ['All Products', 'Zero-Atta Cookies', 'Mukhwas', 'Vedic Tonics', 'Grain-Free Flours'];

    return (
        <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} font-sans transition-colors duration-300`}>

            {/* --- STICKY MOBILE SEARCH & HEADER --- */}
            <div className={`sticky top-0 z-40 ${currentTheme.bg} border-b ${currentTheme.border}`}>
                <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 lg:py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center lg:items-end">
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter">The Pantry</h1>
                                <p className={`hidden md:block text-xs font-bold ${currentTheme.subText} mt-1`}>Home / Shop / <span className="text-emerald-600">{selectedCat}</span></p>
                            </div>

                            {/* View Toggles */}
                            <div className="hidden sm:flex gap-2 bg-[#F5F2ED] p-1 rounded-xl border border-[#E5E1DA]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#3D2B1F] text-white' : 'text-[#8C7E6A]'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#3D2B1F] text-white' : 'text-[#8C7E6A]'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* SEARCH BAR */}
                        <div className={`flex items-center px-5 py-3 rounded-2xl border ${currentTheme.border} ${currentTheme.input} shadow-sm`}>
                            <Search size={18} className="text-[#8C7E6A]" />
                            <input
                                type="text"
                                placeholder="Search our creations..."
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full font-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-10">

                {/* --- SIDEBAR (Desktop) --- */}
                <aside className="hidden lg:block w-72 space-y-8 sticky top-48 h-fit">
                    <div className={`border ${currentTheme.border} rounded-3xl overflow-hidden shadow-sm`}>
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full flex items-center justify-between p-5 bg-[#F5F2ED] font-black text-[10px] uppercase tracking-widest text-[#3D2B1F]"
                        >
                            Browse Collections
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? '' : '-rotate-90'}`} />
                        </button>
                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                    className="overflow-hidden bg-white"
                                >
                                    <div className="p-3 space-y-1">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCat(cat)}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedCat === cat ? 'bg-[#3D2B1F] text-white' : 'hover:bg-[#F5F2ED] text-[#8C7E6A]'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>

                {/* --- MOBILE FILTER BUTTON --- */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="w-full flex items-center justify-center gap-3 bg-[#3D2B1F] text-white py-4 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                    >
                        <Filter size={16} /> Filters & View
                    </button>
                </div>

                {/* --- PRODUCT GRID AREA --- */}
                <div className="flex-1">
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                        : "flex flex-col gap-6"
                    }>
                        {products.data && products.data?.map((i) => (
                            <motion.div
                                layout
                                key={i._id}
                                className={`group flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'} border ${currentTheme.border} ${currentTheme.card} rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:border-[#8C7E6A]/30`}
                            >
                                {/* 1. CLICKABLE IMAGE AREA */}
                                <Link to={`/client/productDetails/${i._id}`} className={`relative overflow-hidden bg-zinc-100 ${viewMode === 'grid' ? 'aspect-square w-full' : 'aspect-square sm:w-64 shrink-0'}`}>
                                    <img
                                        src={i.productImages[0]}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Artisanal Product"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100 text-[8px] font-black text-emerald-700 uppercase tracking-widest">
                                        Handcrafted
                                    </div>
                                    {/* <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-[#3D2B1F] hover:text-red-500 transition-colors shadow-sm">
                                        <Heart size={18} />
                                    </button> */}
                                </Link>

                                {/* Product Details */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex text-amber-500 mb-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>

                                    {/* 2. CLICKABLE TITLE */}
                                    <Link to={`/client/productDetails/${i._id}`}>
                                        <h3 className={`font-black uppercase tracking-tight text-[#3D2B1F] group-hover:text-emerald-700 transition-colors ${viewMode === 'grid' ? 'text-xs mb-4 line-clamp-2' : 'text-lg mb-2'}`}>
                                            {i.productName}
                                        </h3>
                                    </Link>

                                    {viewMode === 'list' && (
                                        <p className="text-sm text-[#8C7E6A] mb-6 line-clamp-2 leading-relaxed">
                                            {i.productDescription}
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                {/* <span className="text-[10px] text-zinc-400 font-bold line-through">₹799</span> */}
                                                <span className="text-2xl font-serif italic font-bold text-emerald-700">
                                                    ₹{i.productPrice}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 3. EXPLICIT BUTTONS FOR ALL DEVICES */}
                                        <div className="flex flex-row gap-2">
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#3D2B1F] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg">
                                                <ShoppingCart size={16} /> Add
                                            </button>

                                            <Link
                                                to={`/client/productDetails/${i._id}`}
                                                className="flex-2 flex items-center justify-center border-2 border-[#3D2B1F] text-[#3D2B1F] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3D2B1F] hover:text-white transition-all"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MOBILE FILTER DRAWER --- */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} rounded-t-[3rem] z-[70] p-8 pb-12 shadow-2xl border-t ${currentTheme.border}`}>
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xl font-black uppercase tracking-tight">The Pantry Menu</h2>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-[#F5F2ED] rounded-full text-[#3D2B1F]"><X size={20} /></button>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8C7E6A]">Display View</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => { setViewMode('grid'); setIsMobileFilterOpen(false); }} className={`flex-1 py-4 rounded-2xl border flex justify-center gap-2 items-center text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]' : 'border-[#E5E1DA]'}`}><LayoutGrid size={16} /> Grid</button>
                                        <button onClick={() => { setViewMode('list'); setIsMobileFilterOpen(false); }} className={`flex-1 py-4 rounded-2xl border flex justify-center gap-2 items-center text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]' : 'border-[#E5E1DA]'}`}><List size={16} /> List</button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8C7E6A]">Collections</p>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => { setSelectedCat(c); setIsMobileFilterOpen(false); }}
                                                className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${selectedCat === c ? 'bg-[#3D2B1F] text-white' : 'border-[#E5E1DA]'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;