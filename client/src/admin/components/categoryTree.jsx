// src/admin/components/CategoryTree.jsx
import React from 'react';
import { GripVertical, Trash2, CircleCheck, CircleX } from 'lucide-react';

const CategoryTree = ({ categories, theme, onEdit, onDelete, onStatusToggle, draggedCategory }) => {
    const renderCategory = (category, level = 0) => (
        <div
            draggable
            onDragStart={(e) => draggedCategory.current = category}
            onDragOver={(e) => e.preventDragDefault()}
            onDrop={(e) => {
                e.preventDefault();
                // Handle drop logic
            }}
            className={`
        group flex items-center gap-3 p-4 rounded-xl border-l-4 transition-all hover:shadow-md cursor-grab active:cursor-grabbing
        ${draggedCategory.current?.id === category.id ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105' : ''}
        ${theme === "dark"
                    ? "hover:bg-zinc-800/50 border-l-zinc-700 hover:border-l-blue-500"
                    : "hover:bg-zinc-50 border-l-zinc-300 hover:border-l-blue-500"
                }
      `}
        >
            <GripVertical className="w-5 h-5 text-zinc-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 flex-shrink-0" />

            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${category.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                        {category.name}
                    </p>
                    {category.slug && (
                        <p className={`text-xs truncate ${theme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>
                            /{category.slug}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                    onClick={() => onStatusToggle(category)}
                    className={`
            p-1.5 rounded-lg transition-all flex-shrink-0
            ${category.status === 'active'
                            ? theme === "dark" ? "hover:bg-green-900/50 text-green-400 hover:text-green-300" : "hover:bg-green-50 text-green-600 hover:text-green-700"
                            : theme === "dark" ? "hover:bg-red-900/50 text-red-400 hover:text-red-300" : "hover:bg-red-50 text-red-600 hover:text-red-700"
                        }
          `}
                >
                    {category.status === 'active' ? <CircleCheck className="w-4 h-4" /> : <CircleX className="w-4 h-4" />}
                </button>

                <button
                    onClick={() => onEdit(category)}
                    className={`
            p-1.5 rounded-lg transition-all flex-shrink-0
            ${theme === "dark" ? "hover:bg-blue-900/50 text-blue-400 hover:text-blue-300" : "hover:bg-blue-50 text-blue-600 hover:text-blue-700"}
          `}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>

                <button
                    onClick={() => onDelete(category)}
                    className={`
            p-1.5 rounded-lg transition-all flex-shrink-0
            ${theme === "dark" ? "hover:bg-red-900/50 text-red-400 hover:text-red-300" : "hover:bg-red-50 text-red-600 hover:text-red-700"}
          `}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const renderTree = (categories, level = 0) => (
        <div className={`ml-${level * 6}`}>
            {categories.map(category => (
                <div key={category.id} className="mb-2 last:mb-0">
                    {renderCategory(category, level)}
                    {category.children && category.children.length > 0 && (
                        <div className={`mt-2 ${theme === "dark" ? "bg-zinc-800/30" : "bg-zinc-100/50"} rounded-xl p-2 ml-6`}>
                            {renderTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return <div className="space-y-2">{renderTree(categories)}</div>;
};

export default CategoryTree;
