import { useState, useEffect } from 'react';
import { Users, ShoppingCart, CreditCard, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/slice/users.slice';
import { viewAllCategory } from '../../redux/slice/category.slice';
import { showAllProducts } from '../../redux/slice/products.slice';
import { useNavigate } from 'react-router';

const Dashboard = () => {

    const { filteredUsers } = useSelector(state => state.usersState);
    const { category, loading } = useSelector(state => state.categoryState);
    const { products } = useSelector(state => state.productState);
    const { user } = useSelector(state => state.authState);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user) return;

    //     if (user.data?.userRole === 'user') {
    //         navigate('/client', { replace: true });
    //     }
    // }, [user, navigate]);

    const stats = [
        { name: 'Total Users', value: filteredUsers?.length || 0, icon: Users, color: 'blue' },
        { name: 'Total Categories', value: category?.length || 0, icon: ShoppingCart, color: 'emerald' },
        { name: 'Total Products', value: products?.length || 0, icon: CreditCard, color: 'purple' },
        { name: 'Total Admins', value: 1, icon: Package, color: 'orange' },
    ];
    const { theme } = useSelector(state => state.themeState)
    const isDark = theme === "dark";

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch]);

    useEffect(() => {
        dispatch(viewAllCategory());
    }, [dispatch]);

    useEffect(() => {
        dispatch(showAllProducts())
    }, [dispatch])

    if (loading) {
        return (
            <div className="p-6 lg:p-10">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isDark ? "bg-zinc-900" : "bg-white"} p-8 rounded-3xl border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className={`h-3 rounded w-3/4 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                            <div className={`h-8 rounded-lg w-full ${isDark ? "bg-zinc-700" : "bg-zinc-100"}`}></div>
                            <div className={`h-4 rounded w-1/2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (

        <div className={`p-6 lg:p-10 space-y-8 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tighter ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        Dashboard
                    </h1>
                    <p className={`mt-1 font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        Monitor your store's performance at a glance.
                    </p>
                </div>
                {/* <div className="flex gap-3">
                    <button className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isDark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100 border" : "bg-white shadow-sm hover:shadow-md border border-zinc-200 text-zinc-900"}`}>
                        Generate Report
                    </button>
                </div> */}
            </div>

            {/* Stats Cards - Grid remains responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className={`
                            group p-6 rounded-[2rem] border transition-all duration-300
                            ${isDark
                                ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 shadow-2xl shadow-black/20"
                                : "bg-white border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/40"
                            }
                        `}>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                        {stat.name}
                                    </p>
                                    <p className={`text-3xl font-black tracking-tighter ${isDark ? "text-white" : "text-zinc-900"}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl transition-all ${isDark ? `bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20` : `bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-100`}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`lg:col-span-7 p-8 rounded-[2.5rem] border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black italic tracking-tighter">Analysis</h3>
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isDark ? ' text-zinc-500' : ' text-zinc-400'}`}>Live Data</div>
                </div>
                <div className={`h-fit rounded-3xl flex flex-col items-center justify-center  ${isDark ? "bg-zinc-800/20 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                    More Analysis Coming soon
                </div>
            </div>

            {/* Detailed View Section */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className={`lg:col-span-7 p-8 rounded-[2.5rem] border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic tracking-tighter">Performance Analysis</h3>
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-100 text-zinc-400'}`}>Live Data</div>
                    </div>
                    <div className={`h-80 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed ${isDark ? "bg-zinc-800/20 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                        <div className="flex items-center gap-3 text-zinc-500 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Compiling Statistics...</span>
                        </div>
                    </div>
                </div>

                <div className={`lg:col-span-5 p-8 rounded-[2.5rem] border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
                    <h3 className="text-xl font-black italic mb-6 tracking-tighter">Recent Sales</h3>
                    <div className="space-y-4">
                        {[
                            { id: '#12345', customer: 'John Doe', amount: '$129.99', status: 'Delivered', color: 'emerald' },
                            { id: '#12344', customer: 'Jane Smith', amount: '$89.50', status: 'Shipped', color: 'blue' },
                            { id: '#12343', customer: 'Bob Wilson', amount: '$245.00', status: 'Pending', color: 'orange' },
                        ].map((order) => (
                            <div key={order.id} className={`
                                p-4 rounded-2xl border flex items-center justify-between group transition-all
                                ${isDark ? "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700" : "bg-zinc-50/50 border-zinc-100 hover:bg-white hover:shadow-lg"}
                            `}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-${order.color}-500 shadow-lg shadow-${order.color}-500/50`}></div>
                                    <div>
                                        <p className="font-bold text-sm tracking-tight">{order.id}</p>
                                        <p className={`text-[10px] font-bold uppercase ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-sm tracking-tight">{order.amount}</p>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;