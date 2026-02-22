import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, AlertCircle, Phone, Camera, X, Eye, EyeOff } from 'lucide-react';
import Loader from '../UI/loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../../redux/slice/auth.slice';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: ""
    });

    const { theme } = useSelector(state => state.themeState)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.authState)
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return setFormError("Image size should be less than or equal to 5MB");
            console.log(file);
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setFormError("");
        if (!profileImage) return setFormError("Please upload a profile image.");


        const userNameRegex = /^[a-zA-Z0-9]+$/;
        if (!formData.name)
            return setFormError("Enter name.");
        if (!userNameRegex.test(formData.name))
            return setFormError("Name can only contains characters");

        const userNumberRegex = /^[0-9]{10}$/;
        if (!formData.number)
            return setFormError("Enter number.")
        if (!userNumberRegex.test(formData.number))
            return setFormError("Invalid number");


        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!formData.email)
            return setFormError("Enter email id.");
        else if (!userEmailRegex.test(formData.email))
            return setFormError("Invalid email.");


        const userPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$])[a-zA-Z0-9@&$]{8,}$/;
        if (!formData.password)
            return setFormError("Enter password.");
        if (!userPasswordRegex.test(formData.password))
            return setFormError("Password format invalid. One Uppercase, one lowercase , one number and one character between @&$ and min length should be 8");

        if (formData.password !== formData.confirmPassword)
            return setFormError("Passwords do not match.")


        const userDetails = {
            userName: formData.name,
            userEmail: formData.email,
            userPassword: formData.password,
            userNumber: formData.number,
            userProfileImage: profileImage,
        }

        dispatch(registerUser(userDetails))
            .unwrap()
            .then(() => {
                navigate('/admin/');
                toast.success("Register Successful")

                // if (data.data.userRole == 'admin')
                // else if (data.data.userRole == 'user')
                //     navigate('/user');
            })
            .catch((error) => {
                toast.error(`${error}`);
            })
    };

    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"}`}>
            <div className={`w-full max-w-[520px] p-8 rounded-2xl shadow-2xl border transition-all ${theme === "dark" ? "bg-zinc-900 border-zinc-800 shadow-black/50" : "bg-white border-zinc-200 shadow-zinc-200"}`}>

                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Create Account</h1>
                    <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Please enter your details to sign up</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="relative group cursor-pointer">
                            <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? "border-indigo-500 border-solid" : (theme === "dark" ? "border-zinc-700 bg-zinc-800" : "border-zinc-300 bg-zinc-50")
                                }`}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className={`w-8 h-8 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 w-full h-full rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase"
                            >
                                {imagePreview ? "Change" : "Upload"}
                            </button>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform active:scale-90"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleImageChange(e)} accept="image/*" className="" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Full Name</label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"}`}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Phone Number</label>
                            <div className="relative">
                                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                <input
                                    type="tel"
                                    placeholder="1234567890"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"}`}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}

                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Email Address</label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"}`}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"}`}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}

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

                        {/* Confirm Password */}
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Confirm Password</label>
                            <div className="relative">
                                <CheckCircle2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border outline-none transition-all ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-white border-zinc-300 text-zinc-900 focus:border-indigo-600"}`}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}

                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {formError && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${theme === "dark" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"}`}>
                            <AlertCircle className="w-4 h-4" /> {formError}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${theme === "dark" ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"}`}
                    >
                        Sign Up
                    </button>
                </form>

                <p className={`text-center mt-8 text-sm ${theme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>
                    Already have an account? <Link to="/login" className="text-indigo-500 font-bold hover:underline">Sign in</Link>
                </p>

                <p className={`text-center mt-4 text-xs font-medium tracking-tight ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>
                    By signing up, you agree to our <span className="underline cursor-pointer">Terms</span>.
                </p>
            </div>
        </div>
    );
};

export default Register;