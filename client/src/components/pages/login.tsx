import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import Loader from '../UI/loader';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slice/auth.slice';

import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState("");
    const { theme } = useSelector(state => state.themeState)
    const { loading, error, user } = useSelector(state => state.authState)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        // Google OAuth login logic here
        toast.info("Google login coming soon!");
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setFormError("");

        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        const userPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$])[a-zA-Z0-9@&$]{8,}$/;

        if (!userEmailRegex.test(email)) return setFormError("Please enter a valid email address.");

        if (!userPasswordRegex.test(password)) return setFormError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");

        const userDetails = {
            userEmail: email,
            userPassword: password
        }

        dispatch(loginUser(userDetails))
            .unwrap()
            .then(() => {
                navigate('/admin/');
                toast.success("Login Successful")
            })
            .catch((error: string) => {
                toast.error(`${error}`);
            })

    };

    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"
            }`}>
            <div className={`w-full max-w-[420px] p-8 rounded-2xl shadow-2xl border transition-all ${theme === "dark" ? "bg-zinc-900 border-zinc-800 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200"
                }`}>
                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Welcome Back</h1>
                    <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Please enter your details to sign in</p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className={`w-full py-2.5 px-4 border rounded-lg flex items-center justify-center gap-3 mb-5 font-medium transition-all hover:shadow-md active:scale-95 ${theme === "dark" ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:bg-zinc-700" : "bg-white border-zinc-300 hover:border-zinc-400 text-zinc-700 hover:bg-zinc-50"
                        }`} >

                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Continue with Google
                </button>

                <div className={`relative flex items-center ${theme === "dark" ? "before:bg-zinc-700 after:bg-zinc-700" : "before:bg-zinc-300 after:bg-zinc-300"}`}>
                    <div className={`absolute inset-0 flex items-center ${theme === "dark" ? "bg-zinc-900" : "bg-white"}`}>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-600"></div>
                    </div>
                    <span className={`relative px-3 text-xs uppercase font-medium tracking-wide ${theme === "dark" ? "text-zinc-500 bg-zinc-900" : "text-zinc-500 bg-white"}`}>or</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 mt-6">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                            <input
                                type="email"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"
                                    }`}
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className={`text-sm font-medium ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Password</label>
                            <Link to="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full pl-10 pr-12 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"
                                    }`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {formError && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${theme === "dark" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"
                            }`}>
                            <AlertCircle className="w-4 h-4" /> {formError}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${theme === "dark" ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                            }`}
                    >
                        <LogIn className="w-5 h-5" /> Sign In
                    </button>
                </form>

                <p className={`text-center mt-8 text-sm ${theme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>
                    Don't have an account? <Link to="/register" className="text-indigo-500 font-bold hover:underline">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
