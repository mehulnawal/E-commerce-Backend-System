import { useState, useRef, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Loader from '../UI/loader';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/slice/auth.slice';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const navigate = useNavigate();
  const { theme } = useSelector(state => state.themeState)
  const { loading, userEmail } = useSelector(state => state.authState)

  // console.log(userEmail);

  const dispatch = useDispatch();

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Visibility States
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length < 5) return setError("Please enter the 5-digit OTP sent to " + userEmail);

    const userPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$])[a-zA-Z0-9@&$]{8,}$/;
    if (!newPassword)
      return setError("Enter password.");
    if (!userPasswordRegex.test(newPassword))
      return setError("Password format invalid. One Uppercase, one lowercase , one number and one character between @&$ and min length should be 8");

    if (newPassword !== newPassword)
      return setError("Passwords do not match.")
    const userDetails = {
      "otp": otp.join(""),
      "newPassword": newPassword,
      "userEmail": userEmail
    }

    // Simulating API call
    dispatch(resetPassword(userDetails))
      .unwrap()
      .then(() => {
        toast.success("New password set")
        navigate('/login')
      })
      .catch((error) => {
        toast.error(`${error}`);
      })

  };

  const resendOTP = () => {
    setTimer(30);
    navigate('/forgot-password')
  }

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"
      }`}>
      <div className={`w-full max-w-110 p-8 rounded-3xl shadow-2xl border transition-all ${theme === "dark" ? "bg-zinc-900 border-zinc-800 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200"
        }`}>

        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center rotate-6 ${theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
            }`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
            Secure Reset
          </h2>
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
            Verification code sent to <span className="font-bold">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={(e) => handleReset(e)} className="space-y-6">

          {/* OTP Input Fields */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                OTP Code
              </label>
              <button
                type="button"
                disabled={timer > 0}
                onClick={() => resendOTP()}
                className={`text-xs font-bold transition-colors ${timer > 0 ? "text-zinc-600" : "text-indigo-500 hover:text-indigo-400"
                  }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((data, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[i] = el)}
                  value={data}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => e.key === "Backspace" && !otp[i] && i > 0 && inputRefs.current[i - 1]?.focus()}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all ${theme === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:ring-4 ring-indigo-500/10"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-indigo-600 focus:ring-4 ring-indigo-600/5"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-20" />

          {/* New Password Field */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                New Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border outline-none text-sm transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-600"
                    }`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                Confirm Password
              </label>
              <div className="relative">
                <CheckCircle className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border outline-none text-sm transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-600"
                    }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className={`flex items-center gap-2 p-3.5 rounded-xl text-xs font-bold ${theme === "dark" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${theme === "dark"
              ? "bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] hover:bg-indigo-500"
              : "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
              }`}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;