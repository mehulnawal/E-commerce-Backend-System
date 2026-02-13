import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCartItemsFun } from '../../../redux/slice/client/cart.slice';

const navLinks = [
    { name: 'Home', path: '/client/home' },
    { name: 'Shop', path: '/client/shop' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const brandDark = "text-[#3D2B1F]";
    const brandBg = "bg-[#FDFCF9]";
    const brandBorder = "border-[#E5E1DA]";

    const { cart } = useSelector(state => state.clientCartState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCartItemsFun());
    }, [])

    return (
        <>
            <div className="bg-[#3D2B1F] text-[#FDFCF9] text-[10px] md:text-xs font-bold tracking-[0.2em] text-center py-2.5 uppercase">
                Zero Sugar • Zero Atta • Handcrafted in Surat
            </div>

            <nav className={`sticky top-0 z-50 ${brandBg} border-b ${brandBorder} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/client/" className={`flex items-center gap-2 text-2xl font-serif italic font-black tracking-tight ${brandDark}`}>
                            <div className="w-10 h-10 bg-[#3D2B1F] rounded-full flex items-center justify-center text-[#FDFCF9]">
                                <Leaf size={20} fill="currentColor" />
                            </div>
                            <span className="hidden sm:block">Live <span className="not-italic text-[#8C7E6A]">Nourished</span></span>
                        </Link>

                        {/* Desktop NavLinks */}
                        <div className="hidden md:flex items-center gap-8 h-full">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-[11px] font-black uppercase tracking-[0.15em] ${brandDark} hover:text-[#8C7E6A] transition-colors`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-5">
                            <Link to="/client/cart" className="relative group">
                                <ShoppingBag size={22} className={`${brandDark} group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                                <span className="absolute -top-1.5 -right-1.5 bg-[#8C7E6A] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#FDFCF9]">
                                    {cart?.length}
                                </span>
                            </Link>
                            <Link to="/client/editProfile" className="hidden md:block">
                                <User size={22} className={`${brandDark} hover:text-[#8C7E6A] transition-colors`} strokeWidth={2.5} />
                            </Link>
                            <button className={`md:hidden p-2 ${brandDark}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`md:hidden ${brandBg} border-b ${brandBorder} overflow-hidden`}
                        >
                            <div className="p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block py-3 px-2 font-black text-xs tracking-widest ${brandDark} border-b border-[#F5F2ED]`}
                                    >
                                        {link.name.toUpperCase()}
                                    </Link>
                                ))}
                                <Link
                                    to="/user/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`py-3 px-2 font-black text-xs tracking-widest ${brandDark} flex items-center justify-between`}
                                >
                                    ACCOUNT <User size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;