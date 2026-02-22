import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trash2, Info, Loader2, PackageOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Note: Assuming these actions exist or will be added to your product slice
import { getAllTrashProducts, restoreProduct } from '../../redux/slice/trash.slice';

const Trash = () => {
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.themeState);

    useEffect(() => {
        dispatch(getAllTrashProducts());
    }, [dispatch]);

    const { trashProduct, loading } = useSelector(state => state.trashState);
    const isDark = theme === "dark";



    const handleRestore = (id) => {

        dispatch(restoreProduct(id))
            .unwrap()
            .then(() => {
                toast.success("Product restored");
            })
            .catch((error) => {
                toast.error(`${error}`);
            });

        dispatch(getAllTrashProducts());
    };

    const getCardClass = () => isDark
        ? "bg-zinc-900 border-zinc-800 shadow-2xl"
        : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50";

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-8 space-y-8 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tighter flex items-center gap-3 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                        <Trash2 className="text-red-500" size={36} /> Trash Repository
                    </h1>
                    <p className={`font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Review and restore recently removed assets</p>
                </div>
            </div>

            {/* Content Table */}
            <div className={`rounded-[2.5rem] border overflow-hidden ${getCardClass()}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className={`${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'} border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <tr>
                                <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Trashed Product</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Category</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Original Price</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Deleted Date</th>
                                <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Recover</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                            {trashProduct && trashProduct.length == 0
                                ? (<tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <PackageOpen className={`mx-auto mb-4 opacity-20 ${isDark ? 'text-zinc-400' : 'text-zinc-900'}`} size={48} />
                                        <p className={`font-bold italic ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Trash is empty. No items found.</p>
                                    </td>
                                </tr>)
                                : (trashProduct && trashProduct.map((product) => (
                                    <tr key={product._id} className={`group transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.productImages[0]}
                                                    className={`w-12 h-12 rounded-xl object-cover border grayscale opacity-60 ${isDark ? 'border-zinc-700' : 'border-zinc-100'}`}
                                                    alt=""
                                                />
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{product.productName}</span>
                                                    <span className="text-[10px] font-black opacity-30 uppercase">ID: {product._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-5 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{product.productCategory.categoryName}</td>

                                        <td className="px-6 py-5 font-black text-blue-500">₹{product.productPrice}</td>

                                        <td className={`px-6 py-5 text-xs font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                            {new Date().toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleRestore(product._id)}
                                                className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ml-auto font-black text-[10px] uppercase tracking-widest ${isDark
                                                    ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-600/10'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                                                    }`}
                                            >
                                                <RotateCcw size={16} />
                                                <span className="hidden sm:inline">Restore</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Trash;