import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, MapPinOff, ArrowLeft, Home, RotateCcw } from 'lucide-react';

const theme = "dark";

/**
 * ErrorPage Component
 * @param {number} errorCode - 404 or 401
 */

export const ErrorPage = ({ errorCode = 404 }) => {
    const navigate = useNavigate();

    // Configuration mapping based on error code
    const errorConfig = {
        404: {
            title: "Page Not Found",
            description: "Oops! The page you are looking for doesn't exist or has been moved to a different universe.",
            icon: <MapPinOff className="w-12 h-12" />,
            primaryLabel: "Back to Home",
            primaryPath: "/login",
            accentColor: "indigo"
        },
        401: {
            title: "Unauthorized Access",
            description: "Wait a minute! You don't have the proper credentials to access this secure area.",
            icon: <ShieldAlert className="w-12 h-12" />,
            primaryLabel: "Login Now",
            primaryPath: "/login",
            accentColor: "rose"
        }
    };

    const config = errorConfig[errorCode] || errorConfig[404];

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
            }`}>
            <div className="w-full max-w-[420px] text-center">
                {/* Animated Icon Wrapper */}
                <div className={`relative w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-3xl rotate-12 transition-transform hover:rotate-0 duration-500 ${theme === "dark"
                    ? "bg-zinc-900 border border-zinc-800 text-indigo-400 shadow-2xl shadow-indigo-500/10"
                    : "bg-white border border-zinc-200 text-indigo-600 shadow-xl shadow-zinc-200"
                    }`}>
                    {config.icon}
                    <span className={`absolute -top-2 -right-2 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${theme === "dark" ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600"
                        }`}>
                        Err_{errorCode}
                    </span>
                </div>

                {/* Text Content */}
                <h1 className={`text-5xl font-black mb-3 tracking-tighter ${theme === "dark" ? "text-white" : "text-zinc-900"
                    }`}>
                    {errorCode}
                </h1>
                <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                    }`}>
                    {config.title}
                </h2>
                <p className={`text-sm leading-relaxed mb-10 px-4 ${theme === "dark" ? "text-zinc-500" : "text-zinc-500"
                    }`}>
                    {config.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        to={config.primaryPath}
                        className={`group w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${theme === "dark"
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                            }`}
                    >
                        {errorCode === 401 ? <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> : <Home className="w-4 h-4" />}
                        {config.primaryLabel}
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-all hover:bg-opacity-50 ${theme === "dark"
                            ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Footer Link */}
                <p className={`mt-12 text-xs font-medium tracking-wide uppercase ${theme === "dark" ? "text-zinc-700" : "text-zinc-400"
                    }`}>
                    Security System Status: <span className="text-emerald-500">Active</span>
                </p>
            </div>
        </div>
    );
};