import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import Loader from '../UI/loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { forgetPassword } from '../../redux/slice/auth.slice';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.authState)
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.themeState)

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Basic Email Validation
        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!email)
            return setError("Enter email id.");
        else if (!userEmailRegex.test(email))
            return setError("Invalid email.");


        // Simulating API call
        dispatch(forgetPassword(email))
            .unwrap()
            .then(() => {
                toast.success("Otp send")
                navigate('/reset-password')
            })
            .catch((error) => {
                toast.error(`${error}`);
            })
    };

    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"
            }`}>
            <div className={`w-full max-w-105 p-8 rounded-3xl shadow-2xl border transition-all ${theme === "dark" ? "bg-zinc-900 border-zinc-800 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200"
                }`}>

                <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center -rotate-6 ${theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                        }`}>
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                        Forgot Password?
                    </h2>
                    <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                        Enter your email to receive a 6-digit verification code.
                    </p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                            }`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                                }`} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm transition-all ${theme === "dark"
                                    ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:ring-4 ring-indigo-500/10"
                                    : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-600 focus:ring-4 ring-indigo-600/5"
                                    }`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold px-1">{error}</p>
                    )}

                    <button className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${theme === "dark"
                        ? "bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] hover:bg-indigo-500"
                        : "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Send Code
                        </div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className={`text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors ${theme === "dark" ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900"
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;