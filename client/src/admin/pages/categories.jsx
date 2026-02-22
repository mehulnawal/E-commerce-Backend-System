import { useState, useEffect, useRef } from 'react';
import {
    Plus, Edit3, Loader2, AlertCircle, ChevronDown, ChevronRight,
    Layers, Tag, Info, CheckCircle2, XCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCategory, editNewCategory, statusToggleCategory, viewAllCategory } from '../../redux/slice/category.slice';
import { addNewSubCategory, editNewSubCategory, statusToggleSubCategory } from '../../redux/slice/subCategory.slice';
import { toast } from 'react-toastify';

const Categories = () => {
    const [isSubCategoryMode, setIsSubCategoryMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.themeState);
    const { category, loading } = useSelector(state => state.categoryState);

    const isDark = theme === 'dark';

    useEffect(() => {
        dispatch(viewAllCategory());
    }, [dispatch]);

    const expandSubCategories = (catId) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const handleToggleCategory = async (id, status) => {
        await dispatch(statusToggleCategory({ categoryStatus: status, categoryId: id })).unwrap()
            .then(() => { toast.success('Status updated'); dispatch(viewAllCategory()); })
            .catch((err) => toast.error(err));
    };

    const handleToggleSubCategory = async (id, subStatus) => {
        await dispatch(statusToggleSubCategory({ subCategoryStatus: subStatus, subCategoryId: id })).unwrap()
            .then(() => { toast.success('Status updated'); dispatch(viewAllCategory()); })
            .catch((err) => toast.error(err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await dispatch(editNewCategory({ categoryId: editingCategory._id, categoryNewName: categoryName })).unwrap();
            } else if (editingSubCategory) {
                await dispatch(editNewSubCategory({ subCategoryId: editingSubCategory._id, subCategoryNewName: categoryName, parentId: parentCategoryId })).unwrap();
            } else if (!isSubCategoryMode) {
                await dispatch(addNewCategory(categoryName)).unwrap();
            } else {
                await dispatch(addNewSubCategory({ subCategoryName: categoryName, categoryId: parentCategoryId })).unwrap();
            }
            toast.success('Action successful');
            resetForm();
            dispatch(viewAllCategory());
        } catch (error) { toast.error(error); }
    };

    const resetForm = () => {
        setCategoryName('');
        setParentCategoryId('');
        setEditingCategory(null);
        setEditingSubCategory(null);
        setIsSubCategoryMode(false);
    };

    const getCardClass = () => isDark
        ? 'bg-zinc-900 border-zinc-800 shadow-2xl text-zinc-100'
        : 'bg-white border-zinc-200 shadow-xl text-zinc-900';

    const getInputClass = () => isDark
        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:bg-zinc-800/50'
        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 shadow-inner';

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto transition-colors duration-300 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>Categories Management</h1>
                    <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Organize product hierarchy</p>
                </div>
            </div>

            {/* Form Section */}
            <div ref={formRef} className={`rounded-3xl border p-6 md:p-8 transition-all ${getCardClass()}`}>
                <div className="flex items-center gap-3 mb-8">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        {isSubCategoryMode ? <Tag size={20} /> : <Layers size={20} />}
                    </div>
                    <h2 className="text-xl font-bold italic tracking-tighter">
                        {editingCategory || editingSubCategory ? 'Edit Entry' : 'Create New'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    {!editingCategory && !editingSubCategory && (
                        <div className="md:col-span-3 space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Mode</label>
                            <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
                                <button type="button" onClick={() => setIsSubCategoryMode(false)} className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${!isSubCategoryMode ? 'bg-blue-600 text-white shadow-md' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}>PARENT</button>
                                <button type="button" onClick={() => setIsSubCategoryMode(true)} className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${isSubCategoryMode ? 'bg-blue-600 text-white shadow-md' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}>SUB</button>
                            </div>
                        </div>
                    )}

                    <div className={isSubCategoryMode || editingSubCategory ? "md:col-span-4 space-y-2" : "md:col-span-6 space-y-2"}>
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Name</label>
                        <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Electronics" className={`w-full p-3.5 rounded-xl border outline-none font-bold transition-all ${getInputClass()}`} />
                    </div>

                    {(isSubCategoryMode || editingSubCategory) && (
                        <div className="md:col-span-3 space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Parent Category</label>
                            <div className="relative">
                                <select required value={parentCategoryId} onChange={(e) => setParentCategoryId(e.target.value)} className={`w-full p-3.5 pr-10 rounded-xl border outline-none appearance-none font-bold transition-all ${getInputClass()}`}>
                                    <option value="" className={isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-white'}>Select Parent</option>
                                    {category.map(cat => (
                                        <option key={cat._id} value={cat._id} className={isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-3 flex flex-col sm:flex-row gap-2">
                        {editingCategory || editingSubCategory ? (
                            <>
                                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20 active:scale-95">Update</button>
                                <button type="button" onClick={resetForm} className={`flex-1 py-3.5 rounded-xl border font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm'}`}>Cancel</button>
                            </>
                        ) : (
                            <button type="submit" className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
                                <Plus size={16} /> {isSubCategoryMode ? 'Add Sub' : 'Add Category'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className={`rounded-3xl border overflow-hidden ${getCardClass()}`}>
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-800/30' : 'border-zinc-100 bg-zinc-50'}`}>
                    <h3 className={`font-black text-sm uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Database Architecture</h3>
                    <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-500/10 text-blue-500 uppercase">{category.length} Main Segments</span>
                </div>

                <div className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
                    {category.length === 0 ? (
                        <div className={`p-20 text-center ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`}>
                            <Info className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="font-bold italic text-sm">No segments configured.</p>
                        </div>
                    ) : (
                        category.map(cat => (
                            <div key={cat._id} className="transition-all">
                                <div className={`flex items-center justify-between p-5 transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-blue-50/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => expandSubCategories(cat._id)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${expandedCategories[cat._id] ? 'bg-blue-600 border-blue-600 text-white rotate-180' : isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-500' : 'border-zinc-200 bg-white text-zinc-400 shadow-sm'}`}>
                                            <ChevronDown size={16} />
                                        </button>
                                        <div>
                                            <h4 className={`font-bold text-base ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>{cat.categoryName}</h4>
                                            <p className={`text-[10px] font-black tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>SLUG: {cat.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleToggleCategory(cat._id, cat.status)} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${cat.status === 'active' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                                            {cat.status === 'active' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                        </button>
                                        <button onClick={() => { setEditingCategory(cat); setEditingSubCategory(null); setCategoryName(cat.categoryName); setIsSubCategoryMode(false); formRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-900 hover:text-white shadow-sm'}`}>
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {expandedCategories[cat._id] && (
                                    <div className={`p-2 space-y-1 ${isDark ? 'bg-zinc-950/50' : 'bg-zinc-50'}`}>
                                        {cat.subCategories.length > 0 ? (
                                            cat.subCategories.map(sub => (
                                                <div key={sub._id} className={`flex items-center justify-between ml-10 mr-4 p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:shadow-sm'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60"></div>
                                                        <h5 className={`font-bold text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{sub.subCategoryName}</h5>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${sub.subStatus === 'active' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>{sub.subStatus.toUpperCase()}</span>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => handleToggleSubCategory(sub._id, sub.subStatus)} className={`p-2 transition-all ${sub.subStatus === 'active' ? 'text-emerald-500' : 'text-red-500'} hover:opacity-50`}><CheckCircle2 size={16} /></button>
                                                            <button onClick={() => { setEditingCategory(null); setEditingSubCategory(sub); setCategoryName(sub.subCategoryName); setIsSubCategoryMode(true); setParentCategoryId(cat._id); formRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className={`p-2 transition-all ${isDark ? 'text-zinc-500 hover:text-blue-400' : 'text-zinc-400 hover:text-blue-600'}`}><Edit3 size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={`ml-14 py-3 text-xs italic ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>No nested items.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;