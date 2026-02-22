import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, showAllProducts } from '../../redux/slice/products.slice';
import { toast } from 'react-toastify';

const Products = () => {
    const navigate = useNavigate();

    const { theme } = useSelector(state => state.themeState);
    const isDark = theme === "dark";

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showAllProducts())
    }, [dispatch])

    const { products, loading } = useSelector(state => state.productState);
    // console.log(products);

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

    const deleteProductFun = (productId) => {
        dispatch(deleteProduct(productId))
            .unwrap()
            .then(() => {
                toast.success("Product moved to trash");
            })
            .catch((error) => {
                toast.error(`${error}`);
            });

        dispatch(showAllProducts());
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tighter ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>Inventory</h1>
                    <p className={`font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage and organize your product catalog</p>
                </div>
                <button
                    onClick={() => navigate('/admin/product/add')}
                    className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all hover:shadow-xl active:scale-95"
                >
                    <Plus size={18} /> Add New Asset
                </button>
            </div>

            <div className={`rounded-[2.5rem] border overflow-hidden ${getCardClass()}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className={`${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'} border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <tr>
                                <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Product</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Category</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Pricing</th>
                                <th className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Status</th>
                                <th className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                            {products && products.map((product) => (
                                <tr key={product._id} className={`group transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-blue-50/50'}`}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">

                                            <img src={product?.productImages[0]} className={`w-12 h-12 rounded-xl object-cover border ${isDark ? 'border-zinc-700' : 'border-zinc-100'}`} alt="" />

                                            <span className={`font-bold text-sm ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{product.productName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-5 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{product.productCategory.categoryName}</td>
                                    <td className="px-6 py-5 font-black text-blue-500">₹{product.productPrice}</td>
                                    <td className={`px-6 py-5 italic text-xs uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{product.productStatus}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                                            className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-500/10 text-blue-500'}`}
                                        >
                                            <Edit3 size={18} />
                                        </button>

                                        <button
                                            onClick={e => deleteProductFun(product._id)}
                                            className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-red-500'}`} >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;