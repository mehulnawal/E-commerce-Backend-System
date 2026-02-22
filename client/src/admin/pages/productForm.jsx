import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, ImageIcon, Info, Plus, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addNewProducts, editProducts, showAllProducts } from '../../redux/slice/products.slice';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useSelector(state => state.themeState);
    const isDark = theme === "dark";
    const { category } = useSelector(state => state.categoryState);
    const [categoryId, setCategoryId] = useState(null);
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.productState);
    const [formData, setFormData] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productCategory: '',
        productStatus: 'published'
    });

    const [images, setImages] = useState({ banner: null, detail1: null, detail2: null });
    const [previews, setPreviews] = useState({ banner: '', detail1: '', detail2: '' });

    useEffect(() => {
        if (!id || products.length === 0) return;

        const product = products.find(p => p._id === id);

        if (!product) return;

        setFormData({
            productName: product.productName,
            productPrice: product.productPrice,
            productDescription: product.productDescription,
            productCategory: product.productCategory._id,
            productStatus: product.productStatus
        });

        setCategoryId(product.productCategory._id);

        setPreviews({
            banner: product.productImages?.[0] || '',
            detail1: product.productImages?.[1] || '',
            detail2: product.productImages?.[2] || '',
        });
    }, [id, products]);


    const handleImageChange = (e, slot) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [slot]: file }));
            setPreviews(prev => ({ ...prev, [slot]: URL.createObjectURL(file) }));
        }
    };

    const handlePublish = () => {
        const {
            productName,
            productPrice,
            productDescription,
            productStatus
        } = formData;

        if (!productName) {
            toast.error("Product name is required");
            return;
        }

        if (!productPrice) {
            toast.error("Product price is required");
            return;
        }

        if (!productDescription) {
            toast.error("Product description is required");
            return;
        }

        if (!categoryId) {
            toast.error("Product category is required");
            return;
        }

        if (!id) {
            if (!previews.banner) {
                toast.error("Banner image is required");
                return;
            }

            if (!previews.detail1) {
                toast.error("Detail image 1 is required");
                return;
            }

            if (!previews.detail2) {
                toast.error("Detail image 2 is required");
                return;
            }
        }

        const filteredImages = {};

        if (images.banner) {
            filteredImages.banner = images.banner;
        }

        if (images.detail1) {
            filteredImages.detail1 = images.detail1;
        }

        if (images.detail2) {
            filteredImages.detail2 = images.detail2;
        }

        const productDetails = {
            productId: id,
            productName,
            productPrice,
            productDescription,
            productCategory: categoryId,
            productStatus,
            productImages: filteredImages
        };

        if (id) {
            dispatch(editProducts(productDetails))
                .unwrap()
                .then(() => {
                    toast.success("Product updated successfully");
                    navigate("/admin/products");
                })
                .catch((error) => {
                    toast.error(error || "Failed to update product");
                });
        } else {
            dispatch(addNewProducts(productDetails))
                .unwrap()
                .then(() => {
                    toast.success("Product added successfully");
                    navigate("/admin/products");
                })
                .catch((error) => {
                    toast.error(error || "Failed to add product");
                });
        }
    };


    const getCardClass = () => isDark
        ? "bg-zinc-900 border-zinc-800 shadow-2xl"
        : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50";

    const getInputClass = () => isDark
        ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:bg-zinc-800/50"
        : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500 shadow-inner";

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-8 max-w-7xl mx-auto space-y-8 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>

            {/* Action Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate('/admin/products')} className={`flex items-center gap-2 font-bold transition-all ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase border transition-all ${isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
                    >
                        Discard
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-700"
                    >
                        {id ? 'Save Changes' : 'Publish Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Form Details */}
                <div className={`lg:col-span-7 space-y-6 p-8 rounded-[2.5rem] border ${getCardClass()}`}>
                    <h3 className="text-xl font-black italic flex items-center gap-2 tracking-tighter">
                        <Info size={20} className="text-blue-500" /> Specifications
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Product Title</label>
                            <input
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                className={`w-full p-4 rounded-2xl border outline-none font-bold transition-all ${getInputClass()}`}
                                placeholder="Enter name..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Category</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.productCategory}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                productCategory: e.target.value
                                            }));
                                            setCategoryId(e.target.value);
                                        }}
                                        className={`w-full p-3.5 pr-10 rounded-xl border outline-none appearance-none font-bold transition-all ${getInputClass()}`}>

                                        <option value="" className={isDark ? 'bg-zinc-900' : 'bg-white'}>Select Parent</option>
                                        {
                                            category.map(cat => (
                                                <option key={cat._id} value={cat._id} className={isDark ? 'bg-zinc-900' : 'bg-white'}>{cat.categoryName}</option>
                                            ))
                                        }

                                    </select>
                                    <Plus size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Price (INR)</label>
                                <input
                                    type="number"
                                    value={formData.productPrice}
                                    onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                                    className={`w-full p-4 rounded-2xl border outline-none font-bold transition-all ${getInputClass()}`}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Status</label>
                            <div className={`flex p-1.5 rounded-2xl border max-w-sm ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
                                {['published', 'draft'].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, productStatus: s })}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.productStatus === s ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Description</label>
                            <textarea
                                value={formData.productDescription}
                                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                                className={`w-full p-4 rounded-2xl border outline-none font-bold min-h-[150px] transition-all ${getInputClass()}`}
                                placeholder="Details..."
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Images */}
                <div className="lg:col-span-5 space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border ${getCardClass()}`}>
                        <h3 className="text-xl font-black italic mb-6 flex items-center gap-2 tracking-tighter">
                            <ImageIcon size={20} className="text-blue-500" /> Media Gallery
                        </h3>

                        <div className="space-y-6">
                            <label className={`relative block w-full h-56 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${previews.banner ? 'border-blue-500' : isDark ? 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/30' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50'}`}>
                                {previews.banner ? <img src={previews.banner} className="w-full h-full object-cover" alt="" /> : <div className={`text-center font-black text-[10px] tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}><Upload className="mx-auto mb-2" /> UPLOAD BANNER</div>}
                                <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'banner')} />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                {['detail1', 'detail2'].map((slot) => (
                                    <label key={slot} className={`relative block w-full h-36 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${previews[slot] ? 'border-blue-500' : isDark ? 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/30' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50'}`}>
                                        {previews[slot] ? <img src={previews[slot]} className="w-full h-full object-cover" alt="" /> : <Plus className={isDark ? "text-zinc-600" : "text-zinc-400"} />}
                                        <input type="file" className="hidden" onChange={(e) => handleImageChange(e, slot)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;