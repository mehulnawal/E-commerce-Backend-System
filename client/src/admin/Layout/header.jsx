import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronDown, Moon, Sun, User as UserIcon,
    LogOut, Menu, X, Bell, Search
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slice/theme.slice';
import { toast } from 'react-toastify';
import { logout } from '../../redux/slice/auth.slice';
import { getAllUsers } from '../../redux/slice/users.slice';

const Header = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.themeState);
    const { user } = useSelector(state => state.authState);
    const userDetails = user?.data;

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch]);

    const isDark = theme === "dark";

    const handleLogout = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success("Logout Successful");
                navigate('/login');
            })
            .catch((error) => {
                toast.error(`${error}`);
            });
        setProfileOpen(false);
    };

    return (
        <header className={` sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${isDark
            ? "bg-zinc-900/90 border-zinc-800 shadow-lg"
            : "bg-white/80 border-zinc-200 shadow-sm"} `}
        >

            <div className="px-4 sm:px-6 lg:px-10 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className={`p-2.5 rounded-2xl transition-all active:scale-90 flex items-center justify-center border
                                ${isDark
                                    ? "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
                                    : "bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200 shadow-sm"}
                            `}
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="hidden sm:block">
                            <h2 className={`text-sm font-black tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                Hello, {userDetails?.userName?.split(' ')[0] || 'Admin'} 👋
                            </h2>
                            <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Actions & Profile */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`p-2.5 rounded-xl transition-all border ${isDark
                                ? "bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700"
                                : "bg-zinc-50 border-zinc-200 text-indigo-600 hover:bg-zinc-100 shadow-sm"
                                }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className={`h-8 w-px mx-1 ${isDark ? "bg-zinc-700" : "bg-zinc-200"}`}></div>

                        {/* PROFILE DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all border
                                    ${isDark
                                        ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                                        : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"}
                                `}
                            >
                                <div className="relative">
                                    <img
                                        src={userDetails?.userProfileImage}
                                        alt="profile"
                                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 rounded-full ${isDark ? "border-zinc-800" : "border-white"}`}></div>
                                </div>

                                <div className="hidden md:block text-left">
                                    <p className={`text-xs font-black truncate max-w-[80px] ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                        {userDetails?.userName?.toUpperCase()}
                                    </p>
                                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                        {userDetails?.userRole}
                                    </p>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDark ? "text-zinc-400" : "text-zinc-400"} ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* DROPDOWN MENU */}
                            {profileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                                    <div className={`
                                        absolute right-0 mt-3 w-64 origin-top-right rounded-3xl border z-20 overflow-hidden
                                        animate-in fade-in zoom-in-95 duration-200
                                        ${isDark
                                            ? "bg-zinc-800 border-zinc-700 shadow-xl"
                                            : "bg-white border-zinc-200 shadow-2xl shadow-zinc-200"}
                                    `}>
                                        <div className={`p-5 border-b ${isDark ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-50 bg-zinc-50"}`}>
                                            <p className={`text-[10px] font-black tracking-widest uppercase mb-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Signed in as</p>
                                            <p className={`font-bold truncate ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                                {userDetails?.userEmail}
                                            </p>
                                        </div>

                                        <div className={`p-2 ${isDark ? "bg-zinc-800" : "bg-white"}`}>
                                            <button
                                                onClick={handleLogout}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                                    ${isDark ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-600"}
                                                `} >

                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <LogOut className="w-4 h-4" />
                                                </div>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;