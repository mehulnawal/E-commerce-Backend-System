import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({ children }) => {

    const { user, loading } = useSelector(state => state.authState);
    if (user?.data?.userRole !== 'admin') {
        return <Navigate to="/client" replace />;
    }

    if (loading) {
        return (
            <div className="p-6 lg:p-10">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isDark ? "bg-zinc-900" : "bg-white"} p-8 rounded-3xl border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className={`h-3 rounded w-3/4 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                            <div className={`h-8 rounded-lg w-full ${isDark ? "bg-zinc-700" : "bg-zinc-100"}`}></div>
                            <div className={`h-4 rounded w-1/2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return children;
}