import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';

const Logout = () => {
    const navigate = useNavigate();

    const {theme} = useSelector(state => state.themeState)

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"}`}>
            <div className={`w-full max-w-[400px] p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-600"}`}>
                    <LogOut className="w-8 h-8" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Confirm Logout</h2>
                <p className={`text-sm mb-8 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Are you sure you want to sign out of your account?</p>

                <div className="flex gap-3">
                    <button onClick={() => navigate(-1)} className={`flex-1 py-2.5 rounded-lg font-semibold border ${theme === "dark" ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}>
                        Cancel
                    </button>
                    <button onClick={() => navigate("/login")} className="flex-1 py-2.5 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700">
                        Yes, Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;