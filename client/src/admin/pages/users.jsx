import { useEffect, useState } from 'react';
import { Search, Mail, MapPin, Globe, Filter, Download, ChevronDown, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { filteredUsersFun, getAllUsers } from '../../redux/slice/users.slice';

const Users = () => {

    const { theme } = useSelector(state => state.themeState);
    const isDark = theme === "dark";
    const { filteredUsers, loading } = useSelector(state => state.usersState);

    const [searchValue, setSearchValue] = useState('');
    // console.log(filteredUsers);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch]);

    useEffect(() => {
        const userDetails = {};

        if (searchValue) userDetails.search = searchValue;

        dispatch(filteredUsersFun(userDetails));
    }, [searchValue, dispatch]);


    const getThemeClass = () => isDark ? "bg-zinc-950 text-zinc-100" : "bg-[#f8fafc] text-zinc-900";

    const getCardClass = () => isDark
        ? "bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50"
        : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/60";

    const getInputClass = () => isDark
        ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500"
        : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500 shadow-inner";

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-4 md:p-10 ${getThemeClass()} transition-all duration-500`}>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Export */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className={`text-4xl font-black tracking-tighter ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>User Management</h1>
                        <p className={`mt-2 font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Monitor account activity and access permissions</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
                        <Download className="w-5 h-5" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Filters Bar */}
                <div className={`p-4 rounded-3xl border ${getCardClass()} flex flex-col lg:flex-row gap-4`}>
                    <div className="relative grow">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            type="text"
                            placeholder="Search by name or email"
                            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none font-bold ${getInputClass()}`}
                        />
                    </div>
                </div>

                {/* Main Table */}
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                    {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                className={`group transition-all ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}`}
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="relative shrink-0">
                                            <img
                                                src={user.userProfileImage}
                                                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-500/10 group-hover:ring-blue-500/30 transition-all shadow-lg"
                                                alt=""
                                            />
                                            <div
                                                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 ${isDark ? 'border-zinc-900' : 'border-white'
                                                    } ${user.userIsBlocked === 'active'
                                                        ? 'bg-emerald-500'
                                                        : 'bg-red-500'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className={`font-black text-lg leading-tight tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'
                                                    }`}
                                            >
                                                @{user.userName}
                                            </p>
                                            <span
                                                className={`text-[10px] font-black uppercase tracking-widest ${user.userRole === 'admin'
                                                    ? 'text-amber-500'
                                                    : isDark
                                                        ? 'text-zinc-500'
                                                        : 'text-zinc-400'
                                                    }`}
                                            >
                                                {user.userRole} ACCOUNT
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    <div className="space-y-1">
                                        <div
                                            className={`flex items-center gap-2 font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'
                                                }`}
                                        >
                                            <Mail className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">{user.userEmail}</span>
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                                                }`}
                                        >
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-xs truncate max-w-[180px] font-bold">
                                                {user.userAddress || 'not given'}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    <div
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border ${isDark
                                            ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                            : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                            }`}
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase">
                                            {user.userAuthProvider}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    <div
                                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${user.userIsBlocked === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}
                                    >
                                        {user.userIsBlocked?.toUpperCase()}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                className={`px-8 py-12 text-center font-black tracking-widest uppercase text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                                    }`}
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>

            </div>
        </div >
    );
};

export default Users;