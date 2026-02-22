import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Package, ShoppingCart, CreditCard, Shield, BarChart3, Settings,
    X, ChevronRight, Trash2, ChevronDown, PlusCircle, List,
    ShieldUser
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { theme } = useSelector(state => state.themeState);
    const isDark = theme === "dark";

    // State to manage Products dropdown
    const [productsOpen, setProductsOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Categories', path: '/admin/categories', icon: Package, new: true },
        {
            name: 'Products',
            path: '/admin/products',
            icon: Package,
            hasDropdown: true,
            subItems: [
                { name: 'All Products', path: '/admin/products', icon: List },
                { name: 'Add Product', path: '/admin/product/add', icon: PlusCircle },
            ]
        },
        { name: 'Trash', path: '/admin/trash', icon: Trash2 },
        { name: 'Admin', path: '/admin/admins', icon: ShieldUser },
    ];

    return (
        <>
            <aside className={`
            fixed z-[70] top-0 left-0 h-full transition-all duration-500 ease-in-out
            ${isOpen ? 'w-72 lg:w-80 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-[-100%]'}
            ${isDark ? "bg-zinc-900 border-r border-zinc-800" : "bg-white border-r border-zinc-200"}
            overflow-hidden
        `}>

                {/* Mobile Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Sidebar Content Container */}
                <aside className={`
                fixed z-[70] top-0 left-0 h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                w-72 lg:w-80
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isDark
                        ? "bg-zinc-900 border-r border-zinc-800 shadow-2xl shadow-black/50"
                        : "bg-white border-r border-zinc-200 shadow-2xl shadow-zinc-200/50"
                    }
            `}>
                    {/* Header */}
                    <div className={`h-24 flex items-center justify-between px-8 border-b ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/20" : "bg-blue-50"}`}>
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className={`font-black text-xl tracking-tighter ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                CORE<span className="text-blue-500">.</span>
                            </h2>
                        </div>

                        <button
                            onClick={toggleSidebar}
                            className={`lg:hidden p-2.5 rounded-xl transition-all active:scale-95 ${isDark
                                ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                                }`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-6 space-y-1.5 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
                        <p className={`px-4 mb-5 text-[10px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            System Menu
                        </p>

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.path);

                            if (item.hasDropdown) {
                                return (
                                    <div key={item.name} className="space-y-1">
                                        <button
                                            onClick={() => setProductsOpen(!productsOpen)}
                                            className={`
                                                w-full group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300
                                                ${isActive && !productsOpen ? (isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-50 text-zinc-900") : ""}
                                                ${isDark ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-bold text-[15px] tracking-tight">{item.name}</span>
                                            <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Content */}
                                        <div className={`overflow-hidden transition-all duration-300 ${productsOpen ? 'max-height-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-12 space-y-1 mt-1">
                                                {item.subItems.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isSubActive = location.pathname === sub.path;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            to={sub.path}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                                                                ${isSubActive
                                                                    ? (isDark ? "text-blue-400" : "text-blue-600")
                                                                    : (isDark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-900")}
                                                            `}
                                                        >
                                                            <SubIcon className="w-4 h-4" />
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`
                                    group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative
                                    ${isActive
                                            ? (isDark
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                                : "bg-zinc-900 text-white shadow-lg shadow-zinc-900/30")
                                            : (isDark
                                                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")
                                        }
                                `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-bold text-[15px] tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Branding */}
                    <div className="absolute bottom-6 left-0 right-0 px-10 text-center pointer-events-none">
                        <p className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? "text-zinc-700" : "text-zinc-300"}`}>
                            v2.0.4 Premium Admin
                        </p>
                    </div>
                </aside>
            </aside>
        </>
    );
};

export default Sidebar;