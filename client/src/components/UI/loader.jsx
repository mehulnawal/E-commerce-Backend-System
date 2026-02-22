import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Loader = () => {

    const { theme } = useSelector(state => state.themeState)

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
            }`}>
            <Loader2 className={`w-10 h-10 animate-spin ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`} />
            <p className={`mt-4 text-sm font-medium ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                Preparing your experience...
            </p>
        </div>
    );
};

export default Loader;