import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import Loader from '../UI/loader';
import { useSelector } from 'react-redux';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const {theme} = useSelector(state => state.themeState)

    useEffect(() => {
        if (timer > 0) setTimeout(() => setTimer(timer - 1), 1000);
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join("");
        if (code.length < 6) return alert("Enter full code");

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (code === "123456") {
                navigate("/login");
            } else {
                alert("Incorrect OTP");
            }
        }, 1500);
    };

    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"}`}>
            <div className={`w-full max-w-[420px] p-8 rounded-2xl shadow-2xl border text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Verify OTP</h2>
                <p className={`text-sm mb-8 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Enter the 6-digit code sent to your email.</p>

                <div className="flex justify-between gap-2 mb-8">
                    {otp.map((data, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength="1"
                            ref={(el) => (inputRefs.current[i] = el)}
                            value={data}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => e.key === "Backspace" && !otp[i] && i > 0 && inputRefs.current[i - 1].focus()}
                            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-indigo-600"
                                }`}
                        />
                    ))}
                </div>

                <button onClick={handleVerify} className={`w-full py-3 rounded-lg font-bold mb-4 ${theme === "dark" ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white"}`}>
                    Verify Account
                </button>

                <button
                    disabled={timer > 0}
                    className={`flex items-center justify-center gap-2 mx-auto text-sm font-medium ${timer > 0 ? "opacity-50 cursor-not-allowed" : "text-indigo-500"}`}
                    onClick={() => setTimer(30)}
                >
                    <RefreshCw className={`w-4 h-4 ${timer > 0 ? "" : "animate-spin-slow"}`} />
                    {timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;