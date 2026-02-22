import { useState, useEffect } from 'react';
import { Loader2, Shield, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdmin } from '../../redux/slice/users.slice';

const Admins = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const { allAdmin, loading } = useSelector(state => state.usersState);
    const { theme } = useSelector(state => state.themeState);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllAdmin())
    }, [dispatch]);

    const isDark = theme === 'dark';

    const getCardClass = () => isDark
        ? "bg-zinc-900 border-zinc-800 shadow-2xl"
        : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50";


    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                <p className={`font-black uppercase tracking-widest text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Securing Access...</p>
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-8 space-y-8 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Admin Authority</h1>
                        <p className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Manage privileged account access</p>
                    </div>
                </div>
            </div>

            {/* Admins Table Container */}
            <div className={`rounded-[2.5rem] border overflow-hidden ${getCardClass()}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`${isDark ? 'bg-zinc-800/50 text-zinc-500' : 'bg-zinc-50 text-zinc-400'} border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Administrator</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Security Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest hidden lg:table-cell">Activity</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                            {allAdmin && allAdmin?.map((admin) => (
                                <tr key={admin._id} className={`group transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-orange-50/30'}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={admin.userProfileImage} className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-500/10" alt="" />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-zinc-900' : 'border-white'} ${admin.userIsBlocked === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">@{admin.userName}</p>
                                                <p className={`text-[11px] font-medium opacity-60`}>{admin.userEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${admin.userIsBlocked === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {admin.userIsBlocked.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 hidden lg:table-cell">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Last Login</span>
                                            <span className="text-xs font-bold">{admin.sessionStartedAt ? new Date(admin.sessionStartedAt).toLocaleDateString() : 'Never'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-[2rem] border p-8 ${getCardClass()}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black italic tracking-tighter">New Authority</h2>
                            <button onClick={() => setShowAddModal(false)} className="opacity-40 hover:opacity-100 transition-all"><XCircle /></button>
                        </div>
                        <div className="py-8 text-center space-y-4">
                            <Shield size={48} className="mx-auto text-orange-500 opacity-20" />
                            <p className="font-bold text-sm">Configure permissions for the new admin account. Feature coming soon.</p>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-black text-xs uppercase tracking-widest">Close Access</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;